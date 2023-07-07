import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { Div } from '../basic/Div';
import { Label } from '../label/Label';

import { Select } from './Select';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Select,
} as Meta;

const Template = (props: React.ComponentProps<typeof Select>) => (
  <Select {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Select>;

export const Simple = Template.bind({});
Simple.args = {
  placeholder: 'Choose',
  options: [
    { value: '1', label: 'First' },
    { value: '2', label: 'Second' },
  ],
  defaultValue: '1',
};

export const Groups = Template.bind({});
Groups.args = {
  placeholder: 'Choose something',
  options: [
    { value: 'Banana', label: 'Banana', group: 'fruit' },
    { value: 'Apple', label: 'Apple', group: 'fruit' },
    { value: 'Orange', label: 'Orange', group: 'fruit' },
    { value: 'Milk', label: 'Milk', group: 'drink' },
    { value: 'Bloody Mary', label: 'Bloody Mary', group: 'drink' },
    { value: 'Squirrel', label: 'Squirrel', group: 'animal' },
    { value: 'Cow', label: 'Cow', group: 'animal' },
  ],
};

export const DisabledOption = Template.bind({});
DisabledOption.args = {
  placeholder: 'Try me',
  options: [
    { value: 'Can touch this', label: 'Can touch this' },
    { value: "Can't touch this", label: "Can't touch this", disabled: true },
  ],
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Try me',
  disabled: true,
  options: [
    { value: 'Nix', label: 'Nix' },
    { value: 'Nope', label: 'Nope' },
  ],
};

export const NoSuffix = Template.bind({});
NoSuffix.args = {
  placeholder: 'Looks like button',
  options: [
    { value: 'Clinic A', label: 'Clinic A' },
    { value: 'Clinic B', label: 'Clinic B' },
  ],
  suffix: null,
};

export const WithReactHookFormAndLabel = () => {
  const { setValue, watch } = useForm<{
    animal: string;
  }>();
  const options = [
    { value: 'cat', label: 'cat' },
    { value: 'dog', label: 'dog' },
  ];
  const animal = watch('animal');

  return (
    <Div css={{ display: 'flex', gap: '$1', flexDirection: 'column' }}>
      <Label htmlFor="form-animal">
        {(animal && `Thanks for selecting ${animal}`) || 'Choose animal'}
      </Label>
      <Select
        value={animal}
        id="form-animal"
        options={options}
        onValueChange={(val) => {
          setValue('animal', val);
        }}
      />
    </Div>
  );
};
