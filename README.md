# 스마트 계산기 허브 (Smart Calculator Hub)

> 모바일 퍼스트 반응형 생활 금융 & 일상 유틸리티 계산기 허브 웹 애플리케이션

스마트 계산기 허브는 자산 증식을 위한 **정밀 연복리 계산기**, 한국 실생활에 최적화된 **단위 변환기**, 글로벌 금융 시장 기준율 및 우대율을 반영하는 **실시간 환율 계산기**를 하나로 통합한 모바일 우선 웹 애플리케이션입니다.

Ghost 디자인 시스템의 모노크롬 미니멀 감성과 Electric Lime 하이라이트를 바탕으로 제작되었으며, PWA(프로그레시브 웹 앱) 기술을 통해 오프라인 환경에서도 신속하게 사용할 수 있습니다.

---

## 주요 계산기 모듈

### 1. 연복리 계산기 (Compound Interest Calculator)
- **정밀 복리 계산 엔진**: 초기 투자 원금 거치식 및 정기 적립식(매월 / 매년) 지원, 월복리·연복리·분기복리·일복리 선택 지원.
- **한국형 금융 과세 체계**: 일반과세(15.4%), 비과세(0%), 세금우대/ISA(9.9%), 사용자 직접 입력 지원.
- **원금 손실 시뮬레이션**: -30% ~ +50% 수익률 구간 지원 및 손실 구간 소득세 0원 자동 면제.
- **시나리오 A/B 듀얼 비교 모드**: 두 가지 투자 전략의 성장 곡선을 한 차트에 오버레이 비교하고 최종 자산·순이자·수익률 격차 분석.
- **인터랙티브 Recharts 시각화**: 누적 영역형(Stacked Area) 및 선형(Line) 차트 전환, 모바일 터치 최적화 툴팁.
- **모바일 퀵 컨트롤**: 금액 증감 퀵 버튼(+10만, +50만, +100만, +1,000만, 정정), 실시간 한글 금액 변환 표기, 수익률·기간 프리셋 칩.
- **연도별 자산 흐름표 및 CSV 내보내기**: 아코디언 접이식 테이블 및 엑셀 호환 UTF-8 BOM CSV 파일 다운로드.
- **복리 투자 상식 및 유의사항 카드**: 72의 법칙, 복리 효과, ISA 절세 팁, 금융소득 종합과세 기준 및 시뮬레이션 유의사항 안내.

### 2. 단위 변환기 (Unit Converter)
- **5대 핵심 카테고리 지원**: 넓이(면적), 길이, 무게, 부피, 온도 지원.
- **한국형 생활 밀착 단위**: 아파트 평수(평 ↔ ㎡), 순금 1돈(돈 ↔ g), 육류/채소 1근(근 ↔ g) 등 실생활 특화 단위 내장.
- **대형 듀얼 변환 카드**: 출발 단위와 도착 단위를 대형 숫자로 직관적으로 비교 및 실시간 맞바꾸기(Swap) 지원.
- **생활 밀착 원클릭 퀵 프리셋**: 아파트 84㎡(34평형), 순금 1돈(3.75g), 마라톤 풀코스(42.195km), 고기 1근(600g) 등 원터치 입력.
- **전체 단위 일괄 변환 그리드**: 하나의 수치를 입력하면 해당 카테고리의 모든 단위 변환 결과를 카드형 그리드로 한눈에 확인 및 원클릭 클립보드 복사.
- **소수점 정밀도 조절**: 자동, 0자리, 2자리, 4자리, 6자리 실시간 전환.

### 3. 실시간 환율 계산기 (Exchange Rate Calculator)
- **6대 핵심 통화 지원**: 미국 달러(USD), 일본 엔(JPY), 유럽 유로(EUR), 중국 위안(CNY), 영국 파운드(GBP), 한국 원(KRW).
- **글로벌 실시간 환율 동기화**: Open Exchange Rates API 기반 자동 백그라운드 동기화(Stale-While-Revalidate) 및 오프라인 로컬 캐시 지원.
- **은행권 환전 수수료 및 우대율(스프레드) 계산**:
  - 거래 유형: 사실 때(현찰 살 때), 파실 때(현찰 팔 때), 보내실 때(송금 보낼 때), 받으실 때(송금 받을 때), 매매기준율.
  - 우대율 적용: 0%, 50%, 80%, 90%(기본값), 100% 실시간 계산 및 우대 할인으로 절약한 원화 금액 표시.
- **여행 & 직구 퀵 프리셋**: 일본 여행 경비(¥50,000), 미국 직구 면세 한도($200), 일반 직구 면세 한도($150), 미국 여행 달러($1,000) 원클릭 프리셋.
- **6대 통화 실시간 일괄 비교 그리드**: 기준 금액에 대한 전 세계 주요 통화 환산 금액 동시 비교.
- **환전 상식 및 면세 가이드 안내 카드**: 환전 우대율 개념, 모바일 vs 공항 환전 팁, 여행자 휴대품 면세 한도($800), 직구 면세 한도 안내.

---

## 핵심 아키텍처 및 디자인 원칙

- **Ghost 디자인 시스템**: 미니멀 모노크롬 팔레트(`#15171a`, `#0b0c0e`, `#f8fafc`)와 Electric Lime(`#d1ff19`) 액센트를 적용하여 높은 가독성과 정돈된 심미성 제공.
- **shadcn/ui 컴포넌트 전면 표준화**: `Button`, `Input`, `Slider`, `Select`, `Tooltip`, `Sheet`, `Card`, `Badge` 등 모든 폼과 인터랙션 요소를 shadcn/ui 컴포넌트로 일원화하여 일관된 디자인과 키보드 웹 접근성(WCAG 2.1 AA) 보장.
- **모바일 퍼스트 UX**: 슬라이드형 사이드바 드로어 네비게이션, 가로 스크롤 칩, 터치 친화적 탭 및 버튼 인터랙션.
- **성능 최적화 (Route Code-Splitting)**: React.lazy와 Suspense를 적용하여 초기 진입 번들 크기를 경감(154kB)하고 빠른 체감 로딩 속도 달성.
- **PWA (Progressive Web App)**: 서비스 워커와 캐시 스토리지를 통해 네트워크 연결이 불안정하거나 오프라인 상태인 환경에서도 모든 계산 기능 정상 작동.
- **로컬 스토리지 상태 보존**: 각 계산기의 마지막 입력값, 선택 단위, 과세 설정, 환율 스냅샷을 브라우저에 안전하게 보관.

---

## 기술 스택

- **Core**: React 18, TypeScript, Vite
- **Routing**: React Router DOM (v7)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (`Button`, `Input`, `Slider`, `Select`, `Tooltip`, `Sheet`, `Card`, `Badge`)
- **Styling**: Tailwind CSS, Class Variance Authority (CVA), clsx, tailwind-merge
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa, Workbox
- **Testing**: Vitest, React Testing Library, jsdom
- **Typography**: Pretendard Variable

---

## 프로젝트 디렉터리 구조

```text
src/
├── calculators/                     # 각 계산기 도메인별 독립 모듈
│   ├── compound-interest/           # 연복리 계산기
│   │   ├── components/              # 복리 투자 상식 카드 등 하위 컴포넌트
│   │   └── CompoundInterestApp.tsx  # 연복리 메인 컨테이너
│   ├── unit-converter/              # 단위 변환기
│   │   ├── components/              # 듀얼 변환 카드, 일괄 그리드, 프리셋 칩 등
│   │   └── UnitConverterApp.tsx     # 단위 변환기 메인 컨테이너
│   └── exchange-rate/               # 실시간 환율 계산기
│       ├── components/              # 환율 듀얼 카드, 통화 선택, 면세 가이드 등
│       └── ExchangeApp.tsx          # 환율 계산기 메인 컨테이너
├── components/                      # 공통 컴포넌트
│   ├── ui/                          # shadcn/ui 컴포넌트 (Button, Input, Slider, Select 등)
│   ├── CalculatorForm.tsx           # 복리 조건 입력 폼
│   ├── ChartDashboard.tsx           # 복리 시각화 차트
│   ├── ComparisonView.tsx           # 복리 시나리오 A/B 비교 뷰
│   ├── DataTable.tsx                # 복리 연도별 자산 흐름표 (CSV 내보내기)
│   ├── Header.tsx                   # 상단 헤더
│   ├── SidebarDrawer.tsx            # 모바일/데스크톱 네비게이션 드로어
│   └── SummaryCards.tsx             # 요약 카드 지표
├── config/
│   └── site.ts                      # 사이트 전역 메타데이터 및 설정 (Single Source of Truth)
├── hooks/
│   └── useLocalStorage.ts           # 로컬 스토리지 동기화 커스텀 훅
├── types/                           # 도메인별 타입 정의 (복리, 단위, 환율)
└── utils/                           # 순수 연산 엔진 및 포맷터 (테스트 코드 포함)
```

---

## 라이선스

Copyright (c) 2026 sosoFactory. All rights reserved.
