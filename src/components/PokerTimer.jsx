import { createSignal, onCleanup } from "solid-js";

const PokerTimer = () => {
  const [timeLeft, setTimeLeft] = createSignal(600); // 10 minutes default
  const [isRunning, setIsRunning] = createSignal(false);
  const [currentLevel, setCurrentLevel] = createSignal(1);
  const [smallBlind, setSmallBlind] = createSignal(10);
  const [bigBlind, setBigBlind] = createSignal(20);

  const blindLevels = [
    { sb: 10, bb: 20, time: 600 },
    { sb: 20, bb: 40, time: 600 },
    { sb: 25, bb: 50, time: 600 },
    { sb: 50, bb: 100, time: 600 },
    { sb: 75, bb: 150, time: 600 },
    { sb: 100, bb: 200, time: 600 },
    { sb: 150, bb: 300, time: 600 },
    { sb: 200, bb: 400, time: 600 },
    { sb: 300, bb: 600, time: 600 },
    { sb: 500, bb: 1000, time: 600 },
    { sb: 750, bb: 1500, time: 600 },
    { sb: 1000, bb: 2000, time: 600 },
  ];

  let interval;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (!isRunning()) {
      setIsRunning(true);
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextLevel();
            return blindLevels[currentLevel()]?.time || 600;
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

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(interval);
    setTimeLeft(blindLevels[currentLevel() - 1]?.time || 600);
  };

  const nextLevel = () => {
    const newLevel = currentLevel() + 1;
    if (newLevel <= blindLevels.length) {
      setCurrentLevel(newLevel);
      setSmallBlind(blindLevels[newLevel - 1].sb);
      setBigBlind(blindLevels[newLevel - 1].bb);
      setTimeLeft(blindLevels[newLevel - 1].time);

      // Play notification sound (using Web Audio API for simple beep)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } else {
      setIsRunning(false);
      clearInterval(interval);
    }
  };

  onCleanup(() => {
    clearInterval(interval);
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white flex flex-col items-center justify-center p-4 safe-area">
      <div class="w-full max-w-lg mx-auto">
        {/* Header */}
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold mb-2">Poker Timer</h1>
          <p class="text-green-200">Hold'em Tournament Manager</p>
        </div>

        {/* Timer Display */}
        <div class="bg-black/50 backdrop-blur-lg rounded-3xl p-8 mb-6 border-2 border-green-500/30 shadow-2xl">
          <div class="text-center">
            <div
              class="text-7xl font-mono font-bold text-yellow-400 mb-4"
              classList={{ "text-red-500": timeLeft() <= 60 && isRunning() }}
            >
              {formatTime(timeLeft())}
            </div>

            {/* Blind Display */}
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-black/30 rounded-xl p-3">
                <div class="text-xs text-green-300 uppercase">Small Blind</div>
                <div class="text-2xl font-bold">${smallBlind()}</div>
              </div>
              <div class="bg-black/30 rounded-xl p-3">
                <div class="text-xs text-green-300 uppercase">Big Blind</div>
                <div class="text-2xl font-bold">${bigBlind()}</div>
              </div>
            </div>

            {/* Level Info */}
            <div class="text-lg text-green-200">
              Level {currentLevel()} / {blindLevels.length}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div class="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={resetTimer}
            class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
          >
            <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <div class="text-xs mt-1">Reset</div>
          </button>

          <button
            onClick={isRunning() ? pauseTimer : startTimer}
            classList={{
              "bg-red-600 hover:bg-red-500": isRunning(),
              "bg-green-600 hover:bg-green-500": !isRunning(),
            }}
            class="text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
          >
            {isRunning() ? (
              <>
                <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="text-xs mt-1">Pause</div>
              </>
            ) : (
              <>
                <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div class="text-xs mt-1">Start</div>
              </>
            )}
          </button>

          <button
            onClick={nextLevel}
            class="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
          >
            <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <div class="text-xs mt-1">Next</div>
          </button>
        </div>

        {/* Level Navigation */}
        <div class="bg-black/30 backdrop-blur-lg rounded-2xl p-4 border border-green-500/20">
          <div class="text-center mb-3 text-sm text-green-200 uppercase">Quick Level Jump</div>
          <div class="grid grid-cols-6 gap-2">
            {blindLevels.map((level, index) => (
              <button
                onClick={() => {
                  setCurrentLevel(index + 1);
                  setSmallBlind(level.sb);
                  setBigBlind(level.bb);
                  setTimeLeft(level.time);
                  setIsRunning(false);
                  clearInterval(interval);
                }}
                classList={{
                  "bg-green-600": index + 1 === currentLevel(),
                  "bg-black/50 hover:bg-green-900/50": index + 1 !== currentLevel(),
                }}
                class="text-xs py-2 rounded-lg font-medium transition-all touch-manipulation"
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Settings hint */}
        <div class="text-center mt-6 text-green-200/60 text-sm">
          <p>Touch controls optimized for mobile</p>
          <p class="text-xs mt-1">Auto-advances when timer reaches 0</p>
        </div>
      </div>
    </div>
  );
};

export default PokerTimer;
