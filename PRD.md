# [PRD] 모바일 우선 스마트 멀티 계산기 플랫폼 (Smart Calculator Hub)

## 1. 프로젝트 개요

- **프로젝트명**: 스마트 멀티 계산기 허브 (Smart Calculator Hub)
- **목적**: 일상과 금융 생활에서 자주 필요한 다양한 계산 도구들을 한곳에 모아 모바일과 데스크톱에서 빠르고 직관적으로 사용할 수 있도록 제공하는 모듈형 계산기 포털 웹 애플리케이션
- **핵심 가치**:
  - **원스톱 계산 허브**: 연복리, 단위 변환, 환율 계산 등 필수 계산기들을 탭/메뉴 전환으로 손쉽게 이용
  - **모바일 퍼스트(Mobile-First) UX**: 한 손 터치에 최적화된 하단 네비게이션/상단 스크롤 탭 및 빠른 입력 패드
  - **확장 가능한 모듈형 아키텍처**: 새로운 계산기(대출 이자, 적금, 연봉 실수령액 등)를 언제든 플러그인 형태로 추가 가능한 구조
  - **데이터 지속성**: 각 계산기별 최근 입력값 및 설정을 브라우저 `LocalStorage`에 개별 저장/유지

---

## 2. 제품 아키텍처 및 네비게이션 구조

### 2.1 좌측 네비게이션 시스템 (Left Sidebar & Drawer)
- **메뉴 확장성 최적화**: 향후 계산기 도구가 10개 이상 늘어나더라도 스크롤 가능한 세로 목록으로 깔끔하게 확장 대응.
- **모바일 뷰포트 (360px ~ 768px)**:
  - 상단 좌측 햄버거 메뉴 버튼(`Menu`) 터치 시 좌측에서 부드럽게 슬라이드인되는 **좌측 오버레이 드로어(Slide-over Drawer)**.
  - **슬라이드 애니메이션 및 오버레이 페이드 규격**:
    - 열림(Open): 300ms 이징(`cubic-bezier(0.16, 1, 0.3, 1)` 감속 곡선)으로 좌측 바깥(`translateX(-100%)`)에서 스르륵 부드럽게 진입.
    - 닫힘(Close): 250ms 가속 곡선으로 좌측 바깥으로 자연스럽게 퇴장.
    - 딤드(Dimmed) 배경 오버레이: 300ms 동안 `opacity 0 ➔ 1`로 페이드인되며 배경 블러(`backdrop-blur-xs`) 연출.
    - CSS 키프레임 기반 하드웨어 가속(`transform: translate3d`)을 적용하여 모바일 사파리 및 크롬 등 모든 모바일 브라우저에서 60fps 이상의 부드러운 전환 보장.
  - 카테고리별(금융/투자, 생활/측정, 통화/글로벌) 그룹화 및 직관적인 아이콘 버튼 형태.
  - 드로어 외부 터치 또는 항목 선택 시 자동 닫힘.
- **데스크톱 뷰포트 (1024px 이상)**:
  - 좌측 고정 사이드바(Width: 260px) + 우측 메인 콘텐츠 영역의 2열 레이아웃.
  - 사이드바 접기/펼치기(Collapse/Expand) 토글 지원으로 넓은 작업 공간 확보 가능.
- **전역 페이지 라우트 전환 페이드(Page Transition Fade) 규격**:
  - 계산기 간 화면 이동 시(예: 연복리 ↔ 단위 변환 ↔ 환율) 메인 콘텐츠 영역(`main`)이 즉시 전환되어 발생하는 시각적 이질감을 해소하고 모던 앱 경험을 제공함.
  - **애니메이션 사양**:
    - 불투명도: `opacity 0 ➔ 1`
    - 미세 모션: `translate3d(0, 4px, 0) ➔ translate3d(0, 0, 0)` (하단에서 부드럽게 안착)
    - 지속 시간 및 이징: 200ms `ease-out` (사용자 입력 지연이 없도록 신속하고 경쾌하게 전환)
    - React Router의 `location.pathname` 키 기반 재마운트 트랜지션 적용으로 데스크탑 및 모바일 전 기기에서 동일하게 동작 보장.
- **헤더 및 푸터 브랜딩/정렬 규격**:
  - **사이드바 로고 영역**:
    - 검은색 계산기 아이콘(`w-9 h-9`)과 우측 텍스트 묶음 간의 세로 중심선(Vertical Center) 정렬 보정
    - 불필요한 'Ghost Design' 수식어를 제거하고 직관적인 영문 서브타이틀(`Smart Calculator`)로 변경
    - 우측 글로벌 헤더 텍스트 블록과의 시각적 수직 중심 밸런스 유지
  - **사이드바 푸터**:
    - 'Ghost Design' 표기를 배제하고 공식 카피라이트 `© sosoFactory` 및 버전 정보 표기 (`© sosoFactory • 스마트 계산기 v1.5.0`)

### 2.2 공통 모바일 퍼스트(Mobile-First) 및 반응형 컨테이너 표준 규격
모든 계산기 모듈과 글로벌 네비게이션은 다음의 표준 규격을 공통으로 상속받아 일관성을 유지합니다:
- **헤더 엣지-투-엣지(Edge-to-Edge) 풀 와이드 및 본문 단일 컨테이너(`max-w-5xl`) 표준화**:
  - **글로벌 상단 헤더 (`GlobalHeader.tsx`)**: 뷰포트 좌우 끝까지 100% 확장되는 풀 와이드(`w-full px-4 sm:px-6`) 구조를 적용하여, 좌측 타이틀 영역과 우측 테마 토글 버튼이 화면 양 끝에 넉넉하고 시원하게 붙도록 배치.
  - **메인 본문 콘텐츠 (`App.tsx`의 `<main>`)**: 가독성과 안정감을 위해 일관된 `max-w-5xl w-full mx-auto` 단일 규격을 유지하여, 페이지 전환 시 본문 너비가 덜컹거리지 않음.
  - 개별 페이지 컴포넌트(`CompoundInterestApp.tsx`, `UnitConverterApp.tsx`, `ExchangeApp.tsx`) 내부의 불필요한 `max-w-4xl`, `max-w-5xl` 등 중복 제한을 제거하여, 페이지 이동 시 레이아웃 좌우 정렬선이 1px의 떨림도 없이 완벽하게 정렬되도록 일원화.
- **단일 열(Single Column) 흐름 최적화**: 좁은 모바일 화면(360px ~ 430px)에서 가로 스크롤 없이 엄지손가락 터치 반경 내에서 모든 인터랙션 완결.
- **상단 카테고리/모드 스와이프 탭**: 손쉬운 가로 스크롤/탭 전환 지원.
- **대형 인터랙티브 듀얼 카드(Dual Interactive Card) 표준 규격**:
  - 단위 변환기(`DualConverterCard.tsx`)와 환율 계산기(`DualExchangeCard.tsx`)의 From(입력)/To(결과) 영역의 구조, 배경색, 인풋 필드, 단위 선택 드롭다운, 타이포그래피를 동일한 규격으로 통일함:
    - **From (출발 입력 카드)**:
      - 컨테이너: `bg-slate-50/70 border border-[#e5e7eb] rounded-2xl p-4 focus-within:border-[#15171a] focus-within:bg-white transition-all`
      - 상단 행: 좌측 `text-xs font-bold text-[#64748b]` 라벨 + 우측 통일된 크기의 shadcn `Select` (단위/통화 선택)
      - 하단 행: 대형 `text-2xl sm:text-3xl font-extrabold text-[#112220] tabular-nums` 입력 필드 + 우측 심볼/단위 표시
    - **To (도착 결과 카드)**:
      - 컨테이너: 시각적 반전 및 하이라이트를 위해 `bg-[#15171a] text-white rounded-2xl p-4 border border-[#15171a]` 통일 적용 (환율 계산기의 밋밋한 화이트 인풋 박스를 단위 변환기와 동일한 다크 하이라이트 카드로 통일하거나, 두 화면의 테마 톤앤매너를 일관되게 단일 표준으로 맞춤)
      - 상단 행: 좌측 `text-xs font-bold text-[#d1ff19]` (Electric Lime 포인트 뱃지 + 결과 라벨) + 우측 복사 버튼 + 우측 다크 테마 shadcn `Select`
      - 하단 행: 대형 `text-2xl sm:text-3xl font-extrabold text-white tabular-nums` 결과값 + 우측 단위/심볼
    - **중앙 Swap 버튼**: `w-10 h-10 rounded-full border border-[#e5e7eb] bg-white hover:bg-slate-100 active:scale-95 shadow-2xs` 통일.
- **원클릭 퀵 프리셋 칩(Quick Preset Chips)**: 한국 사용자가 자주 찾는 대표 생활/여행/투자 시나리오를 탭 한 번으로 즉시 자동 입력.
- **모바일 좁은 화면(360px ~ 390px) 텍스트 깨짐 및 가로 넘침(Overflow) 방지 표준**:
  - **From / To 듀얼 카드 상단 헤더 반응형 분기**:
    - 모바일(가용 폭 270px 이하)에서 우측 컨트롤(복사 버튼 + 단위/통화 드롭다운 셀렉트)이 과도한 공간을 차지해 좌측 라벨 텍스트가 2~3줄로 찌그러지거나 잘리는 현상을 원천 방지함.
    - 라벨 텍스트 간결화: `입력 (From)`, `결과 (To)`로 통일 및 `text-[11px] sm:text-xs whitespace-nowrap` 적용.
    - 복사 버튼 규격 통일: 모바일에서는 텍스트("복사/복사완료") 대신 컴팩트 아이콘 버튼(`w-7 h-7`, `Tooltip` 피드백 내장)을 배치하여 가로 폭 40px 이상 절약.
    - 드롭다운 트리거 너비: 모바일 `w-28 sm:w-36 lg:w-44` 가변형 적용 및 `truncate`로 긴 단위/통화명이 넘치지 않도록 처리.
  - **통화/단위 선택기(CurrencySelect) 모바일 렌더링 최적화**:
    - `SelectTrigger` 내부 텍스트가 줄바꿈되어 컨트롤 높이가 무너지는 현상을 막기 위해, 모바일 트리거에서는 심볼과 코드가 우선적으로 깔끔하게 표시되도록 인라인 정렬 보정.
  - **전체 일괄 환산표 그리드(Multi-Result Grid) 모바일 헤더 재구성**:
    - 모바일(360px)에서 긴 타이틀("전체 주요 통화 실시간 일괄 환산")과 기준 배지(`기준: 1,350.00 KRW`)가 한 줄에 억지로 배치되어 타이틀이 글자 단위로 쪼개지는 현상 차단.
    - 헤더 레이아웃을 `flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between`으로 변경: 모바일 1행(타이틀 + 우측 기준 배지), 2행(보조 설명문구 전체 너비)으로 분리하여 가독성 및 시각적 안정성 극대화.
  - **환전 방식 탭 및 기준일/실시간 환율 바 모바일 최적화**:
    - 환전 방식 탭: 모바일에서 `w-full grid grid-cols-3 gap-1`로 시원하게 꽉 채워 텍스트 줄바꿈 방지 및 엄지 터치 영역 확보.
    - 기준일 및 1통화 환율 정보: 모바일에서 불규칙한 줄바꿈 없이 `w-full flex items-center justify-between text-[11px] pt-1`로 깔끔하게 1행 정리.
  - **은행 우대율 바 모바일 최적화**:
    - 모바일에서 우대율 배지와 4개 버튼(90%, 80%, 50%, 0%)이 줄바꿈으로 깨지지 않도록 `flex items-center justify-between gap-1` 및 버튼 폰트/패딩 최적화.
- **결과 원클릭 복사 및 피드백**: 계산된 핵심 결과를 탭 한 번으로 클립보드에 복사하고 시각적 복사 완료 피드백 제공.
- **안내 팁 카드 및 문구 작성 원칙**: 유용한 상식 및 팁을 안내할 때 텍스트나 문구에 컬러 이모지를 절대 넣지 않음.

### 2.3 공통 디자인 시스템 원칙 (Ghost Design System)
플랫폼 내 모든 UI 컴포넌트는 Ghost 디자인 시스템 사양을 전역 일관되게 적용합니다:
- **배경 및 서피스**: Warm White (`#ffffff`), Slate Hairlines (`border-[#e5e7eb]`, 그림자 배제 플랫 원칙), 24px 대형 둥근 모서리(`rounded-[24px]` / `rounded-3xl`).
- **인터랙션 및 버튼**: Near-black (`#15171a`, text `#ffffff`), 6px/8px 반경, 39px 높이 규격.
- **시그니처 포인트**: Electric Lime (`#d1ff19`) - 상단 12px uppercase 볼드 아이브로우 및 뱃지 포인트로 제한적/절제된 사용.
- **타이포그래피 & 수직 정렬**: Pretendard Variable 폰트, Tabular Numbers(고정폭 숫자), 한글 수직 중앙(Vertical Center) 정렬 보정(`leading-normal` 및 미세 baseline 패딩).
- **모듈형 UI 컴포넌트**: shadcn/ui 기반 표준 토큰 컴포넌트(Button, Select, Input, Badge, Tooltip, Sheet).

### 2.4 모듈형 컴포넌트 아키텍처
```text
src/
├── calculators/
│   ├── compound-interest/   # 1. 연복리 & 자산 성장 계산기
│   ├── unit-converter/      # 2. 단위 변환기 (평수 ↔ ㎡ 등)
│   ├── exchange-rate/       # 3. 환율 계산기 (실시간/기준 환율 및 우대율)
│   ├── loan-interest/       # 4. [추천] 대출 이자 및 상환 방식 비교 계산기
│   ├── dividend/            # 5. [추천] 배당금 및 월 배당 현금흐름 계산기
│   └── goal-planner/        # 6. [추천] 목표 자산 역산(얼마씩 모아야 할까) 계산기
├── components/              # LeftSidebar, GlobalHeader, Layout, ThemeToggle
├── context/
│   └── ThemeContext.tsx     # 전역 테마 상태 (light/dark/system) 관리 Context
├── config/
│   └── site.ts              # 사이트 전역 브랜드 명칭, 타이틀, 카피라이트 SSOT
└── ...
```

### 2.5 전역 다크 모드 시스템 사양 (Dark Mode Architecture & UX)
- **테마 모드 지원 및 상태 관리**:
  - `light` (라이트 모드), `dark` (다크 모드), `system` (OS 시스템 설정 자동 동기화) 3가지 모드 지원.
  - 최초 진입 시: 사용자 로컬 스토리지(`localStorage.getItem('theme')`) 설정을 우선하며, 저장된 값이 없을 경우 OS 환경(`window.matchMedia('(prefers-color-scheme: dark)')`)을 감지하여 자동 적용.
  - 상태 지속성: 테마 변경 시 `localStorage`에 즉시 저장하고, 루트 `<html>` 태그에 `.dark` 클래스를 토글하여 Tailwind CSS의 `darkMode: 'class'`와 연동.
  - 시스템 테마 실시간 반응: 사용자가 시스템 모드를 사용하는 경우, OS 테마 변경 이벤트 리스너를 통해 즉시 테마 동기화.
- **테마 토글 인터페이스 (Theme Toggle Interface)**:
  - **글로벌 헤더 우측 상단 단일 배치**: 모바일 및 데스크톱 뷰포트 전반에서 항시 즉시 접근 가능한 우측 액션 영역 1곳에만 일원화하여 불필요한 UI 중복 배제.
  - **shadcn UI 표준 모드 토글 버튼 (Icon Toggle Button) 사양**:
    - 컴포넌트: shadcn UI `Button` (`variant="outline"`, `size="icon"`, `w-9 h-9`) 기반.
    - 아이콘 모션 연출:
      - 라이트 모드: `Sun` 아이콘 표시 (`rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`).
      - 다크 모드: `Moon` 아이콘 표시 (`rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute`).
      - 회전 및 스케일 트랜지션으로 시각적 완성도와 경쾌한 반응성 제공.
    - 접근성 및 터치 최적화: `aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}`, shadcn Tooltip 안내.
- **다크 모드 컬러 팔레트 및 토큰 규격 (Ghost Dark Theme)**:
  - **메인 뷰포트 배경**: `dark:bg-[#0f172a]` (Slate 900)
  - **카드 및 컴포넌트 서피스**: `dark:bg-[#1e293b]` (Slate 800)
  - **사이드바 & 글로벌 헤더**: `dark:bg-[#0b1120]`, `dark:border-slate-800`
  - **테두리 선(Hairlines)**: `border-[#e5e7eb]` ➔ `dark:border-slate-700/80`
  - **기본 텍스트**: `#112220` ➔ `dark:text-slate-100`, 서브 텍스트: `dark:text-slate-400`
  - **인풋/셀렉트 폼 컨트롤**: `dark:bg-slate-900/60`, `dark:border-slate-700`, `dark:text-white`
  - **Ghost 시그니처 Lime (`#d1ff19`)**: 다크 모드에서 한층 높은 대비와 가독성을 발휘하여 배지, 아이브로우, 토글 하이라이트에 그대로 적용.
  - **차트(Recharts) 시각화 적응**: 다크 모드 전환 시 그리드선 색상(`rgba(255,255,255,0.08)`), 축 라벨 텍스트 색상(`dark:text-slate-400`), 툴팁 배경(`dark:bg-slate-800 dark:border-slate-700`)이 자동으로 가독성 높게 조정.
- **모바일 퍼스트 UX 고려사항**:
  - 야간 및 저조도 환경에서 눈부심 없는 최적의 명암비(WCAG AA 기준 준수) 확보.
  - 테마 전환 시 화면 전체가 깜빡이거나 튀지 않도록 부드러운 CSS 배경색/텍스트 트랜지션 적용.

---

## 3. 계산기 모듈별 상세 기능 명세

### 3.1 [금융/투자] 연복리 & 자산 성장 계산기 (Compound Interest - 구현 완료)
- **기능 요약**: 초기 원금, 정기 적립금, 복리 주기, 한국형 세금 체계를 반영한 자산 증식 시뮬레이터.
- **주요 기능**:
  - 월초/연초 정기 적립식 복리 산출.
  - 복리 주기 (월복리, 연복리, 분기복리, 일복리).
  - 과세 체계 (일반과세 15.4%, 비과세 0%, ISA 9.9%, 직접입력).
  - 하락장/손실 시뮬레이션 (-30% ~ +50% 및 손실 시 세금 0원 면제).
  - 시나리오 A / B 듀얼 오버레이 비교 차트 및 격차 분석.
  - Recharts 기반 인터랙티브 시각화 대시보드 & CSV 내보내기:
    - 단일 시나리오 모드: 직관적인 누적 영역형 차트(AreaChart)로 고정 (불필요한 선형 토글 제거로 UX 단순화).
    - 비교 모드: 두 시나리오 간 추이를 직관적으로 대조하는 멀티 라인 차트(LineChart) 유지.
  - 입력 폼 사용성 최적화:
    - 연 예상 수익률 프리셋 버튼: 불필요한 시각적 아이콘을 배제하고 직관적인 텍스트 라벨 중심으로 정리.
  - 레이아웃 및 헤더 정렬 규격:
    - 좌측 사이드바 로고 영역과 우측 글로벌 헤더 영역의 높이를 `h-16 (64px)`로 동일하게 고정하여 하단 구분선(border-b)의 수평선 불일치 완벽 해소.

### 3.2 [생활/측정] 단위 변환기 (Unit Converter - 구현 완료)
- **기능 요약**: 일상 생활, 부동산 거래, 직구 및 해외 규격에서 자주 쓰이는 단위를 실시간으로 상호 변환하고, 모든 관련 단위 결과를 한눈에 확인할 수 있는 올인원 변환기.
- **주요 기능 명세**:
  - **카테고리별 1순위 대표 생활 프리셋 & 기본 도착 단위 자동 설정**:
    - **넓이(면적)**: 출발 `84㎡` ➔ 도착 `평` (국민평형 84㎡는 몇 평일까?)
    - **길이**: 출발 `1in (인치)` ➔ 도착 `cm` (1인치는 몇 cm일까?)
    - **무게**: 출발 `1돈 (순금)` ➔ 도착 `g` (금 1돈은 몇 g일까?)
    - **부피**: 출발 `1gal (갤런)` ➔ 도착 `L` (1갤런은 몇 리터일까?)
    - **온도**: 출발 `36.5℃ (체온)` ➔ 도착 `℉` (체온 36.5도는 화씨 몇 도일까?)
  - 소수점 정밀도 선택기 (0, 2, 4, 6자리) 및 전체 관련 단위 일괄 실시간 변환표 제공.
- **지원 카테고리 및 상세 단위**:
  1. **넓이/면적 (부동산 특화)**:
     - **평(坪) ↔ 제곱미터(㎡)**: 아파트 공급/전용면적 원클릭 변환 (1평 = 3.305785㎡, 1㎡ ≈ 0.3025평)
     - 제곱미터(㎡), 평(坪), 제곱센티미터(㎠), 제곱킬로미터(㎢), 헥타르(ha), 에이커(ac), 제곱피트(ft²), 제곱야드(yd²)
     - *한국형 추천 프리셋*: 84㎡(국민평형 25.4평), 59㎡(소형 17.8평), 114㎡(대형 34.5평), 10평, 20평, 34평
  2. **길이**:
     - 센티미터(cm), 미터(m), 킬로미터(km), 인치(in), 피트(ft), 야드(yd), 마일(mi), 밀리미터(mm), 자/척(尺, 약 30.3cm)
     - *한국형 추천 프리셋*: 1인치(2.54cm), 1피트(30.48cm), 1마일(1.61km), 100m, 키 175cm
  3. **무게/질량**:
     - 그램(g), 킬로그램(kg), 톤(t), 파운드(lb), 온스(oz), 돈(3.75g, 금/귀금속 특화), 근(600g, 고기/채소 특화)
     - *한국형 추천 프리셋*: 순금 1돈(3.75g), 순금 10돈(1냥), 고기 1근(600g), 1파운드(453.6g)
  4. **부피/용량**:
     - 밀리리터(mL), 리터(L), 세제곱미터(㎥), 갤런(gal, US 액량 3.785L), 배럴(bbl, 원유 158.98L), 플루이드 온스(fl oz)
     - *한국형 추천 프리셋*: 종이컵 180mL, 생수병 500mL, 1리터, 1갤런
  5. **온도**:
     - 섭씨(℃), 화씨(℉), 켈빈(K)
     - 비선형/오프셋 변환 공식 적용: \(℉ = ℃ \times 1.8 + 32\), \(K = ℃ + 273.15\)
     - *한국형 추천 프리셋*: 체온 36.5℃, 실온 20℃, 물 끓는점 100℃, 화씨 100℉

### 3.3 [통화/글로벌] 환율 계산기 (Currency Exchange - 구현 단계)
- **기능 요약**: 글로벌 주요 6대 통화 간 금액을 기준 환율 및 은행 환전 수수료/우대율(Spread Discount)을 반영하여 즉시 상호 환산하는 계산기.
- **오프라인 100% 동작 & 기준 환율 구조 (PWA 원칙)**:
  - 오프라인 무인터넷 환경에서도 100% 독립 동작하도록 최신 고시 매매기준율(USD, JPY, EUR, CNY, GBP 등)을 기본 내장.
  - 네트워크 연결 시 최신 환율 갱신 기능(선택적) 및 사용자가 직접 원하는 기준 환율을 수정/입력할 수 있는 **'환율 직접 수정(커스텀 환율)'** 모드 지원.
- **지원 통화 (6대 핵심 통화)**:
  1. `KRW`: 대한민국 원 (기본 기준 통화)
  2. `USD`: 미국 달러 (세계 기축 통화)
  3. `JPY`: 일본 엔 (100엔당 표기 및 환산 자동 계산)
  4. `EUR`: 유럽연합 유로
  5. `CNY`: 중국 위안
  6. `GBP`: 영국 파운드
- **도구 고유 기능 명세**:
  1. **은행 환전 수수료 및 우대율(스프레드) 시뮬레이터**:
     - 거래 방식 선택:
       - **매매기준율**: 수수료 없는 순수 시장 기준 환율
       - **현찰 살 때 (살 때 환율)**: 여행/출국 전 외화 현찰을 살 때
       - **현찰 팔 때 (팔 때 환율)**: 귀국 후 외화 현찰을 원화로 바꿀 때
       - **송금 보낼 때 / 받을 때**: 전신환 기준
     - **환전 우대율(Spread Discount) 프리셋 버튼**:
       - `90% 우대 (주요 은행 모바일 앱 환전)`
       - `80% 우대`
       - `50% 우대`
       - `0% 우대 (공항 환전소 등 기본 수수료 100% 적용)`
     - 절약된 환전 수수료(우대 혜택 금액)를 직관적으로 비교 표시.
  2. **자주 찾는 여행/직구 퀵 프리셋 칩(Quick Preset Chips)**:
     - `USD $100` (여행 비상금)
     - `USD $200` (해외 직구 면세 한도)
     - `JPY 10,000엔` (일본 1만엔 지폐)
     - `EUR 100유로`
     - `KRW 100만원`
  3. **전체 통화 일괄 실시간 환산 그리드 (Multi-Currency Grid)**:
     - 현재 입력된 금액 기준으로 나머지 5개 통화가 각각 얼마인지 한눈에 일목요연하게 비교 카드 형태로 실시간 표시.
  4. **환전 상식 및 면세 유의사항 안내 카드**:
     - 공항 환전 vs 모바일 앱 환전 팁, 미국 여행 면세 기준 등 유용한 팁 제공 (문구에 컬러 이모지 배제).
  5. **환율 기준일 표시 및 자동 최신화 (Auto-Sync & Stale-While-Revalidate)**:
     - 페이지 진입 시 신뢰도 높은 글로벌 기준 매매 환율(open.er-api.com / Frankfurter)을 백그라운드에서 자동 비동기 패치하여 최신화.
     - 듀얼 카드 상단에 **고시 기준일(예: `기준일: 2026.09.07 11:00`)** 표시.
     - 오프라인 환경에서는 저장된 캐시 및 기본 고시 환율로 100% 정상 작동.
  6. **데이터 출처 및 환율 유의사항 고지 안내 (Disclaimer)**:
     - "본 계산기의 환율은 글로벌 공시 매매기준율을 바탕으로 산출된 참고용 정보이며, 실제 은행별 환전 시점, 거래 지점, 모바일 앱 우대 조건 및 환율 변동에 따라 실제 적용 금액과 차이가 발생할 수 있습니다." 명시.

### 3.4 [금융/투자 - 추천 계산기 라인업]
1. **대출 이자 및 상환 계산기 (Loan Calculator)**:
   - 원리금균등, 원금균등, 만기일시상환 3대 상환 방식을 한눈에 비교.
   - 대출금, 금리, 기간, 거치기간 입력 시 월 상환액과 총 대출이자 계산.
2. **배당금 및 월 현금흐름 계산기 (Dividend Calculator)**:
   - 보유 주식수, 주당 배당금, 배당 주기(월/분기/연) 입력.
   - 월별 배당 캘린더 및 배당소득세(15.4%) 차감 후 실수령액 계산.
3. **목표 자산 달성 역산 계산기 (Goal Planner)**:
   - "N년 후 1억/5억/10억을 모으려면 매월 얼마씩 투자해야 할까?" 역산.

### 3.4 향후 확장 예정 모듈 (Roadmap)
- 대출 이자 계산기 (원리금균등, 원금균등, 만기일시상환 비교)
- 예·적금 만기 수령액 계산기
- 연봉 실수령액 계산기

---

## 4. 데이터 모델

### 4.0 사이트 전역 설정 모델 (`src/config/site.ts`)
사이트 전반에서 일관된 브랜딩, 타이틀, 카피라이트 및 메타데이터를 유지하기 위한 단일 진실 공급원(Single Source of Truth) 설정:
```typescript
export interface SiteConfig {
  name: string;           // '스마트 계산기 허브' (공식 국문 명칭)
  nameEn: string;         // 'Smart Calculator Hub' (공식 영문 명칭)
  shortName: string;      // '스마트 계산기' (모바일/PWA 쇼트 명칭)
  shortNameEn: string;    // 'Smart Calculator' (사이드바 영문 서브타이틀)
  description: string;    // 사이트 대표 설명
  company: string;        // 'sosoFactory'
  copyright: string;      // '© sosoFactory'
  version: string;        // '1.5.0'
  url?: string;
  links: {
    github?: string;
  };
  getTitle: (pageTitle?: string) => string;
}
```

### 4.1 글로벌 네비게이션 타입
```typescript
export type CalculatorType = 'compound' | 'unit' | 'exchange';

export interface CalculatorMeta {
  id: CalculatorType;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badge?: string;
}
```

### 4.2 단위 변환 데이터 모델
```typescript
export type UnitCategory = 'area' | 'length' | 'weight' | 'volume' | 'temperature';

export interface UnitDefinition {
  id: string;          // 예: 'sqm', 'pyeong', 'cm', 'kg'
  name: string;        // 예: '제곱미터', '평', '센티미터'
  symbol: string;      // 예: '㎡', '평', 'cm'
  category: UnitCategory;
  ratioToBase: number; // 카테고리 기준 단위 대비 1단위의 비율 (단, 온도는 별도 공식 사용)
  description?: string;// 예: '아파트 전용면적 기준', '순금 1돈 = 3.75g'
}

export interface UnitConversionResult {
  unit: UnitDefinition;
  value: number;
  formattedValue: string;
}

export interface QuickPreset {
  label: string;
  category: UnitCategory;
  unitId: string;
  value: number;
  badge?: string;
}
```

### 4.3 환율 계산 데이터 모델 (`src/types/exchange.ts`)
```typescript
export type CurrencyCode = 'KRW' | 'USD' | 'JPY' | 'EUR' | 'CNY' | 'GBP';

export interface CurrencyItem {
  code: CurrencyCode;
  name: string;        // '대한민국 원', '미국 달러' 등
  symbol: string;      // '₩', '$', '¥', '€', '£'
  flag: string;        // 단색/텍스트 코드 또는 국가 식별자
  baseRateToKRW: number; // 1단위(JPY는 100엔)당 KRW 기준 환율
  baseUnit: number;    // 기본 1 (JPY는 100)
  spreadRate: number;  // 은행 표준 현찰 스프레드율 (기본 약 1.75% ~ 2.0%)
}

export type ExchangeType = 'base' | 'cash_buy' | 'cash_sell' | 'send' | 'receive';

export type SpreadDiscount = 0 | 50 | 80 | 90 | 100;

export interface ExchangePreset {
  label: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  amount: number;
  description: string;
}

export interface ExchangeResult {
  convertedAmount: number;
  appliedRate: number;
  spreadFee: number;
  discountSaved: number;
}
```

---

## 5. 기술 스택 및 아키텍처

- **빌드 도구**: Vite
- **PWA (Progressive Web App)**: `vite-plugin-pwa`
  - 모바일 홈 화면 설치(Add to Home Screen / A2HS) 및 독립 실행형(`display: standalone`) 앱 지원
  - 서비스 워커(Service Worker) 기반 정적 자산 캐싱을 통한 **오프라인 무인터넷 환경 100% 동작 보장**
  - Web App Manifest (`manifest.webmanifest`), 테마 색상(`theme-color`), Apple 터치 아이콘 지원
- **프론트엔드**: React 18, TypeScript
- **라우팅**: [React Router v6](https://reactrouter.com/) (`react-router-dom`)
  - 클린 URL 구조: `/compound` (연복리), `/unit` (단위변환), `/exchange` (환율), `/loan` (대출이자)
  - 브라우저 히스토리(뒤로가기/앞으로가기) 네이티브 지원 및 딥링크 공유
- **디자인 시스템 & UI**: [shadcn/ui](https://ui.shadcn.com/) (Ghost Design System 기반 표준 토큰 구조화)
  - `ghost.design.md` 사양 전면 채택:
    - **Eyebrow 배지 & 포인트 컬러**: Electric Lime (`#d1ff19`) - 섹션 상단 12px uppercase 볼드 아이브로우 및 뱃지 포인트로 제한적/절제된 사용
    - **배경 및 캔버스**: Warm White (`#ffffff`), Ink Base (`#15171a`), Slate Hairlines (`#e5e7eb`, `#1f2937`)
    - **버튼 및 인터랙션**: Near-black Pill/Rounded CTA (`#15171a`, text `#ffffff`), 6px/8px 반경, 39px 규격
    - **카드 및 서피스**: 24px 대형 둥근 모서리(`rounded-3xl` / `24px`), 플랫 헤어라인 테두리 (`border-[#e5e7eb]`, 그림자 배제 원칙)
  - shadcn 컴포넌트: 버튼(Button), 카드(Card), 입력창(Input), 슬라이더(Slider), 시트(Sheet/Drawer), 배지(Badge), 테이블(Table), 툴팁(Tooltip), **셀렉트(Select)**
    - `@radix-ui/react-select` 기반 모듈형 드롭다운 컴포넌트 구축 (`src/components/ui/select.tsx`)
    - 기존 브라우저 기본 `<select>` 태그를 shadcn `Select`로 전면 교체:
      - 단위 변환기(`DualConverterCard.tsx`): 출발 단위(From) 및 도착 단위(To) 선택
      - 연복리 계산기(`CalculatorForm.tsx`): 복리 주기(월복리/연복리 등) 및 과세 체계(일반/비과세/ISA 등) 선택
    - Ghost 다크 테마 패널 및 라이트 테마 패널 양방향 완벽 호환 스타일링 지원
- **스타일링**: Tailwind CSS + CSS 토큰 변수 (`src/index.css`)
- **타이포그래피 & 수직 정렬 최적화**:
  - [Pretendard Variable](https://github.com/orioncactus/pretendard) 전면 유지 (숫자 및 한글 가독성 극대화)
  - **한글 수직 중앙(Vertical Center) 정렬 보정**: 한글 글리프 특성상 `leading-none` 적용 시 영문 대비 상단으로 치우쳐(들떠) 보이는 문제를 해결하기 위해, 버튼/배지/탭/타이틀 요소에 균형 잡힌 라인하이트(`leading-normal`, `leading-snug`) 및 정밀 베이스라인 정렬 적용
  - **문구 작성 원칙 (컬러 이모지 배제)**: 서비스 UI 및 안내 문구 전반에 알록달록한 컬러 이모지(💡, ✨ 등)를 절대 넣지 않음.
  - **페이지 타이틀 및 국문 네이밍 규칙**: 개별 계산기 및 도구의 국문 타이틀에는 불필요한 '스마트' 수식어를 배제하고 본래의 명칭(예: '단위 변환기', '연복리 & 자산성장 계산기')으로 통일함. 단, 세련된 글로벌 프로덕트 인상을 위해 영문 브랜드 표기(`Smart Calculator Hub`, `Smart Calculator`)는 유지함.
- **차트**: Recharts (Ghost 테마: Near-black 베이스, Slate-400 원금선, Electric Lime / Lavender 포인트 라인)
- **아이콘**: Lucide React
- **상태 관리**: React State + 커스텀 훅 + LocalStorage
- **코드 스플리팅**: 각 계산기 모듈별 동적 임포트(`React.lazy`) 적용으로 초기 로딩 경량화 유지

---

## 6. 비기능적 요구사항 및 검증 기준

1. **모바일 사용성**: 하단 탭 또는 좌측 드로어를 통해 한 손으로 모든 계산기 간 1회 터치로 전환 가능.
2. **성능 & 번들 최적화**: 멀티 계산기가 추가되어도 메인 엔트리 번들이 비대해지지 않도록 각 계산기 모듈을 코드 스플리팅.
3. **독립성 & 데이터 격리**: 한 계산기에서 입력한 값이 다른 계산기에 영향을 주지 않으며, 각 계산기별 LocalStorage 키를 분리하여 보존.
4. **정확성**:
   - 단위 변환: 부동소수점 오차 없는 표준 단위 환산 계수 적용.
   - 환율: 매매기준율 및 환전 우대율 수식 정합성 보증.

---

## 7. 검색엔진 최적화 (SEO) 전략 및 명세

웹 계산기 서비스의 특성상 포털(구글, 네이버 등) 검색 유입이 핵심 트래픽 원천이므로, **적극적이고 고도화된 SEO 전략**을 기본 탑재합니다.

### 7.1 메타데이터 및 소셜 공유 (Meta Tags & OpenGraph)
- **표준 메타 태그**:
  - `title`: `[계산기 이름] | 스마트 계산기 허브 - 연복리 · 평수계산 · 환율`
  - `description`: 검색 사용자의 클릭률(CTR)을 높이는 구체적인 타깃 설명 (예: "아파트 84㎡는 몇 평일까? 평수와 ㎡ 실시간 변환, 연복리 시뮬레이션, 실시간 환율 계산까지 무료로 이용하세요.")
  - `keywords`: `연복리 계산기, 적립식 복리, 평수 계산기, 아파트 평수 ㎡, 환율 계산기, 달러 환율, 이자 계산기`
  - `canonical`: 중복 URL 방지를 위한 표준 대표 URL 지정
  - `robots`: `index, follow`
- **오픈그래프(OpenGraph) & 트위터 카드**:
  - 카카오톡, 라인, 페이스북, 슬랙 링크 공유 시 매력적인 미리보기 카드 노출 (`og:title`, `og:description`, `og:image`, `og:url`, `og:type="website"`).

### 7.2 동적 페이지 헤드 관리 (Dynamic Meta Updater)
- 단일 페이지 애플리케이션(SPA) 내에서 사용자가 계산기를 전환(`연복리` ↔ `단위변환` ↔ `환율`)할 때:
  - 브라우저의 `<title>`과 `<meta name="description">`이 실시간으로 해당 계산기의 타깃 키워드로 동적 변경.
  - 브라우저 히스토리(`window.history.pushState` 또는 해시/쿼리 파라미터 `?tool=compound`, `?tool=unit`)를 지원하여 특정 계산기로 바로 연결되는 딥링크(Deep Link) URL 제공.

### 7.3 구조화된 데이터 (JSON-LD / Schema.org)
- 검색엔진 크롤러가 사이트의 성격을 즉시 파악하고 구글 검색결과에 리치 스니펫(Rich Snippet)으로 표시되도록 `ld+json` 구조화 데이터 삽입:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "스마트 계산기 허브",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW"
    }
  }
  ```
- **FAQ / HowTo 스키마**: 각 계산기 하단에 검색엔진 노출용 금융/수학 공식 질의응답 아코디언 제공 (예: "복리 계산 공식이란?", "1평은 몇 ㎡인가요?").

### 7.4 크롤러 수집 파일 지원
- `public/robots.txt`: 검색 크롤러의 전체 페이지 접근 허용
- `public/sitemap.xml`: 각 계산기 도구별 URL 맵 제공

---

## 8. PWA (Progressive Web App) 명세 및 설치 지원

모바일 앱과 동일한 사용자 경험 및 네트워크 단절 시에도 온전한 계산 기능 수행을 위해 PWA를 지원합니다.

### 8.1 핵심 요구사항
- **홈 화면 추가(A2HS)**: 모바일(iOS 사파리 '홈 화면에 추가', 안드로이드 크롬 '설치' 배너/버튼) 및 데스크톱 PWA 설치 완벽 지원.
- **오프라인 캐싱 (Service Worker)**:
  - `vite-plugin-pwa` 기반 Workbox 서비스 워커 자동 등록 (`generateSW`).
  - 정적 자산(JS, CSS, HTML, 웹폰트, 아이콘) 프리캐싱을 통해 비행기 모드나 오프라인 환경에서도 모든 계산기 즉시 작동.
- **Web App Manifest**:
  - `name`: `스마트 계산기 허브 | Smart Calculator Hub`
  - `short_name`: `스마트 계산기`
  - `theme_color`: `#0d9488` (Teal-600 브랜드 컬러)
  - `background_color`: `#f8fafc` (Slate-50)
  - `display`: `standalone` (브라우저 주소창 제거, 네이티브 앱 느낌)
  - `icons`: 192x192, 512x512 고해상도 SVG/PNG 아이콘 및 마스크블(maskable) 규격 적용.
- **iOS 최적화**:
  - `apple-mobile-web-app-capable`: `yes`
  - `apple-mobile-web-app-status-bar-style`: `default`
  - `apple-touch-icon`: 192x192 홈 아이콘 지정.

---

## 9. 품질 안정화 및 환경 표준화 규격 (Quality & Environment Standardization)

### 9.1 테스트 환경 Recharts 경고 로그 제거 (JSDOM Layout Mock)
- **배경**: Vitest JSDOM 환경은 실제 DOM 레이아웃(너비/높이 계산)을 지원하지 않아, Recharts의 `ResponsiveContainer`가 `width(0)` 및 `height(0)` 경고 로그를 `stderr`에 출력함.
- **해결 방안**: `src/test/setup.ts`에서 Recharts의 `ResponsiveContainer`를 테스트 시 명시적 크기(예: 가로 800px, 세로 400px)를 가진 래퍼 컨테이너로 Mock 처리하여 불필요한 콘솔 노이즈 제거 및 테스트 로그 청결화.

### 9.2 패키지 메타데이터 및 제품명 동기화
- **배경**: 초기 단일 복리 계산기 프로젝트(`compound-interest-calculator`)에서 멀티 계산기 허브 플랫폼으로 확장 완료됨.
- **해결 방안**: `package.json`의 패키지 `name`을 `smart-calculator-hub`로 변경하여 실제 제품 정체성과 패키지 메타데이터를 일원화.

### 9.3 복리 수치 연산 NaN 입력 방어 규격 (Calculation Robustness)
- **배경**: 사용자 입력 도중 공백이나 잘못된 문자 파싱으로 인해 `NaN`이 유입될 경우, JavaScript 구조 분해 기본값(`= 0`)이 작동하지 않아 전체 자산 성장 테이블이 `NaN`으로 오염되는 문제 예방.
- **해결 방안**: `calculateCompoundInterest` 함수 진입 시 `Number.isFinite()` 검사를 통해 원금(`principal`), 정기적립금(`regularContribution`), 연이율(`annualRate`), 투자기간(`years`)의 유효성을 엄격히 검증하고, 유효하지 않은 값은 기본 안전값(`0` 또는 `10년`)으로 즉시 폴백.

### 9.4 라우트 단위 코드 스플리팅 및 번들 최적화 (Route-level Code Splitting)
- **배경**: 현재 모든 계산기 모듈이 정적으로 임포트되어 있어, 단위 변환기나 환율 계산기 사용자도 첫 로딩 시 대용량 차트 라이브러리(`Recharts` 약 528KB)를 함께 다운로드해야 함.
- **해결 방안**: `src/App.tsx`의 3대 계산기 컴포넌트(`CompoundInterestApp`, `UnitConverterApp`, `ExchangeApp`)를 `React.lazy()` 동적 임포트 및 `<Suspense>`로 분리하여 초기 번들 크기 경감 및 첫 화면 표시 속도(FCP/LCP) 대폭 향상. 로딩 대기 시에는 Ghost 디자인 시스템에 맞춘 가벼운 스켈레톤/스피너 플레이스홀더 노출.

### 9.5 외부 API 네트워크 타임아웃 및 스토리지 안전성 (Network & Storage Reliability)
- **배경**: 환율 API(`open.er-api.com`) 호출 시 네트워크 지연이 발생하면 백그라운드 요청이 무한 대기할 수 있으며, `useLocalStorage`에서 `undefined` 직렬화 시 파싱 오류가 발생할 수 있음.
- **해결 방안**:
  - `fetchLiveExchangeRates`에 5초 타임아웃 신호(`AbortSignal.timeout(5000)`)를 적용하여 음영지역에서도 지연 없이 오프라인 기본값으로 안전하게 폴백.
  - `useLocalStorage`에 `typeof window === 'undefined'` 환경 체크 및 `undefined` 직렬화 방어 로직 적용.

---

## 10. 웹 표준 및 웹 접근성(A11y) 규격 (Web Standards & Accessibility)

### 10.1 뷰포트 저시력자 화면 확대(Zoom) 보장 (WCAG 1.4.4: Resize text)
- **배경**: `index.html`의 뷰포트 메타태그에 `maximum-scale=1.0, user-scalable=no`가 지정되어 있어 저시력 사용자의 핀치 줌 화면 확대가 원천 차단됨.
- **해결 방안**: 뷰포트 메타태그를 표준 `width=device-width, initial-scale=1.0`으로 변경하여 최대 500%까지 자유로운 화면 줌을 보장함. 모바일 iOS 사파리의 인풋 포커스 시 자동 확대는 입력 필드의 기본 폰트 크기(16px 이상) 설정을 통해 자연스럽게 방지.

### 10.2 모든 폼 입력 필드 Accessible Name 매핑 (WCAG 1.3.1 & 4.1.2)
- **배경**: 연복리, 단위 변환, 환율 계산기의 대형 숫자 입력 필드에 스크린 리더가 식별할 수 있는 접근 가능한 이름이 누락되어 음성 낭독 시 "텍스트 편집창"으로만 안내됨.
- **해결 방안**:
  - `CalculatorForm.tsx`: 초기 투자 원금, 정기 추가 적립금, 목표 투자 기간(슬라이더), 예상 수익률 인풋에 `id` 및 `aria-label` 부여.
  - `DualConverterCard.tsx`: 출발 단위 입력 필드에 `aria-label={`${fromUnit.name} 변환할 수치 입력`}` 연결.
  - `DualExchangeCard.tsx`: 출발 통화 입력 필드에 `aria-label={`${fromCurr.name} 환전할 금액 입력`}` 연결.

### 10.3 아코디언 트리거의 키보드 접근성 및 ARIA 상태 표기 (WCAG 2.1.1 & 4.1.2)
- **배경**: `DataTable.tsx`의 연도별 흐름표 헤더가 일반 `<div>`에 클릭 핸들러만 달려 있어 키보드(Tab/Enter/Space) 조작이 불가능하고 확장 여부(`aria-expanded`)를 알 수 없음.
- **해결 방안**: 아코디언 헤더를 시맨틱 `<button type="button" aria-expanded={isOpen} ...>` 구조로 전환하여 키보드 포커스 및 엔터/스페이스 인터랙션과 스크린 리더의 개폐 상태 음성 출력을 보장.

### 10.4 문서 시맨틱 랜드마크 완성 (HTML5 Semantic)
- **배경**: 사이드바 하단 카피라이트/버전 영역이 일반 `<div>`로 작성되어 문서 랜드마크 계층이 미완성됨.
- **해결 방안**: `SidebarDrawer.tsx`의 하단 영역을 시맨틱 `<footer>` 태그로 변경하여 `<header>`, `<nav>`, `<aside>`, `<main>`, `<footer>`의 5대 랜드마크 체계를 완벽하게 수립.

---

## 11. 폼 UI 요소 shadcn/ui 컴포넌트 전면 표준화 규격 (Form UI Component Standardization)

### 11.1 Input 컴포넌트 전면 표준화 (`src/components/ui/input.tsx`)
- **배경**: 인라인 `<input>` 태그를 shadcn `Input`으로 통일하여 디자인 시스템의 포커스 링, 다크 모드 토큰, 기본 상태를 단일 컴포넌트 수준에서 중앙 집중 관리.
- **적용 대상**:
  - `CalculatorForm.tsx`: 초기 투자 원금, 정기 추가 적립금, 연 예상 수익률 직접 입력창
  - `DualConverterCard.tsx`: 출발(From) 단위 대형 수치 입력창
  - `DualExchangeCard.tsx`: 출발(From) 통화 대형 금액 입력창
- **구현 원칙**: `className` 오버라이딩을 통해 기존의 대형 폰트(`text-2xl sm:text-3xl`), 우측 정렬(`text-right`), 투명 배경 및 테두리 스타일을 100% 동일하게 유지.

### 11.2 Slider 컴포넌트 전면 표준화 (`src/components/ui/slider.tsx`)
- **배경**: 브라우저별로 상이하게 렌더링되던 네이티브 `<input type="range">`를 shadcn `<Slider>`로 전면 교체.
- **적용 대상**:
  - `CalculatorForm.tsx`: 목표 투자 기간 슬라이더, 연 예상 수익률 슬라이더
- **구현 원칙**:
  - Ghost 디자인 시스템의 시그니처 Electric Lime(`#d1ff19`) 썸(Thumb) 및 활성 트랙(Range) 적용.
  - 키보드 방향키(좌/우/상/하)를 통한 정밀한 증감 제어 및 부드러운 터치 드래그 지원.
  - `value={[scenario.years]}` 및 `onValueChange={([val]) => ...}` 규격 연동.

### 11.3 Button 컴포넌트 전면 표준화 (`src/components/ui/button.tsx`)
- **배경**: 인라인 `<button>` 태그를 shadcn `Button` (`variant="outline"`, `variant="ghost"`, `variant="default"`)으로 전면 일원화하여 통일된 호버 트랜지션, 포커스 링 및 접근성 지원.
- **적용 대상**:
  - `LoanForm.tsx`: 상환 방식 탭 버튼, 거치 기간 프리셋 칩, 중도상환 토글
  - `LoanComparisonCard.tsx`: 3대 상환방식 선택 카드 버튼
  - `LoanChartDashboard.tsx`: 차트 뷰 전환 버튼 (잔액 감소 vs 누적 납입)
  - `CalculatorForm.tsx`: 적립 주기 탭, 기간 프리셋 칩, 수익률 프리셋 칩
  - `CompoundInterestApp.tsx`: 시뮬레이션 비교 모드 ON/OFF 버튼, 모바일 시나리오 탭 버튼
  - `QuickAmountButtons.tsx`: 금액 증감 칩 및 정정 버튼
  - `UnitCategoryTabs.tsx`: 단위 변환기 5대 카테고리 탭 버튼
  - `QuickPresetChips.tsx`: 단위 변환기 생활 밀착 프리셋 칩
  - `ExchangePresetChips.tsx`: 환율 계산기 여행/직구 프리셋 칩
  - `DualExchangeCard.tsx`: 환전 거래 유형 탭 및 스프레드 우대율 칩, 통화 맞바꾸기(Swap) 버튼
  - `DataTable.tsx`: 연도별 아코디언 토글 헤더 및 더보기 버튼
  - `SidebarDrawer.tsx`: 네비게이션 메뉴 아이템 버튼
  - `PlaceholderView.tsx`: 이전으로 돌아가기 버튼
- **구현 원칙 및 변형(Variants) 매핑 규격**:
  - **탭 및 세그먼트 컨트롤러**: `variant="ghost"` + 활성화 시 배경/글자색 반전(`bg-[#15171a] dark:bg-white text-white dark:text-[#112220]`) 적용
  - **프리셋 칩 및 보조 조작 버튼**: `variant="outline"` + `size="sm"` + 간결한 패딩(`h-7 px-2.5 text-xs`) 적용
  - **카드형 인터랙션 버튼**: `variant="ghost"` 또는 `variant="outline"` + `w-full h-auto p-3.5 text-left`로 카드 전체를 버튼화하여 키보드 Tab 및 Enter 인터랙션 보장
  - **웹 접근성 및 포커스 링**: shadcn Button의 기본 `focus-visible:ring-2 focus-visible:ring-[#15171a] dark:focus-visible:ring-[#d1ff19]` 포커스 링을 통해 키보드 사용자 탐색성 100% 보장
  - **디자인 보존**: `className` 오버라이드를 통해 기존 `ghost.design.md`의 라운드, 패딩, 폰트 웨이트, 모노크롬 다크모드 스타일을 100% 동일하게 유지

---

## 12. 연복리 계산기 투자 상식 및 유의사항 안내 규격 (`CompoundInfoCard`)

### 12.1 목적 및 배경
- 환율 계산기(`ExchangeInfoCard`) 및 단위 변환기(`대한민국 부동산 및 일상 단위 안내`)와 마찬가지로, 연복리 계산기 하단에도 금융 상식 및 절세 팁을 제공하여 페이지 간 UI/UX 일관성을 완성하고 실질적인 금융 의사결정에 도움을 제공함.

### 12.2 핵심 콘텐츠 구성 (압축형)
모바일 화면에서도 한눈에 파악할 수 있도록 불필요한 서술을 제거하고 핵심 요점만 간결하게 압축 제공:
1. **72의 법칙**: 원금이 2배가 되는 시간 ≈ `72 ÷ 연수익률(%)` (예: 연 7% 시 약 10년)
2. **복리의 마법**: 원금뿐 아니라 늘어난 이자에도 이자가 재투자되어 시간이 지날수록 자산이 기하급수적으로 증가
3. **절세 계좌 활용**: 일반과세(15.4%) 대비 ISA(9.9% 분리과세) 등 절세 계좌 활용 시 세금 이연으로 복리 극대화
4. **금융소득 종합과세**: 연간 이자·배당소득 합계 2,000만 원 초과 시 종합과세 합산 대상
5. **시뮬레이션 고지**: 고정 수익률을 가정한 계산 결과이며, 실제 투자 시 원금 손실 위험 및 물가상승률(인플레이션)에 유의

### 12.3 디자인 및 배치 규격
- **배치 위치**: `CompoundInterestApp.tsx` 우측(모바일에서는 하단) 연도별 자산 흐름표(`DataTable`) 하단
- **스타일 톤앤매너**: `p-4 rounded-2xl bg-slate-50 dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 text-xs text-[#64748b] dark:text-slate-300 shadow-2xs`
- **시각 요소**: 상단 `Info` 아이콘(Electric Lime 포인트) + 볼드 헤더 + 구분선

---

## 13. 대출 이자 및 상환방식 비교 계산기 규격 (`LoanApp`)

### 13.1 개발 배경 및 목표
- 대한민국 금융 소비자들이 주택담보대출, 전세대출, 신용대출 이용 시 가장 크게 고민하는 **3대 상환방식(원리금균등, 원금균등, 만기일시)** 간의 총 이자비용 격차와 월별 현금흐름 부담을 한눈에 명확하게 비교하고 시뮬레이션할 수 있도록 지원함.

### 13.2 데이터 모델 (`src/types/loan.ts`)
```typescript
export type RepaymentMethod = 'equal_payment' | 'equal_principal' | 'bullet';

export interface LoanInput {
  loanAmount: number;         // 대출 원금 (원 단위, 예: 300,000,000)
  annualRate: number;         // 연이율 (%, 예: 4.2)
  loanTermYears: number;      // 대출 기간 (연 단위, 예: 30)
  gracePeriodMonths: number;  // 거치 기간 (개월 단위, 0 = 거치 없음)
  repaymentMethod: RepaymentMethod; // 기본 선택 상환방식
}

export interface MonthlyRepayment {
  month: number;              // 회차 (1 ~ 총 개월수)
  year: number;               // 연차 (1 ~ 기간)
  monthInYear: number;        // 연차 내 월 (1 ~ 12)
  isGracePeriod: boolean;     // 거치 기간 여부
  principalPayment: number;   // 납입 원금 (원)
  interestPayment: number;    // 납입 이자 (원)
  totalPayment: number;       // 월 상환액 (원금 + 이자)
  remainingBalance: number;   // 대출 잔액 (원)
}

export interface RepaymentCalculationResult {
  method: RepaymentMethod;
  totalRepayment: number;     // 총 상환금액 (원금 + 총이자)
  totalInterest: number;      // 총 대출이자
  firstMonthPayment: number;  // 1회차 상환액
  lastMonthPayment: number;   // 최종 회차 상환액
  monthlyAveragePayment: number; // 월평균 상환액
  maxMonthlyPayment: number;  // 최대 월 상환액
  minMonthlyPayment: number;  // 최소 월 상환액
export interface EarlyRepaymentOption {
  enabled: boolean;
  afterMonths: number;        // 대출 실행 N개월 후 상환 (예: 12, 24, 36)
  amount: number;             // 중도상환 원금
  feeRate: number;            // 중도상환 수수료율 (%, 기본 1.2)
}

export interface EarlyRepaymentResult {
  feeAmount: number;          // 납부할 중도상환 수수료 (3년 슬라이딩 감면 반영)
  savedInterest: number;      // 중도상환으로 절약된 총이자
  netBenefit: number;         // 순 절감 혜택 (절약이자 - 수수료)
}

export interface RepaymentCalculationResult {
  method: RepaymentMethod;
  totalRepayment: number;     // 총 상환금액 (원금 + 총이자)
  totalInterest: number;      // 총 대출이자
  firstMonthPayment: number;  // 1회차 상환액
  lastMonthPayment: number;   // 최종 회차 상환액
  monthlyAveragePayment: number; // 월평균 상환액
  maxMonthlyPayment: number;  // 최대 월 상환액
  minMonthlyPayment: number;  // 최소 월 상환액
  schedule: MonthlyRepayment[]; // 월별 상세 스케줄표
  earlyRepayment?: EarlyRepaymentResult; // 중도상환 적용 시 결과
}

export interface LoanComparisonSummary {
  equalPayment: RepaymentCalculationResult;
  equalPrincipal: RepaymentCalculationResult;
  bullet: RepaymentCalculationResult;
  lowestInterestMethod: RepaymentMethod;
  interestSavingsVsEqualPayment: number; // 원금균등 선택 시 원리금균등 대비 절약되는 이자액
}
```

### 13.3 금융 수학 연산 규칙 (`src/utils/loanCalculator.ts`)
1. **월이율 산출**: $i = \frac{r}{100 \times 12}$ (연이율 $r\%$ 기준)
2. **거치 기간 처리**: 거치 기간 $G$개월 동안은 원금 상환 $0$원, 월이자 $P \times i$만 납입. 대출 잔액 유지.
3. **원리금균등상환 (Equal Payment)**:
   - 상환 개월수 $M = N - G$ 동안 균등 분할 상환액 $PMT = P \times \frac{i(1+i)^M}{(1+i)^M - 1}$
   - 매월 이자 = $\text{직전 잔액} \times i$, 매월 원금 = $PMT - \text{이자}$
   - 마지막 $N$회차 잔액을 정확히 $0$원으로 보정 (소수점 단수 오차 제거).
4. **원금균등상환 (Equal Principal)**:
   - 매월 균등 원금 = $\frac{P}{M}$
   - 매월 이자 = $\text{직전 잔액} \times i$, 매월 상환액 = 매월 균등 원금 + 매월 이자
5. **만기일시상환 (Bullet)**:
   - $1 \dots N-1$회차: 매월 원금 $0$원, 월이자 $P \times i$ 납입
   - 마지막 $N$회차: 원금 전액 $P$ + 최종월 이자 일괄 상환
6. **중도상환 수수료 및 조기상환 효과**:
   - 수수료 감면율: 대출 실행 후 경과월수 $m$ 기준, $\text{수수료} = \text{상환금액} \times \frac{\text{수수료율}}{100} \times \frac{\max(0, 36 - m)}{36}$ (3년/36개월 경과 시 $0$원 전액 면제)
   - 조기상환 시점 이후 대출 잔액이 즉각 차감되어 이후 잔여 개월 동안의 누적 이자 절감액 및 순 편익(절감이자 - 수수료) 자동 산출

### 13.4 UI 및 사용자 경험 (Mobile-First & Ghost Design)
- **대출 조건 입력 폼 (`LoanForm.tsx`)**:
  - 대출 금액: 한글 단위 실시간 환산(`3억 5,000만 원`), 빠른 증감 칩(`+1,000만`, `+5,000만`, `+1억`, `정정`), shadcn `Input`
  - 대출 금리: 0.1% 단위 증감 인풋 + 시장 대표 금리 칩(`3.2% 특판`, `3.8% 주담대`, `4.5% 전세`, `5.5% 신용`)
  - 대출 기간: 1년 ~ 40년 슬라이더 + 빠른 칩(`1년`, `3년`, `5년`, `10년`, `20년`, `30년`, `40년`)
  - 거치 기간: 0개월 ~ 대출기간 미만 선택 칩 및 셀렉트
  - 상환 방식 탭: 원리금균등, 원금균등, 만기일시 3대 탭
  - **중도상환 시뮬레이터 (선택 토글)**: 스위치 활성화 시 상환 시점(1년/2년/3년), 상환 금액, 수수료율(기본 1.2%) 입력창 노출
- **요약 카드 (`LoanSummaryCards.tsx`)**: 총 대출원금, 총 대출이자, 총 상환금액, 1회차/마지막회차 월상환액, 월평균 상환액 및 중도상환 시 순 절약 혜택 표시
- **3대 상환방식 동시 비교 뷰 (`LoanComparisonCard.tsx`)**:
  - 원리금균등 vs 원금균등 vs 만기일시 총이자, 첫달/마지막달 상환액 나란히 카드 비교
  - "원금균등 방식 선택 시 원리금균등 대비 000만 원 이자 절감" 하이라이트 안내
- **시각화 대시보드 (`LoanChartDashboard.tsx`)**:
  - Recharts 기반 연도별/월별 상환 누적 추이 (납입원금 vs 대출이자 영역 차트) 및 남은 대출잔액 감소 곡선
- **월별 상환 상세 스케줄표 (`LoanScheduleTable.tsx`)**:
  - 회차, 납입원금, 대출이자, 월상환금, 대출잔액 표 (중도상환 회차 뱃지 하이라이트)
  - 엑셀 호환 UTF-8 BOM CSV 다운로드 기능
- **대출 상식 및 유의사항 안내 카드 (`LoanInfoCard.tsx`)**:
  - DSR / DTI / LTV 한 줄 핵심 요약
  - 상환방식 선택 가이드 (소득 안정성 vs 총이자 절감)
  - 중도상환수수료(통상 3년 경과 후 면제) 및 금리인하요구권 팁
  - 변동금리 및 금융기관별 실제 청구액 차이 안내 고지
- **상태 영속화**: `useLocalStorage`를 통해 마지막 입력값 자동 보관 및 헤더 초기화 연동








