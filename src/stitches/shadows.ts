export const shadows = {
  small: '0 2px 2px hsla(0, 0%, 0%, 0.05)',
  medium:
    '0 0 0 1px rgba(0, 0, 0, 0.04), 0 0 16px 0 rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 1px 3px -1px rgba(0, 0, 0, 0.2)',
  huge: '0 1px 2px rgba(0,0,0, 0.08), 0 4px 8px rgba(0,0,0, 0.08), 0 24px 64px rgba(0,0,0, 0.13)',
  border: '0 0 0 1px $colors$grayA300',
  borderHover: '0 0 0 1px $colors$grayA350',
  borderError: '0 0 0 1px $colors$red500',
  focusRing: '0 0 0 3px $colors$blue400',
  focusRingWithLightOffset: '0 0 0 2px white, 0 0 0 5px $colors$blue400',
  focusRingWithDarkOffset:
    '0 0 0 2px $colors$gray900, 0 0 0 5px $colors$blue400',
  focusRingInput: '0 0 0 2px $colors$gray900',
} as const;
