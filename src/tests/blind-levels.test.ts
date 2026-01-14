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
    const expectMultipleOfFirstRound = (first: number) =>
      expect(getBlindLevels({ first, rounds: 40 })).toSatisfy((arr) =>
        arr.every((v) => v % first === 0),
      );
    expectMultipleOfFirstRound(5);
    expectMultipleOfFirstRound(10);
    expectMultipleOfFirstRound(25);
    expectMultipleOfFirstRound(50);
    expectMultipleOfFirstRound(100);
  });

  it("is bigger than the one before it", () => {
    const isBiggerThanOneBeforeIt = (arr: number[]) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        return v > prev;
      });

    expect(getBlindLevels({ first: 5, rounds: 40 })).toSatisfy(
      isBiggerThanOneBeforeIt,
    );
    expect(getBlindLevels({ first: 10, rounds: 40 })).toSatisfy(
      isBiggerThanOneBeforeIt,
    );
    expect(getBlindLevels({ first: 25, rounds: 40 })).toSatisfy(
      isBiggerThanOneBeforeIt,
    );
    expect(getBlindLevels({ first: 50, rounds: 40 })).toSatisfy(
      isBiggerThanOneBeforeIt,
    );
    expect(getBlindLevels({ first: 100, rounds: 40 })).toSatisfy(
      isBiggerThanOneBeforeIt,
    );
  });

  it("is not bigger than twice the one before it", () => {
    expect(getBlindLevels({ first: 25, rounds: 40 })).toSatisfy((arr) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        return v <= prev * 2;
      }),
    );
  });

  it("should have a difference that is one of the previous numbers", () => {
    const isDifferenceOfPrevious = (arr: number[]) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        const difference = v - prev;
        return arr.slice(0, i).includes(difference);
      });

    expect(getBlindLevels({ first: 5, rounds: 40 })).toSatisfy(
      isDifferenceOfPrevious,
    );
    expect(getBlindLevels({ first: 10, rounds: 40 })).toSatisfy(
      isDifferenceOfPrevious,
    );
    expect(getBlindLevels({ first: 25, rounds: 40 })).toSatisfy(
      isDifferenceOfPrevious,
    );
    expect(getBlindLevels({ first: 50, rounds: 40 })).toSatisfy(
      isDifferenceOfPrevious,
    );
    expect(getBlindLevels({ first: 100, rounds: 40 })).toSatisfy(
      isDifferenceOfPrevious,
    );
  });

  it("should always increase by more than 25%", () => {
    const isIncreaseAtLeast25percent = (arr: number[]) =>
      arr.every((v, i) => {
        const prev = arr[i - 1];
        if (prev === undefined) return true;
        const difference = v / prev;
        return difference >= 1.25;
      });

    expect(getBlindLevels({ first: 5, rounds: 40 })).toSatisfy(
      isIncreaseAtLeast25percent,
    );
    expect(getBlindLevels({ first: 10, rounds: 40 })).toSatisfy(
      isIncreaseAtLeast25percent,
    );
    expect(getBlindLevels({ first: 25, rounds: 40 })).toSatisfy(
      isIncreaseAtLeast25percent,
    );
    expect(getBlindLevels({ first: 50, rounds: 40 })).toSatisfy(
      isIncreaseAtLeast25percent,
    );
    expect(getBlindLevels({ first: 100, rounds: 40 })).toSatisfy(
      isIncreaseAtLeast25percent,
    );
  });
});
