import { parseAbsolute } from '@internationalized/date';
import { useDatePicker } from '@react-aria/datepicker';
import {
  AriaDatePickerProps,
  DateValue,
  Granularity,
} from '@react-types/datepicker';
import { useRef } from 'react';
import { useDatePickerState } from 'react-stately';

import { CSS } from '../../stitches';
import { Div } from '../basic/Div';
import { Calendar } from '../calendar/Calendar';
import { CalendarButton } from '../calendar/CalendarButton';
import { DateInput } from '../dateInput/DateInput';
import { FormGroup } from '../formGroup/FormGroup';
import { Icon } from '../icon/Icon';
import { HelpPopover, HelpPopoverProps } from '../label/HelpPopover';
import { Label } from '../label/Label';
import { LabelSuffix } from '../label/LabelSuffix';
import { Popover } from '../popover/Popover';

export type DatePickerProps = {
  onChange?: (value: Date) => void;
  value?: Date;
  'aria-label'?: string;
  'aria-describedby'?: string;
  granularity?: Granularity;
  showTimeZone?: boolean;
  timeZone?: string;
  minValue?: Date;
  maxValue?: Date;
  id?: string;
  label?: React.ReactNode;
  labelSuffix?: React.ReactNode;
  helpPopover?: React.ReactNode;
  helpPopoverProps?: HelpPopoverProps;
  css?: CSS;
  disabled?: boolean;
};

export function DatePicker({
  granularity = 'day',
  showTimeZone = false,
  timeZone = 'UTC',
  disabled,
  css,
  labelSuffix,
  helpPopover,
  helpPopoverProps,
  ...rest
}: DatePickerProps) {
  const modifiedProps: AriaDatePickerProps<DateValue> = {
    ...rest,
    granularity,
    hideTimeZone: !showTimeZone,
    value: rest.value && parseAbsolute(rest.value.toISOString(), timeZone),
    minValue:
      rest.minValue && parseAbsolute(rest.minValue.toISOString(), timeZone),
    maxValue:
      rest.maxValue && parseAbsolute(rest.maxValue.toISOString(), timeZone),
    onChange: (dateValue) => {
      rest.onChange && rest.onChange(dateValue.toDate(timeZone));
    },
    isDisabled: disabled,
  };

  const state = useDatePickerState(modifiedProps);
  const ref = useRef<HTMLDivElement>(null);
  const { groupProps, labelProps, fieldProps, buttonProps, calendarProps } =
    useDatePicker(modifiedProps, state, ref);

  const {
    value: fieldValue,
    minValue: fieldMinValue,
    maxValue: fieldMaxValue,
    onChange: fieldOnChange,
  } = fieldProps;

  const {
    value: calendarValue,
    minValue: calendarMinValue,
    maxValue: calendarMaxValue,
    onChange: calendarOnChange,
  } = calendarProps;

  return (
    <Div css={{ position: 'relative', width: getWidth(granularity), ...css }}>
      <Div css={{ mb: '$1', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Label {...labelProps} htmlFor={rest.id}>
            {rest.label}
          </Label>
          {labelSuffix && <LabelSuffix>{labelSuffix}</LabelSuffix>}
        </div>
        {helpPopover && (
          <HelpPopover {...helpPopoverProps}>{helpPopover}</HelpPopover>
        )}
      </Div>

      <Div {...groupProps} ref={ref}>
        <FormGroup>
          <DateInput
            {...fieldProps}
            timeZone={timeZone}
            showTimeZone={showTimeZone}
            value={fieldValue && fieldValue.toDate(timeZone)}
            minValue={fieldMinValue && fieldMinValue.toDate(timeZone)}
            maxValue={fieldMaxValue && fieldMaxValue.toDate(timeZone)}
            onChange={(date) => {
              fieldOnChange &&
                fieldOnChange(parseAbsolute(date?.toISOString(), timeZone));
            }}
            css={{ width: '100%' }}
            disabled={disabled}
          />
          <CalendarButton {...buttonProps} isDisabled={disabled}>
            <Icon name="calendar" />
          </CalendarButton>
        </FormGroup>
      </Div>
      <Popover
        align="end"
        hideArrow
        content={
          <Calendar
            {...calendarProps}
            value={calendarValue && calendarValue.toDate(timeZone)}
            minValue={calendarMinValue && calendarMinValue.toDate(timeZone)}
            maxValue={calendarMaxValue && calendarMaxValue.toDate(timeZone)}
            onChange={(date) => {
              calendarOnChange &&
                calendarOnChange(parseAbsolute(date?.toISOString(), timeZone));
            }}
            timeZone={timeZone}
          />
        }
        open={state.isOpen}
        onOpenChange={state.setOpen}
      >
        <div />
      </Popover>
    </Div>
  );
}

const getWidth = (granularity: Granularity): string => {
  switch (granularity) {
    case 'second':
      return '300px';
    case 'minute':
      return '270px';
    case 'hour':
      return '245px';
    case 'day':
    default:
      return '215px';
  }
};
