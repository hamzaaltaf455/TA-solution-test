import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { ConversionResponse, CurrencyOption } from '../models/currency.models';

@Injectable({
  providedIn: 'root',
})
export class CurrencyApiService {
  constructor(private readonly http: HttpClient) {}

  getCurrencies() {
    return this.http.get<{ data: CurrencyOption[] }>(`${API_BASE_URL}/currencies`).pipe(map((response) => response.data));
  }

  getHistoricalRate(params: { date: string; base: string; target: string; amount: number }) {
    return this.http.get<ConversionResponse>(`${API_BASE_URL}/historical`, { params });
  }
}
