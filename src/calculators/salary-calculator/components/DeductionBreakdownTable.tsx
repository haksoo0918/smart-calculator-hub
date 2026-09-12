import React, { useState } from 'react';
import { SalaryCalculationResult } from '../../../types/salary';
import { formatNumberWithWon } from '../../../utils/formatters';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';

interface DeductionBreakdownTableProps {
  result: SalaryCalculationResult;
}

type PayerMode = 'employee' | 'employer';

const PAYER_OPTIONS: SegmentedOption<PayerMode>[] = [
  { id: 'employee', label: '근로자 본인 부담' },
  { id: 'employer', label: '회사(사업주) 지원금' },
];

export const DeductionBreakdownTable: React.FC<DeductionBreakdownTableProps> = ({
  result,
}) => {
  const [payerMode, setPayerMode] = useState<PayerMode>('employee');

  const isEmployee = payerMode === 'employee';

  const totalMonthly = isEmployee
    ? result.totalMonthlyDeduction
    : result.totalEmployerInsurances;

  const totalAnnual = totalMonthly * 12;

  return (
    <div className="bg-white dark:bg-[#1e293b] p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 shadow-sm transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 tracking-tight">
            공제 항목별 세부 명세표
          </h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            {isEmployee
              ? '월급에서 원천징수되는 4대 보험 및 세금 항목별 상세 금액입니다'
              : '회사(사업주)가 근로자를 위해 법적으로 지원 납부하는 4대 보험 내역입니다'}
          </p>
        </div>

        {/* 근로자 부담 vs 회사 지원 탭 */}
        <div className="w-full sm:w-auto">
          <SegmentedControl
            value={payerMode}
            options={PAYER_OPTIONS}
            onChange={(val) => setPayerMode(val)}
            variant="dark-solid"
            className="w-full sm:w-64"
            itemClassName="py-1.5 text-xs"
          />
        </div>
      </div>

      {/* 명세 테이블 */}
      <div className="overflow-x-auto -mx-5 md:mx-0">
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] dark:border-slate-800 text-[#64748b] dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50">
              <th className="py-2.5 px-4 font-semibold">공제 항목</th>
              <th className="py-2.5 px-4 font-semibold">산출 기준 및 요율</th>
              <th className="py-2.5 px-4 font-semibold text-right">월 부담액</th>
              <th className="py-2.5 px-4 font-semibold text-right">연간 누적</th>
              <th className="py-2.5 px-4 font-semibold text-right">비중</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-slate-800">
            {result.deductionItems.map((item) => {
              const monthly = isEmployee
                ? item.employeeMonthlyAmount
                : item.employerMonthlyAmount;

              const isTaxItem =
                item.id === 'income_tax' || item.id === 'local_income_tax';

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-4 font-bold text-[#112220] dark:text-slate-100">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-4 text-[#64748b] dark:text-slate-400">
                    {isTaxItem && !isEmployee
                      ? '해당 없음 (근로자 본인 납부)'
                      : item.description}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-right text-[#112220] dark:text-slate-100 tabular-nums">
                    {monthly > 0 ? formatNumberWithWon(monthly) : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[#64748b] dark:text-slate-400 tabular-nums">
                    {monthly > 0 ? formatNumberWithWon(monthly * 12) : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right text-[#64748b] dark:text-slate-400 tabular-nums">
                    {isEmployee && monthly > 0
                      ? `${item.percentageOfGross}%`
                      : !isEmployee && monthly > 0 && result.grossMonthlySalary > 0
                      ? `${(
                          (monthly / result.grossMonthlySalary) *
                          100
                        ).toFixed(2)}%`
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[#e5e7eb] dark:border-slate-700 font-bold bg-slate-50 dark:bg-slate-900/60">
              <td className="py-3 px-4 text-[#112220] dark:text-slate-100">총 합계</td>
              <td className="py-3 px-4 text-[#64748b] dark:text-slate-400">
                {isEmployee ? '4대 보험 + 세금 합산' : '4대 보험 회사 지원 합산'}
              </td>
              <td className="py-3 px-4 text-right text-[#112220] dark:text-slate-100 tabular-nums text-sm">
                {formatNumberWithWon(totalMonthly)}
              </td>
              <td className="py-3 px-4 text-right text-[#64748b] dark:text-slate-400 tabular-nums text-sm">
                {formatNumberWithWon(totalAnnual)}
              </td>
              <td className="py-3 px-4 text-right text-[#112220] dark:text-slate-100 tabular-nums">
                {result.grossMonthlySalary > 0
                  ? `${((totalMonthly / result.grossMonthlySalary) * 100).toFixed(
                      1
                    )}%`
                  : '0%'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
