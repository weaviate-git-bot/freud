import React from 'react';

import { CSS } from '../../stitches';
import { Div } from '../basic/Div';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { HelpText } from '../label/HelpText';
import { Label } from '../label/Label';
import { getAriaDescribedBy } from '../label/utils';
import { Select, SelectProps } from '../select/Select';

export type Props = SelectProps & {
  id: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  helpText?: string;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  label?: string;
  width?: string;
  css?: CSS;
};

export const SelectField = React.forwardRef(
  (
    {
      id,
      error,
      errorMessage,
      css,
      label,
      width = '100%',
      helpText,
      helpPopover,
      helpPopoverProps,
      ...rest
    }: Props,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    const errorMessageId = `${id}-error`;
    const helpTextId = `${id}-helpText`;

    const ariaDescribedBy = getAriaDescribedBy([
      !!errorMessage && error ? errorMessageId : undefined,
      helpText ? helpTextId : undefined,
    ]);

    return (
      <Div css={{ width, ...css }}>
        {(label || helpPopover) && (
          <Div
            css={{ mb: '$1', display: 'flex', justifyContent: 'space-between' }}
          >
            {label && (
              <div>
                <Label htmlFor={id}>{label}</Label>
              </div>
            )}
            {helpPopover && (
              <HelpPopover {...helpPopoverProps}>{helpPopover}</HelpPopover>
            )}
          </Div>
        )}
        <Select
          css={{ width }}
          {...rest}
          id={id}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
        />
        {helpText && <HelpText id={helpTextId}>{helpText}</HelpText>}
        <ErrorMessage show={!!error} id={errorMessageId} css={{ mt: '$2' }}>
          {errorMessage}
        </ErrorMessage>
      </Div>
    );
  },
);

SelectField.displayName = 'SelectField';
