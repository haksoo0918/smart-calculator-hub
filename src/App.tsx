import React, { useState, useMemo } from 'react';
import { ScenarioInput } from './types/calculator';
import { calculateCompoundInterest, compareScenarios } from './utils/calculator';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { SummaryCards } from './components/SummaryCards';
import { ChartDashboard } from './components/ChartDashboard';
import { ComparisonView } from './components/ComparisonView';
import { DataTable } from './components/DataTable';

const DEFAULT_SCENARIO_A: ScenarioInput = {
  name: '시나리오 A',
  principal: 10_000_000, // 초기 원금 1,000만 원
  regularContribution: 500_000, // 매월 50만 원
  contributionFrequency: 'monthly',
  years: 10,
  annualRate: 7.0, // 연 7% (지수 ETF 평균)
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
  annualRate: 10.0, // 연 10% (고수익 포트폴리오)
  compoundingFrequency: 'monthly',
  taxType: 'isa', // ISA 비과세/세금우대 9.9%
  customTaxRate: 9.9,
};

export const App: React.FC = () => {
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

  // 모바일에서 A/B 비교 모드일 때 입력할 시나리오 탭 선택 (A or B)
  const [activeMobileTab, setActiveMobileTab] = useState<'A' | 'B'>('A');

  // 계산 메모이제이션
  const resultA = useMemo(() => calculateCompoundInterest(scenarioA), [scenarioA]);
  const resultB = useMemo(() => calculateCompoundInterest(scenarioB), [scenarioB]);

  const comparison = useMemo(
    () => compareScenarios(scenarioA, scenarioB),
    [scenarioA, scenarioB]
  );

  // 초기화 핸들러
  const handleReset = () => {
    if (window.confirm('모든 입력값을 기본값으로 초기화하시겠습니까?')) {
      setScenarioA(DEFAULT_SCENARIO_A);
      setScenarioB(DEFAULT_SCENARIO_B);
      setIsComparisonMode(false);
      setActiveMobileTab('A');
    }
  };

  // A를 B로 복사
  const handleCopyAtoB = () => {
    setScenarioB({
      ...scenarioA,
      name: '시나리오 B',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Header
        isComparisonMode={isComparisonMode}
        onToggleComparison={() => setIsComparisonMode(!isComparisonMode)}
        onReset={handleReset}
      />

      <main className="max-w-7xl mx-auto px-3.5 py-4 sm:px-6 sm:py-6">
        {/* 모바일 비교 모드 시 탭 네비게이션 */}
        {isComparisonMode && (
          <div className="lg:hidden flex rounded-xl bg-slate-200/80 p-1 mb-4">
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

        {/* 2열 반응형 그리드 (모바일 1열, 대화면 2열) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* 좌측 열: 입력 폼 영역 (lg: 5컬럼) */}
          <div className="lg:col-span-5 space-y-4">
            {/* 단일 모드일 때: 시나리오 A 폼만 표시 */}
            {!isComparisonMode && (
              <CalculatorForm
                scenario={scenarioA}
                onChange={setScenarioA}
                accentColor="teal"
                badgeTitle="기본 시나리오"
              />
            )}

            {/* 비교 모드일 때 (모바일: 탭 선택에 따라 하나 표시, 데스크톱: 둘 다 순차 표시) */}
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

          {/* 우측 열: 시각화 대시보드 & 결과 영역 (lg: 7컬럼) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* 비교 모드 활성화 시 상단 비교 통찰 배너 */}
            {isComparisonMode && <ComparisonView comparison={comparison} />}

            {/* 핵심 요약 카드 (단일 모드: A만, 비교 모드: A와 B 나란히) */}
            {!isComparisonMode ? (
              <SummaryCards result={resultA} theme="teal" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SummaryCards result={resultA} title="시나리오 A" theme="teal" />
                <SummaryCards result={resultB} title="시나리오 B" theme="indigo" />
              </div>
            )}

            {/* Recharts 자산 성장 차트 대시보드 */}
            <ChartDashboard
              resultA={resultA}
              resultB={resultB}
              isComparisonMode={isComparisonMode}
              nameA={scenarioA.name}
              nameB={scenarioB.name}
            />

            {/* 연도별 상세 데이터 테이블 */}
            <DataTable
              result={isComparisonMode && activeMobileTab === 'B' ? resultB : resultA}
              scenarioName={
                isComparisonMode && activeMobileTab === 'B' ? scenarioB.name : scenarioA.name
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
