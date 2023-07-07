import { Meta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { SelectField } from './SelectField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: SelectField,
} as Meta;

const Template = (props: React.ComponentProps<typeof SelectField>) => (
  <SelectField {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof SelectField>;

const options = [
  { value: 'cats', label: 'Cats' },
  { value: 'dogs', label: 'Dogs' },
];

export const Basic = Template.bind({});
Basic.args = {
  id: 'basic-select',
  label: 'Best pet',
  error: true,
  errorMessage: 'Not best pet',
  width: '$64',
  options,
};

export const AutoWidth = Template.bind({});
AutoWidth.args = {
  id: 'autowidth-select',
  label: 'What pet is fat?',
  error: true,
  width: 'auto',
  errorMessage: 'Very long error message, going beyond the dropdown',
  options: [
    { value: 'cat', label: 'Cat' },
    { value: 'Rhinoceros', label: 'Rhinoceros' },
  ],
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  id: 'defaultValue-select',
  options,
  defaultValue: 'cats',
};

export const Disabled = Template.bind({});
Disabled.args = {
  id: 'disabled-select',
  options,
  defaultValue: 'cats',
  disabled: true,
};

export const Error = Template.bind({});
Error.args = {
  id: 'error-select',
  options,
  error: true,
  errorMessage: 'You must select both. Come on! Do it!',
};

export const HelpText = Template.bind({});
HelpText.args = {
  id: 'helpText-select',
  options,
  helpText: 'All pets are created equal.',
};

export const HelpTextAndError = Template.bind({});
HelpTextAndError.args = {
  id: 'helpTextAndError-select',
  options,
  error: true,
  errorMessage: 'You must choose cat',
  helpText: 'All pets are created equal.',
};

export const HelpPopover = Template.bind({});
HelpPopover.args = {
  id: 'helpPopover-select',
  options,
  label: 'Pets',
  helpPopover: 'All pets are created equal.',
  css: {
    width: '$64',
  },
};

export const WithReactHookFormAndLabel = () => {
  const { setValue, watch } = useForm<{
    animal: string;
  }>();
  const animal = watch('animal');

  return (
    <SelectField
      value={animal}
      label={(animal && `Thanks for selecting ${animal}`) || 'Choose animal'}
      id="form-animal"
      options={[
        { value: 'cat', label: 'cat' },
        { value: 'dog', label: 'dog' },
      ]}
      onValueChange={(val) => {
        setValue('animal', val);
      }}
    />
  );
};
