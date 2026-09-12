import React, { useState } from 'react';
import { SalaryCalculationResult } from '../../../types/salary';
import { formatNumberWithWon } from '../../../utils/formatters';
import { SegmentedControl, SegmentedOption } from '../../../components/ui/segmented-control';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from '../../../components/ui/table';

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
    <div className="@container bg-white dark:bg-[#1e293b] p-5 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 shadow-sm transition-colors space-y-4">
      <div className="flex flex-col @lg:flex-row @lg:items-center justify-between gap-3 pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 tracking-tight whitespace-nowrap">
            공제 항목별 세부 명세표
          </h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5 break-keep">
            {isEmployee
              ? '월급에서 원천징수되는 4대 보험 및 세금 항목별 상세 금액입니다'
              : '회사(사업주)가 근로자를 위해 법적으로 지원 납부하는 4대 보험 내역입니다'}
          </p>
        </div>

        {/* 근로자 부담 vs 회사 지원 탭 */}
        <div className="w-full @lg:w-auto shrink-0">
          <SegmentedControl
            value={payerMode}
            options={PAYER_OPTIONS}
            onChange={(val) => setPayerMode(val)}
            variant="dark-solid"
            className="w-full @lg:w-64"
            itemClassName="py-1.5 text-xs whitespace-nowrap"
          />
        </div>
      </div>

      {/* 표준 명세 테이블 */}
      <Table className="min-w-[480px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">공제 항목</TableHead>
            <TableHead className="whitespace-nowrap">산출 기준 및 요율</TableHead>
            <TableHead className="text-right whitespace-nowrap">월 부담액</TableHead>
            <TableHead className="text-right whitespace-nowrap">연간 누적</TableHead>
            <TableHead className="text-right whitespace-nowrap">비중</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.deductionItems.map((item) => {
            const monthly = isEmployee
              ? item.employeeMonthlyAmount
              : item.employerMonthlyAmount;

            const isTaxItem =
              item.id === 'income_tax' || item.id === 'local_income_tax';

            return (
              <TableRow key={item.id}>
                <TableCell className="font-bold text-[#112220] dark:text-slate-100 whitespace-nowrap">
                  {item.name}
                </TableCell>
                <TableCell className="text-[#64748b] dark:text-slate-400">
                  {isTaxItem && !isEmployee
                    ? '해당 없음 (근로자 본인 납부)'
                    : item.description}
                </TableCell>
                <TableCell className="font-bold text-right text-[#112220] dark:text-slate-100 tabular-nums whitespace-nowrap">
                  {monthly > 0 ? formatNumberWithWon(monthly) : '-'}
                </TableCell>
                <TableCell className="text-right text-[#64748b] dark:text-slate-400 tabular-nums whitespace-nowrap">
                  {monthly > 0 ? formatNumberWithWon(monthly * 12) : '-'}
                </TableCell>
                <TableCell className="text-right text-[#64748b] dark:text-slate-400 tabular-nums whitespace-nowrap">
                  {isEmployee && monthly > 0
                    ? `${item.percentageOfGross}%`
                    : !isEmployee && monthly > 0 && result.grossMonthlySalary > 0
                    ? `${(
                        (monthly / result.grossMonthlySalary) *
                        100
                      ).toFixed(2)}%`
                    : '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="font-bold text-[#112220] dark:text-slate-100 whitespace-nowrap">총 합계</TableCell>
            <TableCell className="text-[#64748b] dark:text-slate-400 font-normal">
              {isEmployee ? '4대 보험 + 세금 합산' : '4대 보험 회사 지원 합산'}
            </TableCell>
            <TableCell className="text-right text-[#112220] dark:text-slate-100 tabular-nums text-sm font-bold whitespace-nowrap">
              {formatNumberWithWon(totalMonthly)}
            </TableCell>
            <TableCell className="text-right text-[#64748b] dark:text-slate-400 tabular-nums text-sm font-bold whitespace-nowrap">
              {formatNumberWithWon(totalAnnual)}
            </TableCell>
            <TableCell className="text-right text-[#112220] dark:text-slate-100 tabular-nums font-bold whitespace-nowrap">
              {result.grossMonthlySalary > 0
                ? `${((totalMonthly / result.grossMonthlySalary) * 100).toFixed(
                    1
                  )}%`
                : '0%'}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
