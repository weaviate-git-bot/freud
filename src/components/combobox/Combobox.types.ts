import React from 'react';

import { StyledInput } from '../input/StyledInput';

type StyledInputProps = React.ComponentProps<typeof StyledInput>;

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  image?: URL | 'user';
  group?: string;
};

export type ComboboxProps<T extends ComboboxOption> = {
  options: T[];
  onChange?: (val: string | undefined) => any;
  onQueryChange?: (val: string) => any;
  loading?: boolean;
  nullable?: boolean;
  LabelComponent?: (props: LabelComponentProps<T>) => React.ReactElement | null;
  filter?: (option: T, query: string) => boolean;
} & Omit<StyledInputProps, 'onChange' | 'nullable'>;

export type LabelComponentProps<T extends ComboboxOption> = {
  active: boolean;
  selected: boolean;
  disabled: boolean;
  option: T;
};
