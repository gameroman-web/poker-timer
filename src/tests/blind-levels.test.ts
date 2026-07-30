import { describe, expect, it } from "bun:test";

import { getBlindLevels } from "#lib/blind-levels";

describe("getBlindLevels", () => {
  it("should correctly return for the 1st round", () => {
    expect(getBlindLevels({ first: 1, rounds: 1 })).toEqual([1]);
    expect(getBlindLevels({ first: 5, rounds: 1 })).toEqual([5]);
    expect(getBlindLevels({ first: 10, rounds: 1 })).toEqual([10]);
    expect(getBlindLevels({ first: 25, rounds: 1 })).toEqual([25]);
  });

  it("should correctly double for the 2nd round", () => {
    expect(getBlindLevels({ first: 1, rounds: 2 })).toEqual([1, 2]);
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
    expect(getBlindLevels({ first: 1, rounds: 25 })).toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
        4,
        6,
        8,
        10,
        15,
        20,
        30,
        40,
        60,
        80,
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
      ]
    `);
    expect(getBlindLevels({ first: 5, rounds: 25 })).toMatchInlineSnapshot(`
      [
        5,
        10,
        15,
        20,
        30,
        40,
        60,
        80,
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
      ]
    `);
    expect(getBlindLevels({ first: 10, rounds: 25 })).toMatchInlineSnapshot(`
      [
        10,
        20,
        30,
        40,
        60,
        80,
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
      ]
    `);
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

  const FIRST_ROUNDS = [1, 5, 10, 25, 50, 100];

  it.each(FIRST_ROUNDS)(
    "should always be a multiple of the 1st round",
    (first) => {
      expect(getBlindLevels({ first, rounds: 50 })).toSatisfy((arr) =>
        arr.every((v) => v % first === 0),
      );
    },
  );

  const ALLOWED_MULTIPLIERS = new Set([5 / 4, 4 / 3, 3 / 2, 2 / 1]);

  it.each(FIRST_ROUNDS)(
    "should only use allowed multipliers (5/4, 4/3, 3/2, 2/1)",
    (first) => {
      const hasOnlyAllowedMultipliers = (arr: number[]) =>
        arr.every((v, i) => {
          const prev = arr[i - 1];
          if (prev === undefined) return true;

          const ratio = v / prev;
          return Array.from(ALLOWED_MULTIPLIERS).some(
            (allowed) => Math.abs(ratio - allowed) < 1e-6,
          );
        });

      expect(getBlindLevels({ first, rounds: 50 })).toSatisfy(
        hasOnlyAllowedMultipliers,
      );
    },
  );

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
