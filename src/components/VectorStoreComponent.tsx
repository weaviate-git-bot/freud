import React from "react";
import { Button } from "~/components/button/Button";
import { api } from "~/utils/api";

export const VectorStoreComponent = () => {
  const [isCreatingDatabase, setIsCreatingDatabase] = React.useState(false);
  const [showObjectsInDatabase, setShowObjectsInDatabase] = React.useState<{
    [key: string]: boolean;
  }>({});
  const [weaviateClassObjects, setWeaviateClassObjects] = React.useState<{
    [key: string]: string[];
  }>({});

  const vectorStoreSchemas = api.weaviate.listSchemas.useQuery();

  const vectorStoreCreation =
    api.weaviate.generateVectorStoreFromDisk.useMutation({
      onError: (error) => {
        console.error(error);
        setIsCreatingDatabase(false);
      },
      onSuccess: () => {
        console.info("Vector store create request submitted");
        setIsCreatingDatabase(false);
      },
    });

  const vectorStoreClassDeletion = api.weaviate.deleteSchema.useMutation();

  const vectorStoreListObjects = api.weaviate.listObjectsFromSchema.useMutation(
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (data) => {
        console.debug(data);
        setWeaviateClassObjects({
          ...weaviateClassObjects,
          [data.index]: data.titles,
        });
      },
    }
  );

  function createVectorStore() {
    vectorStoreCreation.mutate();
    setIsCreatingDatabase(true);
  }

  function deleteVectorClass(classname: string) {
    console.debug("Deleting " + classname);
    vectorStoreClassDeletion.mutate(classname);
  }

  function getObjectsFromClass(classname: string) {
    console.debug("Get objects from " + classname);
    vectorStoreListObjects.mutate(classname);
  }

  function addObjectsVisibilityKey(classname: string) {
    if (classname in showObjectsInDatabase) {
      return;
    }

    setShowObjectsInDatabase({
      ...showObjectsInDatabase,
      [classname]: false,
    });
  }

  return (
    <>
      <div className="p-10">
        {vectorStoreSchemas.isLoading || !vectorStoreSchemas.data
          ? "..."
          : vectorStoreSchemas.data.map((data: any, tidx: number) => {
              addObjectsVisibilityKey(data.classname);
              return (
                <div className="pb-10" key={"schema-" + tidx.toString()}>
                  <h2 className="font-extrabold">{data.classname}</h2>
                  Beskrivelse: {data.description}
                  <br />
                  Indekseringsmetode: {data.vectorIndexType}
                  <br />
                  Distanse: {data.distanceMetric}
                  <h3 className="pt-5 font-bold">Metadata</h3>
                  <table className="border">
                    <tbody>
                      <tr className="border">
                        <th className="border" key={"name-" + tidx.toString()}>
                          Navn
                        </th>
                        <th className="border">Datatype</th>
                        <th className="border">Beskrivelse</th>
                        <th className="border">Filtrerbar</th>
                        <th className="border">Søkbar</th>
                      </tr>
                      {data.properties.map((property: any, ridx: number) => {
                        return (
                          <tr
                            key={
                              "schema" +
                              tidx.toString() +
                              "-metadata-" +
                              ridx.toString()
                            }
                          >
                            <td className="border">{property.name}</td>
                            <td className="border">{property.dataType[0]}</td>
                            <td className="border">{property.description}</td>
                            <td className="border">
                              {property.indexFilterable.valueOf().toString()}
                            </td>
                            <td className="border">
                              {property.indexSearchable.valueOf().toString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <br />
                  <Button
                    size={"small"}
                    onClick={() => {
                      if (!showObjectsInDatabase[data.classname]) {
                        getObjectsFromClass(data.classname);
                      }
                      setShowObjectsInDatabase({
                        ...showObjectsInDatabase,
                        [data.classname]:
                          !showObjectsInDatabase[data.classname],
                      });
                    }}
                  >
                    Vis titler
                  </Button>
                  <div className="p-5">
                    {vectorStoreListObjects.isLoading ||
                    !weaviateClassObjects[data.classname] ||
                    !showObjectsInDatabase[data.classname] ? (
                      ""
                    ) : (
                      <div className={data.classname + "-objects"}>
                        {weaviateClassObjects[data.classname].length === 0 ? (
                          "Ingen dokumenter"
                        ) : (
                          <ul className="list-disc">
                            {weaviateClassObjects[data.classname].map(
                              (obj: any, idx: number) => {
                                return <li key={idx}>{obj}</li>;
                              }
                            )}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    color={"red"}
                    size={"small"}
                    onClick={() => deleteVectorClass(data.classname)}
                  >
                    Slett {data.classname}
                  </Button>
                </div>
              );
            })}
        <div className="pt-5">
          <Button
            size={"small"}
            color={"green"}
            loading={isCreatingDatabase}
            disabled={isCreatingDatabase}
            onClick={createVectorStore}
          >
            Generer vektordatabase på nytt
          </Button>
        </div>
      </div>
    </>
  );
};
