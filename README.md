# Reactodia Hashmap [![npm version](https://badge.fury.io/js/@reactodia%2Fhashmap.svg)](https://badge.fury.io/js/@reactodia%2Fhashmap)

`@reactodia/hashmap` is a TypeScript/JavaScript library that provides `HashMap` and `HashSet` collections to use as a compatible replacement for the built-in [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) when keys (items) are composite values.

## Installation

Install with:
```sh
npm install --save @reactodia/hashmap
```

## Quick example

```ts
import { HashMap, hashTuple } from '@reactodia/hashmap';

type Edge = { from: string; to: string };
const hashEdge = (e: Edge) => hashTuple(e.from, e.to);
const equalEdges = (a: Edge, b: Edge) => (
    a.from === b.from &&
    a.to === b.to
);

// Create a map with required hash and equality functions for keys
const map = new HashMap<Edge, number>(hashEdge, equalEdges);

// Set values for keys
map.set({ from: 'A', to: 'B' }, 10);
map.set({ from: 'C', to: 'D' }, 20);

// Update value for an equal key with a different object identity
map.set({ from: 'A', to: 'B' }, 100);

// Get an existing value by the equal key with a different identity
const value = map.get({ from: 'A', to: 'B' });

// Iterate over entries in the original insertion order
for (const [key, value] of map) {
    console.log('Map entry: ', key, value);
}

// Clone the map with the same hash and equality functions
const clonedMap = map.clone();

// Delete entry for an equal key with a different object identity
map.delete({ from: 'A', to: 'B' });

// Clear the map
map.clear();
```

## API

The library has the following exports:

#### `HashMap<K, V>` class

Fully compatible with built-in [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) with a different constructor and an additional method.

The `HashMap` keeps the entries in the original insertion order the same way as the built-in `Map` does.

##### `HashMap<K, V>(hash, equals, entries?)` constructor

Constructs a new hash map with the specified hash and equality functions for keys.

Parameters:
* `hash: (k: Key) => number`
* `equals: (k1, k2) => boolean`
* `entries?: Iterable<readonly [K, V]>`

##### `HashMap<K, V>.clone(): HashMap<K, V>` method

Returns a copy of the map with the same entries, hash and equality functions for the keys.

#### `HashSet<T>` class

Fully compatible with built-in [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) with a different constructor and an additional method.

The `HashSet` keeps the entries in the original insertion order the same way as the built-in `Set` does.

##### `HashSet<T>(hash, equals, items?)` constructor

Constructs a new hash set with the specified hash and equality functions for items.

Parameters:
* `hash: (v: T) => number`
* `equals: (v1, v2) => boolean`
* `items?: Iterable<T>`

##### `HashSet<T>.clone(): HashMap<T>` method

Returns a copy of the set with the same items, hash and equality functions for the items.

#### `ReadonlyHashMap<K, V>` interface

TypeScript interface for a read-only version of a `HashMap` which is compatible with `ReadonlyMap`.

#### `ReadonlyHashSet<T>` interface

TypeScript interface for a read-only version of a `HashSet` which is compatible with `ReadonlySet`.

#### `hashString(value: string, seed?: number): number` function

Utility function to compute a string hash using [FNV-32a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) algorithm.

Default seed is `0x811c9dc5`.

#### `hashNumber(value: number): number` function

Utility function to compute a hash for a JS number:
* for 32-bit integers the hash is the number itself;
* otherwise the hash is `Math.imul(31, H) + L` where `H` and `L` are 32-bit parts of IEEE floating point representation of the number.

#### `hashBigInt(value: bigint): number` function

Utility function to compute a hash for a `bigint` value with the following formula: `abs(N) % 0x8000_0000` where N is the `bigint` value.

#### `hashValue(value: string | number | bigint | boolean | undefined | null)`

Utility function to compute a hash for a primitive JS value:
* for `string` the `hashString(value)` is used;
* for `number` the `hashNumber(value)` is used;
* for `bigint` the `hashBigInt(value)` is used;
* for `null` the hash is `0`;
* for `undefined` the hash is `1`;
* for `boolean` the hash is `3` for `false` and `4` for `true`;
* otherwise the hash is `0`.

#### `chainHash(hash: number, added: number): number`

Utility function to "chain" hash values when computing a hash of a composite value, for example:

```ts
let hash = 0;
hash = chainHash(hash, hashValue(key.fieldA));
hash = chainHash(hash, hashValue(key.fieldB));
hash = chainHash(hash, hashValue(key.fieldC));
```

The formula for chained hash is `(Math.imul(hash, 31) + added) | 0`.

#### `hashTuple(...values): number`

Utility function to compute hash for a tuple of primitive values, equivalent to subsequent calls to `chainHash()` with `hashValue()` for each argument with the initial hash value of a hashed tuple length:

```ts
const hash = hashTuple(key.fieldA, key.fieldB, key.fieldC);
// same as
let hash = hashNumber(3);
hash = chainHash(hash, hashValue(key.fieldA));
hash = chainHash(hash, hashValue(key.fieldB));
hash = chainHash(hash, hashValue(key.fieldC));
```

#### `dropHighestNonSignBit(hash: number): number`

Utility function which coerces a number value into an integer such that "small integer optimization" ([Smi](https://v8.dev/blog/pointer-compression)) in V8 engine can be applied.

Passing the value from this function to return a computed hash may improve performance in some specific situations.

## License

The library is distributed under MIT license, see [LICENSE](./LICENSE). 
