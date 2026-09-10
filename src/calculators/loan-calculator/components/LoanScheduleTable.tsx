import React, { useState } from 'react';
import { MonthlyRepayment } from '../../../types/loan';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface LoanScheduleTableProps {
  schedule: MonthlyRepayment[];
}

export const LoanScheduleTable: React.FC<LoanScheduleTableProps> = ({ schedule }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // 1년(12개월) 단위 페이지네이션
  const totalPages = Math.ceil(schedule.length / pageSize);

  const paginatedSchedule = schedule.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // UTF-8 BOM CSV 다운로드
  const handleDownloadCSV = () => {
    const headers = ['회차', '연차', '구분', '납입원금(원)', '대출이자(원)', '월상환액(원)', '남은잔액(원)'];
    const rows = schedule.map((s) => [
      `${s.month}회차`,
      `${s.year}년차 ${s.monthInYear}월`,
      s.isEarlyRepaymentMonth
        ? '중도상환'
        : s.isGracePeriod
        ? '거치기간(이자만)'
        : '정상상환',
      s.principalPayment,
      s.interestPayment,
      s.totalPayment,
      s.remainingBalance,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `대출상환스케줄표_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 shadow-sm transition-colors space-y-4">
      {/* 헤더 및 다운로드 버튼 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 flex items-center gap-2">
            <span>월별 상환 스케줄 상세표</span>
            <Badge variant="outline" className="text-[10px] font-bold text-slate-500 border-slate-300 dark:border-slate-700">
              총 {schedule.length}회차
            </Badge>
          </h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            매월 원금 상환액과 이자 납입액, 줄어드는 대출 잔액 흐름
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
          className="h-8 text-xs font-semibold bg-white dark:bg-slate-900 border-[#e5e7eb] dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#112220] dark:text-slate-100"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          엑셀(CSV) 다운로드
        </Button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb] dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50 text-[#64748b] dark:text-slate-400 font-bold uppercase">
              <th className="py-2.5 px-3 whitespace-nowrap">회차</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right">납입 원금</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right">대출 이자</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right">월 상환액</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right">대출 잔액</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb] dark:divide-slate-800/60 font-medium">
            {paginatedSchedule.map((row) => (
              <tr
                key={row.month}
                className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                  row.isEarlyRepaymentMonth
                    ? 'bg-amber-50/40 dark:bg-amber-950/20'
                    : row.isGracePeriod
                    ? 'bg-slate-50/30 dark:bg-slate-900/20'
                    : ''
                }`}
              >
                <td className="py-2 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#112220] dark:text-slate-200">
                      {row.month}회
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({row.year}년차 {row.monthInYear}월)
                    </span>
                    {row.isEarlyRepaymentMonth && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                        중도상환
                      </span>
                    )}
                    {row.isGracePeriod && !row.isEarlyRepaymentMonth && (
                      <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        거치
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 px-3 text-right font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                  {row.principalPayment.toLocaleString('ko-KR')}원
                </td>
                <td className="py-2 px-3 text-right font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                  {row.interestPayment.toLocaleString('ko-KR')}원
                </td>
                <td className="py-2 px-3 text-right font-extrabold text-[#112220] dark:text-slate-100 whitespace-nowrap">
                  {row.totalPayment.toLocaleString('ko-KR')}원
                </td>
                <td className="py-2 px-3 text-right text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap">
                  {row.remainingBalance.toLocaleString('ko-KR')}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 (1년 단위) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-[#e5e7eb] dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {currentPage}년차 / 총 {totalPages}년차
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="h-7 w-7 p-0"
              aria-label="이전 연차 보기"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="px-2 font-bold text-slate-700 dark:text-slate-300">
              {currentPage}년차 ({((currentPage - 1) * pageSize) + 1}~{Math.min(currentPage * pageSize, schedule.length)}회)
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="h-7 w-7 p-0"
              aria-label="다음 연차 보기"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
