import {
    TaxCalculationRequest,
    TaxCalculationResponse,
    TaxRatesResponse,
} from "@/types/tax.types";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const taxService = {
    async getAvailableTaxYears(): Promise<string[]> {
        try {
            const response = await api.get<string[]>("/tax/years");
            return response.data;
        } catch (error) {
            console.error("Error fetching tax years:", error);
            throw error;
        }
    },

    async calculateTax(data: TaxCalculationRequest): Promise<TaxCalculationResponse> {
        try {
            const response = await api.post<TaxCalculationResponse>('/tax/calculate', data);
            console.log('Tax Calculation Response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Error calculating tax:', error);
            throw error;
        }
    },

    async getTaxRates(taxYear: string): Promise<TaxRatesResponse> {
        try {
            const response = await api.get<TaxRatesResponse>(`/tax/rates/${taxYear}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching tax rates:", error);
            throw error;
        }
    }
};

