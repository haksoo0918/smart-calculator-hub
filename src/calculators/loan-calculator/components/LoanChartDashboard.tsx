import React, { useState } from 'react';
import { MonthlyRepayment } from '../../../types/loan';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatKoreanLoanAmount } from '../../../utils/loanCalculator';
import { Button } from '../../../components/ui/button';

interface LoanChartDashboardProps {
  schedule: MonthlyRepayment[];
}

export const LoanChartDashboard: React.FC<LoanChartDashboardProps> = ({ schedule }) => {
  const [chartType, setChartType] = useState<'balance' | 'cumulative'>('balance');

  // 연 단위로 데이터 집계 (데이터 포인트가 480개 등 너무 많을 때 최적화)
  const totalYears = Math.ceil(schedule.length / 12);
  const chartData = [];

  let cumPrincipal = 0;
  let cumInterest = 0;

  for (let y = 1; y <= totalYears; y++) {
    const endMonthIdx = Math.min(y * 12 - 1, schedule.length - 1);
    const item = schedule[endMonthIdx];

    // 연간 누적 합산
    const yearMonths = schedule.slice((y - 1) * 12, endMonthIdx + 1);
    for (const m of yearMonths) {
      cumPrincipal += m.principalPayment;
      cumInterest += m.interestPayment;
    }

    chartData.push({
      name: `${y}년차`,
      year: y,
      remainingBalance: item.remainingBalance,
      cumulativePrincipal: cumPrincipal,
      cumulativeInterest: cumInterest,
      totalPaid: cumPrincipal + cumInterest,
    });
  }

  return (
    <div className="bg-white dark:bg-[#1e293b] p-4 sm:p-6 rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 shadow-sm transition-colors space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100">
            상환 추이 시각화 차트
          </h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400">
            연차별 대출 잔액 감소 곡선 및 누적 납입 비율
          </p>
        </div>

        {/* 차트 뷰 전환 버튼 */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-[#e5e7eb] dark:border-slate-800 self-start sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setChartType('balance')}
            className={`h-7 px-2.5 text-xs font-semibold rounded-md transition-all ${
              chartType === 'balance'
                ? 'bg-white dark:bg-slate-800 text-[#112220] dark:text-white shadow-xs hover:bg-white dark:hover:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            대출 잔액 감소
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setChartType('cumulative')}
            className={`h-7 px-2.5 text-xs font-semibold rounded-md transition-all ${
              chartType === 'cumulative'
                ? 'bg-white dark:bg-slate-800 text-[#112220] dark:text-white shadow-xs hover:bg-white dark:hover:bg-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            누적 납입(원금/이자)
          </Button>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'balance' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15171a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#15171a" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) =>
                  val >= 100_000_000
                    ? `${(val / 100_000_000).toFixed(0)}억`
                    : val >= 10_000
                    ? `${(val / 10_000).toFixed(0)}만`
                    : val
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#15171a] text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                        <div className="font-bold text-[#d1ff19]">{data.name}말 기준</div>
                        <div>남은 잔액: {formatKoreanLoanAmount(data.remainingBalance)}</div>
                        <div className="text-slate-400">
                          ({data.remainingBalance.toLocaleString('ko-KR')}원)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="remainingBalance"
                name="대출 잔액"
                stroke="#15171a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#balanceGradient)"
                className="dark:stroke-[#d1ff19]"
              />
            </AreaChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) =>
                  val >= 100_000_000
                    ? `${(val / 100_000_000).toFixed(0)}억`
                    : val >= 10_000
                    ? `${(val / 10_000).toFixed(0)}만`
                    : val
                }
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#15171a] text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs space-y-1">
                        <div className="font-bold text-[#d1ff19]">{data.name} 누적 납입액</div>
                        <div className="text-sky-400">
                          납입 원금: {formatKoreanLoanAmount(data.cumulativePrincipal)}
                        </div>
                        <div className="text-rose-400">
                          납입 이자: {formatKoreanLoanAmount(data.cumulativeInterest)}
                        </div>
                        <div className="text-slate-300 font-bold border-t border-slate-700 pt-1 mt-1">
                          총 합계: {formatKoreanLoanAmount(data.totalPaid)}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulativePrincipal"
                stackId="1"
                name="납입 원금"
                stroke="#0284c7"
                fill="url(#principalGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="cumulativeInterest"
                stackId="1"
                name="누적 이자"
                stroke="#e11d48"
                fill="url(#interestGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
