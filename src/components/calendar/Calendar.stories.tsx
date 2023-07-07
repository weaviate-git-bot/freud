import { I18nProvider } from '@react-aria/i18n';
import { Meta } from '@storybook/react';
import { useState } from 'react';

import { addDays } from '@konfidens/dates';

import { Calendar } from './Calendar';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Calendar,
} as Meta;

const Template = (props: React.ComponentProps<typeof Calendar>) => (
  <Calendar {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Calendar>;

export const Basic = () => {
  return <Calendar />;
};

export const Controlled = () => {
  const [value, setValue] = useState<Date>(new Date());
  return (
    <>
      <Calendar value={value} onChange={setValue} />
      <p>Current value: {value.toISOString()}</p>
    </>
  );
};

export const MinAndMaxValues = () => {
  const today = new Date();
  const tomorrow = addDays(today, 1, 'UTC');
  const nextWeek = addDays(today, 7, 'UTC');

  const [value, setValue] = useState<Date>(tomorrow);
  return (
    <>
      <Calendar
        value={value}
        minValue={today}
        maxValue={nextWeek}
        onChange={setValue}
      />
      <p>Current value: {value.toISOString()}</p>
    </>
  );
};

export const AvailableDays = () => {
  const today = new Date();

  const nextSeven = [...Array(7)].map((_, i) => addDays(today, i, 'UTC'));
  const pastSeven = [...Array(7)].map((_, i) => addDays(today, -i, 'UTC'));

  return <Calendar availableDays={[...pastSeven, ...nextSeven]} />;
};

export const AvailableFutureDaysIndicatesToday = () => {
  const today = new Date();

  const futureDays = [...Array(7)].map((_, i) => addDays(today, 2 + i, 'UTC'));

  return <Calendar availableDays={futureDays} />;
};

export const DisabledPresentStillIndicatesToday = () => {
  const future = addDays(new Date(), 1, 'UTC');

  return <Calendar minValue={future} />;
};

export const EnglishCalendar = () => {
  const future = addDays(new Date(), 1, 'UTC');

  return (
    <I18nProvider locale="en-US">
      <Calendar minValue={future} />
    </I18nProvider>
  );
};
