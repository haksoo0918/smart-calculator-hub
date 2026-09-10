import {
  EarlyRepaymentResult,
  LoanComparisonSummary,
  LoanInput,
  MonthlyRepayment,
  RepaymentCalculationResult,
  RepaymentMethod,
} from '../types/loan';

/**
 * 시중은행 표준 중도상환 수수료 산출 공식 (3년 슬라이딩 감면)
 * 수수료 = 상환금액 * (수수료율 / 100) * ((36 - 경과월수) / 36)
 * 대출 후 36개월(3년) 경과 시 수수료는 0원(전액 면제)
 */
export function calculateEarlyRepaymentFee(
  amount: number,
  feeRate: number,
  elapsedMonths: number
): number {
  if (elapsedMonths >= 36 || amount <= 0 || feeRate <= 0) {
    return 0;
  }
  const remainingFactor = Math.max(0, (36 - elapsedMonths) / 36);
  return Math.round(amount * (feeRate / 100) * remainingFactor);
}

/**
 * 단일 대출 상환 방식에 따른 월별 상환 스케줄 및 지표 정밀 산출
 */
export function calculateLoanRepayment(input: LoanInput): RepaymentCalculationResult {
  const {
    loanAmount,
    annualRate,
    loanTermYears,
    gracePeriodMonths = 0,
    repaymentMethod,
    earlyRepayment,
  } = input;

  const totalMonths = Math.max(1, Math.round(loanTermYears * 12));
  const graceMonths = Math.min(totalMonths - 1, Math.max(0, Math.round(gracePeriodMonths)));
  const repaymentMonths = totalMonths - graceMonths;
  const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;

  // 중도상환 설정 유효성 검증
  const hasEarlyRepayment = Boolean(
    earlyRepayment &&
      earlyRepayment.enabled &&
      earlyRepayment.amount > 0 &&
      earlyRepayment.afterMonths > 0 &&
      earlyRepayment.afterMonths <= totalMonths
  );

  let currentBalance = loanAmount;
  const schedule: MonthlyRepayment[] = [];
  let totalInterest = 0;
  let totalPrincipalPaid = 0;

  // 원리금균등 상환액 고정 공식 (상환 기간 개월수 기준)
  let fixedMonthlyPayment = 0;
  if (repaymentMethod === 'equal_payment') {
    if (monthlyRate === 0) {
      fixedMonthlyPayment = Math.round(loanAmount / repaymentMonths);
    } else {
      const pow = Math.pow(1 + monthlyRate, repaymentMonths);
      fixedMonthlyPayment = Math.round(loanAmount * ((monthlyRate * pow) / (pow - 1)));
    }
  }

  // 원금균등 매월 균등 상환 원금
  let equalPrincipalMonthly =
    repaymentMethod === 'equal_principal'
      ? Math.floor(loanAmount / repaymentMonths)
      : 0;

  for (let m = 1; m <= totalMonths; m++) {
    const year = Math.ceil(m / 12);
    const monthInYear = ((m - 1) % 12) + 1;
    const isGrace = m <= graceMonths;

    if (currentBalance <= 0) {
      schedule.push({
        month: m,
        year,
        monthInYear,
        isGracePeriod: isGrace,
        principalPayment: 0,
        interestPayment: 0,
        totalPayment: 0,
        remainingBalance: 0,
      });
      continue;
    }

    // 당월 대출이자
    const interest = Math.round(currentBalance * monthlyRate);
    let principal = 0;

    if (isGrace) {
      principal = 0;
    } else if (repaymentMethod === 'bullet') {
      // 만기일시: 마지막 회차에 전액 상환
      if (m === totalMonths) {
        principal = currentBalance;
      } else {
        principal = 0;
      }
    } else if (repaymentMethod === 'equal_principal') {
      // 원금균등
      if (m === totalMonths) {
        principal = currentBalance; // 마지막 회차 잔여 원금 완납
      } else {
        principal = Math.min(currentBalance, equalPrincipalMonthly);
      }
    } else {
      // 원리금균등 (equal_payment)
      if (m === totalMonths) {
        principal = currentBalance; // 마지막 회차 단수 오차 보정
      } else {
        principal = Math.min(currentBalance, Math.max(0, fixedMonthlyPayment - interest));
      }
    }

    // 중도상환 적용 체크
    let isEarlyMonth = false;
    let extraPrincipal = 0;
    if (hasEarlyRepayment && m === earlyRepayment!.afterMonths) {
      isEarlyMonth = true;
      const remainingAfterRegular = Math.max(0, currentBalance - principal);
      extraPrincipal = Math.min(remainingAfterRegular, earlyRepayment!.amount);
    }

    const totalPrincipalThisMonth = principal + extraPrincipal;
    const newBalance = Math.max(0, currentBalance - totalPrincipalThisMonth);
    const monthlyTotalPayment = totalPrincipalThisMonth + interest;

    totalInterest += interest;
    totalPrincipalPaid += totalPrincipalThisMonth;
    currentBalance = newBalance;

    schedule.push({
      month: m,
      year,
      monthInYear,
      isGracePeriod: isGrace,
      isEarlyRepaymentMonth: isEarlyMonth,
      earlyRepaymentAmount: extraPrincipal > 0 ? extraPrincipal : undefined,
      principalPayment: totalPrincipalThisMonth,
      interestPayment: interest,
      totalPayment: monthlyTotalPayment,
      remainingBalance: currentBalance,
    });

    // 중도상환 후 원리금균등/원금균등 잔액 재계산 (남은 개월수 동안 분할)
    if (isEarlyMonth && currentBalance > 0 && m < totalMonths) {
      const remainingMonths = totalMonths - m;
      if (repaymentMethod === 'equal_payment') {
        if (monthlyRate === 0) {
          fixedMonthlyPayment = Math.round(currentBalance / remainingMonths);
        } else {
          const pow = Math.pow(1 + monthlyRate, remainingMonths);
          fixedMonthlyPayment = Math.round(currentBalance * ((monthlyRate * pow) / (pow - 1)));
        }
      } else if (repaymentMethod === 'equal_principal') {
        equalPrincipalMonthly = Math.floor(currentBalance / remainingMonths);
      }
    }
  }

  const validPayments = schedule.map((s) => s.totalPayment).filter((p) => p > 0);
  const firstMonthPayment = schedule.length > 0 ? schedule[0].totalPayment : 0;
  const lastMonthPayment =
    schedule.length > 0 ? schedule[schedule.length - 1].totalPayment : 0;
  const monthlyAveragePayment =
    validPayments.length > 0
      ? Math.round(validPayments.reduce((acc, cur) => acc + cur, 0) / validPayments.length)
      : 0;
  const maxMonthlyPayment = validPayments.length > 0 ? Math.max(...validPayments) : 0;
  const minMonthlyPayment = validPayments.length > 0 ? Math.min(...validPayments) : 0;

  // 중도상환 혜택 계산
  let earlyRepaymentResult: EarlyRepaymentResult | undefined;
  if (hasEarlyRepayment) {
    const feeAmount = calculateEarlyRepaymentFee(
      earlyRepayment!.amount,
      earlyRepayment!.feeRate,
      earlyRepayment!.afterMonths
    );

    // 중도상환 없는 기본 스펙 이자 계산
    const baseline = calculateLoanRepayment({
      ...input,
      earlyRepayment: undefined,
    });
    const savedInterest = Math.max(0, baseline.totalInterest - totalInterest);
    const netBenefit = savedInterest - feeAmount;

    earlyRepaymentResult = {
      feeAmount,
      savedInterest,
      netBenefit,
    };
  }

  return {
    method: repaymentMethod,
    totalRepayment: loanAmount + totalInterest,
    totalInterest,
    firstMonthPayment,
    lastMonthPayment,
    monthlyAveragePayment,
    maxMonthlyPayment,
    minMonthlyPayment,
    schedule,
    earlyRepayment: earlyRepaymentResult,
  };
}

/**
 * 원리금균등, 원금균등, 만기일시 3대 상환 방식을 동시에 산출 및 비교
 */
export function compareLoanMethods(input: LoanInput): LoanComparisonSummary {
  const equalPayment = calculateLoanRepayment({
    ...input,
    repaymentMethod: 'equal_payment',
  });

  const equalPrincipal = calculateLoanRepayment({
    ...input,
    repaymentMethod: 'equal_principal',
  });

  const bullet = calculateLoanRepayment({
    ...input,
    repaymentMethod: 'bullet',
  });

  let lowestInterestMethod: RepaymentMethod = 'equal_principal';
  if (
    equalPayment.totalInterest <= equalPrincipal.totalInterest &&
    equalPayment.totalInterest <= bullet.totalInterest
  ) {
    lowestInterestMethod = 'equal_payment';
  } else if (
    bullet.totalInterest <= equalPayment.totalInterest &&
    bullet.totalInterest <= equalPrincipal.totalInterest
  ) {
    lowestInterestMethod = 'bullet';
  }

  const interestSavingsVsEqualPayment = Math.max(
    0,
    equalPayment.totalInterest - equalPrincipal.totalInterest
  );

  return {
    equalPayment,
    equalPrincipal,
    bullet,
    lowestInterestMethod,
    interestSavingsVsEqualPayment,
  };
}

/**
 * 한글 금액 단위 변환 헬퍼 (예: 350000000 -> 3억 5,000만 원)
 */
export function formatKoreanLoanAmount(amount: number): string {
  if (!amount || amount === 0) return '0원';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  const eok = Math.floor(abs / 100_000_000);
  const man = Math.floor((abs % 100_000_000) / 10_000);
  const rest = Math.floor(abs % 10_000);

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString()}억`);
  if (man > 0) parts.push(`${man.toLocaleString()}만`);
  if (rest > 0 && eok === 0 && man === 0) parts.push(`${rest.toLocaleString()}`);

  const formatted = parts.length > 0 ? `${parts.join(' ')} 원` : '0원';
  return isNegative ? `-${formatted}` : formatted;
}
