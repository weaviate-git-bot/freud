import React from 'react';

import { Avatar } from '../avatar/Avatar';
import { Div } from '../basic/Div';
import { LI } from '../basic/LI';

import type { LabelComponentProps, ComboboxOption } from './Combobox.types';

export function ComboboxOptionLabel({
  active,
  selected,
  disabled,
  option,
}: LabelComponentProps<ComboboxOption>) {
  let bg;
  if (selected && disabled) {
    bg = '$gray100';
  } else if (selected) {
    bg = '$green50';
  } else if (active) {
    bg = '$gray100';
  }

  let color = '$textBody';
  if (selected && disabled) {
    color = '$gray400';
  } else if (selected) {
    color = '$green600';
  } else if (disabled) {
    color = '$gray400';
  }

  return (
    <LI
      css={{
        m: '$1',
        p: '$2',
        borderRadius: '$lg',
        fontSize: '$m',
        outline: 'none',
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowWrap: 'anywhere',
        bg,
        fontWeight: selected ? '500' : undefined,
        color,

        '&:first-of-type': { mt: 0 },
        '&:last-of-type': { mb: 0 },
      }}
    >
      {!!option.image && (
        <Div css={{ display: 'flex', alignItems: 'center', gap: '$2' }}>
          <OptionImage url={option.image} />
          {option.label}
        </Div>
      )}
      {!option.image && option.label}
    </LI>
  );
}

const OptionImage = ({ url }: { url: URL | 'user' }) => {
  return (
    <Avatar
      src={url === 'user' ? undefined : url.href}
      size="28px"
      borderRadius="$full"
      fallbackCss={{
        '[data-headlessui-state="active"] &': { bg: '$gray200' },
        '[data-headlessui-state="selected"] &': {
          bg: '$green150',
          color: '$green700',
        },
        '[data-headlessui-state="active selected"] &': {
          bg: '$green150',
          color: '$green700',
        },
      }}
    />
  );
};
