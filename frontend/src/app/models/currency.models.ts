export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string | null;
}

export interface ConversionResponse {
  date: string;
  base: string;
  target: string;
  rate: number;
  amount: number;
  result: number;
}

export interface ConversionHistoryItem {
  id: string;
  timestamp: string;
  date: string;
  base: string;
  target: string;
  amount: number;
  result: number;
}
