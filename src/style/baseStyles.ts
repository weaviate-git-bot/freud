import { globalCss } from '../stitches';

export const baseStyles = globalCss({
  /**
   * TYPOGRAPHY
   */

  '@font-face': [
    {
      fontFamily: 'GT Walsheim',
      fontWeight: 'normal',
      src: `url(/fonts/GT-Walsheim-Regular.woff2) format('woff2'),
            url(/fonts/GT-Walsheim-Regular.woff) format('woff'),
            url(/fonts/GT-Walsheim-Regular.ttf) format('truetype')`,
    },
    {
      fontFamily: 'GT Walsheim',
      fontWeight: 500,
      src: `url(/fonts/GT-Walsheim-Medium.woff2) format('woff2'),
            url(/fonts/GT-Walsheim-Medium.woff) format('woff'),
            url(/fonts/GT-Walsheim-Medium.ttf) format('truetype')`,
    },
    {
      fontFamily: 'GT Walsheim',
      fontWeight: 'bold',
      src: `url(/fonts/GT-Walsheim-Bold.woff2) format('woff2'),
            url(/fonts/GT-Walsheim-Bold.woff) format('woff'),
            url(/fonts/GT-Walsheim-Bold.ttf) format('truetype')`,
    },
  ],

  body: {
    fontFamily: '$sansSerif',
  },

  'strong, b': {
    fontWeight: '700',
  },
});
