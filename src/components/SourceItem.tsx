import React, { useState } from "react";
import { type Source } from "~/interfaces/message";
import { Button } from "./ui/button/Button";

type Prop = {
  source: Source;
};

const SourceItem = ({ source }: Prop) => {
  const [showContent, setShowContent] = useState(false);
  return (
    <div
      className="m-3 w-fit cursor-pointer list-disc rounded-lg bg-gray100 pb-3 pl-5 pr-5 pt-3 text-base font-light"
      onClick={() => setShowContent(!showContent)}
    >
      <span className="font-normal">{source.title}</span> av{" "}
      <span className="font-normal">{source.author}</span> (linje{" "}
      {source.location.lineFrom}-{source.location.lineTo})
      <br />
      <Button size={"small"} withBorder={false} color={"gray"}>
        {showContent ? "Skjul" : "Vis mer"}
      </Button>
      <p>{showContent ? source.content : ""}</p>
    </div>
  );
};

export default SourceItem;
