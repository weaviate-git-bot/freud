import { useDateSegment } from '@react-aria/datepicker';
import { useRef } from 'react';
import { DateFieldState, DateSegment as DateSegmentType } from 'react-stately';

import { styled } from '../../stitches';

const StyledSegment = styled('div', {
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'end',
  px: '2px',

  '&:focus': {
    color: 'white',
    bg: '$green500',
    outline: 'none',
    borderRadius: '$md',
  },

  variants: {
    isPlaceholder: {
      true: {
        color: '$gray400',
      },
      false: {},
    },
  },
  defaultVariants: {
    isPlaceholder: 'false',
  },
});

type Props = {
  segment: DateSegmentType;
  state: DateFieldState;
};

export function DateSegment({ segment, state }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <StyledSegment
      {...segmentProps}
      ref={ref}
      isPlaceholder={segment.isPlaceholder}
    >
      {segment.text}
    </StyledSegment>
  );
}
