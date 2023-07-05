import { AriaButtonProps, useButton } from '@react-aria/button';
import { ElementType, useRef } from 'react';

import { Button } from '../button/Button';

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>;

type Props = AriaButtonProps<ElementType> & ButtonProps;

export const CalendarButton = ({ color = 'white', ...rest }: Props) => {
  const ref = useRef(null);
  const { buttonProps } = useButton(rest, ref);
  return (
    <Button type="button" {...buttonProps} color={color} ref={ref}>
      {rest.children}
    </Button>
  );
};
