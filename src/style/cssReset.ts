import { globalCss } from '../stitches';

export const cssResetStyles = globalCss({
  // Use a more-intuitive box-sizing model
  '*, *::before, *::after': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },

  // Allow percentage-based heights in the application
  'html, body, #__next': {
    height: '100%',
  },

  // Set rem size so that 1 rem == 10 px
  html: {
    fontSize: '62.5%',
  },

  body: {
    // Base font size should still be 16px
    fontSize: '1.6rem',

    // Typographic tweaks!
    // Add accessible line-height
    // Improve text rendering
    lineHeight: 1.5,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  // Improve media defaults
  'img, picture, video, canvas, svg, iframe, object': {
    display: 'block',
    maxWidth: '100%',
  },

  // Remove built-in form typography styles
  'input, button, textarea, select': {
    font: 'inherit',
  },

  // Avoid text overflows
  'p, h1, h2, h3, h4, h5, h6': {
    overflowWrap: 'break-word',
  },

  // Create a root stacking context
  '#__next': {
    isolation: 'isolate',
  },
});
