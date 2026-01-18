<script setup lang="ts">
import { taxService } from '@/services/taxService';
import { TaxCalculationResponse, TaxRatesResponse } from '@/types/tax.types';
import { onMounted, ref } from 'vue';
import TaxResult from './TaxResult.vue';

const income = ref<number | null>(null);
const selectedYear = ref<string>('');
const availableYears = ref<string[]>([]);
const result = ref<TaxCalculationResponse | null>(null);
const rates = ref<TaxRatesResponse | null>(null);
const loading = ref(false);
const loadingYears = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loadingYears.value = true;
    const years = await taxService.getAvailableTaxYears();

    if (Array.isArray(years) && years.length > 0) {
      availableYears.value = years;
      selectedYear.value = years[0];
    } else {
      console.error('Invalid years data:', years);
      error.value = 'No tax years available. Please check the API.';
    }

  } catch (err: any) {
    console.error('Error loading tax years:', err);
    error.value = `Failed to load tax years: ${err.message}. Please ensure the API is running at ` . (import.meta.env.VITE_API_BASE_URL);
  } finally {
    loadingYears.value = false;
  }
});

const calculateTax = async () => {
  if (!income.value || income.value <= 0) {
    error.value = 'Please enter a valid income amount.';
    return;
  }

  if (!selectedYear.value) {
    error.value = 'Please select a tax year.';
    return;
  }

  error.value = null;
  loading.value = true;

  try {
    // Add 5-second delay
    // await new Promise(resolve => setTimeout(resolve, 5000));
    
    result.value = await taxService.calculateTax({
      income: income.value,
      taxYear: selectedYear.value,
    });

    if(result.value) {
      rates.value = await taxService.getTaxRates(selectedYear.value);
    }
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to calculate tax';
    console.error('Tax calculation error:', err);
    result.value = null; 
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  income.value = null;
  result.value = null;
  error.value = null;
};
</script>

<template>
  <div class="calculator-container">
    <div class="header">
      <h1>🇦🇺 Australian Tax Calculator</h1>
      <p>
        Calculate your income tax for financial years 2020-21 to 2025-26
      </p>
    </div>

    <div class="form-container">
      <div class="form-group">
        <label for="income">Annual Income (AUD)</label>
        <input id="income" v-model.number="income" type="number" placeholder="e.g., 80000" min="0" step="1000"
          @keyup.enter="calculateTax" />
      </div>

      <div class="form-group">
        <label for="taxYear">Tax Year</label>
        <select id="taxYear" v-model="selectedYear">
          <option value="" disabled>Select tax year</option>
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="button-group">
        <button @click="calculateTax" :disabled="loading" class="btn-primary">
          {{ loading ? 'Calculating...' : 'Calculate Tax' }}
        </button>
        <button @click="resetForm" class="btn-secondary">Reset</button>
      </div>
    </div>
  </div>

  <div class="result-container">
    <TaxResult :result="result" :rates="rates" />
  </div>
</template>

<style scoped>
.calculator-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px;
}

.result-container {
  max-width: 95%;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 32px;
}

.header p {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.form-container {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #495057;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.error-message {
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  gap: 12px;
}

button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #7474ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #6565ba;
}

.btn-primary:disabled {
  background: #202055;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>
