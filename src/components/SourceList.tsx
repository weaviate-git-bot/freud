import React from "react";
import type { Source } from "~/interfaces/message";
import SourceItem from "./SourceItem";

type Prop = {
  sources: Source[];
};

const SourceList = ({ sources }: Prop) => {
  return (
    <div className="mb-3">
      {sources == undefined || sources?.length == 0 ? (
        <p className="bold py-2 font-bold text-yellow550">
          Fant ingen kilder til dette spørsmålet
        </p>
      ) : (
        <ul>
          {sources.map((source, idx) => (
            <SourceItem source={source} key={idx} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SourceList;
