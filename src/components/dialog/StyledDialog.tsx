import * as DialogPrimitive from '@radix-ui/react-dialog';

import { keyframes, styled } from '../../stitches';

const overlayShow = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

export const contentShow = keyframes({
  '0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
  '100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

export const StyledOverlay = styled(DialogPrimitive.Overlay, {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
});

export const StyledContent = styled(DialogPrimitive.Content, {
  maxWidth: '$128',
  width: '85vw',
  maxHeight: '85vh',
  backgroundColor: 'white',
  padding: '$6',
  borderRadius: '$lg',
  boxShadow: '$huge',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'auto',
  '@media (prefers-reduced-motion: no-preference)': {
    animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
  '&:focus': { outline: 'none' },
});

export const StyledTitle = styled(DialogPrimitive.Title, {
  fontSize: '$2xl',
  color: '$textHeading',
  fontWeight: 500,
});

export const StyledDescription = styled(DialogPrimitive.Description, {
  fontSize: '$m',
  lineHeight: '$6',
  color: '$textBody',
  mt: '$3',
  mb: '$6',
});

export const StyledFooter = styled('div', {
  bg: '$gray100',
  mx: '-$6',
  mb: '-$6',
  px: '$6',
  py: '$3',
});

export const StyledClose = styled(DialogPrimitive.Close, {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '$full',
  height: '$12',
  width: '$12',
  fontSize: '$sizes$8',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '$4',
  right: '$3',
  cursor: 'pointer',
  color: '$gray500',

  '&:hover': { backgroundColor: '$gray100' },
  '&:focus-visible': { boxShadow: '$focusRingWithLightOffset' },
});
