import { describe, expect, it } from "bun:test";

import { getBlindLevels } from "../lib/blind-levels";

describe("getBlindLevels", () => {
  it("should correctly return for the 1st round", () => {
    expect(getBlindLevels({ first: 5, rounds: 1 })).toEqual([5]);
    expect(getBlindLevels({ first: 10, rounds: 1 })).toEqual([10]);
    expect(getBlindLevels({ first: 25, rounds: 1 })).toEqual([25]);
  });

  it("should correctly double for the 2nd round", () => {
    expect(getBlindLevels({ first: 5, rounds: 2 })).toEqual([5, 10]);
    expect(getBlindLevels({ first: 10, rounds: 2 })).toEqual([10, 20]);
    expect(getBlindLevels({ first: 25, rounds: 2 })).toEqual([25, 50]);
  });

  it("should correctly calculate for the 3rd round", () => {
    expect(getBlindLevels({ first: 25, rounds: 3 })).toEqual([25, 50, 75]);
  });

  it("should correctly calculate for the 4th round", () => {
    expect(getBlindLevels({ first: 25, rounds: 4 })).toEqual([25, 50, 75, 100]);
  });

  it("should correctly calculate for the 5th round", () => {
    expect(getBlindLevels({ first: 25, rounds: 5 })).toEqual([
      25, 50, 75, 100, 150,
    ]);
  });

  it("should correctly calculate for the 6th round", () => {
    expect(getBlindLevels({ first: 25, rounds: 6 })).toEqual([
      25, 50, 75, 100, 150, 200,
    ]);
  });

  it("should correctly calculate for 10 rounds", () => {
    expect(getBlindLevels({ first: 25, rounds: 10 })).toEqual([
      25, 50, 75, 100, 150, 200, 300, 500, 800, 1000,
    ]);
  });

  it("should correctly calculate for 13 rounds", () => {
    expect(getBlindLevels({ first: 25, rounds: 13 })).toEqual([
      25, 50, 75, 100, 150, 200, 300, 500, 800, 1000, 1500, 2000, 3000,
    ]);
  });

  it("should always be a multiple of the 1st round", () => {
    expect(getBlindLevels({ first: 25, rounds: 25 })).toSatisfy((arr) =>
      arr.every((v) => v % 25 === 0),
    );
  });

  it("is a multiple of on of the 4 before it", () => {
    expect(getBlindLevels({ first: 25, rounds: 25 })).toSatisfy((arr) =>
      arr.every((v, i, a) => {
        if (i === 0) return true;
        const threeBefore = a.slice(i - 4 < 0 ? 0 : i - 4, i);
        return threeBefore.some((v2) => v % v2 === 0);
      }),
    );
  });

  it("is bigger than the one before it", () => {
    expect(getBlindLevels({ first: 25, rounds: 25 })).toSatisfy((arr) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        return v > prev;
      }),
    );
  });

  it("is not bigger than twice the one before it", () => {
    expect(getBlindLevels({ first: 25, rounds: 25 })).toSatisfy((arr) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        return v <= prev * 2;
      }),
    );
  });
});
