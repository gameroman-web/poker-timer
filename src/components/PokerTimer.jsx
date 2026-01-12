import { createEffect, createSignal, onCleanup } from "solid-js";

const PokerTimer = () => {
	const [timeLeft, setTimeLeft] = createSignal(600); // 10 minutes default
	const [isRunning, setIsRunning] = createSignal(false);
	const [currentLevel, setCurrentLevel] = createSignal(1);
	const [smallBlind, setSmallBlind] = createSignal(10);
	const [bigBlind, setBigBlind] = createSignal(20);

	// Configuration options
	const [minFirstRound, setMinFirstRound] = createSignal(10);
	const [numberOfRounds, setNumberOfRounds] = createSignal(12);
	const [timerPerRound, setTimerPerRound] = createSignal(600); // seconds

	const [blindLevels, setBlindLevels] = createSignal([]);

	let interval;

	// Generate blind levels based on configuration
	const generateBlindLevels = () => {
		const levels = [];
		let currentSmall = minFirstRound();

		for (let i = 0; i < numberOfRounds(); i++) {
			levels.push({
				sb: currentSmall,
				bb: currentSmall * 2,
				time: timerPerRound(),
			});

			// Increase blinds for next round (roughly doubling every 2-3 levels)
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

		// Reset to first level if configuration changes
		if (levels.length > 0) {
			setCurrentLevel(1);
			setSmallBlind(levels[0].sb);
			setBigBlind(levels[0].bb);
			setTimeLeft(levels[0].time);
		}
	});

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

	const nextLevel = () => {
		const levels = blindLevels();
		const newLevel = currentLevel() + 1;
		if (newLevel <= levels.length) {
			setCurrentLevel(newLevel);
			setSmallBlind(levels[newLevel - 1].sb);
			setBigBlind(levels[newLevel - 1].bb);
			setTimeLeft(levels[newLevel - 1].time);

			// Play notification sound (using Web Audio API for simple beep)
			const audioContext = new (
				window.AudioContext || window.webkitAudioContext
			)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = 800;
			oscillator.type = "sine";

			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + 0.5,
			);

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
							Level {currentLevel()} / {blindLevels().length}
						</div>
					</div>
				</div>

				{/* Control Buttons */}
				<div class="grid grid-cols-1 gap-3 mb-6">
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
								<svg
									class="w-6 h-6 mx-auto"
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
								<div class="text-xs mt-1">Pause</div>
							</>
						) : (
							<>
								<svg
									class="w-6 h-6 mx-auto"
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
								<div class="text-xs mt-1">Start</div>
							</>
						)}
					</button>
				</div>

				{/* Configuration */}
				<div class="bg-black/30 backdrop-blur-lg rounded-2xl p-4 border border-green-500/20 mb-6">
					<div class="text-center mb-4 text-sm text-green-200 uppercase">
						Tournament Settings
					</div>
					<div class="space-y-3">
						<div>
							<label class="text-xs text-green-300 block mb-1">
								Minimum First Round ($)
							</label>
							<input
								type="number"
								min="1"
								max="1000"
								value={minFirstRound()}
								onInput={(e) =>
									setMinFirstRound(parseInt(e.target.value) || 10)
								}
								class="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
							/>
						</div>
						<div>
							<label class="text-xs text-green-300 block mb-1">
								Number of Rounds
							</label>
							<input
								type="number"
								min="1"
								max="50"
								value={numberOfRounds()}
								onInput={(e) =>
									setNumberOfRounds(parseInt(e.target.value) || 12)
								}
								class="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
							/>
						</div>
						<div>
							<label class="text-xs text-green-300 block mb-1">
								Timer Per Round (minutes)
							</label>
							<input
								type="number"
								min="1"
								max="120"
								value={timerPerRound() / 60}
								onInput={(e) =>
									setTimerPerRound((parseInt(e.target.value) || 10) * 60)
								}
								class="w-full bg-black/50 border border-green-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
							/>
						</div>
					</div>
				</div>

				{/* Settings hint */}
				<div class="text-center mt-6 text-green-200/60 text-sm">
					<p>Configure your tournament settings above</p>
					<p class="text-xs mt-1">Auto-advances when timer reaches 0</p>
				</div>
			</div>
		</div>
	);
};

export default PokerTimer;
