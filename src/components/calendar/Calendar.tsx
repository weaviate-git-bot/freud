import {
  createCalendar,
  DateValue,
  isSameDay,
  parseAbsolute,
} from '@internationalized/date';
import { AriaCalendarProps, useCalendar } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import { useRef } from 'react';
import { useCalendarState } from 'react-stately';

import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';
import { H3 } from '../typography/H3';

import { CalendarButton } from './CalendarButton';
import { CalendarGrid } from './CalendarGrid';

type Props = {
  value?: Date;
  minValue?: Date;
  maxValue?: Date;
  availableDays?: Date[];
  onChange?: (value: Date) => void;
  timeZone?: string;
};

export const Calendar = ({
  value,
  minValue,
  maxValue,
  availableDays,
  onChange,
  timeZone = 'UTC',
  ...rest
}: Props) => {
  const { locale } = useLocale();
  const modifiedProps: AriaCalendarProps<DateValue> = {
    ...rest,
    value: value && parseAbsolute(value.toISOString(), timeZone),
    minValue: minValue && parseAbsolute(minValue?.toISOString(), timeZone),
    maxValue: maxValue && parseAbsolute(maxValue?.toISOString(), timeZone),
    onChange: (dateValue) => {
      onChange && dateValue && onChange(dateValue.toDate(timeZone));
    },
  };

  const isDateUnavailable = (date: DateValue): boolean => {
    const availableDates =
      availableDays?.map((d) => parseAbsolute(d.toISOString(), timeZone)) || [];

    return !availableDates.some((d) => isSameDay(d, date));
  };

  const availabilityMode = availableDays !== undefined;

  const state = useCalendarState({
    ...modifiedProps,
    locale,
    createCalendar,
    isDateUnavailable: availabilityMode ? isDateUnavailable : undefined,
  });

  const ref = useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useCalendar(modifiedProps, state); // TODO: All the examples adds red as a prop, but if we add it Typescript complains

  return (
    <Div
      {...calendarProps}
      ref={ref}
      css={{
        width: '$80',
      }}
    >
      <Div
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '$1',
          mb: '$4',

          '& h2': {
            flex: 1,
          },
        }}
      >
        <CalendarButton type="button" color="transparent" {...prevButtonProps}>
          <Icon name="chevronLeft" />
        </CalendarButton>
        <H3
          size="m"
          css={{ '&::first-letter': { textTransform: 'uppercase' } }}
        >
          {title}
        </H3>

        <CalendarButton type="button" color="transparent" {...nextButtonProps}>
          <Icon name="chevronRight" />
        </CalendarButton>
      </Div>
      <CalendarGrid state={state} availabilityMode={availabilityMode} />
    </Div>
  );
};
