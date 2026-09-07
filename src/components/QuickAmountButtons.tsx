import React from 'react';

interface QuickAmountButtonsProps {
  onAdd: (amount: number) => void;
  onClear: () => void;
}

const AMOUNTS = [
  { label: '+10만', value: 100_000 },
  { label: '+50만', value: 500_000 },
  { label: '+100만', value: 1_000_000 },
  { label: '+1,000만', value: 10_000_000 },
];

export const QuickAmountButtons: React.FC<QuickAmountButtonsProps> = ({ onAdd, onClear }) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
      {AMOUNTS.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onAdd(item.value)}
          className="px-2 py-1 text-xs font-medium text-[#112220] dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-[0.98] rounded-md transition-colors border border-[#e5e7eb] dark:border-slate-700"
        >
          {item.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="px-2 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/50 dark:hover:bg-rose-900/40 active:scale-[0.98] rounded-md transition-colors border border-rose-200/60 dark:border-rose-900/50 ml-auto"
      >
        정정
      </button>
    </div>
  );
};
