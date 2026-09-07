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
  - 카테고리별(금융/투자, 생활/측정, 통화/글로벌) 그룹화 및 직관적인 아이콘 버튼 형태.
  - 드로어 외부 터치 또는 항목 선택 시 자동 닫힘.
- **데스크톱 뷰포트 (1024px 이상)**:
  - 좌측 고정 사이드바(Width: 260px) + 우측 메인 콘텐츠 영역의 2열 레이아웃.
  - 사이드바 접기/펼치기(Collapse/Expand) 토글 지원으로 넓은 작업 공간 확보 가능.

### 2.2 모듈형 컴포넌트 아키텍처
```text
src/
├── calculators/
│   ├── compound-interest/   # 1. 연복리 & 자산 성장 계산기
│   ├── unit-converter/      # 2. 스마트 단위 변환기 (평수 ↔ ㎡ 등)
│   ├── exchange-rate/       # 3. 실시간/기준 환율 계산기
│   ├── loan-interest/       # 4. [추천] 대출 이자 및 상환 방식 비교 계산기
│   ├── dividend/            # 5. [추천] 배당금 및 월 배당 현금흐름 계산기
│   └── goal-planner/        # 6. [추천] 목표 자산 역산(얼마씩 모아야 할까) 계산기
├── components/              # LeftSidebar, GlobalHeader, Layout
└── ...
```

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
  - Recharts 기반 인터랙티브 시각화 대시보드 & CSV 내보내기.

### 3.2 [생활/측정] 스마트 단위 변환 계산기 (Unit Converter - 신규)
- **기능 요약**: 생활 및 업무에서 가장 빈번하게 사용되는 단위를 실시간으로 상호 변환.
- **지원 카테고리**:
  1. **넓이/면적 (부동산 특화)**:
     - **평(坪) ↔ 제곱미터(㎡)** (아파트 분양 평수 및 전용면적 실시간 원클릭 환산: 예: 84㎡ = 25.4평, 공급 34평형)
     - 평, ㎡, 헥타르(ha), 에이커(ac), 평방피트(sq ft)
  2. **길이**: 센티미터(cm), 미터(m), 킬로미터(km), 인치(in), 피트(ft), 야드(yd), 마일(mi)
  3. **무게/질량**: 그램(g), 킬로그램(kg), 톤(t), 파운드(lb), 온스(oz), 돈/근(한국 전통 단위)
  4. **부피**: 밀리리터(mL), 리터(L), 갤런(gal), 배럴(bbl)
  5. **온도**: 섭씨(℃) ↔ 화씨(℉)
- **UX 편의성**: 한쪽 값을 입력하면 모든 관련 단위가 실시간으로 동시 변환되는 멀티 결과 뷰.

### 3.3 [통화/글로벌] 실시간/기준 환율 계산기 (Currency Exchange - 신규)
- **기능 요약**: 글로벌 주요 통화 간의 금액을 실시간 기준 환율과 환전 수수료/우대율을 반영하여 계산.
- **지원 통화**: 대한민국 원(KRW), 미국 달러(USD), 일본 엔(JPY 100엔 기준), 유로(EUR), 중국 위안(CNY), 영국 파운드(GBP).
- **주요 기능**: 통화 간 양방향 즉시 환산, 환전 수수료 및 우대율(90%, 80%, 50% 등) 설정 반영, 매매기준율/현찰살때 스프레드 옵션 지원.

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
  id: string;
  name: string;
  symbol: string;
  ratioToBase: number; // 기준 단위 대비 비율
  offset?: number;     // 온도시 오프셋
}
```

### 4.3 환율 계산 데이터 모델
```typescript
export interface CurrencyInfo {
  code: string;       // 'KRW', 'USD', 'JPY'
  name: string;       // '대한민국 원', '미국 달러'
  symbol: string;     // '₩', '$', '¥'
  rateToKRW: number;  // 1단위당 KRW 기준 환율 (JPY는 100엔당)
  baseUnit: number;   // 1 또는 100
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
- **디자인 시스템 & UI**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI 프리미티브 + Tailwind CSS 기반 모듈형 컴포넌트 시스템)
  - 버튼(Button), 카드(Card), 입력창(Input), 슬라이더(Slider), 탭(Tabs), 셀렉트(Select), 시트(Sheet/Drawer), 배지(Badge), 테이블(Table) 적용
- **스타일링**: Tailwind CSS (Tailwindcss-animate, CSS 변수 기반 디자인 토큰)
- **타이포그래피**: [Pretendard Variable](https://github.com/orioncactus/pretendard) 전면 적용 (숫자 및 한글 가독성 극대화, 모노스페이스 배제)
- **차트**: Recharts (연복리 모듈에서 유지)
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

