import { createSignal, Match, Switch } from "solid-js";
import { getBlindLevels } from "#lib/blind-levels";
import ActiveTimer from "./ActiveTimer";
import TimerSetup from "./TimerSetup";

type Page = "setup" | "timer";

function PokerTimer() {
  const [currentPage, setCurrentPage] = createSignal<Page>("setup");
  const [minFirstRound, setMinFirstRound] = createSignal(25);
  const [numberOfRounds, setNumberOfRounds] = createSignal(13);
  const [timerPerRound, setTimerPerRound] = createSignal(900);

  return (
    <div class="min-h-screen bg-green-800 text-white flex flex-col items-center justify-center p-4 safe-area">
      <Switch>
        <Match when={currentPage() === "setup"}>
          <TimerSetup
            minFirstRound={minFirstRound}
            numberOfRounds={numberOfRounds}
            timerPerRound={timerPerRound}
            setMinFirstRound={setMinFirstRound}
            setNumberOfRounds={setNumberOfRounds}
            setTimerPerRound={setTimerPerRound}
            onStartTimer={() => {
              setCurrentPage("timer");
            }}
          />
        </Match>
        <Match when={currentPage() === "timer"}>
          <ActiveTimer
            timePerRound={timerPerRound()}
            blindLevels={getBlindLevels({
              first: minFirstRound(),
              rounds: numberOfRounds(),
            })}
            onBackToSetup={() => {
              setCurrentPage("setup");
            }}
          />
        </Match>
      </Switch>
    </div>
  );
}

export default PokerTimer;
