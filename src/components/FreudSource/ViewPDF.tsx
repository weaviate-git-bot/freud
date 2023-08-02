import React, { useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Prop = {
  category: string;
  filename: string;
  location: {
    pageNr?: number;
    lineFrom: number;
    lineTo: number;
  };
};

export const ViewPDF = ({ category, filename, location }: Prop) => {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const [pageNumber, setPageNumber] = React.useState(location.pageNr ?? 1);

  const file = `/documents/${category}/${filename}`;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
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

  useEffect(() => {
    setPageNumber(location.pageNr!)
  }, [location])

  return (
    <>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
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
