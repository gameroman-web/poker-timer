import { describe, expect, it } from "bun:test";

import { getBlindLevels } from "../lib/blind-levels";

describe("getBlindLevels", () => {
  it("should return the correct blind levels", () => {
    expect(getBlindLevels({ first: 5, rounds: 1 })).toEqual([5]);
    expect(getBlindLevels({ first: 5, rounds: 2 })).toEqual([5, 10]);
  });
});
