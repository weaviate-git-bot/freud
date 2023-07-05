import React, { FocusEventHandler } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { FieldValues } from 'react-hook-form/dist/types';

import { CSS } from '../../stitches';
import { Div } from '../basic/Div';
import { Combobox } from '../combobox/Combobox';
import { ComboboxOption, ComboboxProps } from '../combobox/Combobox.types';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { HelpText } from '../label/HelpText';
import { Label } from '../label/Label';
import { LabelSuffix } from '../label/LabelSuffix';
import { getAriaDescribedBy } from '../label/utils';

export type ComboboxFieldProps<
  T extends FieldValues,
  S extends ComboboxOption,
> = CommonProps<S> & Omit<UseControllerProps<T>, 'defaultValue'>;

export function ComboboxField<T extends FieldValues, S extends ComboboxOption>({
  name,
  control,
  rules,
  shouldUnregister,
  options,
  ...props
}: ComboboxFieldProps<T, S>) {
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
    <InternalComboboxField<S>
      name={name}
      error={!!error}
      errorMessage={error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value as string}
      options={options}
      {...props}
    />
  );
}

type CommonProps<S extends ComboboxOption> = {
  id: string;
  label: React.ReactNode;
  labelSuffix?: React.ReactNode;
  helpText?: string;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  name: string;
  css?: CSS;
} & Omit<ComboboxProps<S>, 'id' | 'name' | 'css' | 'error' | 'value'>;

type UncontrolledProps<S extends ComboboxOption> = CommonProps<S> & {
  error?: boolean;
  errorMessage?: string;
  onChange?: (val: string | undefined) => any;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  value?: string;
};

export function InternalComboboxField<S extends ComboboxOption>({
  error,
  errorMessage,
  css,
  id,
  labelSuffix,
  helpText,
  helpPopover,
  helpPopoverProps,
  label,
  ...rest
}: UncontrolledProps<S>) {
  const errorMessageId = `${id}-error`;
  const labelSuffixId = `${id}-labelSuffix`;
  const helpTextId = `${id}-helpText`;

  const ariaDescribedBy = getAriaDescribedBy([
    !!errorMessage && error ? errorMessageId : undefined,
    labelSuffix ? labelSuffixId : undefined,
    helpText ? helpTextId : undefined,
  ]);

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        ...css,
      }}
    >
      <Div css={{ mb: '$1', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Label htmlFor={id}>{label}</Label>
          {labelSuffix && (
            <LabelSuffix id={labelSuffixId}>{labelSuffix}</LabelSuffix>
          )}
        </div>

        {helpPopover && (
          <HelpPopover {...helpPopoverProps}>{helpPopover}</HelpPopover>
        )}
      </Div>

      <Combobox<S>
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        {...rest}
      />

      {helpText && <HelpText id={helpTextId}>{helpText}</HelpText>}

      <ErrorMessage show={!!error} id={errorMessageId} css={{ mt: '$2' }}>
        {errorMessage}
      </ErrorMessage>
    </Div>
  );
}
