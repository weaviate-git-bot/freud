export const sizes = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
  48: '192px',
  56: '224px',
  64: '256px',
  80: '320px',
  96: '384px',
  128: '512px',
  160: '640px',
  192: '768px',
  256: '1024px',
  320: '1280px',
  384: '1536px',

  /*
   * Measure refers to the length of a line of text.
   *
   * “Anything from 45 to 75 characters is widely regarded
   * as a satisfactory length of line for a single-column page…
   * the 66-character line (counting both letters and spaces) is
   * widely regarded as ideal. For multiple-column work,
   * a better average is 40-50 characters.”
   */
  measure: '30em', // ~66 characters
  measureNarrow: '24em', // ~45 characters
  measureWide: '34em', // ~80 characters
} as const;
