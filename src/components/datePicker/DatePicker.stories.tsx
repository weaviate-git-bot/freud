import { styled } from '@stitches/react';
import { Meta } from '@storybook/react';
import { useState } from 'react';

import { addDays } from '@konfidens/dates';

import { P } from '../typography/P';

import { DatePicker } from './DatePicker';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: DatePicker,
} as Meta;

const Template = (props: React.ComponentProps<typeof DatePicker>) => (
  <DatePicker {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof DatePicker>;

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  minHeight: '$64',
});

export const Basic = () => {
  return (
    <Wrapper>
      <DatePicker />
    </Wrapper>
  );
};

export const DisabledDatePicker = () => {
  return (
    <Wrapper>
      <DatePicker disabled />
    </Wrapper>
  );
};

export const Granularity = () => {
  return (
    <Wrapper>
      <DatePicker granularity="day" label="Day" />
      <DatePicker granularity="hour" label="Hour" />
      <DatePicker granularity="minute" label="Minute" />
      <DatePicker granularity="second" label="Second" />
    </Wrapper>
  );
};

export const width = () => {
  const today = new Date('5555-12-30');
  const yesterday = addDays(today, -1, 'UTC');

  return (
    <Wrapper>
      <DatePicker
        value={today}
        maxValue={yesterday}
        granularity="day"
        label="Day"
      />
      <DatePicker
        value={today}
        maxValue={yesterday}
        granularity="hour"
        label="Hour"
      />
      <DatePicker
        value={today}
        maxValue={yesterday}
        granularity="minute"
        label="Minute"
      />
      <DatePicker
        value={today}
        maxValue={yesterday}
        granularity="second"
        label="Second"
      />
      <DatePicker
        value={today}
        maxValue={yesterday}
        granularity="second"
        label="Manual override"
        css={{ width: '$128' }}
      />
    </Wrapper>
  );
};

export const ValueAndOnChange = () => {
  const [value, setValue] = useState<Date>(new Date());

  return (
    <Wrapper>
      <DatePicker
        value={value}
        onChange={(date) => {
          setValue(date);
        }}
      />
      <P>Current date: {value.toISOString()}</P>
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
      <DatePicker
        value={value}
        onChange={setValue}
        minValue={todayDate}
        maxValue={nextMonthDate}
      />
    </Wrapper>
  );
};

export const HelpPopover = () => {
  return (
    <Wrapper>
      <DatePicker helpPopover="Datovelgere er gøy!" />
    </Wrapper>
  );
};
