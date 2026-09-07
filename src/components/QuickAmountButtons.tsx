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
          className="px-2 py-1 text-xs font-medium text-[#112220] bg-slate-50 hover:bg-slate-100 active:scale-[0.98] rounded-md transition-colors border border-[#e5e7eb]"
        >
          {item.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="px-2 py-1 text-xs font-medium text-rose-600 bg-rose-50/50 hover:bg-rose-100/50 active:scale-[0.98] rounded-md transition-colors border border-rose-200/60 ml-auto"
      >
        정정
      </button>
    </div>
  );
};
