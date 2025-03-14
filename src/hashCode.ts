/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer}
 */
function hashFnv32a(str: string, seed = 0x811c9dc5): number {
    let i: number, l: number, hval = seed & 0x7fffffff;
    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    return hval >>> 0;
}

export function chainHash(hash: number, added: number): number {
    return (Math.imul(hash, 31) + added) | 0;
}

export function dropHighestNonSignBit(i32: number): number {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
}

export function hashString(str: string): number {
    return hashFnv32a(str);
}

const NUMBER_BITS = new ArrayBuffer(8);
const UINT32_VIEW = new Uint32Array(NUMBER_BITS);
const FLOAT64_VIEW = new Float64Array(NUMBER_BITS);

export function hashNumber(num: number): number {
    if ((num | 0) === num) {
        return num;
    } else {
        FLOAT64_VIEW[0] = num;
        const hash = chainHash(UINT32_VIEW[0], UINT32_VIEW[1]);
        FLOAT64_VIEW[0] = 0;
        return hash;
    }
}

export function hashBigInt(value: bigint): number {
    return Number((value >= 0n ? value : -value) % 0x100000000n);
}

type PrimitiveValue = string | number | boolean | bigint | undefined | null;

export function hashValue(value: PrimitiveValue): number {
    switch (typeof value) {
        case 'string': return hashString(value);
        case 'number': return hashNumber(value);
        case 'bigint': return hashBigInt(value);
        case 'undefined': return 1;
        case 'boolean': return value ? 3 : 2;
        default: return 0;
    }
}

export function hashTuple(...values: readonly PrimitiveValue[]): number {
    let hash = values.length | 0;
    for (const value of values) {
        hash = chainHash(hash, hashValue(value));
    }
    return hash;
}
