import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CalculatorId, CALCULATORS_LIST } from './types/navigation';
import { SidebarDrawer } from './components/navigation/SidebarDrawer';
import { GlobalHeader } from './components/navigation/GlobalHeader';
import { CompoundInterestApp } from './calculators/compound-interest/CompoundInterestApp';
import { UnitConverterApp } from './calculators/unit-converter/UnitConverterApp';
import { PlaceholderView } from './components/common/PlaceholderView';
import { TooltipProvider } from './components/ui/tooltip';

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
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-white text-[#112220] flex font-sans">
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

        {/* 메인 콘텐츠 라우팅 작업 공간 */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 py-4 sm:px-6 sm:py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/compound" replace />} />
            <Route path="/compound" element={<CompoundInterestApp />} />
            <Route path="/unit" element={<UnitConverterApp />} />
            <Route
              path="/exchange"
              element={
                <PlaceholderView
                  calculator={CALCULATORS_LIST[2]}
                  onGoToCompound={() => navigate('/compound')}
                />
              }
            />
            <Route
              path="/loan"
              element={
                <PlaceholderView
                  calculator={CALCULATORS_LIST[3]}
                  onGoToCompound={() => navigate('/compound')}
                />
              }
            />
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
        </main>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default App;
