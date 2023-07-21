import React from "react";
import { ViewPDF } from "./ViewPDF";
import { ViewEpub } from "./ViewEpub";

type Prop = {
  // category: string;
  content: string;
  // filename: string;
  // filetype: string;
  // location: {
  //   chapter?: string;
  //   pageNr?: number;
  //   lineFrom: number;
  //   lineTo: number;
  // };
};

export const SourceContent = ({
  // category,
  content,
  // filename,
  // filetype,
  // location,
}: Prop) => {
  return (
    <div className="bg-250 m-3 rounded-lg p-2 w-[100%]">
      {content}
      {/* {filetype === "pdf" && (
        <ViewPDF category={category} filename={filename} location={location} />
      )}
      {filetype === "epub" && (
        <ViewEpub category={category} filename={filename} location={location} />
      )} */}
    </div>
  );
};
