export function getBlindLevels({
  first,
  rounds,
}: {
  first: number;
  rounds: number;
}) {
  const levels = [];
  let currentSmall = first;

  const getMultiplier = (roundIndex: number): number => {
    if (roundIndex < 3) return 1;

    const patterns = [
      { start: 3, end: 4, multiplier: 2 },
      { start: 5, end: 5, multiplier: 4 },
      { start: 6, end: 6, multiplier: 8 },
      { start: 7, end: 7, multiplier: 12 },
      { start: 8, end: 8, multiplier: 8 },
      { start: 9, end: 10, multiplier: 20 },
      { start: 11, end: 11, multiplier: 40 },
    ];

    for (const pattern of patterns) {
      if (roundIndex >= pattern.start && roundIndex <= pattern.end) {
        return pattern.multiplier;
      }
    }

    return 40;
  };

  for (let i = 0; i < rounds; i++) {
    levels.push(currentSmall);

    if (i === rounds - 1) break;

    let increase: number;

    if (i < 12) {
      increase = first * getMultiplier(i);
    } else {
      const minIncrease = Math.ceil(currentSmall * 0.25);
      const validIncreases = levels.filter((v) => v >= minIncrease);
      const fallbackIncrease = first * 40;
      increase =
        validIncreases.length > 0
          ? Math.min(...validIncreases)
          : fallbackIncrease;
    }

    currentSmall = currentSmall + increase;
  }

  return levels;
}
