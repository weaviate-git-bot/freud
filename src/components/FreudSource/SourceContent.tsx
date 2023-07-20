import React from "react";
import { ViewPDF } from "./ViewPDF";
import { ViewEpub } from "./ViewEpub";

type Prop = {
  content: string;
  filename: string;
  filetype: string;
};

export const SourceContent = ({ content, filename, filetype }: Prop) => {
  return (
    <div className="bg-250 m-3 rounded-lg p-2">
      {content}
      {filetype === "pdf" && <ViewPDF filename={filename} />}
      {filetype === "epub" && <ViewEpub filename={filename} />}
    </div>
  );
};
