import { createEffect, createSignal } from "solid-js";

interface TimerSetupProps {
  minFirstRound: () => number;
  numberOfRounds: () => number;
  timerPerRound: () => number;
  setMinFirstRound: (value: number) => void;
  setNumberOfRounds: (value: number) => void;
  setTimerPerRound: (value: number) => void;
  onStartTimer: () => void;
}

const TimerSetup = (props: TimerSetupProps) => {
  const [inputMinFirstRound, setInputMinFirstRound] = createSignal(
    props.minFirstRound().toString(),
  );
  const [inputNumberOfRounds, setInputNumberOfRounds] = createSignal(
    props.numberOfRounds().toString(),
  );
  const [inputTimerPerRound, setInputTimerPerRound] = createSignal(
    (props.timerPerRound() / 60).toString(),
  );

  createEffect(() => {
    setInputMinFirstRound(props.minFirstRound().toString());
    setInputNumberOfRounds(props.numberOfRounds().toString());
    setInputTimerPerRound((props.timerPerRound() / 60).toString());
  });

  const handleMinFirstRoundChange = (value: string) => {
    setInputMinFirstRound(value);
    const numValue = parseInt(value, 10) || 10;
    if (numValue >= 1 && numValue <= 1000) {
      props.setMinFirstRound(numValue);
    }
  };

  const handleNumberOfRoundsChange = (value: string) => {
    setInputNumberOfRounds(value);
    const numValue = parseInt(value, 10) || 12;
    if (numValue >= 1 && numValue <= 50) {
      props.setNumberOfRounds(numValue);
    }
  };

  const handleTimerPerRoundChange = (value: string) => {
    setInputTimerPerRound(value);
    const numValue = parseInt(value, 10) || 10;
    if (numValue >= 1 && numValue <= 120) {
      props.setTimerPerRound(numValue * 60);
    }
  };

  const generateBlindLevels = () => {
    const levels = [];
    let currentSmall = props.minFirstRound();

    for (let i = 0; i < props.numberOfRounds(); i++) {
      levels.push({
        sb: currentSmall,
        bb: currentSmall * 2,
        time: props.timerPerRound(),
      });

      if (i % 2 === 1) {
        currentSmall = Math.round(currentSmall * 1.5);
      } else if (i % 3 === 2) {
        currentSmall = currentSmall * 2;
      }
    }

    return levels;
  };

  const blindLevels = generateBlindLevels();

  return (
    <div class="w-full max-w-lg mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2 text-white">Tournament Setup</h1>
        <p class="text-gray-300">Configure your poker tournament settings</p>
      </div>

      <div class="bg-black/50 backdrop-blur-lg rounded-3xl p-8 mb-6 border-2 border-green-500/30 shadow-2xl">
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-yellow-400 mb-2">
              Minimum First Round ($)
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                min="1"
                max="1000"
                value={inputMinFirstRound()}
                onInput={(e) => handleMinFirstRoundChange(e.target.value)}
                class="w-full bg-gray-900 border-2 border-gray-700 rounded-xl pl-8 pr-3 py-3 text-white font-mono text-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                placeholder="10"
              />
            </div>
            {inputMinFirstRound() &&
              (parseInt(inputMinFirstRound(), 10) < 1 ||
                parseInt(inputMinFirstRound(), 10) > 1000) && (
                <p class="text-red-400 text-xs mt-1">
                  Please enter a value between 1 and 1000
                </p>
              )}
          </div>

          <div>
            <label class="block text-sm font-semibold text-yellow-400 mb-2">
              Number of Rounds
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={inputNumberOfRounds()}
              onInput={(e) => handleNumberOfRoundsChange(e.target.value)}
              class="w-full bg-gray-900 border-2 border-gray-700 rounded-xl px-3 py-3 text-white font-mono text-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              placeholder="12"
            />
            {inputNumberOfRounds() &&
              (parseInt(inputNumberOfRounds(), 10) < 1 ||
                parseInt(inputNumberOfRounds(), 10) > 50) && (
                <p class="text-red-400 text-xs mt-1">
                  Please enter a value between 1 and 50
                </p>
              )}
          </div>

          <div>
            <label class="block text-sm font-semibold text-yellow-400 mb-2">
              Timer Per Round (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={inputTimerPerRound()}
              onInput={(e) => handleTimerPerRoundChange(e.target.value)}
              class="w-full bg-gray-900 border-2 border-gray-700 rounded-xl px-3 py-3 text-white font-mono text-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              placeholder="10"
            />
            {inputTimerPerRound() &&
              (parseInt(inputTimerPerRound(), 10) < 1 ||
                parseInt(inputTimerPerRound(), 10) > 120) && (
                <p class="text-red-400 text-xs mt-1">
                  Please enter a value between 1 and 120
                </p>
              )}
          </div>
        </div>
      </div>

      <div class="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 mb-6">
        <div class="text-center mb-4 text-lg font-semibold text-white">
          Blind Structure Preview
        </div>
        <div class="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
          {blindLevels.map((level, index) => (
            <div class="flex justify-between items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-700">
              <span class="text-green-300 font-medium">Level {index + 1}</span>
              <div class="text-white font-mono">
                <span class="text-yellow-400">${level.sb}</span> /{" "}
                <span class="text-orange-400">${level.bb}</span>
              </div>
              <span class="text-gray-400 text-sm">
                {Math.floor(level.time / 60)}:
                {(level.time % 60).toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={props.onStartTimer}
        class="w-full bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation shadow-lg flex items-center justify-center space-x-2"
      >
        <svg
          class="w-6 h-6"
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
        <span>Start Tournament</span>
      </button>
    </div>
  );
};

export default TimerSetup;
