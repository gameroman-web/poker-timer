export function getBlindLevels({
  first,
  rounds,
}: {
  first: number;
  rounds: number;
}) {
  const levels = [];
  let currentSmall = first;

  for (let i = 0; i < rounds; i++) {
    levels.push(currentSmall);

    if (i >= 3) {
      currentSmall = currentSmall + first * 2;
    } else {
      currentSmall = currentSmall + first;
    }
  }

  return levels;
}
