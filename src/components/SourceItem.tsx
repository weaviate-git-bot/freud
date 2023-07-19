import React, { useState } from "react";
import { type Source } from "~/interfaces/source";
import { SourceContent } from "./SourceContent";

type Prop = {
  source: Source;
};

const SourceItem = ({ source }: Prop) => {
  const [showContent, setShowContent] = useState(false);

  return (
    <div
      className="m-3 w-fit cursor-pointer list-disc rounded-lg bg-gray50 pb-2 pl-5 pr-5 pt-2 text-base font-light"
      onClick={() => setShowContent(!showContent)}
    >
      <span className="font-normal">{source.title}</span> av{" "}
      <span className="font-normal">{source.author}</span> (linje{" "}
      {source.location.lineFrom}-{source.location.lineTo})
      <br />
      <span>Filnavn: {source.filename}</span>
      {showContent && (
        <SourceContent
          content={source.content}
          filename={source.filename}
          filetype={source.filetype}
        />
      )}
    </div>
  );
};

export default SourceItem;
