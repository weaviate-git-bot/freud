import { PropertyValue } from '@stitches/react';

export const utils = {
  // Margin: Abbreviated properties
  m: (value: PropertyValue<'margin'>) => ({
    margin: value,
  }),
  mt: (value: PropertyValue<'margin'>) => ({
    marginTop: value,
  }),
  mr: (value: PropertyValue<'margin'>) => ({
    marginRight: value,
  }),
  mb: (value: PropertyValue<'margin'>) => ({
    marginBottom: value,
  }),
  ml: (value: PropertyValue<'margin'>) => ({
    marginLeft: value,
  }),
  mx: (value: PropertyValue<'margin'>) => ({
    marginLeft: value,
    marginRight: value,
  }),
  my: (value: PropertyValue<'margin'>) => ({
    marginTop: value,
    marginBottom: value,
  }),

  // Padding: Abbreviated properties
  p: (value: PropertyValue<'padding'>) => ({
    padding: value,
  }),
  pt: (value: PropertyValue<'padding'>) => ({
    paddingTop: value,
  }),
  pr: (value: PropertyValue<'padding'>) => ({
    paddingRight: value,
  }),
  pb: (value: PropertyValue<'padding'>) => ({
    paddingBottom: value,
  }),
  pl: (value: PropertyValue<'padding'>) => ({
    paddingLeft: value,
  }),
  px: (value: PropertyValue<'padding'>) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  py: (value: PropertyValue<'padding'>) => ({
    paddingTop: value,
    paddingBottom: value,
  }),

  bg: (value: PropertyValue<'backgroundColor'>) => ({
    backgroundColor: value,
  }),

  // Size: Apply width/height together
  size: (value: PropertyValue<'width'>) => ({
    width: value,
    height: value,
  }),

  // Border radius: Apply on pairs of corners
  borderTopRadius: (value: PropertyValue<'borderRadius'>) => ({
    borderTopRightRadius: value,
    borderTopLeftRadius: value,
  }),
  borderRightRadius: (value: PropertyValue<'borderRadius'>) => ({
    borderTopRightRadius: value,
    borderBottomRightRadius: value,
  }),
  borderBottomRadius: (value: PropertyValue<'borderRadius'>) => ({
    borderBottomRightRadius: value,
    borderBottomLeftRadius: value,
  }),
  borderLeftRadius: (value: PropertyValue<'borderRadius'>) => ({
    borderTopLeftRadius: value,
    borderBottomLeftRadius: value,
  }),

  // Grid
  gridColumnSpan: (value: PropertyValue<'gridColumn'>) => ({
    gridColumn: `span ${value} / span ${value}`,
  }),

  visibleFor: (
    value:
      | 'screenreaders-only'
      | 'screenreaders-only-reserve-space'
      | 'visually-only'
      | 'no-one',
  ) => {
    switch (value) {
      case 'screenreaders-only':
        return {
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(100%)',
          height: '1px',
          width: '1px',
          overflow: 'hidden',
          position: 'absolute',
          whiteSpace: 'nowrap',
        };
      case 'screenreaders-only-reserve-space':
        return {
          opacity: 0,
        };
      case 'visually-only':
        return {
          'aria-hidden': 'true',
        };
      case 'no-one':
        return {
          display: 'none',
        };
      default:
        return {};
    }
  },
} as const;
