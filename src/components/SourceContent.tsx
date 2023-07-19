import React from "react";

type Prop = {
  content: string;
};

export const SourceContent = ({ content }: Prop) => {
  return <div className="bg-150 m-3 rounded-lg p-2">{content}</div>;
};
