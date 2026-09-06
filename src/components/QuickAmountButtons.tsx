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
          className="px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-md transition-all border border-slate-200/60"
        >
          {item.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="px-2 py-1 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 active:scale-95 rounded-md transition-all border border-rose-200/60 ml-auto"
      >
        정정
      </button>
    </div>
  );
};
