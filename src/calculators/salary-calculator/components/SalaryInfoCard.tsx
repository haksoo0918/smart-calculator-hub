import React from 'react';
import { Info } from 'lucide-react';

export const SalaryInfoCard: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 text-xs text-[#64748b] dark:text-slate-300 shadow-2xs transition-colors">
      <div className="space-y-1.5 leading-relaxed">
        <p className="font-bold text-[#112220] dark:text-slate-100 text-xs pb-1.5 border-b border-[#e5e7eb] dark:border-slate-800 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#112220] dark:text-[#d1ff19] shrink-0" />
          <span>급여 실수령액 및 4대 보험 세무 상식</span>
        </p>
        <p>
          • <strong>2026년 4대 사회보험 요율</strong>: 국민연금 4.5%(월 최대 277,650원 한도), 건강보험 3.545%, 노인장기요양보험은 건보료의 12.95%, 고용보험은 0.9%(실업급여분)가 근로자 급여에서 원천징수됩니다.
        </p>
        <p>
          • <strong>간이세액표와 연말정산의 차이</strong>: 매달 공제되는 근로소득세는 국세청 간이세액표에 따른 표준적 추정치입니다. 실제 세액은 다음 해 초 연말정산(신용카드, 의료비, 교육비, 연금저축 등 소득·세액공제 증빙)을 거쳐 최종 환급받거나 추가 납부하게 됩니다.
        </p>
        <p>
          • <strong>식대 비과세 20만 원 한도 활용</strong>: 2023년부터 비과세 식대 한도가 월 10만 원에서 20만 원으로 상향되었습니다. 비과세 금액은 4대 보험료와 소득세 산정 기준에서 제외되므로 실수령액을 높이는 가장 대표적인 절세 항목입니다.
        </p>
        <p>
          • <strong>부양가족 및 자녀 세액공제</strong>: 주민등록상 생계를 같이하는 부양가족(연소득 100만 원 이하) 1인당 연 150만 원의 기본인적공제가 적용되며, 20세 이하 자녀가 있는 경우 자녀 세액공제가 추가 반영됩니다.
        </p>
        <p className="pt-1.5 border-t border-[#e5e7eb] dark:border-slate-800 text-[#94a3b8] dark:text-slate-500 text-[11px] leading-normal">
          ※ <strong>시뮬레이션 고지</strong>: 본 계산기는 2026년 최신 4대 보험 요율과 국세청 근로소득 간이세액표 누진공제 기준을 적용한 표준 시뮬레이션입니다. 기업별 급여 체계, 상여금 지급 시점, 추가 비과세 수당(차량유지비, 연구보조비 등) 및 지자체별 감면 규정에 따라 실제 통장 입금액과 미세한 차이가 있을 수 있습니다.
        </p>
      </div>
    </div>
  );
};
