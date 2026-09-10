import React from 'react';
import { LoanComparisonSummary, RepaymentMethod } from '../../../types/loan';
import { formatKoreanLoanAmount } from '../../../utils/loanCalculator';
import { Button } from '../../../components/ui/button';

interface LoanComparisonCardProps {
  comparison: LoanComparisonSummary;
  activeMethod: RepaymentMethod;
  onSelectMethod: (method: RepaymentMethod) => void;
}

export const LoanComparisonCard: React.FC<LoanComparisonCardProps> = ({
  comparison,
  activeMethod,
  onSelectMethod,
}) => {
  const { equalPayment, equalPrincipal, bullet, interestSavingsVsEqualPayment } = comparison;

  const methods = [
    {
      id: 'equal_payment' as RepaymentMethod,
      name: '원리금균등',
      badge: '가장 대중적',
      desc: '매월 상환액이 일정하여 자금 계획 수립에 용이',
      result: equalPayment,
    },
    {
      id: 'equal_principal' as RepaymentMethod,
      name: '원금균등',
      badge: '최저 총이자',
      desc: '매달 이자가 줄어들어 3가지 중 총이자 부담이 가장 적음',
      result: equalPrincipal,
    },
    {
      id: 'bullet' as RepaymentMethod,
      name: '만기일시',
      badge: '초기부담 최소',
      desc: '만기 전까지 이자만 납입하므로 초기 현금흐름 유지에 유리',
      result: bullet,
    },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-[24px] bg-slate-50 dark:bg-slate-900/80 border border-[#e5e7eb] dark:border-slate-800 transition-colors space-y-4">
      {/* 상단 비교 배너 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold text-[#112220] dark:text-slate-100 whitespace-nowrap">
              3대 상환방식 동시 비교
            </span>
            {interestSavingsVsEqualPayment > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15171a] dark:bg-[#d1ff19] text-[#d1ff19] dark:text-[#112220] whitespace-nowrap">
                원금균등 선택 시 약 {formatKoreanLoanAmount(interestSavingsVsEqualPayment)} 절약!
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 mt-0.5 leading-relaxed">
            방식을 클릭하면 해당 상환 방식으로 즉시 전환됩니다
          </p>
        </div>
      </div>

      {/* 3개 카드 그리드 (우측 패널 너비에 맞춰 1열 기본, md/xl 이상 가변 정렬 & 텍스트 쪼개짐 원천 방지) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {methods.map((item) => {
          const isSelected = activeMethod === item.id;
          const isLowest = item.id === 'equal_principal';

          return (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              onClick={() => onSelectMethod(item.id)}
              className={`w-full h-auto p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between font-normal whitespace-normal break-words overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-[#1e293b] border-[#15171a] dark:border-[#d1ff19] shadow-md ring-2 ring-[#15171a]/10 dark:ring-[#d1ff19]/20 hover:bg-white dark:hover:bg-[#1e293b]'
                  : 'bg-white/80 dark:bg-slate-900/60 border-[#e5e7eb] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white/90 dark:hover:bg-slate-900'
              }`}
            >
              <div className="w-full">
                {/* 1행: 상환 방식 명칭 및 뱃지 */}
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-[#112220] dark:text-slate-100 whitespace-nowrap">
                    {item.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                      isLowest
                        ? 'bg-[#d1ff19] text-[#112220]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* 2행: 핵심 요약 설명 문구 (3개 카드 동일한 2줄 높이 유지, 한글 단어 끊김 방지) */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3 whitespace-normal break-keep line-clamp-2 min-h-[32px]">
                  {item.desc}
                </p>
              </div>

              {/* 하단 금액 정보 (시맨틱 dl dt dd 1줄 구성) */}
              <dl className="space-y-1.5 pt-2.5 border-t border-[#e5e7eb] dark:border-slate-800/80 w-full text-xs">
                <div className="flex items-center justify-between gap-1">
                  <dt className="text-slate-500 dark:text-slate-400 text-[11px] shrink-0 whitespace-nowrap">총 대출이자</dt>
                  <dd className={`font-black text-xs whitespace-nowrap ${isLowest ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#112220] dark:text-slate-100'}`}>
                    {item.result.totalInterest.toLocaleString('ko-KR')}원
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <dt className="text-slate-500 dark:text-slate-400 text-[11px] shrink-0 whitespace-nowrap">첫 달 상환액</dt>
                  <dd className="font-bold text-xs text-[#112220] dark:text-slate-200 whitespace-nowrap">
                    {item.result.firstMonthPayment.toLocaleString('ko-KR')}원
                  </dd>
                </div>
              </dl>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
