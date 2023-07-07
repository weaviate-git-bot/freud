import React from 'react';

import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';

import { StyledSelect } from './StyledSelect';

const ChevronDownIcon = () => (
  <Div css={{ marginRight: '-4px', flexShrink: 0, pl: '$2' }}>
    <Icon name="chevronDown" size="5" color="gray500" />
  </Div>
);
const ChevronUpIcon = () => <Icon name="chevronUp" />;
const CheckIcon = () => <Icon name="checkmarkSolid" />;

type RootProps = React.ComponentProps<typeof StyledSelect.Root>;
type CSSProps = Pick<React.ComponentProps<typeof StyledSelect.Trigger>, 'css'>;
export type Option = {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
};
export type SelectProps = RootProps &
  CSSProps & {
    options: Option[];
    placeholder?: string;
    ariaLabel?: string;
    id?: string;
    suffix?: React.ReactNode | null;
    disabled?: boolean;
  };

export const Select = React.forwardRef(
  (
    {
      ariaLabel,
      placeholder,
      options,
      id,
      suffix = <ChevronDownIcon />,
      disabled,
      css,
      ...rest
    }: SelectProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => (
    <Div css={{ position: 'relative', width: '$64', ...css }}>
      <StyledSelect.Root {...rest}>
        <StyledSelect.Trigger
          aria-label={ariaLabel}
          id={id}
          ref={ref}
          disabled={disabled}
        >
          <StyledSelect.Value placeholder={placeholder} />
          {suffix}
        </StyledSelect.Trigger>
        <StyledSelect.Content>
          <StyledSelect.ScrollUpButton>
            <ChevronUpIcon />
          </StyledSelect.ScrollUpButton>
          <StyledSelect.Viewport>
            {options.map((o, i) => {
              const previousGroup = i === 0 ? undefined : options[i - 1].group;
              const displaySeparator = o.group !== previousGroup && i !== 0;
              const displayGroup = o.group !== previousGroup && o.group;
              if (displayGroup) {
                return (
                  <React.Fragment key={o.value}>
                    {displaySeparator && <StyledSelect.Separator />}
                    <StyledSelect.Group>
                      <StyledSelect.Label>{o.group}</StyledSelect.Label>
                      <StyledSelect.Item value={o.value} disabled={o.disabled}>
                        <StyledSelect.ItemText>{o.label}</StyledSelect.ItemText>
                        <StyledSelect.ItemIndicator>
                          <CheckIcon />
                        </StyledSelect.ItemIndicator>
                      </StyledSelect.Item>
                    </StyledSelect.Group>
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={o.value}>
                  {displaySeparator && <StyledSelect.Separator />}
                  <StyledSelect.Item value={o.value} disabled={o.disabled}>
                    <StyledSelect.ItemText>{o.label}</StyledSelect.ItemText>
                    <StyledSelect.ItemIndicator>
                      <CheckIcon />
                    </StyledSelect.ItemIndicator>
                  </StyledSelect.Item>
                </React.Fragment>
              );
            })}
          </StyledSelect.Viewport>
          <StyledSelect.ScrollDownButton>
            <ChevronDownIcon />
          </StyledSelect.ScrollDownButton>
        </StyledSelect.Content>
      </StyledSelect.Root>
    </Div>
  ),
);

Select.displayName = 'Select';

export default Select;
