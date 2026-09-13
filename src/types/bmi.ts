export type Gender = 'male' | 'female';

export type BmiCategory =
  | 'underweight'      // 저체중 (<18.5)
  | 'normal'           // 정상 (18.5 - 22.9)
  | 'pre-obese'        // 비만전단계/과체중 (23.0 - 24.9)
  | 'obese-1'          // 1단계 비만 (25.0 - 29.9)
  | 'obese-2'          // 2단계 비만 (30.0 - 34.9)
  | 'obese-3';         // 3단계 고도비만 (>=35.0)

export interface BmiCategoryInfo {
  category: BmiCategory;
  label: string;
  subLabel: string;
  minBmi: number;
  maxBmi: number;
  color: string;       // 텍스트/뱃지 색상
  bgColor: string;     // 게이지 배경 색상
  borderColor: string;
  description: string;
}

export interface BmiInput {
  height: number;      // 신장 (cm, 100 - 250)
  weight: number;      // 체중 (kg, 30 - 200)
  gender: Gender;      // 성별 ('male' | 'female')
  age?: number;        // 나이 (기본 30)
}

export interface BmiResult {
  bmi: number;                 // BMI 수치 (소수점 1자리)
  category: BmiCategory;       // 판정 단계
  categoryInfo: BmiCategoryInfo; // 판정 세부 정보
  idealWeight: number;         // 나의 적정 표준 체중 (kg)
  normalWeightMin: number;     // 정상 체중 하한 (kg)
  normalWeightMax: number;     // 정상 체중 상한 (kg)
  weightDiff: number;          // 정상 범위 도달을 위한 체중 차이 (kg)
  weightDiffStatus: 'maintain' | 'lose' | 'gain';
  weightDiffLabel: string;     // 체중 조절 안내 문구
  healthComment: string;       // 의학적 한 줄 가이드
}
