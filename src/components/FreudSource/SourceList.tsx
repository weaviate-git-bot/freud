import React from "react";
import type { Source } from "~/interfaces/source";
import SourceItem from "./SourceItem";

type Prop = {
  sources: Source[];
  activeSources: boolean[];
  setActiveSources: React.Dispatch<React.SetStateAction<boolean[]>>
  scrollToId: number,
  setScrollToId: React.Dispatch<React.SetStateAction<number>>
};

const SourceList = ({ sources, activeSources, setActiveSources, scrollToId, setScrollToId }: Prop) => {
  return (
    <div className="mb-3 mt-5 rounded-lg p-2">
      {sources == undefined || sources?.length == 0 ? (
        <p className="bold py-2 font-bold text-yellow550">
          Fant ingen kilder til dette spørsmålet
        </p>
      ) : (
        <div>
          <p className="ml-3 text-lg font-bold">Kilder</p>
          {sources.map((source: Source, idx) => {
            return <SourceItem source={source} key={idx} id={idx} active={activeSources[idx]!} setActiveSources={setActiveSources} scrollToId={scrollToId} setScrollToId={setScrollToId} />
          }
          )
          }
        </div>
      )}
    </div>
  );
};

export default SourceList;
