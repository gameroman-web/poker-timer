import { getBlindLevels } from "../lib/blind-levels";
import { formatTime } from "../lib/format-time";
import NumberInput from "./NumberInput";

interface TimerSetupProps {
  minFirstRound(): number;
  numberOfRounds(): number;
  timerPerRound(): number;
  setMinFirstRound(value: number): void;
  setNumberOfRounds(value: number): void;
  setTimerPerRound(value: number): void;
  onStartTimer(): void;
}

function TimerSetup(props: TimerSetupProps) {
  return (
    <div class="w-full max-w-lg mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2 text-white">Tournament Setup</h1>
        <p class="text-gray-300">Configure your poker tournament settings</p>
      </div>

      <div class="bg-black/50 backdrop-blur-lg rounded-3xl p-8 mb-6 border-2 border-green-500/30 shadow-2xl">
        <div class="space-y-6">
          <div>
            <NumberInput
              value={props.minFirstRound()}
              onChange={props.setMinFirstRound}
              values={[1, 5, 10, 25, 50, 100]}
              label="Minimum First Round"
            />
          </div>

          <div>
            <NumberInput
              value={props.numberOfRounds()}
              onChange={props.setNumberOfRounds}
              values={[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
              label="Number of Rounds"
            />
          </div>

          <div>
            <NumberInput
              value={Math.floor(props.timerPerRound() / 60)}
              onChange={(value) => props.setTimerPerRound(value * 60)}
              values={[5, 10, 15]}
              label="Timer Per Round (minutes)"
            />
          </div>
        </div>
      </div>

      <div class="bg-black/30 backdrop-blur-lg rounded-2xl p-6 border border-green-500/20 mb-6">
        <div class="text-center mb-4 text-lg font-semibold text-white">
          Blind Structure Preview
        </div>
        <div class="space-y-2 max-h-60 overflow-y-auto hide-scrollbar">
          {getBlindLevels({
            first: props.minFirstRound(),
            rounds: props.numberOfRounds(),
          }).map((level, index) => (
            <div class="flex justify-between items-center bg-gray-900/50 rounded-lg px-4 py-2 border border-gray-700">
              <span class="text-green-300 font-medium">Level {index + 1}</span>
              <div class="text-white font-mono">
                <span class="text-yellow-400">${level}</span>
                {" / "}
                <span class="text-orange-400">${level * 2}</span>
              </div>
              <span class="text-gray-400 text-sm">
                {formatTime(props.timerPerRound())}
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
}

export default TimerSetup;
