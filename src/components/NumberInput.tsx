interface NumberInputProps<T extends number, D extends T> {
  value: number;
  onChange(value: number): void;
  values: T[];
  default: D;
  label: string;
}

function NumberInput<T extends number, D extends T>(
  props: NumberInputProps<T, D>,
) {
  const steps: number[] = props.values;
  const currentIndex = steps.indexOf(props.value);

  const handleIncrement = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < props.values.length) {
      const newValue = props.values[nextIndex];
      if (newValue !== undefined) {
        props.onChange(newValue);
      }
    }
  };

  const handleDecrement = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      const newValue = props.values[prevIndex];
      if (newValue !== undefined) {
        props.onChange(newValue);
      }
    }
  };

  return (
    <div>
      <label class="block text-sm font-semibold text-yellow-400 mb-2">
        {props.label}
      </label>

      <div class="flex items-center bg-gray-900 border-2 border-gray-700 rounded-xl overflow-hidden focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 transition-all">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={currentIndex <= 0}
          class="px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>

        <span class="flex-1 bg-transparent text-white font-mono text-lg text-center py-3 pl-3 pr-3">
          {props.value || props.default}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={currentIndex >= props.values.length - 1}
          class="px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NumberInput;
