import { Meta } from '@storybook/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '../button/Button';
import { Link } from '../link/Link';

import { CheckboxField } from './CheckboxField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: CheckboxField,
} as Meta;

type FormType = { consent: boolean };

const Template = (props: React.ComponentProps<typeof CheckboxField>) => (
  <CheckboxField {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof CheckboxField>;

export const Simple = () => {
  const { control } = useForm<FormType>();

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="simple-checkbox"
      label="I accept and consent to your shady intent"
    />
  );
};

export const WithLink = () => {
  const { control } = useForm<FormType>();

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="withlink-checkbox"
      label={
        <>
          I agree to <Link href="/">your agreement</Link>
        </>
      }
    />
  );
};

export const DefaultChecked = () => {
  const { control } = useForm<FormType>({ defaultValues: { consent: true } });

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="default-checkbox"
      label="You have my consent"
    />
  );
};

export const Disabled = () => {
  const { control } = useForm<FormType>();

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="disabled-checkbox"
      label="Please accept my consent"
      disabled
    />
  );
};

export const DisabledAndChecked = () => {
  const { control } = useForm<FormType>({ defaultValues: { consent: true } });

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="disabledandchecked-checkbox"
      label="I did not know your intent was to withhold my consent?"
      disabled
    />
  );
};

export const Small = () => {
  const { control } = useForm<FormType>();

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="small-checkbox"
      label="A little consent"
      size="small"
    />
  );
};

export const RequiredError = () => {
  const { control, handleSubmit } = useForm<FormType>();

  useEffect(() => {
    handleSubmit(() => {})();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="error-checkbox"
      label="I accept the terms and conditions"
      rules={{ required: 'You have no choice. You have to accept' }}
    />
  );
};

export const HelpText = () => {
  const { control } = useForm<FormType>();

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="helptext-checkbox"
      label="I accept the terms and conditions"
      helpText="You have no choice. You have to accept"
    />
  );
};

export const HelpPopover = () => {
  const { control } = useForm<FormType>();

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="helpPopover-checkbox"
      label="I accept the terms and conditions"
      helpPopover="Make sure to read the text in tiny print"
    />
  );
};

export const ErrorAndHelpText = () => {
  const { control, setError } = useForm<FormType>();

  useEffect(() => {
    setError('consent', { message: 'Error set from setError' });
  }, [setError]);

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="error-checkbox"
      label="I accept the terms and conditions"
      helpText="Just do it. Click it"
    />
  );
};

export const LabelSuffix = () => {
  const { control } = useForm<FormType>();

  return (
    <CheckboxField
      control={control}
      name="consent"
      id="labelsuffix-checkbox"
      label="I accept the terms and conditions"
      labelSuffix="(Optional)"
    />
  );
};

export const WithSubmit = () => {
  const { watch, control, handleSubmit } = useForm<FormType>({
    defaultValues: { consent: true },
  });
  const hasConsent = watch('consent');

  return (
    // eslint-disable-next-line no-console
    <form onSubmit={handleSubmit(console.log)}>
      <CheckboxField
        id="withhooks"
        control={control}
        name="consent"
        label={hasConsent ? 'Thank you' : 'Please give it'}
        rules={{ required: 'GIVE IT!' }}
        css={{ mb: '$4' }}
      />
      <Button size="small" type="submit">
        Submit to console
      </Button>
    </form>
  );
};
