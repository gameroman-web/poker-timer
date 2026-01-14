import { createSignal } from "solid-js";
import { getBlindLevels } from "../lib/blind-levels";
import ActiveTimer from "./ActiveTimer";
import TimerSetup from "./TimerSetup";

function PokerTimer() {
  const [currentPage, setCurrentPage] = createSignal("setup");
  const [minFirstRound, setMinFirstRound] = createSignal(25);
  const [numberOfRounds, setNumberOfRounds] = createSignal(13);
  const [timerPerRound, setTimerPerRound] = createSignal(900);

  const handleStartTimer = () => {
    setCurrentPage("timer");
  };

  const handleBackToSetup = () => {
    setCurrentPage("setup");
  };

  return (
    <div class="min-h-screen bg-green-800 text-white flex flex-col items-center justify-center p-4 safe-area">
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
          timePerRound={timerPerRound()}
          blindLevels={getBlindLevels({
            first: minFirstRound(),
            rounds: numberOfRounds(),
          })}
          onBackToSetup={handleBackToSetup}
        />
      )}
    </div>
  );
}

export default PokerTimer;
