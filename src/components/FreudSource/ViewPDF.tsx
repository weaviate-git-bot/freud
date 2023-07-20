import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Prop = {
  filename: string;
};

export const ViewPDF = ({ filename }: Prop) => {
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return (
    <>
      <Document file={"./sample.pdf"} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} renderTextLayer={true} />
      </Document>
      <div className="flex items-center justify-center">
        <button
          className="items-start"
          type="button"
          disabled={pageNumber <= 1}
          onClick={previousPage}
        >
          Forrige
        </button>
        <p className="flex-grow text-center">
          Side {pageNumber || (numPages ? 1 : "--")} av {numPages || "--"}
        </p>
        <button
          className="items-end"
          type="button"
          disabled={numPages === null || pageNumber >= numPages}
          onClick={nextPage}
        >
          Neste
        </button>
      </div>
    </>
  );
};
