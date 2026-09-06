import React, { useState } from 'react';
import { CalculationResult } from '../types/calculator';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { ChevronDown, ChevronUp, Download, Table as TableIcon } from 'lucide-react';

interface DataTableProps {
  result: CalculationResult;
  scenarioName?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  result,
  scenarioName = '시나리오',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // CSV 다운로드 함수
  const downloadCSV = () => {
    const headers = [
      '연차',
      '누적 납입원금(원)',
      '당해연도 세전이자(원)',
      '누적 세전이자(원)',
      '이자소득세(원)',
      '누적 세후이자(원)',
      '세후 총자산(원)',
      '수익률(%)',
    ];

    const rows = result.breakdown.map((row) => [
      `${row.year}년차`,
      row.totalPrincipal,
      row.grossInterestYear,
      row.grossInterestTotal,
      row.taxAmount,
      row.netInterestTotal,
      row.futureValuePostTax,
      row.returnRate.toFixed(2),
    ]);

    const csvContent =
      '\uFEFF' + // UTF-8 BOM for Excel 한국어 깨짐 방지
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${scenarioName}_연도별_복리계산표.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* 아코디언 헤더 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3.5 sm:px-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            연도별 상세 자산 흐름표
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            ({result.breakdown.length}개년 데이터)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                downloadCSV();
              }}
              className="flex items-center gap-1 text-xs text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-md font-semibold border border-teal-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">CSV 다운로드</span>
            </button>
          )}
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 테이블 본체 (펼쳐졌을 때만 표시) */}
      {isOpen && (
        <div className="border-t border-slate-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-3 text-center">연차</th>
                <th className="py-2.5 px-3 text-right">누적 원금</th>
                <th className="py-2.5 px-3 text-right">당해연도 이자</th>
                <th className="py-2.5 px-3 text-right">누적 순이자</th>
                <th className="py-2.5 px-3 text-right">세후 총 평가액</th>
                <th className="py-2.5 px-3 text-right">수익률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
              {result.breakdown.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-center text-slate-900 bg-slate-50/30">
                    {row.year}년
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-600">
                    {formatCurrency(row.totalPrincipal)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500">
                    +{formatCurrency(row.grossInterestYear)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">
                    +{formatCurrency(row.netInterestTotal)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(row.futureValuePostTax)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-teal-700">
                    +{formatPercent(row.returnRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
