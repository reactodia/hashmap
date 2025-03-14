/**
 * Represents a read-only hash map data structure that can be cloned.
 */
export interface ReadonlyHashMap<K, V> extends ReadonlyMap<K, V> {
    /**
     * Creates a mutable copy of this map with the same hash
     * and equality functions.
     */
    clone(): HashMap<K, V>;
}

/**
 * Represents a read-only hash set data structure that can be cloned.
 */
export interface ReadonlyHashSet<K> extends ReadonlySet<K> {
    /**
     * Creates a mutable copy of this set with the same hash
     * and equality functions.
     */
    clone(): HashSet<K>;
}

/**
 * Hash map data structure with custom hash and equality functions
 * to use arbitrary composite keys.
 *
 * @example
 * ```
 * type Edge = { from: string; to: string };
 * const hash = (e: Edge) => hashTuple(e.from, e.to);
 * const equals = (a: Edge, b: Edge) =>
 *     a.from === b.from && a.to === b.to;
 * 
 * const map = new HashMap<Edge, number>(hash, equals);
 * // Set value for the key
 * map.set({ from: 'A', to: 'B' }, 10);
 * // Update value for an equal key with a different object identity
 * map.set({ from: 'A', to: 'B' }, 20);
 * // Delete entry for an equal key with a different object identity
 * map.delete({ from: 'A', to: 'B' });
 * ```
 */
export class HashMap<K, V> implements ReadonlyMap<K, V> {
    private readonly _keys = new Map<number, K[]>();
    private readonly _map = new Map<K, V>();

    constructor(
        private readonly _hashKey: (key: K) => number,
        private readonly _equalKeys: (k1: K, k2: K) => boolean,
        entries?: Iterable<readonly [K, V]>
    ) {
        if (entries) {
            for (const [key, value] of entries) {
                this.set(key, value);
            }
        }
    }

    get size(): number {
        return this._map.size;
    }

    has(key: K): boolean {
        const {_hashKey, _equalKeys} = this;
        const bucket = this._keys.get(_hashKey(key));
        if (bucket) {
            for (const storedKey of bucket) {
                if (_equalKeys(storedKey, key)) {
                    return true;
                }
            }
        }
        return false;
    }

    get(key: K): V | undefined {
        const {_hashKey, _equalKeys} = this;
        const bucket = this._keys.get(_hashKey(key));
        if (bucket) {
            for (const storedKey of bucket) {
                if (_equalKeys(storedKey, key)) {
                    return this._map.get(storedKey);
                }
            }
        }
        return undefined;
    }

    set(key: K, value: V): this {
        const {_hashKey, _equalKeys} = this;
        const hash = _hashKey(key);
        let bucket = this._keys.get(hash);
        if (!bucket) {
            bucket = [key];
            this._keys.set(hash, bucket);
            this._map.set(key, value);
        } else {
            let index = -1;
            for (let i = 0; i < bucket.length; i++) {
                if (_equalKeys(bucket[i], key)) {
                    index = i;
                    break;
                }
            }
            if (index >= 0) {
                this._map.set(bucket[index], value);
            } else {
                bucket.push(key);
                this._map.set(key, value);
            }
        }
        return this;
    }

    delete(key: K): boolean {
        const {_hashKey, _equalKeys} = this;
        const hash = _hashKey(key);
        const bucket = this._keys.get(hash);
        if (bucket) {
            for (let i = 0; i < bucket.length; i++) {
                if (_equalKeys(bucket[i], key)) {
                    const [storedKey] = bucket.splice(i, 1);
                    this._map.delete(storedKey);
                    if (bucket.length === 0) {
                        this._keys.delete(hash);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    clear(): void {
        this._keys.clear();
        this._map.clear();
    }

    clone(): HashMap<K, V> {
        return new HashMap<K, V>(this._hashKey, this._equalKeys, this);
    }

    forEach(callback: (value: V, key: K, map: ReadonlyMap<K, V>) => void): void {
        for (const [key, value] of this) {
            callback(value, key, this);
        }
    }

    keys(): IterableIterator<K> {
        return this._map.keys();
    }

    values(): IterableIterator<V> {
        return this._map.values();
    }

    entries(): IterableIterator<[K, V]> {
        return this._map.entries();
    }

    [Symbol.iterator](): IterableIterator<[K, V]> {
        return this.entries();
    }
}

/**
 * Hash set data structure with custom hash and equality functions
 * to use arbitrary composite items.
 */
export class HashSet<K> implements ReadonlyHashSet<K> {
    private _map: HashMap<K, true>;

    constructor(
        private readonly _hashCode: (key: K) => number,
        private readonly _equals: (k1: K, k2: K) => boolean,
        items?: Iterable<K>
    ) {
        this._map = new HashMap(_hashCode, _equals);
        if (items) {
            for (const item of items) {
                this.add(item);
            }
        }
    }

    get size(): number {
        return this._map.size;
    }

    has(key: K): boolean {
        return this._map.has(key);
    }

    add(key: K): this {
        this._map.set(key, true);
        return this;
    }

    delete(key: K): boolean {
        return this._map.delete(key);
    }

    clear(): void {
        this._map.clear();
    }

    clone(): HashSet<K> {
        const clone = new HashSet<K>(this._hashCode, this._equals);
        this.forEach(key => clone.add(key));
        return clone;
    }

    forEach(callback: (value: K, key: K, set: ReadonlySet<K>) => void): void {
        this._map.forEach((_value, key) => callback(key, key, this));
    }

    keys(): IterableIterator<K> {
        return this._map.keys();
    }

    values(): IterableIterator<K> {
        return this._map.keys();
    }

    *entries(): IterableIterator<[K, K]> {
        for (const key of this.keys()) {
            yield [key, key];
        }
    }

    [Symbol.iterator](): IterableIterator<K> {
        return this._map.keys();
    }
}
