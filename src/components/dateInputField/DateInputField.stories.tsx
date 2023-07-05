import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { addDays } from '@konfidens/dates';

import { DateInputField } from './DateInputField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: DateInputField,
} as Meta;

const Template = (props: React.ComponentProps<typeof DateInputField>) => {
  return <DateInputField {...props} />;
};

Template.args = undefined as
  | undefined
  | Omit<React.ComponentProps<typeof DateInputField>, 'control'>;

type FormType = { departure: Date };

export const Basic = () => {
  const { control } = useForm<FormType>({
    defaultValues: {
      departure: new Date(),
    },
  });

  return (
    <DateInputField
      id="dateinputfield-basic"
      control={control}
      label="Dato"
      labelSuffix="(valgfritt)"
      name="departure"
      helpText="Skriv inn en dato, a!"
    />
  );
};

export const ShowTimeZone = () => {
  const { control } = useForm<FormType>({
    defaultValues: {
      departure: new Date(),
    },
  });

  return (
    <>
      <DateInputField
        control={control}
        id="dateinputfield-without-timezone"
        name="departure"
        label="Avreise"
        granularity="minute"
      />
      <DateInputField
        control={control}
        id="dateinputfield-with-timezone"
        name="departure"
        label="Avreise"
        granularity="minute"
        showTimeZone
      />
    </>
  );
};

export const Granularity = () => {
  const { control } = useForm<FormType>({
    defaultValues: {
      departure: new Date(),
    },
  });

  return (
    <>
      <DateInputField
        control={control}
        id="dateinputfield-second"
        name="departure"
        label="Sekund"
        granularity="second"
      />
      <DateInputField
        control={control}
        id="dateinputfield-minute"
        name="departure"
        label="Minutt"
        granularity="minute"
      />
      <DateInputField
        control={control}
        id="dateinputfield-hour"
        name="departure"
        label="Time"
        granularity="hour"
      />
      <DateInputField
        control={control}
        id="dateinputfield-day"
        name="departure"
        label="Dag"
        granularity="day"
      />
    </>
  );
};

export const MinimumAndMaximumValues = () => {
  const today = new Date();
  const nextMonth = addDays(today, 31, 'UTC');
  const outOfBounds = addDays(today, 32, 'UTC');

  const { control } = useForm<FormType>({
    defaultValues: {
      departure: outOfBounds,
    },
  });

  return (
    <>
      <DateInputField
        control={control}
        id="dateinputfield-granularity"
        name="departure"
        label="Dag"
        minValue={today}
        maxValue={nextMonth}
      />
    </>
  );
};

export const HelpPopover = () => {
  const { control } = useForm<FormType>({
    defaultValues: {
      departure: new Date(),
    },
  });

  return (
    <DateInputField
      id="dateinputfield-helpPopover"
      control={control}
      label="Dato"
      name="departure"
      helpPopover="Skriv inn en dato, a!"
    />
  );
};
