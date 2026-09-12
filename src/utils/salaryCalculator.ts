import {
  SalaryInput,
  SalaryCalculationResult,
  DeductionItem,
} from '../types/salary';

/**
 * 2026년 기준 4대 사회보험 요율 및 상한액 상수
 */
export const SALARY_CONSTANTS = {
  // 국민연금 (4.5%, 상한액 617만 원, 하한액 39만 원)
  NATIONAL_PENSION_RATE: 0.045,
  NATIONAL_PENSION_MAX_MONTHLY_INCOME: 6_170_000,
  NATIONAL_PENSION_MIN_MONTHLY_INCOME: 390_000,
  NATIONAL_PENSION_MAX_PAYMENT: 277_650, // 6,170,000 * 0.045 = 277,650원

  // 건강보험 (3.545%)
  HEALTH_INSURANCE_RATE: 0.03545,

  // 노인장기요양보험 (건강보험료의 12.95%)
  LONG_TERM_CARE_RATE: 0.1295,

  // 고용보험 (0.9% - 실업급여 근로자 부담분)
  EMPLOYMENT_INSURANCE_RATE: 0.009,

  // 비과세 식대 기본 한도 (월 20만 원)
  DEFAULT_NON_TAXABLE_AMOUNT: 200_000,

  // 인적공제 기본공제 (1인당 연 150만 원)
  PERSONAL_DEDUCTION_PER_PERSON: 1_500_000,
};

/**
 * 10원 단위 미만 절사 (원단위 절사)
 * 부동소수점 연산 미세 오차(예: 26999.999999999996) 방지를 위해 정수 반올림 후 10원 단위 절사
 */
export function floorToTens(amount: number): number {
  if (amount <= 0) return 0;
  const rounded = Math.round(amount);
  return Math.floor(rounded / 10) * 10;
}

/**
 * 근로소득공제액 산출 (연간 총급여 기준)
 */
export function calculateEarnedIncomeDeduction(annualGross: number): number {
  if (annualGross <= 0) return 0;
  if (annualGross <= 5_000_000) {
    return annualGross * 0.7;
  }
  if (annualGross <= 15_000_000) {
    return 3_500_000 + (annualGross - 5_000_000) * 0.4;
  }
  if (annualGross <= 45_000_000) {
    return 7_500_000 + (annualGross - 15_000_000) * 0.15;
  }
  if (annualGross <= 100_000_000) {
    return 12_000_000 + (annualGross - 45_000_000) * 0.05;
  }
  // 1억원 초과 (최대 한도 2,000만원)
  const deduction = 14_750_000 + (annualGross - 100_000_000) * 0.02;
  return Math.min(20_000_000, deduction);
}

/**
 * 종합소득세 과세표준 8단계 기본 누진세율 적용 산출세액 계산
 */
export function calculateIncomeTaxFromTaxBase(taxBase: number): number {
  if (taxBase <= 0) return 0;
  if (taxBase <= 14_000_000) {
    return taxBase * 0.06;
  }
  if (taxBase <= 50_000_000) {
    return taxBase * 0.15 - 1_260_000;
  }
  if (taxBase <= 88_000_000) {
    return taxBase * 0.24 - 5_760_000;
  }
  if (taxBase <= 150_000_000) {
    return taxBase * 0.35 - 15_440_000;
  }
  if (taxBase <= 300_000_000) {
    return taxBase * 0.38 - 19_940_000;
  }
  if (taxBase <= 500_000_000) {
    return taxBase * 0.40 - 25_940_000;
  }
  if (taxBase <= 1_000_000_000) {
    return taxBase * 0.42 - 35_940_000;
  }
  return taxBase * 0.45 - 65_940_000;
}

/**
 * 근로소득 세액공제 산출 (총급여 및 산출세액 기준)
 */
export function calculateEarnedIncomeTaxCredit(
  calculatedTax: number,
  annualGross: number
): number {
  if (calculatedTax <= 0) return 0;

  // 1. 산출세액 기준 공제액
  let credit = 0;
  if (calculatedTax <= 1_300_000) {
    credit = calculatedTax * 0.55;
  } else {
    credit = 715_000 + (calculatedTax - 1_300_000) * 0.3;
  }

  // 2. 총급여 구간별 공제 한도
  let limit = 740_000;
  if (annualGross <= 33_000_000) {
    limit = 740_000;
  } else if (annualGross <= 70_000_000) {
    limit = Math.max(660_000, 740_000 - (annualGross - 33_000_000) * 0.008);
  } else {
    limit = Math.max(500_000, 660_000 - (annualGross - 70_000_000) * 0.5);
  }

  return Math.min(credit, limit);
}

/**
 * 20세 이하 자녀 세액공제 산출 (연간 기준)
 */
export function calculateChildTaxCredit(childrenCount: number): number {
  if (childrenCount <= 0) return 0;
  if (childrenCount === 1) return 150_000;
  if (childrenCount === 2) return 350_000;
  return 350_000 + (childrenCount - 2) * 300_000;
}

/**
 * 국세청 간이세액표 기준 월 근로소득세 및 지방소득세 산출
 */
export function calculateMonthlyIncomeTax(
  taxableMonthlySalary: number,
  familyCount: number,
  childrenCount: number
): { incomeTax: number; localIncomeTax: number } {
  if (taxableMonthlySalary <= 0) {
    return { incomeTax: 0, localIncomeTax: 0 };
  }

  // 최저생계비 수준(월 과세급여 약 106만 원 이하)은 소득세 0원
  if (taxableMonthlySalary < 1_060_000) {
    return { incomeTax: 0, localIncomeTax: 0 };
  }

  const annualGross = taxableMonthlySalary * 12;

  // 1. 근로소득공제
  const earnedIncomeDeduction = calculateEarnedIncomeDeduction(annualGross);
  const earnedIncomeAmount = Math.max(0, annualGross - earnedIncomeDeduction);

  // 2. 인적공제 (기본공제 1인당 150만 원)
  const personalDeduction =
    Math.max(1, familyCount) * SALARY_CONSTANTS.PERSONAL_DEDUCTION_PER_PERSON;

  // 3. 연금보험료 공제 (국민연금 연간 납부액)
  const pensionMonthly = calculateNationalPension(taxableMonthlySalary);
  const pensionDeduction = pensionMonthly * 12;

  // 4. 특별소득공제 및 표준세액공제 등 기본 반영치 (간이세액표 표준 추정치)
  // 간이세액표는 부양가족 수에 따른 특별공제 표준 산출공식을 내장함
  let specialDeduction = 0;
  if (familyCount === 1) {
    specialDeduction = Math.min(3_100_000, annualGross * 0.1);
  } else if (familyCount === 2) {
    specialDeduction = Math.min(3_600_000, annualGross * 0.12);
  } else {
    specialDeduction = Math.min(5_000_000, annualGross * 0.15);
  }

  // 5. 과세표준 산출
  const taxBase = Math.max(
    0,
    earnedIncomeAmount - personalDeduction - pensionDeduction - specialDeduction
  );

  // 6. 산출세액
  const calculatedTax = calculateIncomeTaxFromTaxBase(taxBase);

  // 7. 세액공제 (근로소득세액공제 + 자녀세액공제)
  const earnedIncomeTaxCredit = calculateEarnedIncomeTaxCredit(
    calculatedTax,
    annualGross
  );
  const childTaxCredit = calculateChildTaxCredit(childrenCount);

  // 8. 연간 결정세액
  const annualDeterminedTax = Math.max(
    0,
    calculatedTax - earnedIncomeTaxCredit - childTaxCredit
  );

  // 9. 월 소득세 (12개월 균등 분할 및 10원 미만 절사)
  const incomeTax = floorToTens(annualDeterminedTax / 12);

  // 10. 지방소득세 (소득세의 10%, 10원 미만 절사)
  const localIncomeTax = floorToTens(incomeTax * 0.1);

  return { incomeTax, localIncomeTax };
}

/**
 * 국민연금 월 공제액 산출 (4.5%, 상한 277,650원, 하한 17,550원)
 */
export function calculateNationalPension(taxableMonthlySalary: number): number {
  if (taxableMonthlySalary <= 0) return 0;
  const cappedIncome = Math.max(
    SALARY_CONSTANTS.NATIONAL_PENSION_MIN_MONTHLY_INCOME,
    Math.min(
      SALARY_CONSTANTS.NATIONAL_PENSION_MAX_MONTHLY_INCOME,
      taxableMonthlySalary
    )
  );
  const pension = cappedIncome * SALARY_CONSTANTS.NATIONAL_PENSION_RATE;
  return floorToTens(pension);
}

/**
 * 건강보험 월 공제액 산출 (3.545%)
 */
export function calculateHealthInsurance(taxableMonthlySalary: number): number {
  if (taxableMonthlySalary <= 0) return 0;
  return floorToTens(
    taxableMonthlySalary * SALARY_CONSTANTS.HEALTH_INSURANCE_RATE
  );
}

/**
 * 노인장기요양보험 월 공제액 산출 (건강보험료의 12.95%)
 */
export function calculateLongTermCare(healthInsurance: number): number {
  if (healthInsurance <= 0) return 0;
  return floorToTens(healthInsurance * SALARY_CONSTANTS.LONG_TERM_CARE_RATE);
}

/**
 * 고용보험 월 공제액 산출 (0.9%)
 */
export function calculateEmploymentInsurance(
  taxableMonthlySalary: number
): number {
  if (taxableMonthlySalary <= 0) return 0;
  return floorToTens(
    taxableMonthlySalary * SALARY_CONSTANTS.EMPLOYMENT_INSURANCE_RATE
  );
}

/**
 * 연봉/월급 입력 기반 전체 급여 및 공제 종합 계산기
 */
export function calculateSalary(input: SalaryInput): SalaryCalculationResult {
  const safeGross = Math.max(0, input.grossAmount || 0);

  // 1. 월 환산 급여 및 연 환산 급여 산정
  let grossMonthlySalary = 0;
  let grossAnnualSalary = 0;

  if (input.paymentType === 'annual') {
    grossAnnualSalary = safeGross;
    const divider = input.severanceType === 'included' ? 13 : 12;
    grossMonthlySalary = Math.round(safeGross / divider);
  } else {
    grossMonthlySalary = safeGross;
    const multiplier = input.severanceType === 'included' ? 13 : 12;
    grossAnnualSalary = safeGross * multiplier;
  }

  // 2. 비과세액 및 과세 대상 급여 산정
  const safeNonTaxable = Math.max(0, input.nonTaxableAmount || 0);
  const nonTaxableMonthly = Math.min(safeNonTaxable, grossMonthlySalary);
  const taxableMonthlySalary = Math.max(0, grossMonthlySalary - nonTaxableMonthly);

  // 3. 4대 사회보험 산출 (근로자 부담분)
  const nationalPension = calculateNationalPension(taxableMonthlySalary);
  const healthInsurance = calculateHealthInsurance(taxableMonthlySalary);
  const longTermCare = calculateLongTermCare(healthInsurance);
  const employmentInsurance = calculateEmploymentInsurance(taxableMonthlySalary);
  const totalFourMajorInsurances =
    nationalPension + healthInsurance + longTermCare + employmentInsurance;

  // 4. 회사(사업주) 부담 4대 보험 산출
  const employerNationalPension = nationalPension;
  const employerHealthInsurance = healthInsurance;
  const employerLongTermCare = longTermCare;
  const employerEmploymentInsurance = employmentInsurance;
  const totalEmployerInsurances =
    employerNationalPension +
    employerHealthInsurance +
    employerLongTermCare +
    employerEmploymentInsurance;

  // 5. 소득세 및 지방소득세 산출
  const { incomeTax, localIncomeTax } = calculateMonthlyIncomeTax(
    taxableMonthlySalary,
    input.familyCount || 1,
    input.childrenCount || 0
  );
  const totalTax = incomeTax + localIncomeTax;

  // 6. 총 공제액 및 실수령액
  const totalMonthlyDeduction = totalFourMajorInsurances + totalTax;
  const netMonthlySalary = Math.max(
    0,
    grossMonthlySalary - totalMonthlyDeduction
  );
  const netAnnualSalary = netMonthlySalary * 12;

  const takeHomeRatio =
    grossMonthlySalary > 0
      ? Number(((netMonthlySalary / grossMonthlySalary) * 100).toFixed(1))
      : 0;

  const totalDeductionRatio =
    grossMonthlySalary > 0
      ? Number(((totalMonthlyDeduction / grossMonthlySalary) * 100).toFixed(1))
      : 0;

  // 7. 6대 공제 항목 상세 목록 생성 (테이블 및 차트용)
  const deductionItems: DeductionItem[] = [
    {
      id: 'national_pension',
      name: '국민연금',
      description: '기준소득월액의 4.5% (월 최대 277,650원)',
      employeeMonthlyAmount: nationalPension,
      employerMonthlyAmount: employerNationalPension,
      employeeAnnualAmount: nationalPension * 12,
      percentageOfGross:
        grossMonthlySalary > 0
          ? Number(((nationalPension / grossMonthlySalary) * 100).toFixed(2))
          : 0,
    },
    {
      id: 'health_insurance',
      name: '건강보험',
      description: '과세 대상 급여의 3.545%',
      employeeMonthlyAmount: healthInsurance,
      employerMonthlyAmount: employerHealthInsurance,
      employeeAnnualAmount: healthInsurance * 12,
      percentageOfGross:
        grossMonthlySalary > 0
          ? Number(((healthInsurance / grossMonthlySalary) * 100).toFixed(2))
          : 0,
    },
    {
      id: 'long_term_care',
      name: '노인장기요양보험',
      description: '건강보험료의 12.95%',
      employeeMonthlyAmount: longTermCare,
      employerMonthlyAmount: employerLongTermCare,
      employeeAnnualAmount: longTermCare * 12,
      percentageOfGross:
        grossMonthlySalary > 0
          ? Number(((longTermCare / grossMonthlySalary) * 100).toFixed(2))
          : 0,
    },
    {
      id: 'employment_insurance',
      name: '고용보험',
      description: '과세 대상 급여의 0.9% (실업급여분)',
      employeeMonthlyAmount: employmentInsurance,
      employerMonthlyAmount: employerEmploymentInsurance,
      employeeAnnualAmount: employmentInsurance * 12,
      percentageOfGross:
        grossMonthlySalary > 0
          ? Number(((employmentInsurance / grossMonthlySalary) * 100).toFixed(2))
          : 0,
    },
    {
      id: 'income_tax',
      name: '근로소득세',
      description: '국세청 간이세액표 기준 누진세율 적용',
      employeeMonthlyAmount: incomeTax,
      employerMonthlyAmount: 0,
      employeeAnnualAmount: incomeTax * 12,
      percentageOfGross:
        grossMonthlySalary > 0
          ? Number(((incomeTax / grossMonthlySalary) * 100).toFixed(2))
          : 0,
    },
    {
      id: 'local_income_tax',
      name: '지방소득세',
      description: '근로소득세의 10%',
      employeeMonthlyAmount: localIncomeTax,
      employerMonthlyAmount: 0,
      employeeAnnualAmount: localIncomeTax * 12,
      percentageOfGross:
        grossMonthlySalary > 0
          ? Number(((localIncomeTax / grossMonthlySalary) * 100).toFixed(2))
          : 0,
    },
  ];

  return {
    input,
    grossMonthlySalary,
    grossAnnualSalary,
    nonTaxableMonthly,
    taxableMonthlySalary,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    totalFourMajorInsurances,
    employerNationalPension,
    employerHealthInsurance,
    employerLongTermCare,
    employerEmploymentInsurance,
    totalEmployerInsurances,
    incomeTax,
    localIncomeTax,
    totalTax,
    totalMonthlyDeduction,
    netMonthlySalary,
    netAnnualSalary,
    takeHomeRatio,
    totalDeductionRatio,
    deductionItems,
  };
}
