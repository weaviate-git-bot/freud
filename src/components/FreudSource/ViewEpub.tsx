import React from "react";
import { ReactReader } from "react-reader";

type Prop = {
  category: string;
  filename: string;
  location: {
    chapter: string;
    lineFrom: number;
    lineTo: number;
  };
};

export const ViewEpub = ({ category, filename, location }: Prop) => {
  const [loc, setLocation] = React.useState(null);
  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub.
    // It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    console.log("epubcifi: ", epubcifi);
    setLocation(epubcifi);
  };

  const file = `/documents/${category}/${filename}`;

  return (
    <div className="h-screen">
      {location.chapter}
      <ReactReader
        location={loc}
        locationChanged={locationChanged}
        // url="https://react-reader.metabits.no/files/alice.epub"
        url={file}
        epubOptions={{
          allowPopups: true, // Adds `allow-popups` to sandbox-attribute
          allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
        }}
      />
    </div>
  );
};
