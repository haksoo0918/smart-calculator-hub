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
    <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-7 h-7" />
      </div>

      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 uppercase tracking-wider inline-block mb-2">
        {calculator.badge || '개발 예정'}
      </span>

      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
        {calculator.name}
      </h2>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {calculator.description}
      </p>

      <div className="bg-slate-50 rounded-xl p-4 text-left text-xs text-slate-600 space-y-2 mb-6 border border-slate-100">
        <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>준비 중인 주요 기능</span>
        </div>
        {calculator.id === 'unit' && (
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>아파트 평(坪) ↔ 제곱미터(㎡) 59㎡/84㎡ 원터치 환산</li>
            <li>길이, 무게, 부피, 온도 실시간 멀티 카드 동시 변환</li>
            <li>자주 쓰는 단위 변환 퀵 스왑(⇄) 기능</li>
          </ul>
        )}
        {calculator.id === 'exchange' && (
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>주요 통화(USD, JPY, EUR, CNY 등) 실시간 기준 환산</li>
            <li>은행별 환전 수수료 및 우대율(90%, 80%) 시뮬레이션</li>
            <li>사용자 맞춤 커스텀 환율 직접 입력 기능</li>
          </ul>
        )}
        {calculator.id === 'loan' && (
          <ul className="list-disc list-inside space-y-1 text-slate-500">
            <li>원리금균등 vs 원금균등 vs 만기일시 3대 상환방식 한눈에 비교</li>
            <li>대출 원금, 이율, 거치기간별 월 상환액 스케줄</li>
            <li>총 대출이자 및 중도상환 수수료 시뮬레이션</li>
          </ul>
        )}
      </div>

      <button
        type="button"
        onClick={onGoToCompound}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-xs transition-all"
      >
        <span>지금 이용 가능한 연복리 계산기 사용하기</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
