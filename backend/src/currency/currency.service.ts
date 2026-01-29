import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

export interface CurrencyListItem {
  code: string;
  name: string;
  symbol: string | null;
}

@Injectable()
export class CurrencyService {
  private readonly apiBaseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiBaseUrl = 'https://api.freecurrencyapi.com/v1';
    this.apiKey = this.configService.get<string>('FREECURRENCY_API_KEY') ?? '';
  }

  async getCurrencies(): Promise<CurrencyListItem[]> {
    if (!this.apiKey) throw new Error('Missing FREECURRENCY_API_KEY.');
    const url = `${this.apiBaseUrl}/currencies`;
    const response = await lastValueFrom(this.httpService.get(url, { params: { apikey: this.apiKey } }));
    const data = response.data?.data ?? {};
    return Object.entries(data).map(([code, details]: [string, any]) => ({
      code,
      name: details.name,
      symbol: details.symbol ?? null,
    }));
  }

  async getHistoricalRate(options: { date: string; base: string; target: string }): Promise<number> {
    if (!this.apiKey) throw new Error('Missing FREECURRENCY_API_KEY.');
    const url = `${this.apiBaseUrl}/historical`;
    const response = await lastValueFrom(this.httpService.get(url, {
      params: {
        apikey: this.apiKey,
        date: options.date,
        base_currency: options.base,
        currencies: options.target,
      },
    }));
    const data = response.data?.data ?? {};
    const dateEntry = data[options.date] ?? {};
    const rate = dateEntry[options.target];
    if (typeof rate !== 'number') throw new Error('Unable to retrieve historical rate.');
    return rate;
  }
}
