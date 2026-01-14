interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  label: string;
}

const NumberInput = (props: NumberInputProps) => {
  const handleIncrement = () => {
    const newValue = Math.min(props.value + (props.step || 1), props.max);
    props.onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(props.value - (props.step || 1), props.min);
    props.onChange(newValue);
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
          disabled={props.disabled || props.value <= props.min}
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

        <span
          class="flex-1 bg-transparent text-white font-mono text-lg text-center py-3 pl-3 pr-3"
        >
          {props.value.toString() || props.placeholder || "0"}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={props.disabled || props.value >= props.max}
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
};

export default NumberInput;
