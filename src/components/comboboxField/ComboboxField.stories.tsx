import { Meta } from '@storybook/react';
// eslint-disable-next-line no-restricted-imports
import { useDebounceFunction } from 'konfidens-web/src/hooks/useDebounceFunction';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Div } from '../basic/Div';
import { Button } from '../button/Button';
import { ComboboxOption } from '../combobox/Combobox';
import { P } from '../typography/P';

import { ComboboxField } from './ComboboxField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: ComboboxField,
} as Meta;

const Template = (props: React.ComponentProps<typeof ComboboxField>) => {
  return <ComboboxField {...props} />;
};

Template.args = undefined as
  | undefined
  | Omit<React.ComponentProps<typeof ComboboxField>, 'control'>;

const people = [
  { value: 'durward_reynolds', label: 'Durward Reynolds' },
  { value: 'kenton_towne', label: 'Kenton Towne' },
  { value: 'therese_wunsch', label: 'Therese Wunsch' },
  { value: 'benedict_kessler', label: 'Benedict Kessler' },
  { value: 'katelyn_rohan', label: 'Katelyn Rohan' },
  { value: 'axdurward_reynolds', label: 'AxDurward Reynolds' },
  { value: 'axkenton_towne', label: 'AxKenton Towne' },
  { value: 'axtherese_wunsch', label: 'AxTherese Wunsch' },
  { value: 'axbenedict_kessler', label: 'AxBenedict Kessler' },
  { value: 'axkatelyn_rohan', label: 'AxKatelyn Rohan' },
  {
    value: 'long',
    label:
      'Frank Nicholas UnlessJesusChristHadDiedForTheeThouHadstBeenDamned Barbon',
  },
  { value: 'short', label: 'Dur hur nor bor' },
];

export const Basic = () => {
  const { control } = useForm();

  return (
    <ComboboxField
      id="combobox-basic"
      control={control}
      name="place"
      label="Steder"
      options={people}
      css={{ mb: '$64' }}
    />
  );
};

export const LabelAndHelptext = () => {
  const { control, watch } = useForm();

  return (
    <ComboboxField
      id="combobox-basic"
      control={control}
      name="place"
      label="Velg en person"
      options={people}
      helpText={`Du har valgt ${watch('place')}`}
    />
  );
};

export const DefaultValue = () => {
  const { control } = useForm({
    defaultValues: { place: 'Oslo' },
  });

  return (
    <ComboboxField
      id="combobox-basic"
      control={control}
      name="place"
      label="Velg en person"
      options={people}
    />
  );
};

export const Required = () => {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <ComboboxField
        id="combobox-basic"
        control={control}
        name="place"
        label="Velg en person"
        options={people}
        rules={{ required: 'Du har ikke valgt noe!' }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export const Disabled = () => {
  const { control } = useForm();

  return (
    <ComboboxField
      id="combobox-basic"
      control={control}
      name="place"
      label="Velg en person"
      options={people}
      disabled
    />
  );
};

export const NonNullable = () => {
  const { control } = useForm();

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '$64',
        minHeight: '$64',
      }}
    >
      <ComboboxField
        options={people}
        name="person"
        control={control}
        label="Checkbox"
        id="combobox-id-nonnullable"
        nullable={false}
      />
    </Div>
  );
};

const search = async (query: string): Promise<ComboboxOption[]> => {
  return people.filter((p) => p.label.toLowerCase().startsWith(query));
};

export const AsyncCombobox = () => {
  const { control } = useForm();
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [submitDebounce, debounceLoading] = useDebounceFunction();
  const onQueryChange = async (query: string) => {
    const newOptions = await search(query);
    setOptions(newOptions);
  };

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '$64',
        minHeight: '$64',
      }}
    >
      <ComboboxField
        options={options}
        name="person"
        label="Checkbox"
        control={control}
        id="combobox-id-async"
        onQueryChange={(query) => submitDebounce(() => onQueryChange(query))}
        loading={debounceLoading}
      />
    </Div>
  );
};

export const GroupedOptions = () => {
  const options = [
    { value: 'Banana', label: 'Banana', group: 'fruit' },
    { value: 'Apple', label: 'Apple', group: 'fruit' },
    { value: 'Orange', label: 'Orange', group: 'fruit' },
    { value: 'Milk', label: 'Milk', group: 'drink' },
    { value: 'Bloody Mary', label: 'Bloody Mary', group: 'drink' },
    { value: 'Squirrel', label: 'Squirrel', group: 'animal' },
    { value: 'Cow', label: 'Cow', group: 'animal' },
  ];
  const { control } = useForm();

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '$64',
        minHeight: '$64',
      }}
    >
      <ComboboxField
        options={options}
        name="fruit"
        label="Checkbox"
        control={control}
        id="combobox-grouped"
      />
    </Div>
  );
};

export const CustomLabelComponent = () => {
  const { control } = useForm();
  const options = [
    {
      value: 'cat',
      label: 'max@cat.com',
      image: 'https://placekitten.com/200/200',
    },
  ];

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '$64',
        minHeight: '$64',
      }}
    >
      <ComboboxField
        options={options}
        name="fruit"
        control={control}
        label="Checkbox"
        id="combobox-id-customlabel"
        LabelComponent={(props) => (
          <Div
            css={{
              display: 'flex',
              bg: props.active ? '$gray100' : undefined,
              alignItems: 'center',
            }}
          >
            <img
              alt="kitten"
              src={props.option.image}
              style={{ width: '32px', height: '32px', margin: '3px 5px' }}
            />
            <P>{props.option.label}</P>
          </Div>
        )}
      />
    </Div>
  );
};

export const HelpPopover = () => {
  const { control } = useForm();

  return (
    <ComboboxField
      id="combobox-helpPopover"
      control={control}
      name="place"
      label="Velg en person"
      options={people}
      helpPopover="Valg av person er bindende og kan aldri tas tilbake"
    />
  );
};
