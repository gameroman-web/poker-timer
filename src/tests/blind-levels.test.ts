import { describe, expect, it } from "bun:test";

import { getBlindLevels } from "#lib/blind-levels";

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

  it("should follow standard T-25 poker tournament structure for the first 14 rounds", () => {
    expect(getBlindLevels({ first: 25, rounds: 14 })).toEqual([
      25, 50, 75, 100, 150, 200, 300, 400, 600, 800, 1000, 1500, 2000, 3000,
    ]);
  });

  it("should have up-to-date snapshots", () => {
    expect(getBlindLevels({ first: 25, rounds: 25 })).toMatchInlineSnapshot(`
      [
        25,
        50,
        75,
        100,
        150,
        200,
        300,
        400,
        600,
        800,
        1000,
        1500,
        2000,
        3000,
        4000,
        6000,
        8000,
        10000,
        15000,
        20000,
        30000,
        40000,
        60000,
        80000,
        100000,
      ]
    `);
  });

  const FIRST_ROUNDS = [5, 10, 25, 50, 100];

  it.each(FIRST_ROUNDS)(
    "should always be a multiple of the 1st round",
    (first) => {
      expect(getBlindLevels({ first, rounds: 50 })).toSatisfy((arr) =>
        arr.every((v) => v % first === 0),
      );
    },
  );

  it.each(FIRST_ROUNDS)("is bigger than the one before it", (first) => {
    const isBiggerThanOneBeforeIt = (arr: number[]) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        return v > prev;
      });

    expect(getBlindLevels({ first, rounds: 50 })).toSatisfy(
      isBiggerThanOneBeforeIt,
    );
  });

  it.each(FIRST_ROUNDS)(
    "is not bigger than twice the one before it",
    (first) => {
      expect(getBlindLevels({ first, rounds: 50 })).toSatisfy((arr) =>
        arr.every((v, i) => {
          const prev = arr[i - 1];
          if (prev === undefined) return true;
          return v <= prev * 2;
        }),
      );
    },
  );

  it.each(FIRST_ROUNDS)("should always increase by at least 25%", (first) => {
    const isIncreaseAtLeast25percent = (arr: number[]) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        const difference = v / prev;
        return difference >= 1.25;
      });

    expect(getBlindLevels({ first, rounds: 50 })).toSatisfy(
      isIncreaseAtLeast25percent,
    );
  });

  it.each(FIRST_ROUNDS)(
    "should have no more than 2 significant figures",
    (first) => {
      const hasMaxTwoSigFigs = (arr: number[]) =>
        arr.every((v) => Number(v.toPrecision(2)) === v);

      expect(getBlindLevels({ first, rounds: 50 })).toSatisfy(hasMaxTwoSigFigs);
    },
  );

  const ALLOWED_PREFIXES = new Set([
    "10",
    "15",
    "20",
    "25",
    "30",
    "40",
    "50",
    "60",
    "75",
    "80",
  ]);

  it.each(FIRST_ROUNDS)(
    "should start with allowed 2-digit sequences when >= 100",
    (first) => {
      const hasValidSigFigs = (arr: number[]) =>
        arr.every((v) => {
          if (v < 100) return true;

          const sigDigits =
            v.toPrecision(2).split("e")[0]?.replace(".", "") ?? "";
          return (
            Number(v.toPrecision(2)) === v && ALLOWED_PREFIXES.has(sigDigits)
          );
        });

      expect(getBlindLevels({ first, rounds: 50 })).toSatisfy(hasValidSigFigs);
    },
  );
});
