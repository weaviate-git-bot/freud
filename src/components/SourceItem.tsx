import React, { useState } from "react";
import { type Source } from "~/interfaces/message";

type Prop = {
  source: Source;
};

//Component with button for hiding and showing 'content'
const SourceItem = ({ source }: Prop) => {
  const [shown, setShown] = useState(false);
  return (
    <li
      className="my-2 cursor-pointer rounded-md bg-gray50"
      onClick={() => {
        setShown(!shown);
      }}
    >
      {source.title} av {source.author}, s. {source.location.pageNr} (linje{" "}
      {source.location.lineFrom}-{source.location.lineTo})
      <br />
      <button className="text-blue">{shown ? "Skjul" : "Vis mer"}</button>
      <p>{shown ? source.content : ""}</p>
    </li>
  );
};

export default SourceItem;
