<script setup lang="ts">
import type { TaxCalculationResponse, TaxRatesResponse } from "@/types/tax.types";

defineProps<{
  result: TaxCalculationResponse | null;
  rates: TaxRatesResponse | null;
}>();

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
};
</script>

<template>
  <div v-if="result || rates" class="results-row">
    <div v-if="result" class="result-container col-6">
      <h2>Tax Calculation Results</h2>
      <p class="tax-year">Tax Year: {{ result.taxYear }}</p>

      <div class="result-grid">
        <div class="result-item">
          <span class="label">Gross Income:</span>
          <span class="value">{{ formatCurrency(result.grossIncome) }}</span>
        </div>

        <div class="result-item highlight">
          <span class="label">Income Tax:</span>
          <span class="value negative">{{
            formatCurrency(result.incomeTax)
          }}</span>
        </div>

        <div class="result-item highlight">
          <span class="label">Medicare Levy:</span>
          <span class="value negative">{{
            formatCurrency(result.medicareLevy)
          }}</span>
        </div>

        <div class="result-item total">
          <span class="label">Total Tax:</span>
          <span class="value negative">{{
            formatCurrency(result.totalTax)
          }}</span>
        </div>

        <div class="result-item net">
          <span class="label">Net Income:</span>
          <span class="value positive">{{
            formatCurrency(result.netIncome)
          }}</span>
        </div>

        <div class="result-item">
          <span class="label">Effective Tax Rate:</span>
          <span class="value">{{ result.effectiveTaxRate }}%</span>
        </div>
      </div>
    </div>
    
    <div v-if="rates" class="result-container col-6">
      <h2>Tax Rates for {{ rates.year }}</h2>

      <div class="result-grid">
        <div v-for="(bracket, index) in rates.brackets" :key="index" class="result-item">
          <span class="label">
            {{ formatCurrency(bracket.min) }} -
            {{ formatCurrency(bracket.max) }}
          </span>
          <span class="value">{{ bracket.rate * 100 }}% (Base: {{  formatCurrency(bracket.base)  }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-row {
  display: flex;
  gap: 20px;
}

.col-6 {
  flex: 1;
  min-width: 0; /* Prevents flex items from overflowing */
}

.result-container {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
}

h2 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 24px;
}

.tax-year {
  color: #6c757d;
  margin: 0 0 20px 0;
  font-size: 14px;
}

.result-grid {
  display: grid;
  gap: 12px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: white;
  border-radius: 6px;
}

.result-item.highlight {
  background: #fff3cd;
}

.result-item.total {
  background: #f8d7da;
  font-weight: 600;
}

.result-item.net {
  background: #d4edda;
  font-weight: 600;
  font-size: 18px;
}

.label {
  color: #495057;
}

.value {
  font-weight: 600;
  color: #2c3e50;
}

.value.negative {
  color: #dc3545;
}

.value.positive {
  color: #28a745;
}

/* Responsive: Stack on smaller screens */
@media (max-width: 768px) {
  .results-row {
    flex-direction: column;
  }
  
  .col-6 {
    flex: none;
  }
}
</style>
