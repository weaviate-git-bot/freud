import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { addDays } from '@konfidens/dates';

import { DatePickerField } from './DatePickerField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: DatePickerField,
} as Meta;

const Template = (props: React.ComponentProps<typeof DatePickerField>) => {
  return <DatePickerField {...props} />;
};

Template.args = undefined as
  | undefined
  | Omit<React.ComponentProps<typeof DatePickerField>, 'control'>;

type FormType = { departure: Date };

export const Basic = () => {
  const { control } = useForm<FormType>({
    defaultValues: {
      departure: new Date(),
    },
  });

  return (
    <DatePickerField
      id="dateinputfield-basic"
      control={control}
      label="Dato"
      labelSuffix="(valgfritt)"
      name="departure"
      helpText="Skriv inn en dato, a!"
    />
  );
};

export const DisabledDatePickerField = () => {
  const { control } = useForm<FormType>();

  return (
    <DatePickerField
      id="dateinputfield-disabled"
      control={control}
      label="Dato"
      name="departure"
      disabled
    />
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
      <DatePickerField
        control={control}
        id="dateinputfield-second"
        name="departure"
        label="Sekund"
        granularity="second"
      />
      <DatePickerField
        control={control}
        id="dateinputfield-minute"
        name="departure"
        label="Minutt"
        granularity="minute"
      />
      <DatePickerField
        control={control}
        id="dateinputfield-hour"
        name="departure"
        label="Time"
        granularity="hour"
      />
      <DatePickerField
        control={control}
        id="dateinputfield-day"
        name="departure"
        label="Dag"
        granularity="day"
      />
    </>
  );
};

export const WithTimeZone = () => {
  const { control, watch } = useForm<FormType>();

  return (
    <DatePickerField
      control={control}
      id="datepickerfield-timezone"
      name="departure"
      label="Dag"
      timeZone="Europe/Oslo"
      showTimeZone
      helpText={`value: ${watch('departure')?.toISOString()}`}
    />
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
      <DatePickerField
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
    <DatePickerField
      id="dateinputfield-helpPopover"
      control={control}
      label="Dato"
      helpPopover="Skriv inn en dato, a!"
      name="departure"
    />
  );
};
