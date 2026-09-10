import React, { useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CalculatorId, CALCULATORS_LIST } from './types/navigation';
import { SidebarDrawer } from './components/navigation/SidebarDrawer';
import { GlobalHeader } from './components/navigation/GlobalHeader';
import { PlaceholderView } from './components/common/PlaceholderView';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './context/ThemeContext';

const CompoundInterestApp = lazy(() =>
  import('./calculators/compound-interest/CompoundInterestApp').then((m) => ({ default: m.CompoundInterestApp }))
);
const UnitConverterApp = lazy(() =>
  import('./calculators/unit-converter/UnitConverterApp').then((m) => ({ default: m.UnitConverterApp }))
);
const ExchangeApp = lazy(() =>
  import('./calculators/exchange-rate/ExchangeApp').then((m) => ({ default: m.ExchangeApp }))
);
const LoanApp = lazy(() =>
  import('./calculators/loan-calculator/LoanApp').then((m) => ({ default: m.LoanApp }))
);

const CalculatorLoadingFallback = () => (
  <div className="w-full py-20 flex flex-col items-center justify-center space-y-3">
    <div className="w-7 h-7 rounded-full border-2 border-[#15171a] dark:border-slate-300 border-t-transparent animate-spin" />
    <span className="text-xs text-[#64748b] dark:text-slate-400 font-medium">계산기를 불러오는 중...</span>
  </div>
);

export const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // URL 경로로부터 현재 활성화된 계산기 ID 도출 (예: /unit -> 'unit')
  const pathId = location.pathname.replace(/^\//, '') as CalculatorId;
  const currentCalculator =
    CALCULATORS_LIST.find((c) => c.id === pathId) ?? CALCULATORS_LIST[0];

  // 모바일 드로어 상태
  const [isOpenMobileDrawer, setIsOpenMobileDrawer] = useState(false);

  // 메뉴 선택 시 해당 URL 경로로 이동
  const handleSelectCalculator = (id: CalculatorId) => {
    navigate(`/${id}`);
  };

  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={150}>
        <div className="min-h-screen bg-white dark:bg-[#0f172a] text-[#112220] dark:text-slate-100 flex font-sans transition-colors duration-200">
      {/* 1. 좌측 사이드바 (데스크톱 고정 & 모바일 슬라이드 드로어) */}
      <SidebarDrawer
        activeId={currentCalculator.id}
        onSelect={handleSelectCalculator}
        isOpenMobile={isOpenMobileDrawer}
        onCloseMobile={() => setIsOpenMobileDrawer(false)}
      />

      {/* 2. 우측 메인 뷰포트 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 글로벌 상단 헤더 */}
        <GlobalHeader
          currentCalculator={currentCalculator}
          onOpenMobileMenu={() => setIsOpenMobileDrawer(true)}
        />

        {/* 메인 콘텐츠 라우팅 작업 공간 (페이지 전환 시 부드러운 페이드인 트랜지션) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 py-4 sm:px-6 sm:py-6">
          <div key={location.pathname} className="animate-page-fade">
            <Suspense fallback={<CalculatorLoadingFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Navigate to="/compound" replace />} />
                <Route path="/compound" element={<CompoundInterestApp />} />
                <Route path="/unit" element={<UnitConverterApp />} />
                <Route path="/exchange" element={<ExchangeApp />} />
                <Route path="/loan" element={<LoanApp />} />
                <Route
                  path="/dividend"
                  element={
                    <PlaceholderView
                      calculator={CALCULATORS_LIST[4]}
                      onGoToCompound={() => navigate('/compound')}
                    />
                  }
                />
                <Route
                  path="/goal"
                  element={
                    <PlaceholderView
                      calculator={CALCULATORS_LIST[5]}
                      onGoToCompound={() => navigate('/compound')}
                    />
                  }
                />
                {/* 정의되지 않은 경로는 기본 연복리로 리다이렉트 */}
                <Route path="*" element={<Navigate to="/compound" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
