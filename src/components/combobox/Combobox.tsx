import { Combobox as HeadlessCombobox } from '@headlessui/react';
import React, { Fragment, useMemo, useState } from 'react';

import { styled } from '../../stitches';
import { Div } from '../basic/Div';
import { Icon } from '../icon/Icon';
import { StyledInput } from '../input/StyledInput';
import { P } from '../typography/P';

import { ComboboxOption, ComboboxProps } from './Combobox.types';
import { ComboboxOptionLabel } from './ComboboxOptionLabel';

export function Combobox<T extends ComboboxOption>({
  options,
  name,
  onChange,
  value,
  disabled: comboboxDisabled,
  onQueryChange,
  loading,
  nullable = true,
  LabelComponent = ComboboxOptionLabel,
  filter,
  ...rest
}: ComboboxProps<T>) {
  const [query, internalSetQuery] = useState('');

  const selectedOption = useMemo(
    () => options.find((o) => o.value === value),
    [value, options],
  );

  const setQuery = (val: string) => {
    internalSetQuery(val);
    onQueryChange && onQueryChange(val);
  };

  const filteredOptions = useMemo(() => {
    const q = query.toLowerCase();
    if (filter) {
      return options.filter((o) => filter(o, q));
    }
    if (!q) {
      return options;
    }
    return options.filter(({ label }) => {
      return label.toLowerCase().includes(q);
    });
  }, [query, options, filter]);

  return (
    <HeadlessCombobox<T>
      value={selectedOption}
      onChange={(val: T | null) => {
        onChange && onChange(val?.value);
        setQuery('');
      }}
      name={name}
      disabled={comboboxDisabled}
      nullable={nullable as true /* Typing bug in HeadlessCombobox */}
    >
      <Div css={{ position: 'relative' }}>
        <HeadlessCombobox.Input<typeof StyledInput, ComboboxOption>
          as={StyledInput}
          onChange={(event) => {
            const val = event.target.value;
            setQuery(val);
          }}
          displayValue={(val) => {
            return val?.label;
          }}
          {...rest}
          name={name}
          autoComplete="off"
        />
        <HeadlessCombobox.Button
          as={ToggleButton}
          type="button"
          css={{ right: loading ? '$2' : undefined }}
          onClick={() => setQuery('')}
        >
          <Icon name={loading ? 'spinner' : 'chevronUpDown'} size="6" />
        </HeadlessCombobox.Button>

        <HeadlessCombobox.Options as={ListBox}>
          {!filteredOptions.length && <NoResults loading={loading} />}
          {filteredOptions.map((option, i) => (
            <HeadlessCombobox.Option
              key={option.value}
              value={option}
              as={Fragment}
              disabled={option.disabled}
            >
              {({ active, selected, disabled }) => {
                const previousGroup =
                  i === 0 ? undefined : filteredOptions[i - 1]?.group;
                const displayGroup =
                  option.group !== previousGroup && option.group;

                return (
                  <div>
                    {displayGroup && (
                      <GroupHeading>{option.group}</GroupHeading>
                    )}
                    <LabelComponent
                      active={active}
                      selected={selected}
                      disabled={disabled}
                      option={option}
                    />
                  </div>
                );
              }}
            </HeadlessCombobox.Option>
          ))}
        </HeadlessCombobox.Options>
      </Div>
    </HeadlessCombobox>
  );
}

const NoResults = ({ loading }: { loading?: boolean }) => {
  return (
    <P css={{ my: '$1', mx: '$3' }} size="s">
      {(loading && 'Laster...') || 'Ingen treff'}
    </P>
  );
};

export const GroupHeading = styled('p', {
  color: '$gray400',
  fontSize: '$xs',
  fontWeight: '500',
  textTransform: 'uppercase',

  px: '$3',
  mb: '$1',
  mt: '$3',

  'div:first-child > &': {
    mt: '2px',
  },
});

const ToggleButton = styled('button', {
  border: 0,
  bg: 'transparent',
  cursor: 'pointer',
  position: 'absolute',
  right: '$1',
  top: 0,
  bottom: 0,
  color: '$gray500',
  zIndex: '2',
});

const ListBox = styled('ul', {
  position: 'absolute',
  zIndex: 10,
  mt: '$1',
  maxHeight: '$64',
  width: '100%',
  overflow: 'auto',
  borderRadius: '$lg',
  bg: 'white',
  py: '$1',
  color: '$textBody',
  boxShadow: '$medium',

  '& > div': {
    scrollMargin: '$1',
  },
});
