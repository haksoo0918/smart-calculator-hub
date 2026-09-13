import React from 'react';
import { BmiResult } from '../../../types/bmi';
import { Badge } from '../../../components/ui/badge';

interface BmiGaugeCardProps {
  result: BmiResult;
}

const GAUGE_SECTIONS = [
  { id: 'underweight', label: '저체중', range: '<18.5', bg: 'bg-blue-400 dark:bg-blue-500', widthPercent: 18 },
  { id: 'normal', label: '정상', range: '18.5-22.9', bg: 'bg-emerald-500 dark:bg-[#d1ff19]', widthPercent: 24 },
  { id: 'pre-obese', label: '과체중', range: '23-24.9', bg: 'bg-amber-400 dark:bg-amber-500', widthPercent: 16 },
  { id: 'obese-1', label: '1단계', range: '25-29.9', bg: 'bg-orange-500 dark:bg-orange-500', widthPercent: 18 },
  { id: 'obese-2', label: '2단계', range: '30-34.9', bg: 'bg-rose-500 dark:bg-rose-500', widthPercent: 14 },
  { id: 'obese-3', label: '고도', range: '≥35', bg: 'bg-purple-600 dark:bg-purple-600', widthPercent: 10 },
];

export const BmiGaugeCard: React.FC<BmiGaugeCardProps> = ({ result }) => {
  // BMI 수치를 0~100% 게이지 x좌표로 매핑
  // 최소 BMI 14 -> 0%, 최대 BMI 38 -> 100%
  const getMarkerPosition = (bmi: number): number => {
    const minScale = 14;
    const maxScale = 38;
    const clamped = Math.max(minScale, Math.min(maxScale, bmi));
    return ((clamped - minScale) / (maxScale - minScale)) * 100;
  };

  const markerPercent = getMarkerPosition(result.bmi);

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 shadow-sm transition-colors space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 flex items-center gap-2">
            <span>비만도 스펙트럼 게이지</span>
            <Badge variant="outline" size="sm" className="text-[10px] sm:text-xs">
              KSSO 한국인 기준
            </Badge>
          </h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            전체 비만도 6단계 스펙트럼 상 나의 위치
          </p>
        </div>
      </div>

      {/* 게이지 본체 영역 */}
      <div className="pt-8 pb-2 px-2">
        <div className="relative">
          {/* 현재 BMI 위치 마커 (상단 뱃지 + 화살표) */}
          <div
            className="absolute -top-7 -translate-x-1/2 transition-all duration-300 ease-out z-10 flex flex-col items-center pointer-events-none"
            style={{ left: `${markerPercent}%` }}
          >
            <div className="bg-[#15171a] dark:bg-white text-white dark:text-[#112220] px-2 py-0.5 rounded text-[11px] font-black tabular-nums shadow-md whitespace-nowrap">
              내 BMI {result.bmi}
            </div>
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#15171a] dark:border-t-white" />
          </div>

          {/* 6단계 컬러 멀티 세그먼트 바 */}
          <div className="h-4 sm:h-5 w-full rounded-full overflow-hidden flex shadow-inner">
            {GAUGE_SECTIONS.map((sec) => (
              <div
                key={sec.id}
                className={`${sec.bg} h-full transition-opacity duration-200 ${
                  result.category === sec.id ? 'opacity-100 ring-2 ring-slate-900/30 dark:ring-white/40' : 'opacity-75 hover:opacity-100'
                }`}
                style={{ width: `${sec.widthPercent}%` }}
                title={`${sec.label} (${sec.range})`}
              />
            ))}
          </div>
        </div>

        {/* 하단 구간별 라벨 및 기준치 */}
        <div className="grid grid-cols-6 gap-1 pt-3 text-center">
          {GAUGE_SECTIONS.map((sec) => {
            const isCurrent = result.category === sec.id;
            return (
              <div key={sec.id} className="space-y-0.5 min-w-0">
                <div
                  className={`text-[11px] sm:text-xs truncate transition-colors ${
                    isCurrent
                      ? 'font-bold text-[#112220] dark:text-[#d1ff19]'
                      : 'text-slate-500 dark:text-slate-400 font-medium'
                  }`}
                >
                  {sec.label}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                  {sec.range}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
