export type RepaymentMethod = 'equal_payment' | 'equal_principal' | 'bullet';

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

export interface LoanInput {
  loanAmount: number;         // 대출 원금 (원 단위, 예: 300,000,000)
  annualRate: number;         // 연이율 (%, 예: 4.2)
  loanTermYears: number;      // 대출 기간 (연 단위, 예: 30)
  gracePeriodMonths: number;  // 거치 기간 (개월 단위, 0 = 거치 없음)
  repaymentMethod: RepaymentMethod; // 기본 선택 상환방식
  earlyRepayment?: EarlyRepaymentOption; // 중도상환 옵션
}

export interface MonthlyRepayment {
  month: number;              // 회차 (1 ~ 총 개월수)
  year: number;               // 연차 (1 ~ 기간)
  monthInYear: number;        // 연차 내 월 (1 ~ 12)
  isGracePeriod: boolean;     // 거치 기간 여부
  isEarlyRepaymentMonth?: boolean; // 중도상환 실행 회차 여부
  earlyRepaymentAmount?: number;   // 해당 월 추가 상환된 원금
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
