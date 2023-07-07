import { Meta } from '@storybook/react';
import { useState } from 'react';

import { addDays } from '@konfidens/dates';

import { styled } from '../../stitches';

import { DateInput } from './DateInput';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: DateInput,
} as Meta;

const Template = (props: React.ComponentProps<typeof DateInput>) => (
  <DateInput {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof DateInput>;

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
});

export const Basic = () => {
  return (
    <DateInput
      onChange={(date) => {
        console.log(date); // eslint-disable-line no-console
      }}
    />
  );
};

export const AriaLabel = () => {
  return <DateInput aria-label="Departure" />;
};

export const Value = () => {
  const [valueDate, setValueDate] = useState<Date>(new Date());

  return (
    <Wrapper>
      <DateInput
        value={valueDate}
        onChange={(date) => {
          console.log(date); // eslint-disable-line no-console
          setValueDate(date);
        }}
      />
    </Wrapper>
  );
};

export const DisabledDateInput = () => {
  return <DateInput disabled />;
};

export const WithTimeZone = () => {
  const [dayValue, setDayValue] = useState<Date>();
  const [minuteValue, setMinuteValue] = useState<Date>(new Date());

  return (
    <Wrapper>
      <DateInput
        granularity="day"
        css={{ width: '$64' }}
        value={dayValue}
        onChange={setDayValue}
        timeZone="Europe/Oslo"
      />
      <DateInput
        granularity="day"
        css={{ width: '$64' }}
        value={dayValue}
        showTimeZone
        onChange={setDayValue}
        timeZone="Europe/Oslo"
      />
      <DateInput
        granularity="minute"
        css={{ width: '$64' }}
        value={minuteValue}
        onChange={setMinuteValue}
        timeZone="Europe/Oslo"
      />
      <DateInput
        value={minuteValue}
        onChange={setMinuteValue}
        timeZone="Europe/Oslo"
        showTimeZone
        granularity="minute"
        css={{ width: '$64' }}
      />
    </Wrapper>
  );
};

export const MinimumAndMaximumValues = () => {
  const todayDate = new Date();
  const nextMonthDate = addDays(todayDate, 31, 'UTC');
  const outOfBoundsDate = addDays(todayDate, 32, 'UTC');

  const [value, setValue] = useState<Date>(outOfBoundsDate);

  return (
    <Wrapper>
      <DateInput
        value={value}
        onChange={setValue}
        minValue={todayDate}
        maxValue={nextMonthDate}
      />
    </Wrapper>
  );
};

export const Granularity = () => {
  return (
    <Wrapper>
      <DateInput granularity="second" />
      <DateInput granularity="minute" />
      <DateInput granularity="hour" />
      <DateInput granularity="day" />
    </Wrapper>
  );
};

export const Width = () => {
  const today = new Date('5555-12-30');
  const yesterday = addDays(today, -1, 'UTC');

  return (
    <Wrapper>
      <DateInput value={today} maxValue={yesterday} granularity="second" />
      <DateInput value={today} maxValue={yesterday} granularity="minute" />
      <DateInput value={today} maxValue={yesterday} granularity="hour" />
      <DateInput value={today} maxValue={yesterday} granularity="day" />
      <DateInput
        value={today}
        maxValue={yesterday}
        granularity="day"
        css={{ width: '$128' }}
      />
    </Wrapper>
  );
};

export const Label = () => {
  return (
    <Wrapper>
      <DateInput label="Avreise" labelSuffix="(Valgfritt)" />
    </Wrapper>
  );
};

export const HelpPopover = () => {
  return (
    <Wrapper>
      <DateInput label="Avreise" helpPopover="Valgfritt" />
    </Wrapper>
  );
};
