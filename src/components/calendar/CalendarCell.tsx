import {
  CalendarDate,
  getLocalTimeZone,
  isSameDay,
  today,
} from '@internationalized/date';
import { useCalendarCell } from '@react-aria/calendar';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { useRef } from 'react';
import { CalendarState } from 'react-stately';

import { styled } from '../../stitches';
import { Div } from '../basic/Div';

type Props = {
  state: CalendarState;
  date: CalendarDate;
  availabilityMode: boolean;
};

const StyledCell = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '$10',
  height: '$10',
  borderRadius: '$full',
  outline: 'none',
  color: '$gray700',

  variants: {
    availabilityMode: {
      true: { borderRadius: '$lg' },
      false: {},
    },
    selected: {
      true: { bg: '$green500', color: 'white' },
      false: {},
    },
    disabled: {
      true: { color: '$gray300', cursor: 'not-allowed' },
      false: { cursor: 'pointer' },
    },
    available: {
      true: {
        bg: '$gray100',
      },
      false: {},
    },
    focused: {
      true: {
        '&:after': {
          content: '',
          position: 'absolute',
          inset: '-2px',
          borderRadius: '$full',
          boxShadow: '0 0 0 2px $colors$green500',
        },
      },
      false: {},
    },
    isHidden: {
      true: {
        display: 'none',
      },
      false: {},
    },
    today: {
      true: {},
    },
  },
  compoundVariants: [
    {
      selected: false,
      disabled: false,
      css: {
        '&:hover': {
          bg: '$green50',
          color: '$green800',
        },
      },
    },
    {
      selected: false,
      disabled: false,
      available: false,
      availabilityMode: false,
      today: true,
      css: {
        bg: '$gray150',
      },
    },
    {
      selected: false,
      disabled: false,
      available: true,
      today: true,
      css: {
        border: '1px solid black',
      },
    },
    {
      selected: false,
      disabled: true,
      availabilityMode: false,
      today: true,
      css: {
        bg: '$gray150',
      },
    },
    {
      selected: false,
      available: false,
      availabilityMode: true,
      today: true,
      css: {
        border: '1px solid $gray300',
      },
    },
    {
      selected: false,
      disabled: true,
      availabilityMode: true,
      today: true,
      css: {
        border: '1px solid $gray300',
      },
    },
    {
      selected: true,
      disabled: false,
      availabilityMode: true,
      css: {
        bg: '$gray900',
      },
    },
    {
      focused: true,
      availabilityMode: true,
      css: {
        '&:after': {
          content: '',
          position: 'absolute',
          inset: '0',
          borderRadius: '$lg',
          boxShadow: '$focusRing',
        },
      },
    },
    {
      availabilityMode: true,
      selected: false,
      disabled: false,
      available: false,
      css: {
        color: '$gray300',
        '&:hover': {
          bg: 'transparent',
          color: '$gray300',
        },
      },
    },
    {
      availabilityMode: true,
      selected: false,
      disabled: false,
      available: true,
      css: {
        '&:hover': {
          bg: '$gray200',
        },
      },
    },
  ],
  defaultVariants: {
    selected: 'false',
    disabled: 'false',
    available: 'false',
  },
});

export function CalendarCell({ state, date, availabilityMode }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate,
  } = useCalendarCell({ date }, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  const available = isUnavailable === false;
  const isToday = isSameDay(date, today(getLocalTimeZone()));

  return (
    <Div
      as="td"
      {...cellProps}
      css={{
        py: '2px',
        position: 'relative',
        zIndex: isFocusVisible ? 10 : 0,
      }}
    >
      <StyledCell
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideVisibleRange}
        selected={isSelected}
        disabled={isDisabled}
        available={available}
        focused={isFocusVisible}
        isHidden={isOutsideVisibleRange}
        availabilityMode={availabilityMode}
        today={isToday}
      >
        {removeTrailingDot(formattedDate)}
      </StyledCell>
    </Div>
  );
}

const removeTrailingDot = (formattedDate: string) => {
  return formattedDate.endsWith('.')
    ? formattedDate.substring(0, formattedDate.length - 1)
    : formattedDate;
};
