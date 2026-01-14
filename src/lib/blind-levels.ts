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

    if (i % 2 === 1) {
      currentSmall = Math.round(currentSmall * 1.5);
    } else if (i % 3 === 2) {
      currentSmall = currentSmall * 2;
    }
  }

  return levels;
}
