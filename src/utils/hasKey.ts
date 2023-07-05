/**
 * Checks if a object contains a specificed key.
 *
 * The main reason this exists is to serve as a [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). Without the type guard, TypeScript will often complain about "implicit any".
 *
 * @example
 * ```
 * // BEFORE
 * const greetings = { hey: 'ho' };
 * if (greetings.hasOwnProperty(greeting)) {
 *   return greetings[greeting];
 *   // TypeScript error 😞
 * }
 *
 * // AFTER
 * const greetings = { hey: 'ho' };
 * if (hasKey(greetings, greeting)) {
 *   return greetings[greeting];
 *   // No errors 🎉
 * }
 * ```
 */
export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
  return Object.hasOwnProperty.call(obj, key);
}
