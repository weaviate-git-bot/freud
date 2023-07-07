import * as RadixTooltip from '@radix-ui/react-tooltip';

import { keyframes, styled } from '../../stitches';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

export const StyledTooltipContent = styled(RadixTooltip.Content, {
  bg: '$gray900',
  color: 'white',
  borderRadius: '$lg',
  fontWeight: 500,
  fontSize: '$m',
  py: '$2',
  px: '$4',

  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': { animationName: slideUpAndFade },
      '&[data-side="right"]': { animationName: slideRightAndFade },
      '&[data-side="bottom"]': { animationName: slideDownAndFade },
      '&[data-side="left"]': { animationName: slideLeftAndFade },
    },
  },

  variants: {
    empty: {
      true: {
        display: 'none',
      },
    },
    size: {
      small: {
        py: '$1',
        px: '$3',
      },
      medium: {
        py: '$2',
        px: '$4',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

export const StyledTooltipArrow = styled(RadixTooltip.Arrow, {
  fill: '$gray900',
});
