import React from 'react';
import { Info } from 'lucide-react';

export const CompoundInfoCard: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 text-xs text-[#64748b] dark:text-slate-300 shadow-2xs transition-colors">
      <div className="space-y-1.5 leading-relaxed">
        <p className="font-bold text-[#112220] dark:text-slate-100 text-xs pb-1.5 border-b border-[#e5e7eb] dark:border-slate-800 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#112220] dark:text-[#d1ff19] shrink-0" />
          <span>복리 투자 상식 및 유의사항 안내</span>
        </p>
        <p>
          • <strong>72의 법칙</strong>: 원금이 2배가 되는 시간 ≈ <strong>72 ÷ 연수익률(%)</strong> (예: 연 7% 복리 시 약 10년)
        </p>
        <p>
          • <strong>복리의 마법</strong>: 발생한 이자에도 다시 이자가 붙어 투자 기간이 길수록 자산이 기하급수적으로 증가합니다.
        </p>
        <p>
          • <strong>절세 계좌 활용</strong>: 일반과세(15.4%) 대신 ISA(9.9% 분리과세) 등 절세 계좌를 활용하면 세금 이연으로 복리 효과가 극대화됩니다.
        </p>
        <p>
          • <strong>금융소득 종합과세</strong>: 연간 이자·배당소득 합계가 <strong>2,000만 원</strong>을 초과하면 종합과세 합산 대상이 됩니다.
        </p>
        <p className="pt-1.5 border-t border-[#e5e7eb] dark:border-slate-800 text-[#94a3b8] dark:text-slate-500 text-[11px] leading-normal">
          ※ <strong>시뮬레이션 유의사항</strong>: 본 결과는 고정 수익률과 복리 주기를 가정한 단순 시뮬레이션 모델이며, 실제 투자 시 원금 손실 위험 및 물가상승률(인플레이션)에 따른 실질 가치 변동이 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
};
