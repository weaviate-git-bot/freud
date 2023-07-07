import { Meta } from '@storybook/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Div } from '../basic/Div';
import { Button } from '../button/Button';
import { Link } from '../link/Link';

import { SwitchField } from './SwitchField';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: SwitchField,
} as Meta;

type FormType = { consent: boolean };

const Template = (props: React.ComponentProps<typeof SwitchField>) => (
  <SwitchField {...props} />
);
Template.args = undefined as
  | undefined
  | React.ComponentProps<typeof SwitchField>;

export const Simple = () => {
  const { control } = useForm<FormType>();

  return (
    <SwitchField
      control={control}
      name="consent"
      id="simple-switch"
      label="I accept and consent to your shady intent"
    />
  );
};

export const WithLink = () => {
  const { control } = useForm<FormType>();

  return (
    <SwitchField
      control={control}
      name="consent"
      id="withlink-switch"
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
    <SwitchField
      control={control}
      name="consent"
      id="default-switch"
      label="You have my consent"
    />
  );
};

export const Disabled = () => {
  const { control } = useForm<FormType>();

  return (
    <SwitchField
      control={control}
      name="consent"
      id="disabled-switch"
      label="Please accept my consent"
      disabled
    />
  );
};

export const DisabledAndChecked = () => {
  const { control } = useForm<FormType>({ defaultValues: { consent: true } });

  return (
    <SwitchField
      control={control}
      name="consent"
      id="disabledandchecked-switch"
      label="I did not know your intent was to withhold my consent?"
      disabled
    />
  );
};

export const Size = () => {
  const { control } = useForm<FormType>();

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$5',
      }}
    >
      <SwitchField
        control={control}
        id="switch-small"
        name="consent"
        label="Small"
        size="small"
      />
      <SwitchField
        control={control}
        id="switch-medium"
        name="consent"
        label="Medium"
        size="medium"
      />
      <SwitchField
        control={control}
        id="switch-large"
        name="consent"
        label="Large"
        size="large"
      />
    </Div>
  );
};

export const Side = () => {
  const { control } = useForm<FormType>();

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$5',
      }}
    >
      <SwitchField
        control={control}
        id="switch-left"
        name="consent"
        label="Left"
        side="left"
      />
      <SwitchField
        control={control}
        id="switch-right"
        name="consent"
        label="Right"
        side="right"
      />
    </Div>
  );
};

export const RequiredError = () => {
  const { control, handleSubmit } = useForm<FormType>();

  useEffect(() => {
    handleSubmit(() => {})();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SwitchField
      control={control}
      name="consent"
      id="error-switch"
      label="I accept the terms and conditions"
      rules={{ required: 'You have no choice. You have to accept' }}
    />
  );
};

export const HelpText = () => {
  const { control } = useForm<FormType>();

  return (
    <SwitchField
      control={control}
      name="consent"
      id="helptext-switch"
      label="I accept the terms and conditions"
      helpText="You have no choice. You have to accept"
    />
  );
};

export const ErrorAndHelpText = () => {
  const { control, setError } = useForm<FormType>();

  useEffect(() => {
    setError('consent', { message: 'Error set from setError' });
  }, [setError]);

  return (
    <SwitchField
      control={control}
      name="consent"
      id="error-switch"
      label="I accept the terms and conditions"
      helpText="Just do it. Click it"
    />
  );
};

export const LabelSuffix = () => {
  const { control } = useForm<FormType>();

  return (
    <SwitchField
      control={control}
      name="consent"
      id="labelsuffix-switch"
      label="I accept the terms and conditions"
      labelSuffix="(Optional)"
    />
  );
};

export const HelpPopover = () => {
  const { control } = useForm<FormType>();

  return (
    <SwitchField
      control={control}
      name="consent"
      id="helppopover-switch"
      label="I accept the terms and conditions"
      helpPopover="Make sure to read the tiny text"
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
      <SwitchField
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

export const EverythingAllAtOnce = () => {
  const { control, setError } = useForm<FormType>();

  useEffect(() => {
    setError('consent', { message: 'Error set from setError' });
  }, [setError]);

  return (
    <Div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$10',
        mx: 'auto',
        maxWidth: '$128',
        borderRadius: '$lg',
        boxShadow: '$medium',
        p: '$4',
      }}
    >
      <SwitchField
        control={control}
        id="switch-small-left"
        name="consent"
        label="Small"
        helpText="This is a pretty short help text"
        size="small"
        side="left"
      />
      <SwitchField
        control={control}
        id="switch-medium-left"
        name="consent"
        label="Medium"
        helpText="This is a pretty short help text"
        size="medium"
        side="left"
      />
      <SwitchField
        control={control}
        id="switch-large-left"
        name="consent"
        label="Large"
        helpText="This is a pretty short help text"
        size="large"
        side="left"
      />
      <SwitchField
        control={control}
        id="switch-small-right"
        name="consent"
        label="Small"
        helpText="This is a pretty short help text"
        size="small"
        side="right"
      />
      <SwitchField
        control={control}
        id="switch-medium-right"
        name="consent"
        label="Medium"
        helpText="This is a pretty short help text"
        size="medium"
        side="right"
      />
      <SwitchField
        control={control}
        id="switch-large-right"
        name="consent"
        label="Large"
        helpText="This is a pretty short help text"
        size="large"
        side="right"
      />
    </Div>
  );
};
