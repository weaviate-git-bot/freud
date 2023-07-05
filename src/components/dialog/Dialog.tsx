import * as RadixDialog from '@radix-ui/react-dialog';
import React from 'react';

import { CSS } from '../../stitches';
import { Icon } from '../icon/Icon';

import {
  StyledClose,
  StyledContent,
  StyledDescription,
  StyledFooter,
  StyledOverlay,
  StyledTitle,
} from './StyledDialog';

type Root = React.ComponentProps<typeof RadixDialog.Root>;

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  css?: CSS;
  overlayCSS?: CSS;

  // Root props
  open?: Root['open'];
  defaultOpen?: Root['defaultOpen'];
  onOpenChange?: Root['onOpenChange'];
};

export const Dialog = ({
  children,
  content,
  css,
  overlayCSS,
  ...rest
}: Props) => (
  <RadixDialog.Root {...rest}>
    <RadixDialog.Trigger asChild>{children}</RadixDialog.Trigger>
    <RadixDialog.Portal>
      <StyledOverlay css={overlayCSS} />
      <StyledContent css={css}>{content}</StyledContent>
    </RadixDialog.Portal>
  </RadixDialog.Root>
);

const X = ({ css }: { css?: CSS }) => (
  <StyledClose aria-label="Lukk" css={css}>
    <Icon name="x" />
  </StyledClose>
);

Dialog.Close = RadixDialog.Close;
Dialog.Title = StyledTitle;
Dialog.Description = StyledDescription;
Dialog.Footer = StyledFooter;
Dialog.X = X;
