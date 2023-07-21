import React from "react";
import { ViewPDF } from "./ViewPDF";
import { ViewEpub } from "./ViewEpub";

type Prop = {
  category: string;
  content: string;
  filename: string;
  filetype: string;
  location: {
    chapter?: string;
    href?: string;
    pageNr?: number;
    lineFrom: number;
    lineTo: number;
  };
};

export const SourceContent = ({
  category,
  content,
  filename,
  filetype,
  location,
}: Prop) => {
  return (
    <div className="bg-250 m-3 rounded-lg p-2">
      {/* {content} */}
      {filetype === "pdf" && (
        <ViewPDF category={category} filename={filename} location={location} />
      )}
      {filetype === "epub" && (
        <ViewEpub category={category} filename={filename} location={location} />
      )}
    </div>
  );
};
