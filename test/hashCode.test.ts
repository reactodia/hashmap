import { expect, test } from 'vitest';

import {
    chainHash, dropHighestNonSignBit, hashBigInt, hashNumber, hashString,
    hashTuple, hashValue,
} from '../src/hashCode';

test('dropHighestNonSignBit()', () => {
    expect(dropHighestNonSignBit(0)).toBe(0);
    expect(dropHighestNonSignBit(1)).toBe(1);
    expect(dropHighestNonSignBit(-1)).toBe(-1);
    expect(dropHighestNonSignBit(0x12345678)).toBe(0x12345678);
    expect(dropHighestNonSignBit(-0x12345678)).toBe(-0x12345678);
    expect(dropHighestNonSignBit(0x72ABCDEF)).toBe(0x32ABCDEF);
});

test('hashBigInt()', () => {
    expect(hashBigInt(0n)).toBe(0);
    expect(hashBigInt(0x12ABCDEFn)).toBe(0x12ABCDEF);
    expect(hashBigInt(-0x12ABCDEFn)).toBe(0x12ABCDEF);
    expect(hashBigInt(0x1234567812ABCDEFn)).toBe(0x12ABCDEF);
    expect(hashBigInt(-0x1234567812ABCDEFn)).toBe(0x12ABCDEF);
});

test('hashNumber()', () => {
    expect(hashNumber(0)).toBe(0);
    expect(hashNumber(0x12ABCDEF)).toBe(0x12ABCDEF);
    expect(hashNumber(-0x12ABCDEF)).toBe(-0x12ABCDEF);
    expect(hashNumber(1.1)).toBe(-645188801);
    expect(hashNumber(Math.PI)).toBe(1951045603);
});

test('hashString()', () => {
    expect(hashString('')).toBe(18652613);
    expect(hashString('simple')).toBe(2523299967);
    expect(hashString('The quick brown fox jumps over the lazy dog')).toBe(2224029584);
    expect(hashString('『鋼の錬金術師』')).toBe(3110757255);
});

test('hashValue()', () => {
    expect(hashValue(0x12ABCDEF)).toBe(hashNumber(0x12ABCDEF));
    expect(hashValue(Math.PI)).toBe(hashNumber(Math.PI));
    expect(hashValue(0x1234567812ABCDEFn)).toBe(hashBigInt(0x1234567812ABCDEFn));
    expect(hashValue('simple')).toBe(hashString('simple'));
    expect(hashValue(null)).toBe(0);
    expect(hashValue(undefined)).toBe(1);
    expect(hashValue(false)).toBe(2);
    expect(hashValue(true)).toBe(3);
});

test('chainHash()', () => {
    expect(chainHash(1, 2)).toBe(33);
    expect(chainHash(42, 0x12345678)).toBe(305421198);
    expect(chainHash(-100, 2345678)).toBe(2342578);
    expect(chainHash(0x12345678, -0xABCDEF)).toBe(866822809);
});

test('hashTuple()', () => {
    const tuple = [42, 'some string!', -123456789012345678n, false, true, undefined, null];
    expect(hashTuple(...tuple)).toBe(
        tuple.reduce<number>(
            (acc, v) => chainHash(acc, hashValue(v)),
            hashNumber(tuple.length)
        )
    );
});
