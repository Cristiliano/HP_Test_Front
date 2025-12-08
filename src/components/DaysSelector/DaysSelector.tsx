interface DaysSelectorProps {
  value: number;
  onChange: (days: number) => void;
  min?: number;
  max?: number;
}

export function DaysSelector({
  value,
  onChange,
  min = 1,
  max = 7,
}: DaysSelectorProps) {
  const days = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Dias de previsão
      </label>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => onChange(day)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                value === day
                  ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'
              }
            `}
          >
            {day} {day === 1 ? 'dia' : 'dias'}
          </button>
        ))}
      </div>
    </div>
  );
}
