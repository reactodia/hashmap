import { describe, expect, it } from 'vitest';

import { HashMap, HashSet } from '../src/hashMap.js';
import { hashTuple } from '../src/hashCode.js';

describe('HashMap', () => {
    it('allows to set and get items by key', () => {
        const weights = new HashMap<Edge, number>(hashEdge, equalEdges);
        weights.set({ from: 'A', to: 'B', type: 1 }, 10);
        weights.set({ from: 'A', to: 'B', type: 2 }, 20);
        weights.set({ from: 'A', to: 'C', type: 1 }, 30);
        weights.set({ from: 'D', to: 'B', type: 1 }, 40);

        expect(weights.size).toBe(4);

        expect(weights.has({ from: 'A', to: 'B', type: 1 })).toBe(true);
        expect(weights.has({ from: 'A', to: 'B', type: 2 })).toBe(true);
        expect(weights.has({ from: 'A', to: 'C', type: 1 })).toBe(true);
        expect(weights.has({ from: 'D', to: 'B', type: 1 })).toBe(true);

        expect(weights.get({ from: 'A', to: 'B', type: 1 })).toBe(10);
        expect(weights.get({ from: 'A', to: 'B', type: 2 })).toBe(20);
        expect(weights.get({ from: 'A', to: 'C', type: 1 })).toBe(30);
        expect(weights.get({ from: 'D', to: 'B', type: 1 })).toBe(40);

        expect(weights.has({ from: 'A', to: 'B', type: 3 })).toBe(false);
        expect(weights.has({ from: 'D', to: 'C', type: 1 })).toBe(false);

        expect(weights.get({ from: 'A', to: 'B', type: 3 })).toBe(undefined);
        expect(weights.get({ from: 'D', to: 'C', type: 1 })).toBe(undefined);
    });

    it('allows to change value by an existing key', () => {
        const weights = new HashMap<Edge, number>(hashEdge, equalEdges);
        weights.set({ from: 'A', to: 'B', type: 1 }, 10);
        weights.set({ from: 'E', to: 'F', type: 5 }, 50);

        weights.set({ from: 'A', to: 'B', type: 1 }, 60);

        expect(weights.size).toBe(2);
        expect(weights.get({ from: 'A', to: 'B', type: 1 })).toBe(60);
    });

    it('returns itself from set()', () => {
        const weights = new HashMap<Edge, number>(hashEdge, equalEdges);
        expect(weights.set({ from: 'A', to: 'B', type: 1 }, 10)).toBe(weights);
    });

    it('deletes by key', () => {
        const weights = new HashMap<Edge, number>(hashEdge, equalEdges);
        weights.set({ from: 'A', to: 'B', type: 1 }, 10);
        weights.set({ from: 'A', to: 'B', type: 2 }, 20);
        weights.set({ from: 'A', to: 'C', type: 1 }, 30);
        weights.set({ from: 'D', to: 'B', type: 1 }, 40);

        expect(weights.delete({ from: 'A', to: 'B', type: 1 })).toBe(true);
        expect(weights.delete({ from: 'A', to: 'B', type: 3 })).toBe(false);

        expect(weights.size).toBe(3);
        expect(weights.has({ from: 'A', to: 'B', type: 1 })).toBe(false);
        expect(weights.has({ from: 'A', to: 'B', type: 2 })).toBe(true);
        expect(weights.get({ from: 'A', to: 'B', type: 1 })).toBe(undefined);
        expect(weights.get({ from: 'A', to: 'B', type: 2 })).toBe(20);
    });

    it('can be cleared', () => {
        const weights = new HashMap<Edge, number>(hashEdge, equalEdges);
        weights.set({ from: 'A', to: 'B', type: 1 }, 10);
        weights.set({ from: 'A', to: 'B', type: 2 }, 20);
        weights.set({ from: 'A', to: 'C', type: 1 }, 30);
        weights.set({ from: 'D', to: 'B', type: 1 }, 40);

        weights.clear();
        expect(weights.size).toBe(0);
        expect(weights.has({ from: 'A', to: 'B', type: 1 })).toBe(false);
        expect(weights.has({ from: 'A', to: 'B', type: 2 })).toBe(false);
        expect(weights.get({ from: 'A', to: 'B', type: 1 })).toBe(undefined);
        expect(weights.get({ from: 'A', to: 'B', type: 2 })).toBe(undefined);
    });

    it('can be cloned', () => {
        const weights = new HashMap<Edge, number>(hashEdge, equalEdges);
        weights.set({ from: 'A', to: 'B', type: 1 }, 10);
        weights.set({ from: 'A', to: 'B', type: 2 }, 20);
        weights.set({ from: 'A', to: 'C', type: 1 }, 30);
        weights.set({ from: 'D', to: 'B', type: 1 }, 40);

        const clone = weights.clone();
        weights.clear();

        expect(clone.size).toBe(4);
        expect(clone.has({ from: 'A', to: 'B', type: 1 })).toBe(true);
        expect(clone.get({ from: 'A', to: 'B', type: 1 })).toBe(10);
    });

    it('can be enumerated', () => {
        const weights = new HashMap<Edge, number>(hashEdge, equalEdges);
        weights.set({ from: 'A', to: 'B', type: 1 }, 10);
        weights.set({ from: 'A', to: 'B', type: 2 }, 20);
        weights.set({ from: 'A', to: 'C', type: 1 }, 30);
        weights.set({ from: 'D', to: 'B', type: 1 }, 40);

        const keys = Array.from(weights.keys()).sort(compareEdges);
        expect(keys).toEqual([
            { from: 'A', to: 'B', type: 1 },
            { from: 'A', to: 'B', type: 2 },
            { from: 'A', to: 'C', type: 1 },
            { from: 'D', to: 'B', type: 1 },
        ]);

        const values = Array.from(weights.values()).sort((a, b) => a - b);
        expect(values).toEqual([10, 20, 30, 40]);

        const entries = Array.from(weights.entries()).sort((a, b) => compareEdges(a[0], b[0]));
        expect(entries).toEqual([
            [{ from: 'A', to: 'B', type: 1 }, 10],
            [{ from: 'A', to: 'B', type: 2 }, 20],
            [{ from: 'A', to: 'C', type: 1 }, 30],
            [{ from: 'D', to: 'B', type: 1 }, 40],
        ]);

        const items = Array.from(weights).sort((a, b) => compareEdges(a[0], b[0]));
        expect(items).toEqual([
            [{ from: 'A', to: 'B', type: 1 }, 10],
            [{ from: 'A', to: 'B', type: 2 }, 20],
            [{ from: 'A', to: 'C', type: 1 }, 30],
            [{ from: 'D', to: 'B', type: 1 }, 40],
        ]);

        let calledCount = 0;
        weights.forEach((value, key, collection) => {
            expect(weights.has(key)).toBe(true);
            expect(weights.get(key)).toBe(value);
            expect(collection).toBe(weights);
            calledCount++;
        });
        expect(calledCount).toBe(weights.size);
    });

    it('keeps the original insertion order', () => {
        const weights = new HashMap<number, string>(n => n % 10, (a, b) => a === b);
        weights.set(1, 'a');
        weights.set(2, 'b');
        weights.set(3, 'c');
        weights.set(11, 'aa');
        weights.set(22, 'bb');
        weights.set(33, 'cc');

        expect(Array.from(weights)).toEqual([
            [1, 'a'],
            [2, 'b'],
            [3, 'c'],
            [11, 'aa'],
            [22, 'bb'],
            [33, 'cc'],
        ]);

        weights.set(2, 'B');
        weights.set(11, 'AA');
        weights.set(4, 'D');
        expect(Array.from(weights)).toEqual([
            [1, 'a'],
            [2, 'B'],
            [3, 'c'],
            [11, 'AA'],
            [22, 'bb'],
            [33, 'cc'],
            [4, 'D'],
        ]);
    });
});

describe('HashSet', () => {
    it('allows to add items', () => {
        const edges = new HashSet<Edge>(hashEdge, equalEdges);
        edges.add({ from: 'A', to: 'B', type: 1 });
        edges.add({ from: 'A', to: 'B', type: 2 });
        edges.add({ from: 'A', to: 'C', type: 1 });
        edges.add({ from: 'D', to: 'B', type: 1 });

        expect(edges.has({ from: 'A', to: 'B', type: 1 })).toBe(true);
        expect(edges.has({ from: 'A', to: 'B', type: 2 })).toBe(true);
        expect(edges.has({ from: 'A', to: 'C', type: 1 })).toBe(true);
        expect(edges.has({ from: 'D', to: 'B', type: 1 })).toBe(true);

        expect(edges.has({ from: 'A', to: 'B', type: 3 })).toBe(false);
        expect(edges.has({ from: 'D', to: 'C', type: 1 })).toBe(false);
    });

    it('allows add already existing items', () => {
        const edges = new HashSet<Edge>(hashEdge, equalEdges);
        edges.add({ from: 'A', to: 'B', type: 1 });
        edges.add({ from: 'E', to: 'F', type: 5 });

        edges.add({ from: 'A', to: 'B', type: 1 });

        expect(edges.size).toBe(2);
        expect(edges.has({ from: 'A', to: 'B', type: 1 })).toBe(true);
    });

    it('returns itself from add()', () => {
        const edges = new HashSet<Edge>(hashEdge, equalEdges);
        expect(edges.add({ from: 'A', to: 'B', type: 1 })).toBe(edges);
    });

    it('deletes items', () => {
        const edges = new HashSet<Edge>(hashEdge, equalEdges);
        edges.add({ from: 'A', to: 'B', type: 1 });
        edges.add({ from: 'A', to: 'B', type: 2 });
        edges.add({ from: 'A', to: 'C', type: 1 });
        edges.add({ from: 'D', to: 'B', type: 1 });

        expect(edges.delete({ from: 'A', to: 'B', type: 1 })).toBe(true);
        expect(edges.delete({ from: 'A', to: 'B', type: 3 })).toBe(false);

        expect(edges.size).toBe(3);
        expect(edges.has({ from: 'A', to: 'B', type: 1 })).toBe(false);
        expect(edges.has({ from: 'A', to: 'B', type: 2 })).toBe(true);
    });

    it('can be cleared', () => {
        const edges = new HashSet<Edge>(hashEdge, equalEdges);
        edges.add({ from: 'A', to: 'B', type: 1 });
        edges.add({ from: 'A', to: 'B', type: 2 });
        edges.add({ from: 'A', to: 'C', type: 1 });
        edges.add({ from: 'D', to: 'B', type: 1 });

        edges.clear();
        expect(edges.size).toBe(0);
        expect(edges.has({ from: 'A', to: 'B', type: 1 })).toBe(false);
        expect(edges.has({ from: 'A', to: 'B', type: 2 })).toBe(false);
    });

    it('can be cloned', () => {
        const edges = new HashSet<Edge>(hashEdge, equalEdges);
        edges.add({ from: 'A', to: 'B', type: 1 });
        edges.add({ from: 'A', to: 'B', type: 2 });
        edges.add({ from: 'A', to: 'C', type: 1 });
        edges.add({ from: 'D', to: 'B', type: 1 });

        const clone = edges.clone();
        edges.clear();

        expect(clone.size).toBe(4);
        expect(clone.has({ from: 'A', to: 'B', type: 1 })).toBe(true);
    });

    it('can be enumerated', () => {
        const edges = new HashSet<Edge>(hashEdge, equalEdges);
        edges.add({ from: 'A', to: 'B', type: 1 });
        edges.add({ from: 'A', to: 'B', type: 2 });
        edges.add({ from: 'A', to: 'C', type: 1 });
        edges.add({ from: 'D', to: 'B', type: 1 });

        const keys = Array.from(edges.keys()).sort(compareEdges);
        expect(keys).toEqual([
            { from: 'A', to: 'B', type: 1 },
            { from: 'A', to: 'B', type: 2 },
            { from: 'A', to: 'C', type: 1 },
            { from: 'D', to: 'B', type: 1 },
        ]);

        const values = Array.from(edges.values()).sort(compareEdges);
        expect(values).toEqual([
            { from: 'A', to: 'B', type: 1 },
            { from: 'A', to: 'B', type: 2 },
            { from: 'A', to: 'C', type: 1 },
            { from: 'D', to: 'B', type: 1 },
        ]);

        const entries = Array.from(edges.entries()).sort((a, b) => compareEdges(a[0], b[0]));
        expect(entries).toEqual([
            [{ from: 'A', to: 'B', type: 1 }, { from: 'A', to: 'B', type: 1 }],
            [{ from: 'A', to: 'B', type: 2 }, { from: 'A', to: 'B', type: 2 }],
            [{ from: 'A', to: 'C', type: 1 }, { from: 'A', to: 'C', type: 1 }],
            [{ from: 'D', to: 'B', type: 1 }, { from: 'D', to: 'B', type: 1 }],
        ]);

        const items = Array.from(edges).sort(compareEdges);
        expect(items).toEqual([
            { from: 'A', to: 'B', type: 1 },
            { from: 'A', to: 'B', type: 2 },
            { from: 'A', to: 'C', type: 1 },
            { from: 'D', to: 'B', type: 1 },
        ]);

        let calledCount = 0;
        edges.forEach((value, key, collection) => {
            expect(value).toBe(key);
            expect(edges.has(key)).toBe(true);
            expect(collection).toBe(edges);
            calledCount++;
        });
        expect(calledCount).toBe(edges.size);
    });

    it('keeps the original insertion order', () => {
        const edges = new HashSet<number>(n => n % 10, (a, b) => a === b);
        edges.add(1);
        edges.add(2);
        edges.add(3);
        edges.add(11);
        edges.add(22);
        edges.add(33);

        expect(Array.from(edges)).toEqual([1, 2, 3, 11, 22, 33]);

        edges.add(2);
        edges.add(11);
        edges.add(4);
        expect(Array.from(edges)).toEqual([1, 2, 3, 11, 22, 33, 4]);
    });
});

interface Edge {
    readonly from: string;
    readonly to: string;
    readonly type: number;
}

function hashEdge(value: Edge): number {
    return hashTuple(value.from, value.to, value.type);
}

function equalEdges(a: Edge, b: Edge): boolean {
    return (
        a.from === b.from &&
        a.to === b.to &&
        a.type === b.type
    );
}

function compareEdges(a: Edge, b: Edge): number {
    let result = (
        a.from < b.from ? -1 :
        a.from > b.from ? 1 :
        0
    );
    if (result !== 0) {
        return result;
    }
    result = (
        a.to < b.to ? -1 :
        a.to > b.to ? 1 :
        0
    );
    if (result !== 0) {
        return result;
    }
    return (
        a.type < b.type ? -1 :
        a.type > b.type ? 1 :
        0
    );
}
