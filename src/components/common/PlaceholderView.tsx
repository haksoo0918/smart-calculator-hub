import React from 'react';
import { CalculatorItem } from '../../types/navigation';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

interface PlaceholderViewProps {
  calculator: CalculatorItem;
  onGoToCompound: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  calculator,
  onGoToCompound,
}) => {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] p-6 sm:p-10 border border-[#e5e7eb] dark:border-slate-800 text-center max-w-xl mx-auto transition-colors">
      <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-800 border border-[#e5e7eb] dark:border-slate-700 text-[#112220] dark:text-slate-100 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-6 h-6 text-[#112220] dark:text-[#d1ff19]" />
      </div>

      <div className="inline-block mb-3">
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#d1ff19] text-[#112220] uppercase tracking-widest">
          {calculator.badge || 'COMING SOON'}
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-[#112220] dark:text-slate-100 mb-2 tracking-tight">
        {calculator.name}
      </h2>

      <p className="text-sm text-[#64748b] dark:text-slate-400 mb-6 leading-relaxed">
        {calculator.description}
      </p>

      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-4 text-left text-xs text-[#334155] dark:text-slate-300 space-y-2 mb-6 border border-[#e5e7eb] dark:border-slate-800">
        <div className="font-bold text-[#112220] dark:text-slate-100 flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#15171a] dark:text-[#d1ff19]" />
          <span>준비 중인 주요 기능</span>
        </div>
        {calculator.id === 'unit' && (
          <ul className="list-disc list-inside space-y-1 text-[#64748b] dark:text-slate-400">
            <li>아파트 평(坪) ↔ 제곱미터(㎡) 59㎡/84㎡ 원터치 환산</li>
            <li>길이, 무게, 부피, 온도 실시간 멀티 카드 동시 변환</li>
            <li>자주 쓰는 단위 변환 퀵 스왑(⇄) 기능</li>
          </ul>
        )}
        {calculator.id === 'exchange' && (
          <ul className="list-disc list-inside space-y-1 text-[#64748b] dark:text-slate-400">
            <li>주요 통화(USD, JPY, EUR, CNY 등) 실시간 기준 환산</li>
            <li>은행별 환전 수수료 및 우대율(90%, 80%) 시뮬레이션</li>
            <li>사용자 맞춤 커스텀 환율 직접 입력 기능</li>
          </ul>
        )}
        {calculator.id === 'loan' && (
          <ul className="list-disc list-inside space-y-1 text-[#64748b] dark:text-slate-400">
            <li>원리금균등 vs 원금균등 vs 만기일시 3대 상환방식 한눈에 비교</li>
            <li>대출 원금, 이율, 거치기간별 월 상환액 스케줄</li>
            <li>총 대출이자 및 중도상환 수수료 시뮬레이션</li>
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onGoToCompound}
        className="inline-flex items-center justify-center gap-2 h-[39px] px-5 bg-[#15171a] hover:bg-[#1f2937] dark:bg-white dark:hover:bg-slate-100 dark:text-[#112220] active:scale-[0.98] text-white text-sm font-semibold rounded-md transition-colors"
      >
        <span>지금 이용 가능한 연복리 계산기 사용하기</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
