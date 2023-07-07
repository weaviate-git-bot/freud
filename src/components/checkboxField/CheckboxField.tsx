import React from 'react';
import {
  useController,
  UseControllerProps,
  FieldValues,
} from 'react-hook-form';

import { Div } from '../basic/Div';
import { Checkbox, CheckboxProps } from '../checkbox/Checkbox';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { HelpText } from '../label/HelpText';
import { Label } from '../label/Label';
import { LabelSuffix } from '../label/LabelSuffix';
import { getAriaDescribedBy } from '../label/utils';

type CommonProps = {
  id: string;
  label: React.ReactNode;
  labelSuffix?: React.ReactNode;
  helpText?: string;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
};

type Props<T extends FieldValues> = CommonProps &
  Omit<UseControllerProps<T>, 'defaultValue'> &
  Pick<CheckboxProps, 'disabled' | 'css' | 'size'>;

type SimpleCheckboxFieldProps = CommonProps &
  Omit<CheckboxProps, 'value'> & {
    error?: boolean;
    errorMessage?: string;
  };

export function CheckboxField<T extends FieldValues>({
  name,
  control,
  rules,
  shouldUnregister,
  ...props
}: Props<T>) {
  const {
    field,
    fieldState: { error },
  } = useController<T>({
    name,
    control,
    rules,
    shouldUnregister,
  });
  return (
    <SimpleCheckboxField
      name={name}
      error={!!error}
      errorMessage={error?.message}
      onCheckedChange={field.onChange}
      onBlur={field.onBlur}
      checked={field.value as boolean}
      defaultChecked={field.value as boolean}
      {...props}
    />
  );
}

function SimpleCheckboxField({
  error,
  errorMessage,
  css,
  size,
  disabled,
  id,
  labelSuffix,
  helpText,
  helpPopover,
  helpPopoverProps,
  label,
  ...rest
}: SimpleCheckboxFieldProps) {
  const errorMessageId = `${id}-error`;
  const labelSuffixId = `${id}-labelSuffix`;
  const helpTextId = `${id}-helpText`;

  const ariaDescribedBy = getAriaDescribedBy([
    !!errorMessage && error ? errorMessageId : undefined,
    labelSuffix ? labelSuffixId : undefined,
    helpText ? helpTextId : undefined,
  ]);

  return (
    <Div css={{ display: 'flex', ...css }}>
      <Checkbox
        id={id}
        disabled={disabled}
        size={size}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        {...rest}
      />
      <Div css={{ pl: '$4', mt: size === 'small' ? '-2px' : undefined }}>
        <Div css={{ display: 'flex', gap: '$1' }}>
          <Label htmlFor={id} disabled={disabled}>
            {label}
          </Label>
          {labelSuffix && (
            <LabelSuffix id={labelSuffixId}>{labelSuffix}</LabelSuffix>
          )}
          {helpPopover && (
            <HelpPopover align="center" {...helpPopoverProps}>
              {helpPopover}
            </HelpPopover>
          )}
        </Div>
        {helpText && (
          <HelpText id={helpTextId} css={{ mt: 0 }}>
            {helpText}
          </HelpText>
        )}
        <ErrorMessage
          show={!!error}
          id={errorMessageId}
          iconCss={{ mr: '$5' }}
          css={{ mt: '$2', position: 'relative', left: '-36px' }}
        >
          {errorMessage}
        </ErrorMessage>
      </Div>
    </Div>
  );
}
