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

    if (i < 3) {
      currentSmall = currentSmall + first;
    } else if (i === 3) {
      currentSmall = currentSmall + first * 2;
    } else if (i === 4) {
      currentSmall = currentSmall + first * 2;
    } else if (i === 5) {
      currentSmall = currentSmall + first * 4;
    } else if (i === 6) {
      currentSmall = currentSmall + first * 8;
    } else if (i === 7) {
      currentSmall = currentSmall + first * 12;
    } else if (i === 8) {
      currentSmall = currentSmall + first * 8;
    } else if (i === 9) {
      currentSmall = currentSmall + first * 20;
    } else if (i === 10) {
      currentSmall = currentSmall + first * 20;
    } else if (i === 11) {
      currentSmall = currentSmall + first * 40;
    } else {
      currentSmall = currentSmall + first * 40;
    }
  }

  return levels;
}
