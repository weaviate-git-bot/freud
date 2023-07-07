import { Meta } from '@storybook/react';
// eslint-disable-next-line no-restricted-imports
import { useDebounceFunction } from 'konfidens-web/src/hooks/useDebounceFunction';
import { useState } from 'react';

import { styled } from '../../stitches';
import { Div } from '../basic/Div';
import { P } from '../typography/P';

import { Combobox, ComboboxOption } from './Combobox';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Combobox,
} as Meta;

const Template = (props: React.ComponentProps<typeof Combobox>) => (
  <Combobox {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Combobox>;

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
];

const Wrapper = styled(Div, {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '$64',
  minHeight: '$64',
});

export const Basic = () => {
  const [val, setVal] = useState<string>();
  return (
    <Wrapper>
      <Combobox options={people} value={val} onChange={setVal} />
    </Wrapper>
  );
};

export const DefaultValue = () => {
  const [val, setVal] = useState<string | undefined>(people[3].value);
  return (
    <Wrapper>
      <Combobox options={people} value={val} onChange={setVal} />
    </Wrapper>
  );
};

export const DisabledCombobox = () => {
  const [val, setVal] = useState<string | undefined>(people[0].value);
  return (
    <Wrapper>
      <Combobox disabled options={people} value={val} onChange={setVal} />
    </Wrapper>
  );
};

export const DisabledValue = () => {
  const disabledOption = {
    value: 'NO_TOUCH',
    label: `Can't touch this`,
    disabled: true,
  };
  const [val, setVal] = useState<string | undefined>(disabledOption.value);
  return (
    <Wrapper>
      <Combobox
        options={[disabledOption, ...people]}
        value={val}
        onChange={setVal}
      />
    </Wrapper>
  );
};

export const Name = () => {
  const [val, setVal] = useState<string>();

  return (
    <>
      <code>Selected value: {JSON.stringify(val)}</code>
      <P>
        By adding a name prop, the Combobox will render{' '}
        {'<Input type="hidden" />'} so that its easier for forms to extract the
        value
      </P>

      <Wrapper
        css={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '$64',
          minHeight: '$64',
        }}
      >
        <Combobox
          options={people}
          name="person"
          value={val}
          onChange={setVal}
        />
      </Wrapper>
    </>
  );
};

export const NonNullable = () => {
  const [val, setVal] = useState<string>();

  return (
    <Wrapper>
      <Combobox
        options={people}
        name="person"
        value={val}
        onChange={setVal}
        nullable={false}
      />
    </Wrapper>
  );
};

const search = async (query: string): Promise<ComboboxOption[]> => {
  return people.filter((p) => p.label.toLowerCase().startsWith(query));
};

export const WithImage = () => {
  const [val, setVal] = useState<string>('cat');
  const imageOptions = [
    {
      value: 'cat',
      label: 'max@cat.com',
      image: new URL('https://placekitten.com/200/200'),
    },
    {
      value: 'catholder',
      label: 'placeholder@cat.com',
      image: 'user',
    },
    {
      value: 'nocat',
      label: 'no-image@cat.com',
    },
  ];
  return (
    <Wrapper>
      <Combobox options={imageOptions} value={val} onChange={setVal} />
    </Wrapper>
  );
};

export const AsyncCombobox = () => {
  const [val, setVal] = useState<string>();
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [submitDebounce, debounceLoading] = useDebounceFunction();
  const onQueryChange = async (query: string) => {
    const newOptions = await search(query);
    setOptions(newOptions);
  };

  return (
    <Wrapper>
      <Combobox
        options={options}
        name="person"
        value={val}
        onChange={setVal}
        onQueryChange={(query) => submitDebounce(() => onQueryChange(query))}
        loading={debounceLoading}
      />
    </Wrapper>
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
  const [val, setVal] = useState<string>();

  return (
    <Wrapper>
      <Combobox options={options} name="fruit" value={val} onChange={setVal} />
    </Wrapper>
  );
};

export const CustomLabelComponent = () => {
  const [val, setVal] = useState<string>();
  const options = [
    {
      value: 'cat',
      label: 'max@cat.com',
      image: 'https://placekitten.com/200/200',
    },
  ];

  return (
    <Wrapper>
      <Combobox
        options={options}
        name="fruit"
        value={val}
        onChange={setVal}
        LabelComponent={(props) => (
          <Wrapper
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
          </Wrapper>
        )}
      />
    </Wrapper>
  );
};

export const CustomFiltering = () => {
  const [val, setVal] = useState<string>();
  const options = [
    {
      value: 'cat',
      label: 'max@cat.com',
      alias: 'fisheater',
    },
  ];

  return (
    <Wrapper>
      <Combobox
        options={options}
        name="fruit"
        value={val}
        onChange={setVal}
        filter={(option, query) => option.alias.includes(query)}
      />
    </Wrapper>
  );
};
