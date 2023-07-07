import * as SelectPrimitive from '@radix-ui/react-select';
import React from 'react';

import { styled } from '../../stitches';

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  boxSizing: 'border-box',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: '$lg',
  fontSize: '$m',
  lineHeight: '$6',
  py: '$2',
  px: '$3',
  width: '100%',

  '& span': {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },

  backgroundColor: 'white',
  color: '$textBody',
  cursor: 'pointer',
  boxShadow: '$border, $small',
  transition: 'box-shadow 80ms linear, color 80ms linear',

  '&:hover': { boxShadow: '$borderHover, $small' },
  '&:focus-visible': { boxShadow: '$focusRingInput, $small' },
  '&[data-placeholder]': { color: '$textMuted' },
  '&[data-disabled]': { color: '$textMuted', backgroundColor: '$gray100' },
});

const StyledIcon = styled(SelectPrimitive.SelectIcon, {
  color: '$gray500',
});

const StyledContent = styled(SelectPrimitive.Content, {
  boxSizing: 'border-box',
  overflow: 'hidden',
  bg: 'white',
  borderRadius: '$lg',
  width: '100%',
  maxWidth: '100%',
  boxShadow: '$huge',
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

function Content({ children, ...props }: { children: React.ReactNode }) {
  return (
    <SelectPrimitive.Portal>
      <StyledContent {...props}>{children}</StyledContent>
    </SelectPrimitive.Portal>
  );
}

const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',
  fontSize: '$m',
  lineHeight: '$6',
  color: '$textBody',
  borderRadius: '$md',
  display: 'flex',
  alignItems: 'center',
  py: '6px',
  pl: '25px',
  pr: '$6',
  position: 'relative',
  userSelect: 'none',

  '&[data-disabled]': {
    color: '$textMuted',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    backgroundColor: '$gray100',
    color: '$textHeading',
  },
});

const StyledLabel = styled(SelectPrimitive.Label, {
  py: 0,
  px: '$6',
  fontSize: '$s',
  lineHeight: 1.5,
  color: '$gray400',
});

const StyledSeparator = styled(SelectPrimitive.Separator, {
  height: 1,
  backgroundColor: '$gray200',
  margin: 5,
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: 'white',
  color: '$textBody',
  cursor: 'default',
};

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles,
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles,
);

export const StyledSelect = {
  Root: SelectPrimitive.Root,
  Trigger: StyledTrigger,
  Value: SelectPrimitive.Value,
  Icon: StyledIcon,
  Content,
  Viewport: StyledViewport,
  Group: SelectPrimitive.Group,
  Item: StyledItem,
  ItemText: SelectPrimitive.ItemText,
  ItemIndicator: StyledItemIndicator,
  Label: StyledLabel,
  Separator: StyledSeparator,
  ScrollUpButton: StyledScrollUpButton,
  ScrollDownButton: StyledScrollDownButton,
};
