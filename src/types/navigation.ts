export type CalculatorId =
  | 'compound'
  | 'unit'
  | 'exchange'
  | 'loan'
  | 'salary'
  | 'dividend'
  | 'goal';

export type CalculatorCategory = 'finance' | 'lifestyle' | 'global';

export interface CalculatorItem {
  id: CalculatorId;
  name: string;
  shortName: string;
  description: string;
  category: CalculatorCategory;
  badge?: string;
  status: 'active' | 'coming-soon';
}

export const CATEGORY_NAMES: Record<CalculatorCategory, string> = {
  finance: '금융 & 자산 투자',
  lifestyle: '생활 & 측정',
  global: '통화 & 글로벌',
};

export const CALCULATORS_LIST: CalculatorItem[] = [
  {
    id: 'compound',
    name: '연복리 & 자산성장 계산기',
    shortName: '연복리 계산기',
    description: '적립식 복리, 세금 공제, 하락장 손실, 시나리오 A/B 비교',
    category: 'finance',
    status: 'active',
  },
  {
    id: 'unit',
    name: '단위 변환기',
    shortName: '단위 변환기',
    description: '아파트 평(坪)↔㎡, 길이, 무게, 부피, 온도 실시간 멀티 변환',
    category: 'lifestyle',
    status: 'active',
  },
  {
    id: 'exchange',
    name: '환율 계산기',
    shortName: '환율 계산기',
    description: '주요 통화(USD, JPY, EUR 등) 환산 및 은행 우대율 시뮬레이션',
    category: 'global',
    status: 'active',
  },
  {
    id: 'loan',
    name: '대출이자 & 상환방식 비교',
    shortName: '대출이자 계산기',
    description: '원리금균등 vs 원금균등 vs 만기일시 3대 상환방식 한눈에 비교',
    category: 'finance',
    status: 'active',
  },
  {
    id: 'salary',
    name: '연봉 실수령액 계산기',
    shortName: '연봉 계산기',
    description: '2026년 4대 보험 및 간이세액표 기반 월/연 실수령액 & 세부 공제',
    category: 'finance',
    status: 'active',
  },
  {
    id: 'dividend',
    name: '배당금 & 월 배당 달력',
    shortName: '배당금 계산기',
    description: '미국/한국 배당주 월별 현금흐름 및 세후 실수령액 계산',
    category: 'finance',
    status: 'coming-soon',
  },
  {
    id: 'goal',
    name: '목표 자산 역산 계산기',
    shortName: '목표자산 역산',
    description: 'N년 뒤 목표 금액 달성에 필요한 월 적립 투자금 역산',
    category: 'finance',
    status: 'coming-soon',
  },
];
