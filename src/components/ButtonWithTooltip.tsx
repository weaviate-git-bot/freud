import { Button } from "./ui/button/Button";
import React, { forwardRef } from "react";
import { Tooltip } from "./ui/tooltip/Tooltip";
import { Span } from "./ui/basic/Span";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

type Props = ButtonProps & {
  tooltip: React.ComponentProps<typeof Tooltip>["content"];
  tooltipProps?: Omit<
    React.ComponentProps<typeof Tooltip>,
    "children" | "content"
  >;
};

// ForwardRef is needed to make Tooltip and Popover to play nice together.
export const ButtonWithTooltip = forwardRef(
  (
    { tooltip, tooltipProps, children, ...rest }: Props,
    ref: React.ForwardedRef<HTMLButtonElement>
  ) => {
    if (rest.disabled) {
      // https://www.radix-ui.com/docs/primitives/components/tooltip#displaying-a-tooltip-from-a-disabled-button
      return (
        <Tooltip content={tooltip} {...tooltipProps}>
          <Span tabIndex={0} css={{ flexShrink: 0 }}>
            <Button
              ref={ref}
              {...rest}
              css={{ ...rest.css, pointerEvents: "none" }}
            >
              {children}
            </Button>
          </Span>
        </Tooltip>
      );
    }
    return (
      <Tooltip content={tooltip} {...tooltipProps}>
        <Button ref={ref} {...rest}>
          {children}
        </Button>
      </Tooltip>
    );
  }
);

ButtonWithTooltip.displayName = "ButtonWithTooltip";
