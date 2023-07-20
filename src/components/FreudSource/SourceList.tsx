import React from "react";
import type { Source } from "~/interfaces/source";
import SourceItem from "./SourceItem";

type Prop = {
  sources: Source[];
};

const SourceList = ({ sources }: Prop) => {
  return (
    <div className="mb-3 mt-5 rounded-lg p-2">
      {sources == undefined || sources?.length == 0 ? (
        <p className="bold py-2 font-bold text-yellow550">
          Fant ingen kilder til dette spørsmålet
        </p>
      ) : (
        <div>
          <p className="ml-3 text-lg font-bold">Kilder</p>
          <div className="w-fit">
            {sources.map((source: Source, idx) => (
              <SourceItem source={source} key={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceList;
