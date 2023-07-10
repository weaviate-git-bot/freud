import React from "react";
import { Button } from "~/components/button/Button";
import { api } from "~/utils/api";

export const VectorStoreComponent = () => {
  const [isCreatingDatabase, setIsCreatingDatabase] = React.useState(false);
  const vectorStoreStatistics = api.weaviate.stats.useQuery();

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
      </div>
    </>
  );
};
