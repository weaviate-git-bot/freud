import { FocusEventHandler } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

import { CSS } from '../../stitches';
import { Div } from '../basic/Div';
import { DatePicker, DatePickerProps } from '../datePicker/DatePicker';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { HelpPopoverProps } from '../label/HelpPopover';
import { HelpText } from '../label/HelpText';
import { getAriaDescribedBy } from '../label/utils';

type CommonProps = {
  id: string;
  name: string;
  label: React.ReactNode;
  labelSuffix?: React.ReactNode;
  helpText?: string;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  css?: CSS;
} & Omit<DatePickerProps, 'value' | 'onChange' | 'onBlur' | 'name'>;

type Props<T extends FieldValues> = CommonProps &
  Omit<UseControllerProps<T>, 'defaultValue'>;

export function DatePickerField<T extends FieldValues>({
  name,
  control,
  rules,
  shouldUnregister,
  ...rest
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
    <InternalDatePickerField
      {...rest}
      name={field.name}
      error={!!error}
      errorMessage={error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
    />
  );
}

type UncontrolledProps = CommonProps & {
  error?: boolean;
  errorMessage?: string;
  onChange?: (...event: any[]) => any;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  value?: Date;
  name?: string;
};

export function InternalDatePickerField({
  error,
  errorMessage,
  css,
  id,
  helpText,
  ...rest
}: UncontrolledProps) {
  const errorMessageId = `${id}-error`;
  const helpTextId = `${id}-helpText`;

  const ariaDescribedBy = getAriaDescribedBy([
    !!errorMessage && error ? errorMessageId : undefined,
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
      <DatePicker
        id={id}
        aria-describedby={ariaDescribedBy}
        css={{ width: '100%' }}
        {...rest}
      />

      {helpText && <HelpText id={helpTextId}>{helpText}</HelpText>}

      <ErrorMessage show={!!error} id={errorMessageId} css={{ mt: '$2' }}>
        {errorMessage}
      </ErrorMessage>
    </Div>
  );
}
