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
    currentSmall = currentSmall * 2;
  }

  return levels;
}
