const PREFERRED_TRANSITIONS: Record<string, string> = {
  "10": "15",
  "15": "20",
  "20": "30",
  "25": "50",
  "30": "40",
  "40": "60",
  "50": "75",
  "60": "80",
  "75": "100",
  "80": "100",
};

function getSigDigits(num: number): string {
  return num.toPrecision(2).split("e")[0]?.replace(".", "") ?? "";
}

function isValidLevel(num: number): boolean {
  if (num < 100) return true;
  if (Number(num.toPrecision(2)) !== num) return false;
  const sig = getSigDigits(num);
  return sig in PREFERRED_TRANSITIONS || sig === "80";
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
    const prev = levels[i - 1] ?? first;

    const candidates = [5 / 4, 4 / 3, 3 / 2, 2 / 1]
      .map((m) => Math.round(prev * m))
      .filter((c) => c % first === 0 && isValidLevel(c));

    const targetSig = PREFERRED_TRANSITIONS[getSigDigits(prev)];
    const preferred = candidates.find((c) => getSigDigits(c) === targetSig);

    levels.push(preferred ?? Math.min(...candidates));
  }

  return levels;
}
