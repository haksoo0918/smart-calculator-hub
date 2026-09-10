import React from 'react';
import { RepaymentCalculationResult } from '../../../types/loan';
import { formatKoreanLoanAmount } from '../../../utils/loanCalculator';
import { TrendingDown, Sparkles } from 'lucide-react';

interface LoanSummaryCardsProps {
  result: RepaymentCalculationResult;
  loanAmount: number;
}

export const LoanSummaryCards: React.FC<LoanSummaryCardsProps> = ({ result, loanAmount }) => {
  const interestRatio = loanAmount > 0 ? (result.totalInterest / loanAmount) * 100 : 0;
  const early = result.earlyRepayment;

  return (
    <div className="space-y-3">
      {/* 중도상환 순 혜택 하이라이트 배너 (활성화 시) */}
      {early && (
        <div className="p-4 rounded-2xl bg-[#15171a] dark:bg-[#1e293b] border border-[#15171a] dark:border-slate-800 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-page-fade">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#d1ff19] text-[#112220] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <span>조기 상환 순 이익 (절감이자 - 수수료)</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-[#d1ff19] tracking-tight">
                +{early.netBenefit.toLocaleString('ko-KR')}원
                <span className="text-xs font-normal text-slate-300 ml-1.5">
                  ({formatKoreanLoanAmount(early.netBenefit)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300 border-t sm:border-t-0 sm:border-l border-slate-700 sm:pl-4 pt-2 sm:pt-0 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <span className="text-slate-400 block text-[11px]">아낀 총이자</span>
              <span className="font-bold text-white">
                {early.savedInterest.toLocaleString('ko-KR')}원
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">납부 수수료</span>
              <span className="font-bold text-rose-400">
                {early.feeAmount === 0 ? '0원 (면제)' : `${early.feeAmount.toLocaleString('ko-KR')}원`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3대 핵심 요약 카드 그리드 (부모 폭에 맞춰 1열/2열/3열 유동 적응) */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
        {/* 1. 총 상환금액 */}
        <div className="@container p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 shadow-2xs min-w-0">
          <div className="flex flex-col @xs:flex-row @xs:items-center @xs:justify-between gap-1 @xs:gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider block">
                총 상환금액 (원금 + 이자)
              </span>
              <p className="text-[11px] font-bold text-[#64748b] dark:text-slate-400 mt-0.5">
                {formatKoreanLoanAmount(result.totalRepayment)}
              </p>
            </div>
            <div className="text-base sm:text-lg xl:text-xl font-black text-[#112220] dark:text-slate-100 tracking-tight flex items-baseline gap-0.5 whitespace-nowrap @xs:text-right">
              <span>{result.totalRepayment.toLocaleString('ko-KR')}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">원</span>
            </div>
          </div>
        </div>

        {/* 2. 총 대출이자 */}
        <div className="@container p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 shadow-2xs min-w-0">
          <div className="flex flex-col @xs:flex-row @xs:items-center @xs:justify-between gap-1 @xs:gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider">
                  총 대출이자
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 shrink-0">
                  원금의 {interestRatio.toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] font-bold text-rose-500/80 dark:text-rose-400/80 mt-0.5">
                {formatKoreanLoanAmount(result.totalInterest)}
              </p>
            </div>
            <div className="text-base sm:text-lg xl:text-xl font-black text-rose-600 dark:text-rose-400 tracking-tight flex items-baseline gap-0.5 whitespace-nowrap @xs:text-right">
              <span>{result.totalInterest.toLocaleString('ko-KR')}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">원</span>
            </div>
          </div>
        </div>

        {/* 3. 월 상환액 (1회차 & 평균) */}
        <div className="@container p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 shadow-2xs min-w-0">
          <div className="flex flex-col @xs:flex-row @xs:items-center @xs:justify-between gap-1 @xs:gap-3">
            <div>
              <span className="text-[11px] font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider block">
                첫 달 상환액 (1회차)
              </span>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                <span>월평균 {result.monthlyAveragePayment.toLocaleString('ko-KR')}원</span>
                {result.firstMonthPayment !== result.lastMonthPayment && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    막달 {result.lastMonthPayment.toLocaleString('ko-KR')}원
                  </span>
                )}
              </div>
            </div>
            <div className="text-base sm:text-lg xl:text-xl font-black text-[#112220] dark:text-slate-100 tracking-tight flex items-baseline gap-0.5 whitespace-nowrap @xs:text-right">
              <span>{result.firstMonthPayment.toLocaleString('ko-KR')}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
