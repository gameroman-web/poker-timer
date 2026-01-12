import { createEffect, createSignal } from "solid-js";
import ActiveTimer from "./ActiveTimer";
import TimerSetup from "./TimerSetup";

const PokerTimer = () => {
  const [currentPage, setCurrentPage] = createSignal("setup");
  const [minFirstRound, setMinFirstRound] = createSignal(10);
  const [numberOfRounds, setNumberOfRounds] = createSignal(12);
  const [timerPerRound, setTimerPerRound] = createSignal(600);

  const [blindLevels, setBlindLevels] = createSignal<
    {
      sb: number;
      bb: number;
      time: number;
    }[]
  >([]);

  const generateBlindLevels = () => {
    const levels = [];
    let currentSmall = minFirstRound();

    for (let i = 0; i < numberOfRounds(); i++) {
      levels.push({
        sb: currentSmall,
        bb: currentSmall * 2,
        time: timerPerRound(),
      });

      if (i % 2 === 1) {
        currentSmall = Math.round(currentSmall * 1.5);
      } else if (i % 3 === 2) {
        currentSmall = currentSmall * 2;
      }
    }

    return levels;
  };

  createEffect(() => {
    const levels = generateBlindLevels();
    setBlindLevels(levels);
  });

  const handleStartTimer = () => {
    setCurrentPage("timer");
  };

  const handleBackToSetup = () => {
    setCurrentPage("setup");
  };

  return (
    <div class="min-h-screen bg-linear-to-br from-green-900 via-green-800 to-green-900 text-white flex flex-col items-center justify-center p-4 safe-area">
      {currentPage() === "setup" ? (
        <TimerSetup
          minFirstRound={minFirstRound}
          numberOfRounds={numberOfRounds}
          timerPerRound={timerPerRound}
          setMinFirstRound={setMinFirstRound}
          setNumberOfRounds={setNumberOfRounds}
          setTimerPerRound={setTimerPerRound}
          onStartTimer={handleStartTimer}
        />
      ) : (
        <ActiveTimer
          initialTime={timerPerRound()}
          blindLevels={blindLevels()}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </div>
  );
};

export default PokerTimer;
