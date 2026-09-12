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
    <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">
            공제 항목별 세부 명세표
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isEmployee
              ? '월급에서 원천징수되는 4대 보험 및 세금 항목별 상세 금액입니다.'
              : '회사(사업주)가 근로자를 위해 법적으로 지원 납부하는 4대 보험 내역입니다.'}
          </p>
        </div>

        {/* 근로자 부담 vs 회사 지원 탭 */}
        <div className="w-full sm:w-auto">
          <SegmentedControl
            value={payerMode}
            options={PAYER_OPTIONS}
            onChange={(val) => setPayerMode(val)}
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* 명세 테이블 */}
      <div className="overflow-x-auto -mx-5 md:mx-0">
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground bg-muted/30">
              <th className="py-2.5 px-4 font-semibold">공제 항목</th>
              <th className="py-2.5 px-4 font-semibold">산출 기준 및 요율</th>
              <th className="py-2.5 px-4 font-semibold text-right">월 부담액</th>
              <th className="py-2.5 px-4 font-semibold text-right">연간 누적</th>
              <th className="py-2.5 px-4 font-semibold text-right">비중</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {result.deductionItems.map((item) => {
              const monthly = isEmployee
                ? item.employeeMonthlyAmount
                : item.employerMonthlyAmount;

              // 회사 모드에서 세금은 0원이므로 표기 여부 결정
              const isTaxItem =
                item.id === 'income_tax' || item.id === 'local_income_tax';

              return (
                <tr
                  key={item.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="py-2.5 px-4 font-medium text-foreground">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-4 text-muted-foreground">
                    {isTaxItem && !isEmployee
                      ? '해당 없음 (근로자 본인 납부)'
                      : item.description}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-right text-foreground tabular-nums">
                    {monthly > 0 ? formatNumberWithWon(monthly) : '-'}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-muted-foreground tabular-nums">
                    {monthly > 0 ? formatNumberWithWon(monthly * 12) : '-'}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-right text-muted-foreground tabular-nums">
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
            <tr className="border-t-2 border-border font-bold bg-muted/40">
              <td className="py-3 px-4 text-foreground">총 합계</td>
              <td className="py-3 px-4 text-muted-foreground">
                {isEmployee ? '4대 보험 + 세금 합산' : '4대 보험 회사 지원 합산'}
              </td>
              <td className="py-3 px-4 font-mono text-right text-foreground tabular-nums text-sm">
                {formatNumberWithWon(totalMonthly)}
              </td>
              <td className="py-3 px-4 font-mono text-right text-muted-foreground tabular-nums text-sm">
                {formatNumberWithWon(totalAnnual)}
              </td>
              <td className="py-3 px-4 font-mono text-right text-foreground tabular-nums">
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
