import { Meta } from '@storybook/react';

import { Div } from '../basic/Div';
import { Button } from '../button/Button';
import { Icon } from '../icon/Icon';

import { Tooltip } from './Tooltip';

export default {
  parameters: { docs: { canvas: { sourceState: 'shown' } } },
  component: Tooltip,
} as Meta;

const Template = (props: React.ComponentProps<typeof Tooltip>) => (
  <Tooltip {...props} />
);
Template.args = undefined as undefined | React.ComponentProps<typeof Tooltip>;

export const TooltipDefault = Template.bind({});
TooltipDefault.args = {
  children: (
    <Button>
      <Icon name="eyeClosed" />
    </Button>
  ),
  content: 'Lukk alle innlegg',
};

export const TooltipAlignment = () => (
  <Div css={{ display: 'flex', py: '$16', px: '$40', gap: '$6' }}>
    <Tooltip align="start" content="Lorem ipsum og så videre">
      <Button>Start</Button>
    </Tooltip>

    <Tooltip align="center" content="Lorem ipsum og så videre">
      <Button>Center (default)</Button>
    </Tooltip>

    <Tooltip align="end" content="Lorem ipsum og så videre">
      <Button>End</Button>
    </Tooltip>
  </Div>
);

export const TooltipSide = () => (
  <Div css={{ display: 'flex', py: '$16', px: '$40', gap: '$6' }}>
    <Tooltip side="bottom" content="Lorem ipsum og så videre">
      <Button>Bottom (default)</Button>
    </Tooltip>

    <Tooltip side="left" content="Lorem ipsum og så videre">
      <Button>Left</Button>
    </Tooltip>

    <Tooltip side="top" content="Lorem ipsum og så videre">
      <Button>Top</Button>
    </Tooltip>

    <Tooltip side="right" content="Lorem ipsum og så videre">
      <Button>Right</Button>
    </Tooltip>
  </Div>
);
export const TooltipSize = () => (
  <Div css={{ display: 'flex', py: '$16', px: '$40', gap: '$6' }}>
    <Tooltip content="Lorem ipsum og så videre">
      <Button>Medium (default)</Button>
    </Tooltip>

    <Tooltip content="Lorem ipsum og så videre" size="small">
      <Button>Small</Button>
    </Tooltip>
  </Div>
);
