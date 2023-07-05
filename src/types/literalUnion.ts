import { Primitive } from './primitive';

/**
Allows creating a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union.

Currently, when a union type of a primitive type is combined with literal types, TypeScript loses all information about the combined literals. Thus, when such type is used in an IDE with autocompletion, no suggestions are made for the declared literals.

This type is a workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729). It should be removed as soon as it's not needed anymore.

@example
```
import { LiteralUnion } from '@types/literalUnion';

// BEFORE
type Pet = 'dog' | 'cat' | string;
const pet: Pet = '';
// Start typing in your TypeScript-enabled IDE.
// You **will not** get auto-completion for `dog` and `cat` literals.

// AFTER
type Pet2 = LiteralUnion<'dog' | 'cat', string>;
const pet: Pet2 = '';
// You **will** get auto-completion for `dog` and `cat` literals.
```

Source: [type-fest](https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts).
*/
export type LiteralUnion<LiteralType, BaseType extends Primitive> =
  | LiteralType
  | (BaseType & { _?: never });
