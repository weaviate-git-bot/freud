import path from "path";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { JSDOM } from "jsdom";
import fs from "fs";
import { Document } from "langchain/document";
import { type OpenAIEmbeddings } from "langchain/embeddings/openai";
import { embeddings } from "~/utils/weaviate/embeddings";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { client_diagnosis } from "~/utils/weaviate/client";
import { MergerRetriever } from "~/utils/weaviate/MergerRetriever";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const dirPath = path.join(process.cwd(), "public", "documents", "DSM");
const dsmWebPagePath = path.join(process.cwd(), "public");

type DiagnosisAndEval = {
  diagnosis: string;
  evaluation: string;
  score: number;
  similarityScore: number,
};

// Query database variables:
const metadataKeys: string[] = ["diagnosisName", "categoryName"];

const indexName = "DSM";

const arrayOfVectorStores = await WeaviateStore.fromExistingIndex(embeddings, {
  client: client_diagnosis,
  indexName,
  metadataKeys,
});

export const diagnosisRouter = createTRPCRouter({
  createFileAndEmbedd: publicProcedure.mutation(async () => {
    // Creating the file
    const arrDiagnosis = findDiagnosisChunks();
    createOneFilesFromArray(arrDiagnosis);

    // Make documents, aka splits
    const docs = arrDiagnosis.map((elem) => {
      return new Document({
        pageContent: elem.text,
        metadata: {
          diagnosisName: elem.diagnosis,
          categoryName: elem.category,
        },
      });
    });

    // Embedd to vectorStore
    await createDiagnosisVectorStoreFromDocuments("DSM", docs, embeddings);
  }),

  queryTheDatabase: publicProcedure

    .input(z.array(z.string()))

    .mutation(async ({ input }) => {

      const NUM_SOURCES = 5;
      const SIMILARITY_THRESHOLD = 0.27;

      const retriever = new MergerRetriever(
        [arrayOfVectorStores],
        NUM_SOURCES,
        SIMILARITY_THRESHOLD
      );
      
      console.debug("input length: ", input.length);
      let searchString = input[0] as string + ".";
      for (let i = 2 ; i < input.length ; i += 2) {
        // For each followUp and user-answer create a search string to append 
        const searchAdd = await openai.createChatCompletion({
          model: "gpt-4",
          messages: [{ role: "system", content: `For det følgende spørsmålet og det gitte svaret lag en kort setning som oppsummerer informasjonen som gis fra svaret i henhold til spørsmålet som er stilt.
\nSpørsmål: ${input[i - 1] as string}
Svar: ${input[i] as string}
Oppsummerende setning:` }],
          temperature: 0,
        });
        console.debug("searchAdd number", i); 
        console.debug(searchAdd.data.choices[0]?.message?.content as string);
        searchString += " ";
        searchString += searchAdd.data.choices[0]?.message?.content as string;
      }

      let endTheSearch = false;

      console.debug("searchString: ", searchString);

      const maxQuestions = 4;

      if (input.length >= maxQuestions + 1) {
        endTheSearch = true;
      }
      console.debug("BEFORE");
      const resultingDiagnoses = await retriever.getRelevantDocumentsWithScore(searchString);
      console.debug("AFTER");

      const similarityScoreTreshold = 0.12;

      if (resultingDiagnoses[0] != undefined && resultingDiagnoses[0][1] < similarityScoreTreshold){
        endTheSearch = true;
      }

      if (!endTheSearch) {
        // Making chatGPT produce a differencial-diagnosis question based on the sources
        const diffDiagnosisQueryText = createDifferentiatingQuestion(resultingDiagnoses);
        const diffCompletion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "system", content: diffDiagnosisQueryText }],
        temperature: 0,
        });
        const diffFollowUp = diffCompletion.data.choices[0]?.message?.content as string;

        return {messageOutput: diffFollowUp, clearQueryMessages: endTheSearch};
      }
    
      // Making chatGPT evaluate the correlation between the symptoms and the diagnosis
      const numberOfTopDiagnoses = 3;
      const topDiagnoses = resultingDiagnoses.slice(0, numberOfTopDiagnoses);
      const listOfEvaluations = await Promise.all(
        topDiagnoses.map(async (elem) => {
          const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `Gi en evaluering på hvor mye den gitte input beskrivelsen stemmer overens med diagnose-beskrivelsen. Til slutt i svaret ditt, gi en matching-score på formatet: (#/100), hvor "#" er en score på hvor mye beskrivelsene stemmer overens ut av hundre.\n\nInput beskrivelse: ${searchString}.\n\nDiagnose: ${elem[0].pageContent}. \n\nEvaluering med score på slutten: `,
              },
            ],
            temperature: 1,
          });

          return completion.data.choices[0]?.message?.content as string;
        })
      );

      const combinedData: DiagnosisAndEval[] = [];

      for (let i = 0 ; i < numberOfTopDiagnoses ; i++ ) {
        // Find score of eval
        const scoreIndex = findScoreIndex(listOfEvaluations[i] as string);
        let score = 0;
        if (listOfEvaluations[i][scoreIndex + 1] as string != "/") {
          score = parseInt(listOfEvaluations[i]?.substring(scoreIndex, scoreIndex + 2) as string);
        } else {
          score = parseInt(listOfEvaluations[i]?.substring(scoreIndex, scoreIndex + 1) as string);
        }
        combinedData.push({diagnosis: topDiagnoses[i][0]?.metadata.diagnosisName as string, evaluation: listOfEvaluations[i] as string, score: score, similarityScore: topDiagnoses[i][1]});
      }

      // Sort by score
      combinedData.sort((a, b) => b.score - a.score);
      // console.debug(combinedData);

      // Format the data for output (like a message in chat)
      let formattedOutput = "Diagnoser og prosent-matching med gitte input symptomer:\n";
      combinedData.forEach( (elem) => {
        formattedOutput += "\n\nDiagnose-kode og navn:\n" + elem.diagnosis + "\n\nMatching evaluering:\n" + elem.evaluation + "\n";
      })
      // console.debug(formattedOutput);
      console.debug("\n QUERY RESULTS: ");
      console.debug(combinedData);

      return {messageOutput: formattedOutput, clearQueryMessages: endTheSearch};
    }),
});

function createDifferentiatingQuestion(docs: [Document<Record<string, any>>, number][]): string {
  let diffDiagnosisQueryText = `Basert på the følgende liste med diagnoser, gi ett enkelt ja/nei oppfølgingsspørsmål totalt som skal forsøke å differensiere mellom diagnosene. Gi kun ett spørsmål og ikke noe mer.
\nListe med diagnoser:\n`;
  let counter = 1;
  docs.forEach((doc) => {
    diffDiagnosisQueryText +=
      `\nDiagnose ${counter}:\n` + doc[0].pageContent + "\n";
    counter++;
  });

  diffDiagnosisQueryText += `\n\nEtt differensierende spørsmål: `;
  return diffDiagnosisQueryText;
}

function findScoreIndex(input: string): number {
  const regex = /\d{1,2}\/100/;
  const matchIndex = input.search(regex);
  return matchIndex;
}

// All code below is for creating the embeddings in a weaviate DB, and making the Documents (aka splits) from the html document in a specific manner
async function createDiagnosisVectorStoreFromDocuments(
  indexName: string,
  splits: Document<Record<string, any>>[],
  embeddings: OpenAIEmbeddings
) {
  // Create the vector store
  console.debug(
    `- Create vector store (this may take a while...) (${indexName})`
  );
  await WeaviateStore.fromDocuments(splits, embeddings, {
    client: client_diagnosis,
    indexName,
  })
    .then(() => {
      console.debug(`- Vector store created (${indexName})`);
    })
    .catch((error: Error) => console.error(error));
}

function html2text(html: string): string {
  const dom = new JSDOM();
  const tag = dom.window.document.createElement("div");
  tag.innerHTML = html;
  return tag.textContent || "";
}

function checkForWordInString(
  text: string,
  word: string,
  fromIndex: number,
  toIndex?: number
): number {
  // Gives starting index of the word in the string
  let wordIndex = 0;
  if (toIndex == undefined) {
    toIndex = text.length;
  }
  for (let i = fromIndex; i < toIndex; i++) {
    if (text[i] == word[wordIndex]) {
      wordIndex++;
      if (wordIndex == word.length) {
        return i - wordIndex + 1;
      }
    } else if (text[i] == word[0]) {
      wordIndex = 1;
    } else {
      wordIndex = 0;
    }
  }
  return -1;
}

function findEndOfTag(
  text: string,
  fromIndex: number,
  startTag?: string,
  endTag?: string
): number {
  // assume <p></p> tag
  if (startTag == undefined) {
    startTag = `<p`;
  }
  if (endTag == undefined) {
    endTag = `</p>`;
  }
  let endingTagsLeft = 0;
  for (let i = fromIndex; i < text.length; i++) {
    if (text.substring(i, i + startTag.length) == startTag) {
      endingTagsLeft++;
    } else if (text.substring(i, i + endTag.length) == endTag) {
      endingTagsLeft--;
      if (endingTagsLeft == 0) {
        return i + endTag.length;
      }
    }
  }
  return -1;
}

type CategoryInterval = {
  fromInclusive: number;
  toExclusive: number;
  categoryName: string;
};

function findAllCategoryIntervals(): CategoryInterval[] {
  const webpageFileName = "dsm_norsk_nettside.html";
  const text = fs.readFileSync(
    path.join(dsmWebPagePath, webpageFileName),
    "utf-8"
  );
  const CATEGORY_TAG = `<p class="tretegnoverskrift">`;

  const categories: CategoryInterval[] = [];

  let currentCategory = ``;
  let currentIndex = checkForWordInString(text, CATEGORY_TAG, 0);
  let endOfTagIndex = findEndOfTag(text, currentIndex);
  currentCategory = html2text(text.substring(currentIndex, endOfTagIndex));

  while (true) {
    const startIndex = currentIndex;
    currentIndex = checkForWordInString(text, CATEGORY_TAG, endOfTagIndex);
    if (currentIndex == -1) {
      categories.push({
        fromInclusive: startIndex,
        toExclusive: text.length,
        categoryName: currentCategory,
      });
      break;
    }
    categories.push({
      fromInclusive: startIndex,
      toExclusive: currentIndex,
      categoryName: currentCategory,
    });

    // Set next
    endOfTagIndex = findEndOfTag(text, currentIndex);
    currentCategory = html2text(text.substring(currentIndex, endOfTagIndex));
  }
  return categories;
}

type Chunk = {
  text: string;
  category: string;
  diagnosis: string;
};

function findDiagnosisChunks(): Chunk[] {
  const webpageFileName = "dsm_norsk_nettside.html";
  const text = fs.readFileSync(
    path.join(dsmWebPagePath, webpageFileName),
    "utf-8"
  );
  const DIAGNOSIS_TAG = `<p class="firetegnoverskrift0">`;

  const generatedChunks: Chunk[] = [];

  const foundCategoryIntervals = findAllCategoryIntervals();

  for (let i = 0; i < foundCategoryIntervals.length; i++) {
    let currentDiagnosis = ``;
    let currentIndex = checkForWordInString(
      text,
      DIAGNOSIS_TAG,
      foundCategoryIntervals[i]?.fromInclusive as number
    );
    let endOfTagIndex = findEndOfTag(text, currentIndex);
    currentDiagnosis = html2text(text.substring(currentIndex, endOfTagIndex));

    while (true) {
      const startIndex = currentIndex;
      currentIndex = checkForWordInString(
        text,
        DIAGNOSIS_TAG,
        endOfTagIndex,
        foundCategoryIntervals[i]?.toExclusive
      );
      if (currentIndex == -1) {
        generatedChunks.push({
          text: html2text(
            text.substring(
              startIndex,
              foundCategoryIntervals[i]?.toExclusive as number
            )
          ),
          category: foundCategoryIntervals[i]?.categoryName as string,
          diagnosis: currentDiagnosis,
        });
        break;
      }
      generatedChunks.push({
        text: html2text(text.substring(startIndex, currentIndex)),
        category: foundCategoryIntervals[i]?.categoryName as string,
        diagnosis: currentDiagnosis,
      });

      // Set next
      endOfTagIndex = findEndOfTag(text, currentIndex);
      currentDiagnosis = html2text(text.substring(currentIndex, endOfTagIndex));
    }
  }
  return generatedChunks;
}

function createManyFilesFromArray(diagnosisArray: Chunk[]): void {
  diagnosisArray.forEach((elem) => {
    fs.writeFileSync(
      path
        .join(
          dirPath,
          elem.diagnosis.replace(/\s/g, "").replace(/[\/\\?%*:|"<>\.]/g, "_")
        )
        .concat(".json"),
      JSON.stringify(elem),
      { flag: "w" }
    );
  });
}

function createOneFilesFromArray(diagnosisArray: Chunk[]): void {
  fs.writeFileSync(
    path.join(dirPath, "all_diagnosis.json"),
    JSON.stringify(diagnosisArray),
    { flag: "w" }
  );
}
