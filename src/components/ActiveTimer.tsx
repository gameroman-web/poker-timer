import { createEffect, createSignal, onCleanup } from "solid-js";
import { formatTime } from "../lib/format-time";

interface ActiveTimerProps {
  timePerRound: number;
  blindLevels: number[];
  onBackToSetup(): void;
}

function ActiveTimer(props: ActiveTimerProps) {
  const [timeLeft, setTimeLeft] = createSignal(props.timePerRound);
  const [isRunning, setIsRunning] = createSignal(false);
  const [currentLevel, setCurrentLevel] = createSignal(1);

  let interval: number | undefined;

  createEffect(() => {
    setTimeLeft(props.timePerRound);
    setCurrentLevel(1);
    setIsRunning(false);
  });

  const startTimer = () => {
    if (!isRunning()) {
      setIsRunning(true);
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextLevel();
            const nextTime = props.timePerRound;
            return nextTime;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(interval);
  };

  const nextLevel = () => {
    const newLevel = currentLevel() + 1;
    if (newLevel <= props.blindLevels.length) {
      setCurrentLevel(newLevel);
    } else {
      setIsRunning(false);
      clearInterval(interval);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(interval);
    setTimeLeft(props.timePerRound);
  };

  onCleanup(() => {
    clearInterval(interval);
  });

  const currentBlindLevel = props.blindLevels[currentLevel() - 1];

  return (
    <div class="w-full max-w-lg mx-auto">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold mb-2 text-white">Tournament Timer</h1>
        <p class="text-green-200">
          Level {currentLevel()} of {props.blindLevels.length}
        </p>
      </div>

      <div class="bg-black/50 backdrop-blur-lg rounded-3xl p-8 mb-6 border-2 border-green-500/30 shadow-2xl">
        <div class="text-center">
          <div
            class="text-7xl font-mono font-bold text-yellow-400 mb-6"
            classList={{ "text-red-500": timeLeft() <= 60 && isRunning() }}
          >
            {formatTime(timeLeft())}
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-linear-to-br from-gray-900 to-black rounded-2xl p-4 border border-gray-700">
              <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Small Blind
              </div>
              <div class="text-3xl font-bold text-yellow-400">
                ${currentBlindLevel || 0}
              </div>
            </div>
            <div class="bg-linear-to-br from-gray-900 to-black rounded-2xl p-4 border border-gray-700">
              <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Big Blind
              </div>
              <div class="text-3xl font-bold text-orange-400">
                ${(currentBlindLevel || 0) * 2}
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>{formatTime(props.timePerRound)}</span>
            <span
              classList={{
                "text-green-400": isRunning(),
                "text-gray-500": !isRunning(),
              }}
            >
              {isRunning() ? "RUNNING" : "PAUSED"}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={isRunning() ? pauseTimer : startTimer}
          classList={{
            "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400":
              isRunning(),
            "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400":
              !isRunning(),
          }}
          class="text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation shadow-lg flex items-center justify-center"
        >
          {isRunning() ? (
            <>
              <svg
                class="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg
                class="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start
            </>
          )}
        </button>

        <button
          type="button"
          onClick={resetTimer}
          class="bg-linear-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation shadow-lg flex items-center justify-center"
        >
          <svg
            class="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>
      </div>

      <button
        type="button"
        onClick={props.onBackToSetup}
        class="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation shadow-lg flex items-center justify-center"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Setup
      </button>

      {currentLevel() > props.blindLevels.length && (
        <div class="mt-6 bg-linear-to-r from-yellow-600 to-orange-600 rounded-xl p-4 text-center">
          <div class="text-white font-bold text-lg">Tournament Complete!</div>
          <div class="text-yellow-100 text-sm">
            All levels have been completed
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveTimer;
