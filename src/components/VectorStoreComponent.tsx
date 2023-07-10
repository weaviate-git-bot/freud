import React from "react";
import { Button } from "~/components/button/Button";
import { api } from "~/utils/api";
import { Icon } from "./icon/Icon";

export const VectorStoreComponent = () => {
  const [isCreatingDatabase, setIsCreatingDatabase] = React.useState(false);
  const vectorStoreSchemas = api.weaviate.listSchemas.useQuery();

  const vectorStoreCreation = api.vectorstore.create.useMutation({
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

  function createVectorStore() {
    vectorStoreCreation.mutate();
    setIsCreatingDatabase(true);
  }

  function deleteVectorClass(classname: string) {
    console.debug("Deleting " + classname);
    vectorStoreClassDeletion.mutate(classname);
  }

  return (
    <>
      <div className="p-10">
        {vectorStoreSchemas.isLoading
          ? "..."
          : vectorStoreSchemas.data.map((data, tidx) => {
              return (
                <div key={"schema-" + tidx.toString()}>
                  <h2 className="font-extrabold">{data.classname}</h2>
                  Beskrivelse: {data.description}
                  <br />
                  Indekseringsmetode: {data.vectorIndexType}
                  <br />
                  Distanse: {data.distanceMetric}
                  <br />
                  <br />
                  <h3 className="font-bold">Metadata</h3>
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
                      {data.properties.map((property, ridx) => {
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
                    color={"red"}
                    size={"small"}
                    onClick={() => deleteVectorClass(data.classname)}
                  >
                    Slett
                  </Button>
                </div>
              );
            })}
      </div>
      <div className="pt-5">
        <Button
          size={"small"}
          loading={isCreatingDatabase}
          disabled={isCreatingDatabase}
          onClick={createVectorStore}
        >
          Lag vektordatabase
        </Button>
      </div>
    </>
  );
};
