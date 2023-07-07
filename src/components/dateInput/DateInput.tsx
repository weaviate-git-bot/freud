import {
  CalendarDateTime,
  createCalendar,
  DateValue,
} from '@internationalized/date';
import { useDateField } from '@react-aria/datepicker';
import { useLocale } from '@react-aria/i18n';
import { Granularity } from '@react-types/datepicker';
import { useRef } from 'react';
import { useDateFieldState } from 'react-stately';

import { getTimezoneOffset } from '@konfidens/dates';

import { CSS } from '../../stitches';
import { Div } from '../basic/Div';
import { Span } from '../basic/Span';
import { Icon } from '../icon/Icon';
import { StyledInput } from '../input/StyledInput';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { Label } from '../label/Label';
import { LabelSuffix } from '../label/LabelSuffix';

import { DateSegment } from './DateSegment';

export type DateInputProps = {
  onChange?: (value: Date) => void;
  value?: Date;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  granularity?: Granularity;
  showTimeZone?: boolean;
  minValue?: Date;
  maxValue?: Date;
  id?: string;
  label?: React.ReactNode;
  labelSuffix?: React.ReactNode;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  timeZone?: string;
  css?: CSS;
  disabled?: boolean;
  width?: CSS['width'];
};

export function DateInput({
  onChange,
  value,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  granularity = 'day',
  showTimeZone = false,
  timeZone = 'UTC',
  minValue,
  maxValue,
  id,
  label,
  labelSuffix,
  helpPopover,
  helpPopoverProps,
  css,
  disabled,
}: DateInputProps) {
  const { locale } = useLocale();
  const state = useDateFieldState({
    minValue: minValue && toDateValue(minValue, timeZone),
    maxValue: maxValue && toDateValue(maxValue, timeZone),
    hideTimeZone: !showTimeZone,
    granularity,
    value: value && toDateValue(value, timeZone),
    onChange: (dateValue) => {
      onChange && dateValue && onChange(dateValue.toDate(timeZone));
    },
    locale,
    createCalendar,
    isDisabled: disabled,
  });

  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, fieldProps } = useDateField(
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      id,
      isDisabled: disabled,
    },
    state,
    ref,
  );

  const width = css?.width || getWidth(granularity);

  return (
    <Div css={{ width }}>
      {(label || helpPopover) && (
        <Div
          css={{ mb: '$1', display: 'flex', justifyContent: 'space-between' }}
        >
          {label && (
            <div>
              <Label as="span" {...labelProps}>
                {label}
              </Label>
              {labelSuffix && <LabelSuffix>{labelSuffix}</LabelSuffix>}
            </div>
          )}
          {helpPopover && (
            <HelpPopover {...helpPopoverProps}>{helpPopover}</HelpPopover>
          )}
        </Div>
      )}

      <StyledInput
        as="div"
        {...fieldProps}
        ref={ref}
        css={{
          display: 'inline-flex',
          borderLeftRadius: '$lg !important',

          '&:not(:disabled):not([aria-disabled="true"])': {
            '&:focus-within': {
              zIndex: 1,
              position: 'relative',
              boxShadow: '$focusRingInput, $small',
            },
          },

          ...css,
          width: '100%',
        }}
      >
        {state.segments.map((segment, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <DateSegment key={i} segment={segment} state={state} />
        ))}
        {state.validationState === 'invalid' && (
          <Span
            aria-hidden="true"
            css={{
              ml: '$2',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <Icon name="exclamation" size="5" color="red500" />
          </Span>
        )}
      </StyledInput>
    </Div>
  );
}

const getWidth = (granularity: Granularity): string => {
  switch (granularity) {
    case 'second':
      return '$64';
    case 'minute':
      return '$56';
    case 'hour':
      return '196px';
    case 'day':
    default:
      return '164px';
  }
};

const toDateValue = (
  date: Date | undefined,
  timeZone: string,
): DateValue | undefined => {
  if (!date) {
    return undefined;
  }
  const tzOffset = getTimezoneOffset(timeZone, date);
  const pushedDate = new Date(date.getTime() + tzOffset);
  return new CalendarDateTime(
    pushedDate.getUTCFullYear(),
    pushedDate.getUTCMonth() + 1,
    pushedDate.getUTCDate(),
    pushedDate.getUTCHours(),
    pushedDate.getUTCMinutes(),
    pushedDate.getUTCSeconds(),
  );
};
