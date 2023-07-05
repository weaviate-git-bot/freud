import React from 'react';
import {
  useController,
  UseControllerProps,
  FieldValues,
} from 'react-hook-form';

import { styled } from '../../stitches';
import { Div } from '../basic/Div';
import { ErrorMessage } from '../errorMessage/ErrorMessage';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { HelpText } from '../label/HelpText';
import { Label } from '../label/Label';
import { LabelSuffix } from '../label/LabelSuffix';
import { getAriaDescribedBy } from '../label/utils';
import { Switch, SwitchProps } from '../switch/Switch';

type CommonProps = {
  id: string;
  label: React.ReactNode;
  labelSuffix?: React.ReactNode;
  helpText?: string;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  side?: 'left' | 'right';
};
type Props<T extends FieldValues> = CommonProps &
  Omit<UseControllerProps<T>, 'defaultValue'> &
  Pick<SwitchProps, 'disabled' | 'css' | 'size'>;

type SimpleSwitchFieldProps = CommonProps &
  Omit<SwitchProps, 'value'> & {
    error?: boolean;
    errorMessage?: string;
  };

export function SwitchField<T extends FieldValues>({
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
    <SimpleSwitchField
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

export function SimpleSwitchField({
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
  side = 'right',
  ...rest
}: SimpleSwitchFieldProps) {
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
        justifyContent: side === 'right' ? 'space-between' : undefined,
        flexDirection: side === 'right' ? 'row-reverse' : undefined,
        ...css,
      }}
    >
      <Switch
        id={id}
        disabled={disabled}
        size={size}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        {...rest}
      />
      <LabelWrap size={size} side={side}>
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
          iconCss={{ mr: side === 'left' ? '$5' : undefined }}
          css={{
            mt: '$1',
            position: 'relative',
            left: side === 'left' ? '-36px' : undefined,
          }}
        >
          {errorMessage}
        </ErrorMessage>
      </LabelWrap>
    </Div>
  );
}

const LabelWrap = styled('div', {
  variants: {
    size: {
      small: {
        mt: '-2px',
      },
      medium: {},
      large: {
        mt: '2px',
      },
    },
    side: {
      left: {
        pl: '$4',
      },
      right: {},
    },
  },
  defaultVariants: {
    size: 'medium',
    side: 'right',
  },
});
