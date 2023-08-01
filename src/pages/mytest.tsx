import React, { useEffect } from 'react'
import { Button } from '~/components/ui/button/Button';
import { Message, Role } from '~/interfaces/message';
import { api } from '~/utils/api';

const mytest = () => {
    const answerMutation = api.source.ask.useMutation();

    const questions = ["How can I treat anxiety?", "Why does this work?"]
    const standaloneprompts = [`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, if the follow up question is already a standalone question, just return the follow up question.`,
        `Given a conversation, rephrase the last user input to be a standalone question. If it already works as a standalone question, just return the question.`
    ]
    //Variables are defined in sourceformat.ts
    //In example below ${0}=documents.length, ${1}= documentsString
    //formatPrompt(input.qaPrompt, documents.length, documentsString)
    const qaprompts = ["You are a chatbot used by a professional psychiatrist. They have a work-related question. Only use the ${0} sources below to answer the question. If the question can't be answered based on the sources, just say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${1}",
        "You are a an expert psychologist who works as a mentor for another professional psychiatrist. Use the sources below to answer questions. If the question can't be answered based on the sources, just say \"I don't know\". Show usage of each source with in-text citations. Do this with square brackets with ONLY the number of the source. \n\n${1}",
    ]

    let completions: { [key: number]: { qaPrompt: string, [key: number]: { [key: string]: {} } } } = {
    }

    const askTestQuestion = async (questionIndex: number, standaloneIndex: number, qaIndex: number, messages: Message[] = []) => {
        if (qaIndex >= qaprompts.length) {
            console.log(completions)
            return
        }
        if (standaloneIndex >= standaloneprompts.length) {
            askTestQuestion(0, 0, qaIndex + 1, [])
            return
        }

        if (questionIndex >= questions.length) {
            console.log(messages)
            if (!completions[qaIndex]) {
                completions[qaIndex] = { "qaPrompt": qaprompts[qaIndex]! }
            };
            if (!completions[qaIndex]![standaloneIndex]) {
                completions[qaIndex]![standaloneIndex] = { "standalonePrompt": standaloneprompts[standaloneIndex]! }
            };
            completions[qaIndex]![standaloneIndex]!["chat"] = messages;
            askTestQuestion(0, standaloneIndex + 1, qaIndex, [])
            return
        }

        const nextquestion = {
            role: Role.User,
            content: questions[questionIndex]!,
        };

        messages.push(nextquestion)

        answerMutation.mutate({ messages, categories: { ISTDP: true, CBT: true }, standalonePrompt: standaloneprompts[standaloneIndex], qaPrompt: qaprompts[qaIndex] }, {
            onSuccess(answer) {
                askTestQuestion(questionIndex + 1, standaloneIndex, qaIndex, [...messages, answer])
            },
        });
    }



    return (<div><Button onClick={() => askTestQuestion(0, 0, 0)}>Still</Button></div>)
}

export default mytest