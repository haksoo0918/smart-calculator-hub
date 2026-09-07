import React, { useState, useMemo } from 'react';
import { ScenarioInput } from '../../types/calculator';
import { calculateCompoundInterest, compareScenarios } from '../../utils/calculator';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CalculatorForm } from '../../components/CalculatorForm';
import { SummaryCards } from '../../components/SummaryCards';
import { ChartDashboard } from '../../components/ChartDashboard';
import { ComparisonView } from '../../components/ComparisonView';
import { DataTable } from '../../components/DataTable';
import { GitCompare, RotateCcw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';

const DEFAULT_SCENARIO_A: ScenarioInput = {
  name: '시나리오 A',
  principal: 10_000_000,
  regularContribution: 500_000,
  contributionFrequency: 'monthly',
  years: 10,
  annualRate: 7.0,
  compoundingFrequency: 'monthly',
  taxType: 'normal',
  customTaxRate: 15.4,
};

const DEFAULT_SCENARIO_B: ScenarioInput = {
  name: '시나리오 B',
  principal: 10_000_000,
  regularContribution: 500_000,
  contributionFrequency: 'monthly',
  years: 10,
  annualRate: 10.0,
  compoundingFrequency: 'monthly',
  taxType: 'isa',
  customTaxRate: 9.9,
};

interface CompoundInterestAppProps {
  onSetHeaderActions?: (actions: React.ReactNode) => void;
}

export const CompoundInterestApp: React.FC<CompoundInterestAppProps> = () => {
  const [isComparisonMode, setIsComparisonMode] = useLocalStorage<boolean>(
    'compound_calc_comparison_mode',
    false
  );

  const [scenarioA, setScenarioA] = useLocalStorage<ScenarioInput>(
    'compound_calc_scenario_a',
    DEFAULT_SCENARIO_A
  );

  const [scenarioB, setScenarioB] = useLocalStorage<ScenarioInput>(
    'compound_calc_scenario_b',
    DEFAULT_SCENARIO_B
  );

  const [activeMobileTab, setActiveMobileTab] = useState<'A' | 'B'>('A');

  const resultA = useMemo(() => calculateCompoundInterest(scenarioA), [scenarioA]);
  const resultB = useMemo(() => calculateCompoundInterest(scenarioB), [scenarioB]);
  const comparison = useMemo(
    () => compareScenarios(scenarioA, scenarioB),
    [scenarioA, scenarioB]
  );

  const handleReset = () => {
    if (window.confirm('모든 입력값을 기본값으로 초기화하시겠습니까?')) {
      setScenarioA(DEFAULT_SCENARIO_A);
      setScenarioB(DEFAULT_SCENARIO_B);
      setIsComparisonMode(false);
      setActiveMobileTab('A');
    }
  };

  const handleCopyAtoB = () => {
    setScenarioB({
      ...scenarioA,
      name: '시나리오 B',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 상단 서브 컨트롤러 바 (비교 토글 및 리셋) */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">
            시뮬레이션 모드:
          </span>
          <button
            type="button"
            onClick={() => setIsComparisonMode(!isComparisonMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
              isComparisonMode
                ? 'bg-teal-50 text-teal-700 border-teal-300 ring-2 ring-teal-100'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>비교 모드 (A/B)</span>
            <span
              className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                isComparisonMode ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isComparisonMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              aria-label="기본값 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">초기화</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>기본값 초기화</TooltipContent>
        </Tooltip>
      </div>

      {/* 모바일 비교 모드 시 탭 네비게이션 */}
      {isComparisonMode && (
        <div className="lg:hidden flex rounded-xl bg-slate-200/80 p-1">
          <button
            type="button"
            onClick={() => setActiveMobileTab('A')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              activeMobileTab === 'A'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            시나리오 A 설정
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('B')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              activeMobileTab === 'B'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            시나리오 B 설정
          </button>
        </div>
      )}

      {/* 2열 반응형 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 좌측: 입력 폼 영역 (lg: 5컬럼) */}
        <div className="lg:col-span-5 space-y-4">
          {!isComparisonMode && (
            <CalculatorForm
              scenario={scenarioA}
              onChange={setScenarioA}
              accentColor="teal"
              badgeTitle="기본 시나리오"
            />
          )}

          {isComparisonMode && (
            <>
              <div className={`space-y-4 ${activeMobileTab === 'A' ? 'block' : 'hidden lg:block'}`}>
                <CalculatorForm
                  scenario={scenarioA}
                  onChange={setScenarioA}
                  accentColor="teal"
                  badgeTitle="시나리오 A (기준)"
                />
              </div>

              <div className={`space-y-4 ${activeMobileTab === 'B' ? 'block' : 'hidden lg:block'}`}>
                <CalculatorForm
                  scenario={scenarioB}
                  onChange={setScenarioB}
                  accentColor="indigo"
                  badgeTitle="시나리오 B (비교)"
                  onCopyFromOther={handleCopyAtoB}
                  copyButtonLabel="시나리오 A 조건 복사"
                />
              </div>
            </>
          )}
        </div>

        {/* 우측: 시각화 대시보드 & 결과 영역 (lg: 7컬럼) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {isComparisonMode && <ComparisonView comparison={comparison} />}

          {!isComparisonMode ? (
            <SummaryCards result={resultA} theme="teal" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SummaryCards result={resultA} title="시나리오 A" theme="teal" />
              <SummaryCards result={resultB} title="시나리오 B" theme="indigo" />
            </div>
          )}

          <ChartDashboard
            resultA={resultA}
            resultB={resultB}
            isComparisonMode={isComparisonMode}
            nameA={scenarioA.name}
            nameB={scenarioB.name}
          />

          <DataTable
            result={isComparisonMode && activeMobileTab === 'B' ? resultB : resultA}
            scenarioName={
              isComparisonMode && activeMobileTab === 'B' ? scenarioB.name : scenarioA.name
            }
          />
        </div>
      </div>
    </div>
  );
};
