export type SalaryPaymentType = 'annual' | 'monthly';
export type SeveranceType = 'separate' | 'included';

export interface SalaryInput {
  paymentType: SalaryPaymentType; // 급여 형태: 'annual' (연봉) | 'monthly' (월급)
  grossAmount: number; // 세전 금액 (원, 연봉 또는 월급)
  severanceType: SeveranceType; // 퇴직금: 'separate' (별도) | 'included' (연봉 포함, 1/13 분할)
  nonTaxableAmount: number; // 월 비과세액 (기본 200,000원 - 식대 등)
  familyCount: number; // 부양가족 수 (본인 포함, 1 ~ 11명)
  childrenCount: number; // 20세 이하 자녀 수 (0 ~ 10명)
}

export type DeductionId =
  | 'national_pension'
  | 'health_insurance'
  | 'long_term_care'
  | 'employment_insurance'
  | 'income_tax'
  | 'local_income_tax';

export interface DeductionItem {
  id: DeductionId; // 항목 식별자
  name: string; // 국문 명칭
  description: string; // 항목 설명 및 적용 요율
  employeeMonthlyAmount: number; // 근로자 부담 월 공제액
  employerMonthlyAmount: number; // 사업주(회사) 부담 월 지원액
  employeeAnnualAmount: number; // 근로자 연간 공제 누적액
  percentageOfGross: number; // 세전 월 환산 급여 대비 공제 비중 (%)
}

export interface SalaryCalculationResult {
  input: SalaryInput;
  grossMonthlySalary: number; // 세전 월 환산 급여
  grossAnnualSalary: number; // 세전 연 환산 급여
  nonTaxableMonthly: number; // 월 비과세액
  taxableMonthlySalary: number; // 월 과세 대상 급여 (세전월급 - 비과세액)

  // 4대 보험 월 공제액 (근로자 부담분)
  nationalPension: number; // 국민연금 (4.5%, 상한 277,650원)
  healthInsurance: number; // 건강보험 (3.545%)
  longTermCare: number; // 노인장기요양보험 (건보의 12.95%)
  employmentInsurance: number; // 고용보험 (0.9%)
  totalFourMajorInsurances: number; // 4대 보험 합계

  // 회사 부담 4대 보험 월 지원액
  employerNationalPension: number; // 국민연금 (4.5%)
  employerHealthInsurance: number; // 건강보험 (3.545%)
  employerLongTermCare: number; // 노인장기요양보험 (건보의 12.95%)
  employerEmploymentInsurance: number; // 고용보험 (실업급여분 0.9%)
  totalEmployerInsurances: number; // 회사 부담 4대 보험 합계

  // 세금 월 공제액
  incomeTax: number; // 근로소득세 (간이세액표 누진세율 및 세액공제 반영)
  localIncomeTax: number; // 지방소득세 (근로소득세의 10%)
  totalTax: number; // 세금 합계

  // 최종 요약 지표
  totalMonthlyDeduction: number; // 월 총 공제액 (4대보험 + 세금)
  netMonthlySalary: number; // 월 예상 실수령액
  netAnnualSalary: number; // 연 예상 실수령액
  takeHomeRatio: number; // 실수령 비율 (%)
  totalDeductionRatio: number; // 총 공제 비율 (%)

  // 세부 명세 목록 (테이블 & 차트용)
  deductionItems: DeductionItem[];
}
