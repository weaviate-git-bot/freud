import { FocusEventHandler } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

import { CSS } from '../../stitches';
import { Div } from '../basic/Div';
import { DateInput, DateInputProps } from '../dateInput/DateInput';
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
} & DateInputProps;

type Props<T extends FieldValues> = CommonProps &
  Omit<UseControllerProps<T>, 'defaultValue'>;

export function DateInputField<T extends FieldValues>({
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
    <InternalDateInputField
      name={field.name}
      error={!!error}
      errorMessage={error?.message}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      {...rest}
    />
  );
}

type UncontrolledProps = CommonProps & {
  error?: boolean;
  errorMessage?: string;
  onChange?: (...event: any[]) => any;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  value?: Date;
};

export function InternalDateInputField({
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
      <DateInput
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
