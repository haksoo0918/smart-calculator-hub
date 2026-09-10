# 변경 이력 (CHANGELOG)

모든 주요 변경 사항은 본 문서에 기록됩니다.
버전 체계는 [Semantic Versioning (SemVer)](https://semver.org/)을 준수합니다.

## [1.8.1] - 2026-09-10

### 인터랙션 요소 전면 표준화 및 공통 컴포넌트 추상화 (Component Refactoring & DRY)
- **전 모듈 shadcn `Button` 컴포넌트 전면 통일**:
  - 인라인 네이티브 `<button>` 태그를 shadcn `Button`으로 100% 교체하여 일관된 포커스 링, 웹 접근성, 트랜지션 적용.
- **선택(Active) 버튼 호버 인터랙션 미세 명도 피드백 표준화**:
  - 선택된 버튼에 마우스 오버 시 색상이 고정되거나 기본 고스트 스타일이 튀어나오던 현상 개선.
  - 라이트 모드 `hover:bg-[#2e3238]`, 다크 모드 `dark:hover:bg-slate-700` / `dark:hover:bg-slate-100`으로 자연스러운 클릭 가능 피드백 통일.
- **2회 이상 중복 인터랙션 요소의 공통 컴포넌트 추상화 (DRY 원칙)**:
  - `SelectableChip` (`src/components/ui/selectable-chip.tsx`): 금리, 기간, 거치기간, 수익률, 우대율 등 선택형 프리셋 칩 표준화.
  - `SegmentedControl` (`src/components/ui/segmented-control.tsx`): 상환방식, 적립주기, 환전방식, 차트 뷰 등 2~4분할 세그먼트 탭 표준화.
- **적용 모듈**: 대출 계산기(`LoanForm`, `LoanChartDashboard`), 단위 변환기(`DualConverterCard`), 환율 계산기(`DualExchangeCard`), 복리 계산기(`CalculatorForm`, `CompoundInterestApp`).
- 단위/통합/라우팅 테스트 49종 전체 통과 및 프로덕션 빌드 완료.

## [1.8.0] - 2026-09-10

### 대출이자 & 상환방식 비교 계산기 신규 출시 (Loan Repayment Calculator)
- **3대 상환방식 정밀 지원 & 실시간 비교 (`LoanComparisonCard`)**:
  - 원리금균등, 원금균등, 만기일시 3가지 방식의 총이자 및 1회차/마지막회차 월상환액 나란히 비교
  - "원금균등 선택 시 원리금균등 대비 OOO만 원 이자 절약" 하이라이트 배너 제공
- **중도상환 시뮬레이터 내장 (선택 토글)**:
  - 시중은행 3년(36개월) 슬라이딩 감면 공식 자동 적용 (3년 경과 시 0원 전액 면제)
  - 조기 상환 시 아낄 수 있는 누적 이자와 납부 수수료, 순 절감 혜택(+OOO만 원) 실시간 산출
- **모바일 퍼스트 터치 편의 UX (`LoanForm`)**:
  - 한글 금액 실시간 표기(`3억 5,000만 원`), 빠른 금액 증감 칩(`+1,000만`, `+5,000만`, `+1억`, `정정`), shadcn `Input`
  - 0.1% 단위 금리 조절 및 시장 대표 금리 칩(`3.2% 특판`, `3.8% 주담대`, `4.5% 전세`, `5.5% 신용`)
  - 1~40년 대출 기간 슬라이더 및 거치 기간(0개월~5년 원금 상환 유예) 설정
- **시각화 & 스케줄표 & 안내 카드**:
  - Recharts 기반 연차별 대출 잔액 감소 곡선 및 누적 납입액(원금 vs 이자) 영역 차트 (`LoanChartDashboard`)
  - 12개월 단위 연차별 페이지네이션, 중도상환 회차 뱃지 표기, 엑셀 호환 UTF-8 BOM CSV 내보내기 (`LoanScheduleTable`)
  - DSR / DTI / LTV 개념, 상환방식 선택 가이드, 금리인하요구권 팁 안내 카드 (`LoanInfoCard`)
- **라우트 코드 스플리팅 & 상태 영속화**:
  - `/loan` 라우트 활성화 및 사이드바 `NEW` 배지 적용, `useLocalStorage` 입력값 자동 보관
- **단위/통합/라우팅 테스트 49종 전체 통과 및 프로덕션 빌드 완료**

## [1.7.7] - 2026-09-07

### 복리 계산기 금액 입력창 우측 패딩 및 단위 텍스트 겹침 버그 수정 (UI Fix)
- **`CalculatorForm.tsx` 원금 및 적립금 입력창 패딩 개선**:
  - `Input` 컴포넌트의 클래스에서 `px-3`이 우측 패딩 `pr-9`을 덮어써서 우측 정렬된 숫자와 '원' 텍스트가 겹치던 현상 수정
  - `pl-3 pr-10`(우측 패딩 40px)으로 충분한 여백을 확보하여 긴 금액 입력 시에도 '원' 단위 기호와 겹치지 않도록 조치
  - 우측 '원' 텍스트에 `pointer-events-none select-none`을 추가하여 클릭 시 인풋 포커스 방해 방지
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.6] - 2026-09-07

### 연복리 계산기 투자 상식 및 유의사항 안내 카드 추가 (Compound Info Card)
- **복리 투자 상식 및 유의사항 카드(`CompoundInfoCard.tsx`) 신설**:
  - 단위 변환기 및 환율 계산기와의 UI/UX 일관성을 위해 연복리 계산기 하단(`DataTable` 아래)에 컴팩트 정보 카드 추가
  - 72의 법칙, 복리 효과(스노우볼), 절세 계좌(ISA 9.9% 분리과세) 활용 팁, 금융소득 종합과세(2,000만 원 초과) 기준을 압축형 불릿으로 제공
  - 고정 수익률 가정 및 원금 손실·물가상승률(인플레이션) 리스크에 대한 법적/시뮬레이션 유의사항 명시
- **디자인 시스템 100% 일치**:
  - `ghost.design.md` 라운드 카드(`rounded-2xl bg-slate-50 dark:bg-[#1e293b] border`) 및 Electric Lime 아이콘 포인트 적용
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.5] - 2026-09-07

### 폼 UI 요소 shadcn/ui 컴포넌트 전면 표준화 (Form UI Standardization)
- **복리 계산기 입력 폼(`CalculatorForm.tsx`) shadcn 전환**:
  - 초기 투자 원금, 정기 추가 적립금, 연 예상 수익률, 커스텀 세율 입력 필드를 네이티브 `<input>`에서 shadcn `<Input>` 컴포넌트로 전면 교체
  - 목표 투자 기간 및 연수익률 조절 슬라이더를 네이티브 `<input type="range">`에서 shadcn `<Slider>` 컴포넌트로 전환 (키보드 화살표 1단계 정밀 제어 지원)
- **단위 변환기(`DualConverterCard.tsx`) shadcn 전환**:
  - 수치 입력 인풋을 shadcn `<Input>` 컴포넌트로 교체하고 기존 Ghost 미니멀 타이포그래피 스타일 보존
- **환율 계산기(`DualExchangeCard.tsx`) shadcn 전환**:
  - 환전 금액 입력 인풋을 shadcn `<Input>` 컴포넌트로 교체하고 기존 Ghost 미니멀 타이포그래피 스타일 보존
- **디자인 및 기능 완벽 보존**:
  - `ghost.design.md` 모노크롬(#15171a, #0b0c0e) 및 Electric Lime(#d1ff19) 포커스 링 스타일 100% 유지
  - 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.4] - 2026-09-07

### 웹 표준 및 웹 접근성(WCAG 2.1 / KWCAG) 강화 적용 (Web Standards & Accessibility)
- **뷰포트 화면 확대(Zoom) 보장 (WCAG 1.4.4)**:
  - `index.html`에서 저시력자 핀치 줌을 가로막던 `user-scalable=no, maximum-scale=1.0`을 제거하고 표준 뷰포트로 전환
- **모든 폼 입력 필드 Accessible Name 매핑 (WCAG 1.3.1 & 4.1.2)**:
  - `CalculatorForm.tsx`: 초기 원금, 정기 적립금, 투자 기간(슬라이더), 예상 연수익률 입력 필드에 `id`, `htmlFor`, 명시적 `aria-label` 완벽 연결
  - `DualConverterCard.tsx`: 출발 단위 입력 필드에 `aria-label` 및 `<label htmlFor>` 매핑
  - `DualExchangeCard.tsx`: 출발 통화 입력 필드에 `aria-label` 및 `<label htmlFor>` 매핑
- **아코디언 키보드 접근성 및 상태 음성 표기 (WCAG 2.1.1 & 4.1.2)**:
  - `DataTable.tsx`: 연도별 자산 흐름표 아코디언 헤더를 시맨틱 `<button type="button" aria-expanded={isOpen}>`으로 전환하여 Tab/Enter/Space 키보드 조작 및 개폐 상태 인식 보장
- **시맨틱 랜드마크 완성도 제고 (HTML5 Semantic)**:
  - `SidebarDrawer.tsx`: 하단 카피라이트/버전 영역을 시맨틱 `<footer>` 태그로 래핑하여 5대 랜드마크 체계 수립
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.3] - 2026-09-07

### 코드 리뷰 권장 조치 및 라우트 코드 스플리팅 적용 (Route Splitting & Robustness)
- **라우트 단위 코드 스플리팅 (`React.lazy` & `Suspense`)**:
  - `CompoundInterestApp`, `UnitConverterApp`, `ExchangeApp`을 동적 임포트로 분리
  - 초기 진입 번들 크기 262kB ➔ 154kB로 41% 경감하여 첫 로딩 속도(FCP/LCP) 대폭 향상
  - 로딩 중 Ghost 스타일 미니멀 스피너 폴백 표시
- **복리 수치 연산 NaN 방어 코드 적용**:
  - `src/utils/calculator.ts`의 `calculateCompoundInterest`에 `Number.isFinite` 검증을 적용하여 비정상 입력 시 자산 성장 테이블 전체 오염 원천 차단
  - 신규 복리 계산기 단위 테스트(`calculator.test.ts`) 5종 추가
- **네트워크 타임아웃 및 로컬스토리지 안정화**:
  - `fetchLiveExchangeRates`에 5초 타임아웃 신호(`AbortController`) 추가로 네트워크 지연 시 무한 대기 방지
  - `useLocalStorage`에 SSR 환경 가드 및 `undefined` 직렬화 예외 방지 코드 추가
- 단위/통합/라우팅 테스트 38개 전체 통과 및 프로덕션 빌드 완료

## [1.7.2] - 2026-09-07

### 테스트 환경 최적화 및 패키지 메타데이터 동기화 (Test Optimization & Metadata Sync)
- **테스트 러너 콘솔 로그 청결화**:
  - JSDOM 환경에서 Recharts `ResponsiveContainer` 크기 계산 불가로 발생하던 `stderr` 경고 로그(`width(0) and height(0)...`) 제거
  - `src/test/setup.ts`에 Recharts `ResponsiveContainer` 테스트 Mock 래퍼 적용으로 33개 테스트 완전 무경고 클린 패스 달성
- **패키지 메타데이터 동기화**:
  - `package.json`의 프로젝트명을 `smart-calculator-hub`로 동기화하여 멀티 계산기 플랫폼 정체성 일원화
- 단위/라우팅 테스트 33개 전체 통과

## [1.7.1] - 2026-09-07

### 전역 단일 컨테이너 너비 표준화 적용 (Global Container Max-Width Standardization)
- **페이지 이동 시 콘텐츠 폭 불일치 및 덜컹거림 완벽 해소**:
  - 개별 페이지마다 달랐던 컨테이너 최대 너비(연복리 1280px ↔ 단위 변환 1024px ↔ 환율 896px)를 전역 단일 규격인 `max-w-5xl` (1024px)로 일원화
  - `GlobalHeader.tsx`: 헤더 내부 컨테이너를 엣지-투-엣지(`w-full px-4 sm:px-6`)로 확장하여, 페이지 타이틀(좌측)과 테마 토글 버튼(우측)이 화면 양 끝에 시원하게 밀착 배치되도록 개선
  - `App.tsx`: `<main>` 메인 뷰포트 컨테이너를 `max-w-5xl` 단일 규격으로 유지하여 본문 가독성과 밸런스 확보
  - `UnitConverterApp.tsx` & `ExchangeApp.tsx`: 개별 컴포넌트에 하드코딩되어 있던 중복 `max-w-*`를 제거하고 부모 컨테이너 너비(`w-full`)를 자연스럽게 100% 채우도록 개선
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.7.0] - 2026-09-07

### 전역 다크 모드 시스템 및 shadcn UI 모드 토글 버튼 구현 (Global Dark Mode System & Mode Toggle)
- **사용자 요청 반영: shadcn UI 표준 모드 토글 버튼 (`ThemeToggle.tsx`)**:
  - 글로벌 헤더 우측 상단에 정갈한 `h-9 w-9` 아이콘 버튼(`Button variant="outline" size="icon"`)으로 전면 교체
  - 라이트/다크 전환 시 Sun(태양)과 Moon(달) 아이콘이 부드럽게 회전 및 스케일 모션(`dark:-rotate-90 dark:scale-0`, `rotate-90 scale-0 dark:rotate-0 dark:scale-100`)으로 전환
  - Radix UI Tooltip을 연동하여 마우스 오버 시 "다크 모드로 전환" / "라이트 모드로 전환" 안내
  - 글로벌 헤더 우측 상단 1곳으로 단일화하여 불필요한 중복 배제
- **전역 테마 상태 아키텍처 구축 (`ThemeContext.tsx`)**:
  - 시스템 선호도(OS 다크 모드) 자동 감지 및 `localStorage`(`theme-preference`) 영구 동기화
  - `<html>` 루트 엘리먼트의 `.dark` 클래스 및 `color-scheme` 동적 제어
  - SSR 및 jsdom 테스트 환경 대응 방어 코드 적용
  - 새로고침 시 화면 번쩍임 방지(FOUC 차단): `index.html` 인라인 스크립트 적용
- **전체 컴포넌트 및 3대 계산기 다크 모드 스타일 완벽 지원**:
  - **공통 UI Primitives**: `card`, `input`, `select`, `button`, `badge`, `sheet`, `table`, `slider` 다크 테마 토큰 적용
  - **연복리 계산기**: 메인 폼, 퀵 버튼, 요약 카드, 데이터 테이블, 시나리오 비교 뷰 다크 모드 지원
  - **Recharts 인터랙티브 차트 다크 모드 적응**: `ChartDashboard.tsx`에서 차트 그리드, 축, 툴팁, 면적/라인 색상이 다크 배경에 최적화되도록 구현 (Electric Lime `#d1ff19` 악센트 적용)
  - **단위 변환기**: 듀얼 인풋 카드, 카테고리 탭, 퀵 프리셋 칩, 일괄 환산 그리드 다크 모드 지원
  - **환율 계산기**: 듀얼 환율 카드, 환전 방식 탭, 프리셋 칩, 일괄 환산표, 환율 정보 카드 다크 모드 지원
  - **글로벌 네비게이션**: 데스크탑 헤더, 사이드바, 모바일 드로어(Sheet), 플레이스홀더 뷰 다크 모드 지원
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.5] - 2026-09-07

### 전역 페이지 라우트 전환 부드러운 페이드인 애니메이션 구현 (Page Transition Fade Motion)
- **React Router 라우트 전환 시 깜빡임 없이 부드러운 페이드 전환**:
  - 데스크탑 좌측 사이드바 및 모바일 드로어에서 메뉴 이동 시 화면이 즉시 바뀌지 않고 부드럽게 안착되도록 전환 효과 적용
  - `src/App.tsx`의 `<Routes>` 컨테이너를 `<div key={location.pathname} className="animate-page-fade">`로 래핑하여 경로 변경 시마다 애니메이션이 100% 확실하게 트리거되도록 구현
  - **애니메이션 스펙**: 200ms `ease-out`, 미세한 수직 안착(`translate3d(0, 4px, 0)` -> `translate3d(0, 0, 0)`), 불투명도 점진 증가(`opacity: 0` -> `1`)
  - `tailwind.config.js` 및 `src/index.css`에 `page-fade` / `pageFadeIn`을 명시적으로 선언하여 Tailwind 빌드 누락 방지 및 하드웨어 GPU 가속 보장
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.4] - 2026-09-07

### 모바일 사이드바 드로어 하드웨어 가속 슬라이드 애니메이션 구현 (Mobile Drawer Smooth Motion)
- **모바일 햄버거 메뉴 슬라이드오버 드로어(Sheet) 애니메이션 복구 및 고도화**:
  - `Sheet` 컴포넌트 내 CSS Transition과 Tailwind Animate 키프레임의 충돌로 인해 애니메이션이 생략(깜빡임)되던 문제를 근본적으로 해결
  - 브라우저 GPU 하드웨어 가속(`translate3d`)을 사용하는 독립 키프레임(`slideInFromLeft`, `slideOutToLeft`)을 `index.css`에 직접 선언
  - **열림(Open)**: 280ms 부드러운 감속 곡선(`cubic-bezier(0.16, 1, 0.3, 1)`)으로 좌측 화면 바깥에서 스르륵 진입
  - **닫힘(Close)**: 220ms 가속 곡선으로 좌측 화면 바깥으로 스르륵 퇴장
  - **배경 오버레이(Overlay)**: 드로어 전환 속도에 맞춘 280ms/220ms 딤드(Dimmed) 페이드인/아웃 애니메이션 적용
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.3] - 2026-09-07

### 모바일 퍼스트 뷰포트(360px~390px) 텍스트 깨짐 및 레이아웃 전면 개선 (Mobile-First UX Refinement)
- **듀얼 인풋/결과 카드 모바일 텍스트 깨짐 및 가로 넘침(Overflow) 방지**:
  - `DualExchangeCard.tsx` & `DualConverterCard.tsx`
  - 출발(From) / 도착(To) 상단 라벨을 `입력 (From)` 및 `결과 (To)`로 간결화하고 `whitespace-nowrap`을 적용하여 좁은 모바일 화면(가용 폭 270px 이하)에서 단어 중간 줄바꿈 찌그러짐 현상 원천 해결
  - 도착(To) 카드 복사 버튼을 텍스트 없는 콤팩트 `Tooltip` 아이콘 버튼(`w-7 h-7`)으로 통일하여 가로 공간 45px 이상 확보
  - 드롭다운 셀렉트 너비를 모바일 `w-28 sm:w-36 lg:w-44` 가변형으로 최적화 및 `truncate` 처리
- **일괄 환산표 헤더 모바일 반응형 2행 구조 적용**:
  - `MultiExchangeGrid.tsx` & `MultiResultGrid.tsx`
  - 모바일(360px)에서 긴 타이틀("전체 주요 통화 실시간 일괄 환산")과 기준 배지가 한 줄에 억지로 배치되어 글자가 3~4줄로 깨지던 현상 해소
  - 모바일에서는 1행(타이틀 + 우측 기준 배지), 2행(보조 설명문구 풀 너비)으로 분리하여 가독성 극대화 (`sm` 이상에서는 기존 1행 가로 정렬 유지)
- **환율 계산기 상단 환전 방식 탭 및 기준일 바 모바일 최적화**:
  - 환전 방식 탭 3개를 모바일에서 `w-full grid grid-cols-3`로 꽉 채워 텍스트 줄바꿈 방지 및 엄지 터치 영역 확대
  - 고시 기준일 및 1통화 환율 정보를 모바일 1행(`w-full flex items-center justify-between`)으로 독립 분리
  - 은행 우대율 바도 모바일에서 줄바꿈 왜곡 없이 컴팩트하게 정렬
- 단위/라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 완료

## [1.6.2] - 2026-09-07

### 디자인 및 UX 스타일 전면 통일 (UI/UX Alignment)
- **듀얼 인풋/아웃풋 카드 스타일 1:1 표준화 (`DualConverterCard` ↔ `DualExchangeCard`)**:
  - **출발(From) 카드**: 상단 라벨 및 우측 콤팩트 셀렉트(`h-8 text-xs font-bold`), 하단 무경계 대형 숫자 인풋(`text-2xl sm:text-3xl font-extrabold tabular-nums`) 레이아웃 완전 일원화
  - **도착(To) 카드**: Near-black(`bg-[#15171a] text-white rounded-2xl`) 다크 하이라이트 카드 통일, 결과값 복사 버튼(Tooltip 안내 및 복사 완료 피드백) 및 우측 다크 셀렉트 드롭다운 배치 통일
  - **중앙 맞바꾸기(Swap) 버튼**: 원형 버튼 디자인 및 Tooltip 안내(`단위 맞바꾸기 / 통화 맞바꾸기`) 완벽 일치
- **전체 일괄 환산표 그리드 구조 통일 (`MultiResultGrid` ↔ `MultiExchangeGrid`)**:
  - **헤더 규격**: 좌측 타이틀 및 보조 설명문구, 우측 기준값 안내 배지(`기준: 84 ㎡` / `기준: 100 USD`) 양 화면 공통 적용
  - **카드 레이아웃**: 상단(라벨/기호 + 우측 Tooltip 복사 버튼)과 하단(대형 볼드 수치 + 우측 단위 기호) 2단 분할 레이아웃으로 100% 동일화
  - 활성 카드(`bg-slate-50 border-[#15171a]`)와 일반 카드(`bg-white border-[#e5e7eb]`) 테두리 및 룩앤필 일치화
- 단위 및 라우팅 테스트 33개 전체 통과 및 프로덕션 빌드 검증 완료

## [1.6.1] - 2026-09-07

### 개선 및 기능 추가 (Improved & Added)
- **환율 고시 기준일 표시 및 백그라운드 자동 최신화 (Auto-Sync)**:
  - 듀얼 환율 카드 상단에 **고시 기준일(예: `고시 기준: 2026.09.07`)** 및 실시간 연동 상태 인디케이터 제공
  - 페이지 진입 시 글로벌 공시 환율 API(`open.er-api.com`)를 통한 백그라운드 비동기 자동 갱신 및 캐싱 적용
  - 네트워크 단절(오프라인 PWA) 시에도 캐시 및 기본 고시 환율을 통해 100% 끊김 없는 동작 보장
- **환율 데이터 출처 및 법적 고지 안내문(Disclaimer) 추가**:
  - 하단 안내 카드에 글로벌 공시 매매기준율 출처 명시
  - 은행별 환전 시점, 거래 지점, 우대 쿠폰 등에 따른 실제 체결 금액과의 차이 발생 가능성 및 최종 거래 전 금융기관 확인 권고 안내문 반영 (문구 내 컬러 이모지 전면 배제)
- 단위 테스트(`exchangeCalculator.test.ts`) 동적 환율 매핑 검증 추가 (총 33개 테스트 전체 통과)

## [1.6.0] - 2026-09-07

### 신규 기능 추가 (Added)
- **환율 계산기(Currency Exchange) 신규 모듈 구현 및 서비스 런칭 (`/exchange`)**:
  - **6대 핵심 통화 지원**: 대한민국 원(`KRW`), 미국 달러(`USD`), 일본 엔(`JPY 100엔당`), 유럽 유로(`EUR`), 중국 위안(`CNY`), 영국 파운드(`GBP`)
  - **오프라인 100% 동작 보장 (PWA)**: 신뢰도 높은 기본 기준 환율을 내장하여 인터넷 연결이 없는 상태에서도 정상 환산
  - **은행 환전 수수료 & 우대율(스프레드) 시뮬레이터**:
    - 거래 유형(매매기준율, 현찰 살 때, 현찰 팔 때) 지원
    - 우대율(0%, 50%, 80%, 90%) 선택 및 우대 혜택으로 절약된 수수료 금액 실시간 계산 및 시각적 하이라이트
  - **모바일 퍼스트 UX**:
    - 대형 24px 라운드 듀얼 환율 카드 및 원터치 통화 맞바꿈(`⇄ Swap`) 버튼
    - 여행 및 해외 직구 퀵 프리셋 칩 (`$100`, `$200 면세`, `10,000엔`, `€100`, `100만원`)
    - 전체 6대 통화 일괄 실시간 비교 그리드 (`MultiExchangeGrid`)
    - 환전 상식 및 면세 유의사항 안내 카드 (문구 내 컬러 이모지 배제 원칙 엄수)
  - `LocalStorage` 자동 저장/복원 및 브라우저 타이틀 동적 연동
  - PRD 공통화(모바일 퍼스트 및 디자인 시스템 상위 섹션 통합) 및 단위 테스트 추가 (총 32개 테스트 통과)

## [1.5.5] - 2026-09-07

### 개선 및 명칭 표준화 (Improved & Refined)
- **페이지 타이틀 및 개별 계산기 국문 명칭에서 '스마트' 수식어 제거**:
  - 단위 변환기의 공식 명칭 및 페이지 브라우저 타이틀을 `스마트 단위 변환기` ➔ `단위 변환기`로 간결화
  - `연복리 & 자산성장 계산기`, `실시간 환율 계산기` 등과 같이 도구 본래의 직관적 명칭으로 통일성 확보
  - 글로벌 브랜딩을 위한 영문 표기(`Smart Calculator Hub`, `Smart Calculator`)는 유지
  - PRD 명세 및 라우팅 단위 테스트(`App.routing.test.tsx`) 동기화

## [1.5.4] - 2026-09-07

### 스타일 및 UI 정밀 보정 (Style & Refined)
- **한글 텍스트 세로 중앙 정렬(광학적 중심선) 미세 조정**:
  - Pretendard 한글 폰트의 라틴 baseline 여백으로 인한 상단 들뜸 현상을 해소하기 위해 `leading-normal` 및 미세 baseline 패딩(`pt-[0.5px]` ~ `pt-[1px]`) 적용
  - 사이드바 로고 텍스트, 메뉴 네비게이션 버튼, 글로벌 헤더 타이틀, 단위 탭, 프리셋 칩, 셀렉트 트리거 등 전역 컴포넌트 세로 정렬 최적화
- **컬러 이모지 전면 배제 및 단색 시스템 벡터 아이콘 원칙 확립**:
  - 알록달록한 유니코드 컬러 이모지(💡 등)를 UI에서 전면 배제하고, 통일된 모노크롬 Lucide 벡터 아이콘(`Info` 등)으로 시각적 완성도 및 가독성 향상
  - 단위 변환기 하단 대한민국 부동산 및 일상 안내 카드에 단색 `<Info />` 벡터 아이콘 배치

## [1.5.3] - 2026-09-07

### 개선 및 기능 추가 (Improved & Added)
- **단위 변환기 카테고리별 1순위 생활 프리셋 및 기본 도착 단위 표준화**:
  - `CATEGORY_DEFAULTS` 설정을 구축하여 탭 전환 시 가장 대표적인 생활 질문 시나리오로 자동 세팅:
    - **넓이**: `84㎡` ➔ `평` (국민평형 84㎡는 몇 평일까?)
    - **길이**: `1인치` ➔ `cm` (1인치는 몇 cm일까?)
    - **무게**: `순금 1돈` ➔ `g` (금 1돈은 몇 g일까?)
    - **부피**: `1갤런(US)` ➔ `L` (1갤런은 몇 리터일까?)
    - **온도**: `체온 36.5℃` ➔ `℉` (정상 체온 36.5도는 화씨 몇 도일까?)
  - 프리셋 칩 선택 시 도착 단위 중복 방지 및 상호 단위 스마트 전환 로직 보강
  - 카테고리별 기본값 매핑 유닛 테스트 추가 (총 27개 테스트 통과)

## [1.5.2] - 2026-09-07

### 개선 및 리팩터링 (Improved & Refactored)
- **shadcn/ui `Select` 컴포넌트 전면 도입 및 네이티브 select 태그 대체**:
  - `@radix-ui/react-select` 기반 모듈형 컴포넌트 구축 (`src/components/ui/select.tsx`)
  - Ghost 디자인 시스템의 Hairline 테두리, 둥근 모서리, 다크/라이트 양방향 테마 스타일링 적용
  - **스마트 단위 변환기 (`DualConverterCard.tsx`)**: 출발 단위(From) 및 도착 단위(To) 드롭다운을 shadcn Select로 마이그레이션
  - **연복리 계산기 (`CalculatorForm.tsx`)**: 복리 주기 및 이자소득 과세 체계 드롭다운을 shadcn Select로 마이그레이션
  - `select.test.tsx` 단위 테스트 작성 및 통과 (총 26개 테스트 전체 통과)

## [1.5.1] - 2026-09-07

### 개선 및 리팩터링 (Improved & Refactored)
- **전역 설정 파일(`src/config/site.ts`) 도입 및 사이트 브랜딩 명칭 전면 통일**:
  - `siteConfig` 객체를 신설하여 국문 사이트명(`스마트 계산기 허브`), 영문 사이트명(`Smart Calculator Hub`), 앱/쇼트명(`스마트 계산기`), 영문 서브타이틀(`Smart Calculator`), 카피라이트(`© sosoFactory`) 등을 단일 공급원으로 표준화
- **사이드바 로고 영역 수직 중앙 정렬(Vertical Center) 보정**:
  - 검은색 계산기 아이콘(`w-9 h-9`)과 우측 2줄 텍스트 블록의 세로 중심선을 완벽히 수직 중앙으로 일치
  - 불필요한 'Ghost Design Edition' 수식어를 제거하고 직관적인 영문 서브타이틀(`Smart Calculator`)로 정돈
- **사이드바 푸터 카피라이트 반영**:
  - Ghost 문구 배제 및 공식 카피라이트 표기 (`© sosoFactory • 스마트 계산기 v1.5.1`)
- **전역 타이틀 헬퍼 및 메타데이터 동기화**:
  - `GlobalHeader.tsx`, `CompoundInterestApp.tsx`, `UnitConverterApp.tsx`, `index.html`에 `siteConfig` 전면 연동
  - `site.test.ts` 단위 테스트 작성 완료 (총 25개 테스트 통과)

## [1.5.0] - 2026-09-07

### 추가 (Added)
- **스마트 단위 변환기 (Unit Converter) 전면 구현 및 라우팅 연동 (`/unit`)**:
  - **5대 카테고리 실시간 변환 지원**: 넓이(면적), 길이, 무게(질량), 부피(용량), 온도
  - **부동산 특화 평수 ↔ ㎡ 원클릭 변환**: 아파트 84㎡(25.4평), 59㎡(17.8평), 114㎡ 등 국민평형 프리셋 탑재
  - **한국 생활 밀착 단위 지원**: 순금 1돈(3.75g), 육류 1근(600g), 자/척(尺) 등
  - **대형 듀얼 인터랙티브 변환 카드 (`DualConverterCard`)**: 출발 단위 입력 및 도착 단위 실시간 환산, 원터치 맞바꿈(Swap `⇄`), 소수점 정밀도(0, 2, 4, 6자리) 선택, 기준 공식 가이드
  - **전체 단위 일괄 변환표 (`MultiResultGrid`)**: 한 번의 입력으로 카테고리 내 모든 단위로 실시간 동시 변환 및 원클릭 복사(`Copy`) 지원
  - **모바일 퍼스트 가로 스크롤 카테고리 탭 (`UnitCategoryTabs`)**: 터치 친화적 UI 및 좁은 뷰포트 최적화
  - **Ghost 디자인 시스템 완벽 적용**: Near-black (`#15171a`), Electric Lime (`#d1ff19`), Flat Hairline (`#e5e7eb`), 24px Round Card
  - **단위 변환 엔진 TDD 테스트 완료**: 11개 단위 변환 검증 테스트 추가 (총 23개 테스트 통과)
  - **LocalStorage 데이터 지속성**: 최근 사용 카테고리, 단위, 입력값 자동 저장 및 복원

## [1.4.1] - 2026-09-07

### 수정 및 개선 (Fixed & Improved)
- **사이드바-글로벌 헤더 하단 보더 라인 수평 정렬 일치**:
  - 좌측 사이드바 로고 영역과 우측 글로벌 헤더 영역의 높이를 `h-16 (64px)` 및 `flex items-center`로 통일하여 헤더 하단 구분선(`border-b`)의 단차 및 수평선 불일치 완벽 해소
- **연복리 차트 단순화**:
  - 단일 모드에서 불필요한 '영역형 / 선형' 토글 버튼을 제거하고, 누적 원금과 순이자 추이를 직관적으로 보여주는 단일 영역형 차트(`AreaChart`)로 고정
- **연 예상 수익률 프리셋 UI 정리**:
  - 수익률 프리셋 버튼(`RATE_PRESETS`) 내 불필요한 아이콘을 배제하고 수치/라벨 텍스트 중심으로 직관적 정돈

## [1.4.0] - 2026-09-07

### 추가 및 변경 (Added & Changed)
- **Ghost 디자인 시스템(`ghost.design.md`) 전면 도입 및 shadcn/ui 표준 토큰 개편**:
  - 기존 Teal 디자인 시스템을 완전히 버리고 Ghost 특유의 미니멀리즘 및 에디토리얼 스타일로 전면 교체
  - **Electric Lime (`#d1ff19`)**: 12px 대문자 트래킹 아이브로우 및 뱃지 포인트로 절제된 볼티지 적용
  - **Near-Black CTA (`#15171a`)**: 화이트 텍스트, 6px 둥근 모서리, 39px 규격의 시그니처 버튼 적용
  - **Deep Teal-Ink (`#112220`)**: 헤드라인 및 주요 텍스트 색상 적용
  - **Flat Hairline (`#e5e7eb`, `#1f2937`)**: 그림자를 배제하고 플랫한 헤어라인 테두리 중심의 깊이감 구현
  - **Shapes**: 메인 카드 표면에 Ghost 사양의 24px 대형 둥근 모서리(`rounded-[24px]`) 전면 적용
  - **Pretendard Variable 웹폰트 전면 유지**: 한글 및 금융 숫자의 가독성을 극대화하며 Ghost 타이포그래피 비율과 결합
  - **Recharts 시각화 테마**: Ghost 다크 대시보드 밴드 스타일과 라임/라벤더 데이터 라인 적용
  - shadcn 컴포넌트(`Button`, `Card`, `Badge`, `Input`, `Slider`, `Table`, `Tooltip`, `Sheet`) Ghost 토큰 마이그레이션 완료

## [1.3.0] - 2026-09-07

### 추가 및 변경 (Added & Changed)
- **PWA (Progressive Web App) 도입 및 오프라인 지원**:
  - `vite-plugin-pwa` 및 Workbox 서비스 워커 자동 등록 (`dist/sw.js`)
  - Web App Manifest (`dist/manifest.webmanifest`): 192x192, 512x512 고해상도 앱 아이콘 및 maskable 규격 적용
  - 정적 자산(JS, CSS, HTML, 폰트, SVG) 오프라인 프리캐싱으로 네트워크 단절 시에도 모든 계산기 기능 즉시 작동
  - iOS 홈 화면 바로가기 지원 (`apple-mobile-web-app-capable`, `apple-touch-icon`)
  - 안드로이드/데스크톱 브라우저 "앱으로 설치" 및 독립 창(`standalone`) 실행 환경 완벽 지원
- **shadcn/ui 툴팁(Tooltip) 컴포넌트 전면 도입 및 네이티브 title 속성 대체**:
  - `@radix-ui/react-tooltip` 기반 shadcn `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` 구축
  - TDD 단위 테스트 작성 (`src/components/ui/tooltip.test.tsx`)
  - 브라우저 기본 `title` 속성을 제거하고 세련된 다크 테마 플로팅 툴팁 및 접근성(`aria-label`)으로 전면 교체 (기본값 초기화 버튼, 자산 구성 비율 게이지, 모바일 햄버거 메뉴, 상세 흐름표 토글 버튼 등)

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
