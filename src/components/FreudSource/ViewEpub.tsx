import React from "react";
import { ReactReader } from "react-reader";

type Prop = {
  filename: string;
};

export const ViewEpub = ({}: Prop) => {
  const [location, setLocation] = React.useState(null);
  const locationChanged = (epubcifi) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub.
    // It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };

  return (
    <div className="h-screen">
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url="https://react-reader.metabits.no/files/alice.epub"
        epubOptions={{
          allowPopups: true, // Adds `allow-popups` to sandbox-attribute
          allowScriptedContent: true, // Adds `allow-scripts` to sandbox-attribute
        }}
      />
    </div>
  );
};
