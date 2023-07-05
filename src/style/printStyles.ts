import { globalCss } from '../stitches';

export const printStyles = globalCss({
  '@media print': {
    body: {
      height: 'unset',
    },

    '.print-hidden': {
      display: 'none !important',
    },
    '.print-page-break': {
      pageBreakAfter: 'always',
    },

    '::-webkit-scrollbar': {
      // Avoid including the scrollbar in the PDF when printing with Safari
      display: 'none !important',
      width: '0 !important',
    },
  },

  '@page': {
    margin: '20mm 10mm 20mm 10mm !important',
  },
});
