import { globalCss } from '../stitches';

export const reachStyles = globalCss({
  // Ignore reach style import
  ':root': {
    '--reachListbox': 1,
    '--reachDialog': 1,
  },

  '[data-reach-listbox-popover]': {
    zIndex: 10,
    ul: {
      maxHeight: '32rem',
      overflowY: 'auto',
    },
  },
});
