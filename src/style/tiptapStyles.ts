import { globalCss } from '../stitches';

export const tiptapStyles = globalCss({
  '.suggestion': {
    color: '$beige900 !important',
    display: 'inline-block',
    bg: '$beige50',
    borderRadius: '$md',
    pr: '$1',

    '&::first-letter': {
      opacity: '0',
    },

    '&:before': {
      backgroundImage: 'url(/img/search.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      content: ' ',
      width: '$6',
      display: 'inline-block',
      color: '$yellow500',

      // Camuflage the trigger character (.) by moving
      // the :before content over it
      bg: '$beige50',
      position: 'relative',
      left: '$1',
    },
  },

  '.search-highlight': {
    bg: '$yellow50',
    borderRadius: '$sm',
    boxShadow: '0 0 0 4px $colors$yellow50',
  },
});
