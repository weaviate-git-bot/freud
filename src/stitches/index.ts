import { createStitches, CSS as CSSType } from '@stitches/react';

import { colors } from './colors';
import { fontSizes } from './fontSizes';
import { fonts } from './fonts';
import { letterSpacings } from './letterSpacings';
import { lineHeights } from './lineHeights';
import { media } from './media';
import { radii } from './radii';
import { shadows } from './shadows';
import { sizes } from './sizes';
import { utils } from './utils';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config: stitchesConfig,
} = createStitches({
  theme: {
    colors,
    sizes,
    fonts,
    fontSizes,
    letterSpacings,
    lineHeights,
    space: sizes,
    radii,
    shadows,
  },
  media,
  utils,
});

export type CSS = CSSType<typeof stitchesConfig>;
