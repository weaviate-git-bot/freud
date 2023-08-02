import React from "react";
import { ViewPDF } from "./ViewPDF";
import { ViewEpub } from "./ViewEpub";
import { env } from "~/env.mjs";

type Prop = {
  content: string;
  category: string;
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
  content,
  category,
  filename,
  filetype,
  location,
}: Prop) => {
  return (
    <div className="bg-250 m-3 w-[100%] rounded-lg p-2">
      {content}

      {env.NEXT_PUBLIC_NODE_ENV == "development" && filetype === "pdf" && (
        <ViewPDF category={category} filename={filename} location={location} />
      )}
      {env.NEXT_PUBLIC_NODE_ENV == "development" && filetype === "epub" && (
        <ViewEpub category={category} filename={filename} location={location} />
      )}
    </div>
  );
};
