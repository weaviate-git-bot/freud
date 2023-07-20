import React, { useState } from "react";
import { type Source } from "~/interfaces/source";
import { SourceContent } from "./SourceContent";

type Prop = {
  source: Source;
};

const SourceItem = ({ source }: Prop) => {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="m-3 flex list-disc flex-col rounded-lg bg-gray50 pb-2 pl-5 pr-10 pt-2 text-base font-light">
      <div
        className="cursor-pointer"
        onClick={() => setShowContent(!showContent)}
      >
        <span className="font-normal">{source.title}</span> av{" "}
        <span className="font-normal">{source.author}</span>
        {source.filetype === "pdf" && (
          <span> (s. {source.location.pageNr})</span>
        )}
        {source.filetype === "epub" && (
          <>
            <br />
            {/* <span>{source.location.chapter}</span> */}
          </>
        )}
      </div>
      <div>
        {showContent && (
          <SourceContent
            // category={source.category}
            content={source.content}
          // filename={source.filename}
          // filetype={source.filetype}
          // location={source.location}
          />
        )}
      </div>
    </div>
  );
};

export default SourceItem;
