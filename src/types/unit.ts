export type UnitCategory = 'area' | 'length' | 'weight' | 'volume' | 'temperature';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  category: UnitCategory;
  ratioToBase: number; // 기준 단위 대비 비율 (단, 온도는 별도 함수 처리)
  description?: string;
  isPopular?: boolean;
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
  description?: string;
}

export type DecimalPrecision = 0 | 2 | 4 | 6;
