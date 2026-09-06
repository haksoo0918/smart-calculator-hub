import React, { useState } from 'react';
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
import { AreaChart as AreaIcon, LineChart as LineIcon } from 'lucide-react';

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
  const [chartType, setChartType] = useState<'area' | 'line'>('area');

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
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {isComparisonMode ? '시나리오 A / B 자산 성장 비교' : '연도별 자산 성장 시뮬레이션'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isComparisonMode
              ? '동일 기간 동안 두 전략의 자산 축적 차이를 확인하세요.'
              : '납입 원금과 복리 순이자의 누적 성장 추이입니다.'}
          </p>
        </div>

        {/* 차트 타입 토글 버튼 */}
        {!isComparisonMode && (
          <div className="flex items-center self-end sm:self-auto gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                chartType === 'area'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <AreaIcon className="w-3.5 h-3.5" />
              <span>영역형</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                chartType === 'line'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LineIcon className="w-3.5 h-3.5" />
              <span>선형</span>
            </button>
          </div>
        )}
      </div>

      {/* 차트 영역 */}
      <div className="w-full h-72 sm:h-80 -ml-2 sm:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          {isComparisonMode ? (
            /* 비교 모드: 두 시나리오의 총 자산 및 원금 비교 라인 차트 */
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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

              {/* 시나리오 A (Teal) */}
              <Line
                type="monotone"
                dataKey="totalPostTaxA"
                name={`${nameA} 최종 자산`}
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 2, fill: '#0d9488' }}
                activeDot={{ r: 5 }}
              />
              {/* 시나리오 B (Indigo) */}
              <Line
                type="monotone"
                dataKey="totalPostTaxB"
                name={`${nameB} 최종 자산`}
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 2, fill: '#6366f1' }}
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
                stroke="#c7d2fe"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          ) : chartType === 'area' ? (
            /* 단일 모드 누적 영역형 차트 */
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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
                stroke="#0d9488"
                fill="url(#colorInterest)"
              />
            </AreaChart>
          ) : (
            /* 단일 모드 라인 차트 */
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
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

              <Line
                type="monotone"
                dataKey="totalPostTaxA"
                name="세후 총 자산"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="principalA"
                name="누적 원금"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
