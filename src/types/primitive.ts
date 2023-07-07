/**
 * Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
 *
 * Source: [type-fest](https://github.com/sindresorhus/type-fest/blob/main/source/primitive.d.ts).
 */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;
