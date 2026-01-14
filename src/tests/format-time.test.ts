import { describe, expect, it } from "bun:test";

import { formatTime } from "../lib/format-time";

describe("getBlindLevels", () => {
  it("should return correctly formatted time", () => {
    expect(formatTime(600)).toBe("10:00");
  });
});
