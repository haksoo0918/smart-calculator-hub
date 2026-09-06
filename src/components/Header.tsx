import React from 'react';
import { TrendingUp, GitCompare, RotateCcw } from 'lucide-react';

interface HeaderProps {
  isComparisonMode: boolean;
  onToggleComparison: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isComparisonMode,
  onToggleComparison,
  onReset,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              연복리 계산기
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden xs:block">
              자산 성장 시뮬레이션 & A/B 대시보드
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* A/B 비교 토글 버튼 */}
          <button
            type="button"
            onClick={onToggleComparison}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border transition-all ${
              isComparisonMode
                ? 'bg-teal-50 text-teal-700 border-teal-300 ring-2 ring-teal-100'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>비교 모드</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isComparisonMode
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isComparisonMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* 초기화 버튼 */}
          <button
            type="button"
            onClick={onReset}
            title="기본값으로 초기화"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
