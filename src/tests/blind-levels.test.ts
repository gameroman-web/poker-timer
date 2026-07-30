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

  it("should correctly calculate for the 3rd round", () => {
    expect(getBlindLevels({ first: 25, rounds: 3 })).toEqual([25, 50, 75]);
  });

  it("should correctly calculate for the 4th round", () => {
    expect(getBlindLevels({ first: 25, rounds: 4 })).toEqual([25, 50, 75, 100]);
  });

  it("should have up-to-date snapshots", () => {
    expect(getBlindLevels({ first: 25, rounds: 5 })).toMatchInlineSnapshot(`
      [
        25,
        50,
        75,
        100,
        150,
      ]
    `);
    expect(getBlindLevels({ first: 25, rounds: 6 })).toMatchInlineSnapshot(`
      [
        25,
        50,
        75,
        100,
        150,
        200,
      ]
    `);
    expect(getBlindLevels({ first: 25, rounds: 10 })).toMatchInlineSnapshot(`
      [
        25,
        50,
        75,
        100,
        150,
        200,
        300,
        500,
        800,
        1000,
      ]
    `);
    expect(getBlindLevels({ first: 25, rounds: 13 })).toMatchInlineSnapshot(`
      [
        25,
        50,
        75,
        100,
        150,
        200,
        300,
        500,
        800,
        1000,
        1500,
        2000,
        3000,
      ]
    `);
    expect(getBlindLevels({ first: 25, rounds: 15 })).toMatchInlineSnapshot(`
      [
        25,
        50,
        75,
        100,
        150,
        200,
        300,
        500,
        800,
        1000,
        1500,
        2000,
        3000,
        3800,
        4800,
      ]
    `);
    expect(getBlindLevels({ first: 25, rounds: 20 })).toMatchInlineSnapshot(`
      [
        25,
        50,
        75,
        100,
        150,
        200,
        300,
        500,
        800,
        1000,
        1500,
        2000,
        3000,
        3800,
        4800,
        6300,
        8300,
        11300,
        14300,
        18100,
      ]
    `);
  });

  const FIRST_ROUNDS = [5, 10, 25, 50, 100];

  it.each(FIRST_ROUNDS)(
    "should always be a multiple of the 1st round",
    (first) => {
      expect(getBlindLevels({ first, rounds: 40 })).toSatisfy((arr) =>
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

    expect(getBlindLevels({ first, rounds: 40 })).toSatisfy(
      isBiggerThanOneBeforeIt,
    );
  });

  it.each(FIRST_ROUNDS)(
    "is not bigger than twice the one before it",
    (first) => {
      expect(getBlindLevels({ first, rounds: 40 })).toSatisfy((arr) =>
        arr.every((v, i) => {
          const prev = arr[i - 1];
          if (prev === undefined) return true;
          return v <= prev * 2;
        }),
      );
    },
  );

  it.each(FIRST_ROUNDS)(
    "should have a difference that is one of the previous numbers",
    (first) => {
      const isDifferenceOfPrevious = (arr: number[]) =>
        arr.every((v, i) => {
          const prev = arr[i - 1];
          if (prev === undefined) return true;
          const difference = v - prev;
          return arr.slice(0, i).includes(difference);
        });

      expect(getBlindLevels({ first, rounds: 40 })).toSatisfy(
        isDifferenceOfPrevious,
      );
    },
  );

  it.each(FIRST_ROUNDS)("should always increase by more than 25%", (first) => {
    const isIncreaseAtLeast25percent = (arr: number[]) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        const difference = v / prev;
        return difference >= 1.25;
      });

    expect(getBlindLevels({ first, rounds: 40 })).toSatisfy(
      isIncreaseAtLeast25percent,
    );
  });

  it.each(FIRST_ROUNDS)(
    "should have no more than 2 significant figures",
    (first) => {
      const hasMaxTwoSigFigs = (arr: number[]) =>
        arr.every((v) => Number(v.toPrecision(2)) === v);

      expect(getBlindLevels({ first, rounds: 40 })).toSatisfy(hasMaxTwoSigFigs);
    },
  );
});
