# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 본 문서에 기록됩니다.
버전 체계는 [Semantic Versioning (SemVer)](https://semver.org/)을 준수합니다.

## [1.2.0] - 2026-09-07

### 추가 및 변경 (Added & Changed)
- **shadcn/ui 디자인 시스템 전면 도입**:
  - Radix UI 프리미티브 + Tailwind CSS 기반 모듈형 컴포넌트 시스템 구축
  - `Button`, `Card`, `Badge`, `Input`, `Slider`, `Table`, `Sheet` 컴포넌트 작성 (`src/components/ui/`)
- **기존 컴포넌트 shadcn/ui 전면 마이그레이션**:
  - `SidebarDrawer.tsx`: Radix Dialog 기반 모바일 슬라이드 드로어(`Sheet`) 및 `Badge` 적용
  - `GlobalHeader.tsx`: shadcn `Button`, `Badge` 적용
  - `SummaryCards.tsx`: shadcn `Card`, `Badge` 적용
  - `DataTable.tsx`: shadcn `Table`, `Button` 적용
  - `CalculatorForm.tsx` & `ComparisonView.tsx`: shadcn 컴포넌트 적용
- **TDD (Test-Driven Development) 파이프라인 구축**:
  - Vitest + Testing Library + JSDOM 기반 테스트 환경 구축
  - Red → Green 사이클을 통해 `Button`, `Card`, `Badge`, `Input`, `Table` 컴포넌트 단위 테스트 작성 및 100% 통과 (8개 테스트)
- **Pretendard Variable 가변 웹폰트 전면 적용**:
  - 전역 폰트를 Pretendard Variable로 교체하여 한글/숫자 가독성 최적화
- **마이너스(손실) 수익률 시뮬레이션 지원**:
  - 연 예상 수익률 범위를 `-30% ~ +50%`로 확장하여 시장 하락장 및 원금 손실 시나리오 분석 지원
  - 손실 발생 시 이자 소득세 0원 처리
  - 약세장(`-3%`), 하락장(`-10%`) 원터치 프리셋 칩 추가
  - 손실 구간 붉은색 시각적 피드백 및 원금 손실 배지 추가
- **음수 한글 통화 포맷팅 지원 (`src/utils/formatters.ts`)**:
  - `formatKoreanUnit`에서 음수 발생 시 `-1억 2,000만 원`처럼 정상적인 한글 금액 포맷팅 지원
- **Vite 번들 최적화 (Code Splitting)**:
  - Rollup `manualChunks` 적용으로 `vendor-charts`, `vendor-react`, `vendor-icons` 청크 분리
  - 초기 로딩 JS 청크 크기 대폭 감소로 모바일 네트워크 로딩 성능 극대화

## [1.0.0] - 2026-09-06

### 추가 (Added)
- **모바일 우선 연복리 계산기 프론트엔드 구축**:
  - React + Vite + TypeScript + Tailwind CSS 기반 모바일 반응형 SPA 구현
  - Pretendard 웹폰트 및 터치 친화적 UI 레이아웃 설계
- **정밀 복리 계산 엔진 (`src/utils/calculator.ts`)**:
  - 초기 원금 및 정기 적립(월/년/거치) 복리 미래가치 산출
  - 복리 주기 지원 (월복리, 연복리, 분기복리, 일복리)
  - 한국형 이자소득 과세 옵션 지원 (일반과세 15.4%, 비과세 0%, 세금우대/ISA 9.9%, 직접입력)
  - 연도별 시계열 자산 성장 데이터 생성
- **시나리오 A / B 비교 모드 (`src/components/ComparisonView.tsx`)**:
  - 두 가지 투자 전략 간의 최종 자산, 세후 순이자, 수익률 격차 분석 배너 및 카드
  - "시나리오 A 조건 복사" 기능 제공
- **인터랙티브 차트 대시보드 (`src/components/ChartDashboard.tsx`)**:
  - Recharts 기반의 반응형 자산 성장 차트 (누적 영역형 및 선형 차트 지원)
  - 모바일 터치 최적화 커스텀 툴팁 (한글 원화 및 억/만 단위 실시간 표시)
- **모바일 터치 편의 UX**:
  - 빠른 원화 증감 버튼 (`+10만`, `+50만`, `+100만`, `+1,000만`, `정정`)
  - 대표 연수익률 프리셋 칩 (`예적금 3.5%`, `배당/채권 5%`, `지수 ETF 8%`, `공격투자 12%`)
  - 빠른 투자 기간 칩 (`5년`, `10년`, `15년`, `20년`, `30년`)
  - 슬라이더와 콤마 포맷팅 인풋 간 양방향 실시간 동기화
- **연도별 상세 흐름표 (`src/components/DataTable.tsx`)**:
  - 접이식 아코디언 테이블 및 엑셀 호환 UTF-8 BOM CSV 내보내기 기능
- **데이터 보존 (`src/hooks/useLocalStorage.ts`)**:
  - 브라우저 LocalStorage 자동 저장 및 기본값 초기화 기능
- **검증 및 문서화**:
  - 수학적 정합성 검증 (단위 테스트 통과)
  - [PRD.md](PRD.md) 및 상세 구현 계획서 작성
