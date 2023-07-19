import React from "react";

type Prop = {
  text: string;
};

export const SourceContent = ({ text }: Prop) => {
  return <div className="bg-150 m-3 rounded-lg p-2">{text}</div>;
};
