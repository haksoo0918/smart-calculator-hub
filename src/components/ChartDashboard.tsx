import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CalculationResult } from '../types/calculator';
import { formatCurrency, formatKoreanUnit } from '../utils/formatters';

interface ChartDashboardProps {
  resultA: CalculationResult;
  resultB?: CalculationResult;
  isComparisonMode: boolean;
  nameA?: string;
  nameB?: string;
}

export const ChartDashboard: React.FC<ChartDashboardProps> = ({
  resultA,
  resultB,
  isComparisonMode,
  nameA = '시나리오 A',
  nameB = '시나리오 B',
}) => {
  // 차트 데이터 병합 (연도 기준)
  const chartData = resultA.breakdown.map((itemA, index) => {
    const itemB = resultB?.breakdown[index];
    return {
      year: `${itemA.year}년`,
      yearNum: itemA.year,
      // 시나리오 A
      principalA: itemA.totalPrincipal,
      netInterestA: itemA.netInterestTotal,
      totalPostTaxA: itemA.futureValuePostTax,
      // 시나리오 B (비교 모드)
      principalB: itemB ? itemB.totalPrincipal : 0,
      netInterestB: itemB ? itemB.netInterestTotal : 0,
      totalPostTaxB: itemB ? itemB.futureValuePostTax : 0,
    };
  });

  // Y축 레이블 포맷터 (예: 1억, 5,000만 등)
  const formatYAxis = (val: number) => {
    if (val === 0) return '0';
    if (val >= 100_000_000) {
      return `${(val / 100_000_000).toFixed(val % 100_000_000 === 0 ? 0 : 1)}억`;
    }
    if (val >= 10_000) {
      return `${Math.round(val / 10_000)}만`;
    }
    return `${val}`;
  };

  // 커스텀 툴팁 컴포넌트
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-xs min-w-[160px]">
          <div className="font-bold text-slate-200 border-b border-slate-700 pb-1.5 mb-2 flex items-center justify-between">
            <span>{label}차 경과</span>
          </div>

          <div className="space-y-1.5">
            {payload.map((entry: any, i: number) => {
              const val = entry.value as number;
              return (
                <div key={`item-${i}`} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm inline-block"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-slate-300 text-[11px]">{entry.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-white">{formatCurrency(val)}</div>
                    <div className="text-[10px] text-slate-400">{formatKoreanUnit(val)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#e5e7eb]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#e5e7eb]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220]">
            {isComparisonMode ? '시나리오 A / B 자산 성장 비교' : '연도별 자산 성장 시뮬레이션'}
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            {isComparisonMode
              ? '동일 기간 동안 두 전략의 자산 축적 차이를 확인하세요.'
              : '납입 원금과 복리 순이자의 누적 성장 추이입니다.'}
          </p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="w-full h-72 sm:h-80 -ml-2 sm:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          {isComparisonMode ? (
            /* 비교 모드: 두 시나리오의 총 자산 및 원금 비교 라인 차트 */
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
              />

              {/* 시나리오 A (Near-black) */}
              <Line
                type="monotone"
                dataKey="totalPostTaxA"
                name={`${nameA} 최종 자산`}
                stroke="#15171a"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#15171a' }}
                activeDot={{ r: 5 }}
              />
              {/* 시나리오 B (Ghost Lavender / Olive accent) */}
              <Line
                type="monotone"
                dataKey="totalPostTaxB"
                name={`${nameB} 최종 자산`}
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#8b5cf6' }}
                activeDot={{ r: 5 }}
              />

              {/* 원금 기준선 (점선) */}
              <Line
                type="monotone"
                dataKey="principalA"
                name={`${nameA} 납입원금`}
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="principalB"
                name={`${nameB} 납입원금`}
                stroke="#cbd5e1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          ) : (
            /* 단일 모드: 누적 영역형 차트 (AreaChart) */
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15171a" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#15171a" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
              />

              <Area
                type="monotone"
                dataKey="principalA"
                stackId="1"
                name="누적 납입원금"
                stroke="#64748b"
                fill="url(#colorPrincipal)"
              />
              <Area
                type="monotone"
                dataKey="netInterestA"
                stackId="1"
                name="누적 세후순이자"
                stroke="#15171a"
                fill="url(#colorInterest)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
