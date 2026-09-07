import React from 'react';
import { CurrencyCode, CurrencyItem } from '../../../types/exchange';
import { CURRENCIES_DATA } from '../../../utils/exchangeCalculator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  id?: string;
  label?: string;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onChange,
  id,
  label,
}) => {
  const currencies = Object.values(CURRENCIES_DATA) as CurrencyItem[];

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-[#64748b] pt-[0.5px]">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={(val) => onChange(val as CurrencyCode)}>
        <SelectTrigger
          id={id}
          className="w-full h-11 bg-white border border-[#e5e7eb] rounded-xl px-3 text-sm font-semibold text-[#112220] hover:border-[#15171a] focus:ring-1 focus:ring-[#15171a] transition-all"
        >
          <SelectValue placeholder="통화 선택" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {currencies.map((curr) => (
            <SelectItem key={curr.code} value={curr.code} className="py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 font-mono font-bold text-xs text-[#112220] bg-slate-100 rounded px-1 text-center">
                  {curr.symbol}
                </span>
                <span className="font-semibold text-xs text-[#112220]">
                  {curr.code}
                </span>
                <span className="text-xs text-[#64748b]">
                  {curr.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
