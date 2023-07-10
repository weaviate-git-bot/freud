import React from "react";
import { Button } from "~/components/button/Button";
import { api } from "~/utils/api";

export const VectorStoreComponent = () => {
  const [isCreatingDatabase, setIsCreatingDatabase] = React.useState(false);
  const vectorStoreStatistics = api.weaviate.stats.useQuery();
  const vectorStoreSchemas = api.weaviate.listSchemas.useQuery();

  const vectorStoreMutation = api.vectorstore.create.useMutation({
    onError: (error) => {
      console.error(error);
      setIsCreatingDatabase(false);
    },
    onSuccess: () => {
      console.info("Vector store created");
      setIsCreatingDatabase(false);
    },
  });

  function createVectorStore() {
    vectorStoreMutation.mutate();
    setIsCreatingDatabase(true);
  }

  return (
    <>
      <div className="m-10">
        <b>Statistikk fra databasen</b>
        {vectorStoreStatistics.isLoading
          ? "Venter på databasen..."
          : vectorStoreStatistics.data.map((data, idx) => {
              return (
                <p key={idx}>
                  {data.author}: {data.count}
                </p>
              );
            })}
      </div>
      <div className="pt-5">
        {vectorStoreSchemas.isLoading
          ? "..."
          : vectorStoreSchemas.data.map((data, tidx) => {
              return (
                <>
                  <h2>{data.classname}</h2>
                  Beskrivelse: {data.description}
                  <br />
                  Indekseringsmetode: {data.vectorIndexType}
                  <br />
                  Distanse: {data.distanceMetric}
                  <br />
                  <br />
                  <h3>Attributter</h3>
                  <table>
                    <tbody>
                      <tr>
                        <th>Navn</th>
                        <th>Datatype</th>
                        <th>Beskrivelse</th>
                        <th>Filtrerbar</th>
                        <th>Søkbar</th>
                      </tr>
                      {data.properties.map((property, ridx) => {
                        return (
                          <>
                            <tr>
                              <td>{property.name}</td>
                              <td>{property.dataType[0]}</td>
                              <td>{property.description}</td>
                              <td>
                                {property.indexFilterable.valueOf().toString()}
                              </td>
                              <td>
                                {property.indexSearchable.valueOf().toString()}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </>
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
