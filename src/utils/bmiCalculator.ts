import { BmiCategory, BmiCategoryInfo, BmiInput, BmiResult } from '../types/bmi';

export const BMI_CATEGORIES: Record<BmiCategory, BmiCategoryInfo> = {
  underweight: {
    category: 'underweight',
    label: '저체중',
    subLabel: 'BMI 18.5 미만',
    minBmi: 0,
    maxBmi: 18.49,
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-500',
    description: '체중이 부족하여 면역력 저하 및 영양 불균형에 유의해야 합니다.',
  },
  normal: {
    category: 'normal',
    label: '정상',
    subLabel: 'BMI 18.5 - 22.9',
    minBmi: 18.5,
    maxBmi: 22.99,
    color: 'text-emerald-500 dark:text-[#d1ff19]',
    bgColor: 'bg-emerald-500 dark:bg-[#d1ff19]',
    borderColor: 'border-emerald-500 dark:border-[#d1ff19]',
    description: '대한비만학회 기준 가장 이상적이고 질병 위험이 낮은 건강 체중입니다.',
  },
  'pre-obese': {
    category: 'pre-obese',
    label: '비만전단계 (과체중)',
    subLabel: 'BMI 23.0 - 24.9',
    minBmi: 23.0,
    maxBmi: 24.99,
    color: 'text-amber-500 dark:text-amber-400',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500',
    description: '비만으로 진행될 위험이 있어 식습관 개선과 유산소 운동이 권장됩니다.',
  },
  'obese-1': {
    category: 'obese-1',
    label: '1단계 비만',
    subLabel: 'BMI 25.0 - 29.9',
    minBmi: 25.0,
    maxBmi: 29.99,
    color: 'text-orange-500 dark:text-orange-400',
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-500',
    description: '고혈압, 당뇨 등 대사 질환 위험이 증가하므로 체중 감량이 필요합니다.',
  },
  'obese-2': {
    category: 'obese-2',
    label: '2단계 비만',
    subLabel: 'BMI 30.0 - 34.9',
    minBmi: 30.0,
    maxBmi: 34.99,
    color: 'text-rose-500 dark:text-rose-400',
    bgColor: 'bg-rose-500',
    borderColor: 'border-rose-500',
    description: '심뇌혈관 질환 발생 위험이 크게 높아져 적극적인 치료적 관리가 필요합니다.',
  },
  'obese-3': {
    category: 'obese-3',
    label: '3단계 고도비만',
    subLabel: 'BMI 35.0 이상',
    minBmi: 35.0,
    maxBmi: 60,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-600',
    borderColor: 'border-purple-600',
    description: '전문의 진료와 함께 체계적인 비만 치료 및 생활습관 교정이 시급합니다.',
  },
};

/**
 * 대한비만학회(KSSO) 한국인 기준 비만도 단계 판정
 */
export const getBmiCategory = (bmi: number): BmiCategory => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 23.0) return 'normal';
  if (bmi < 25.0) return 'pre-obese';
  if (bmi < 30.0) return 'obese-1';
  if (bmi < 35.0) return 'obese-2';
  return 'obese-3';
};

/**
 * 신장 기준 적정 표준 체중 계산 (남성: m^2 * 22, 여성: m^2 * 21)
 */
export const calculateIdealWeight = (heightCm: number, gender: 'male' | 'female'): number => {
  const heightM = heightCm / 100;
  const factor = gender === 'male' ? 22 : 21;
  return Number((heightM * heightM * factor).toFixed(1));
};

/**
 * 신장 기준 정상 체중 범위 산출 (BMI 18.5 ~ 22.9)
 */
export const calculateNormalWeightRange = (heightCm: number): { min: number; max: number } => {
  const heightM = heightCm / 100;
  const heightSq = heightM * heightM;
  const min = Number((heightSq * 18.5).toFixed(1));
  const max = Number((heightSq * 22.9).toFixed(1));
  return { min, max };
};

/**
 * 종합 BMI 계산 및 비만도 분석
 */
export const calculateBmi = (input: BmiInput): BmiResult => {
  const heightCm = Math.max(100, Math.min(250, input.height || 170));
  const weightKg = Math.max(30, Math.min(200, input.weight || 65));
  const gender = input.gender || 'male';

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Number(rawBmi.toFixed(1));

  const category = getBmiCategory(bmi);
  const categoryInfo = BMI_CATEGORIES[category];

  const idealWeight = calculateIdealWeight(heightCm, gender);
  const { min: normalWeightMin, max: normalWeightMax } = calculateNormalWeightRange(heightCm);

  let weightDiff = 0;
  let weightDiffStatus: 'maintain' | 'lose' | 'gain' = 'maintain';
  let weightDiffLabel = '현재 정상 체중 범위를 건강하게 유지하고 있습니다.';

  if (weightKg > normalWeightMax) {
    weightDiff = Number((weightKg - normalWeightMax).toFixed(1));
    weightDiffStatus = 'lose';
    weightDiffLabel = `정상 상한선(${normalWeightMax}kg) 도달까지 약 -${weightDiff}kg 감량 권장`;
  } else if (weightKg < normalWeightMin) {
    weightDiff = Number((normalWeightMin - weightKg).toFixed(1));
    weightDiffStatus = 'gain';
    weightDiffLabel = `정상 하한선(${normalWeightMin}kg) 도달까지 약 +${weightDiff}kg 증량 권장`;
  }

  let healthComment = '';
  switch (category) {
    case 'underweight':
      healthComment = '충분한 영양 섭취와 근력 운동을 통해 기초 체력을 보강하세요.';
      break;
    case 'normal':
      healthComment = '균형 잡힌 식단과 규칙적인 운동으로 현재의 건강한 체형을 유지하세요.';
      break;
    case 'pre-obese':
      healthComment = '비만으로 넘어가지 않도록 간식과 탄수화물을 줄이고 유산소 운동을 시작하세요.';
      break;
    case 'obese-1':
      healthComment = '주 3회 이상 30분 유산소 운동과 하루 500kcal 식단 조절을 권장합니다.';
      break;
    case 'obese-2':
      healthComment = '혈압과 혈당 등 정기적인 건강검진과 함께 체계적인 감량 계획이 필요합니다.';
      break;
    case 'obese-3':
      healthComment = '단독 다이어트보다 비만 클리닉 전문의 상담을 통한 의학적 치료를 권장합니다.';
      break;
  }

  return {
    bmi,
    category,
    categoryInfo,
    idealWeight,
    normalWeightMin,
    normalWeightMax,
    weightDiff,
    weightDiffStatus,
    weightDiffLabel,
    healthComment,
  };
};
