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

function getSigDigits(num: number): string {
  return num.toPrecision(2).split("e")[0]?.replace(".", "") ?? "";
}

function isSigFigValid(num: number): boolean {
  if (num < 100) return true;
  if (Number(num.toPrecision(2)) !== num) return false;
  return ALLOWED_PREFIXES.has(getSigDigits(num));
}

export function getBlindLevels({
  first,
  rounds,
}: {
  first: number;
  rounds: number;
}): number[] {
  const levels: number[] = [first];

  for (let i = 1; i < rounds; i++) {
    const prev = levels[i - 1];

    const minTarget = prev * 1.25;
    const maxTarget = prev * 2.0;

    const candidates: number[] = [];

    // 1. Additions from past levels
    for (const past of levels) {
      candidates.push(prev + past);
    }

    // 2. Standard multipliers using clean rational ratios
    const multipliers = [1.25, 4 / 3, 1.5, 1.6, 1.75, 2.0];
    for (const m of multipliers) {
      candidates.push(Math.round(prev * m));
    }

    // Filter valid candidates
    const valid = candidates.filter((c) => {
      if (c <= prev || c > maxTarget + 1e-9) return false;
      if (c < minTarget - 1e-9) return false;
      if (c % first !== 0) return false;

      const diff = c - prev;

      // Difference rule: diff is a previous level, OR a clean decade multiple/factor,
      // OR a standard ratio step (e.g., 1500 -> 2000 is +500)
      const isPastDiff =
        levels.some(
          (l) =>
            l === diff ||
            l % diff === 0 ||
            (diff % l === 0 && isSigFigValid(diff)),
        ) ||
        Math.abs(c - Math.round(prev * (4 / 3))) === 0 ||
        Math.abs(c - Math.round(prev * 1.5)) === 0;

      if (!isPastDiff) return false;
      if (!isSigFigValid(c)) return false;

      return true;
    });

    if (valid.length > 0) {
      // Preferred standard T-25 tournament transitions
      const preferred = valid.find((c) => {
        const sigPrev = getSigDigits(prev);
        const sigC = getSigDigits(c);

        if (sigPrev === "20" && sigC === "30") return true; // 200 -> 300, 2000 -> 3000
        if (sigPrev === "40" && sigC === "60") return true; // 400 -> 600
        if (sigPrev === "60" && sigC === "80") return true; // 600 -> 800
        if (sigPrev === "10" && sigC === "15") return true; // 1000 -> 1500
        if (sigPrev === "15" && sigC === "20") return true; // 1500 -> 2000
        return false;
      });

      levels.push(preferred ?? Math.min(...valid));
    } else {
      let fallback = Math.min(prev * 2, maxTarget);
      if (fallback % first !== 0) {
        fallback = Math.floor(fallback / first) * first;
      }
      while (fallback > prev && !isSigFigValid(fallback)) {
        fallback -= first;
      }
      if (fallback <= prev) fallback = prev * 1.5;
      levels.push(fallback);
    }
  }

  return levels;
}
