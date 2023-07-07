import * as RadixAccordion from '@radix-ui/react-accordion';

import { styled } from '../../stitches';
import { H3 } from '../typography/H3';

export const StyledAccordion = styled(RadixAccordion.Root, {
  '&[data-variant="list"]': {
    borderRadius: '$lg',
    boxShadow: '$border, 0 2px 4px -1px rgba(0, 0, 0, 0.2)', // TODO: Extract shadow to shadows.ts
    bg: '$gray200', // Acts as border between items
  },
});

export const StyledHeader = styled(H3, {
  display: 'flex',
  position: 'relative',
});
StyledHeader.defaultProps = {
  size: 'xs',
};

export const StyledTrigger = styled(RadixAccordion.Trigger, {
  border: 'none',
  py: '$3',
  px: '$6',
  width: '100%',
  textAlign: 'left',
  lineHeight: 1,

  bg: 'white',
  cursor: 'pointer',

  '&:focus-visible': {
    outline: 'none',
    boxShadow: '$focusRing',
    position: 'relative',
    zIndex: '1',
  },

  '&:hover': { bg: '$gray50' },
});

export const StyledContentOuter = styled(RadixAccordion.Content, {
  bg: 'white',
  overflow: 'hidden',

  '[data-variant="card"] &': {
    borderTop: '1px solid $colors$gray200',
  },
});

export const StyledContentInner = styled('div', {
  px: '$6',

  '[data-variant="list"] &': {
    pt: '$1',
    pb: '$4',
  },

  '[data-variant="card"] &': {
    py: '$4',
  },
});

export const StyledItem = styled(RadixAccordion.Item, {
  '[data-variant="list"] &': {
    mt: 1,

    [`&:first-child ${StyledTrigger}`]: {
      mt: 0,
      borderTopRadius: '$lg',
    },

    [`&[data-state="closed"]:last-child ${StyledTrigger},
      &:last-child ${StyledContentOuter}
    `]: {
      borderBottomRadius: '$lg',
    },
  },

  '[data-variant="card"] &': {
    boxShadow: '$border, 0 2px 4px -1px rgba(0, 0, 0, 0.2)', // TODO: Extract shadow to shadows.ts
    mb: '$3',
    borderRadius: '$lg',

    [`& ${StyledTrigger}`]: {
      mt: 0,
      borderTopRadius: '$lg',
    },

    [`&[data-state="closed"] ${StyledTrigger},
      & ${StyledContentOuter}
    `]: {
      borderBottomRadius: '$lg',
    },
  },
});

export const StyledHeaderRight = styled('div', {
  position: 'absolute',
  zIndex: '2',
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  mr: '$2',
});

export const StyledHeaderLeftAbsolute = styled('div', {
  position: 'absolute',
  zIndex: '2',
  left: 0,
  top: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  pl: '$6',
  pt: '$lineHeights$7', // Same as height of heading above
  pr: '$24',
  pb: '$1',
  overflow: 'hidden',

  // Avoid making it impossible to collapse the accordion
  // If you have absolutely positioned content that needs to be clickable,
  // set pointerEvents: 'auto' for those specific elements
  pointerEvents: 'none',
});
