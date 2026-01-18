export interface TaxCalculationRequest {
  income: number;
  taxYear: string;
}

export interface TaxRatesResponse {
  year: string;
  medicareLevy: number;
  brackets: {
    min: number;
    max: number;
    rate: number;
    base: number;
  }[];
}

export interface TaxCalculationResponse {
  grossIncome: number;
  incomeTax: number;
  medicareLevy: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  taxYear: string;
}
