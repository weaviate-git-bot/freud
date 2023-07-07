import * as RadixTooltip from '@radix-ui/react-tooltip';

import { CSS } from '../../stitches';

import { StyledTooltipArrow, StyledTooltipContent } from './StyledTooltip';

type Root = React.ComponentProps<typeof RadixTooltip.Root>;
type Content = React.ComponentProps<typeof StyledTooltipContent>;

type Props = {
  children: React.ReactNode;
  content: Content['children'];

  // Root props
  delayDuration?: Root['delayDuration'];
  open?: Root['open'];
  defaultOpen?: Root['defaultOpen'];
  onOpenChange?: Root['onOpenChange'];

  // Content props
  side?: Content['side'];
  sideOffset?: Content['sideOffset'];
  align?: Content['align'];
  alignOffset?: Content['alignOffset'];
  size?: Content['size'];
  css?: CSS;
};

export const Tooltip = ({
  children,
  content,
  delayDuration,
  side,
  sideOffset = 6,
  align,
  alignOffset,
  open,
  onOpenChange,
  defaultOpen,
  size,
  css,
}: Props) => {
  return (
    <RadixTooltip.Root
      delayDuration={delayDuration}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <StyledTooltipContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        size={size}
        css={css}
        empty={!content}
      >
        {content}
        <StyledTooltipArrow offset={20} />
      </StyledTooltipContent>
    </RadixTooltip.Root>
  );
};
