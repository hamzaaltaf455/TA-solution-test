import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConversionHistoryItem, ConversionResponse } from '../models/currency.models';

const STORAGE_KEY = 'currency-conversion-history-v1';

@Injectable({
  providedIn: 'root',
})
export class ConversionHistoryService {
  private readonly historySubject = new BehaviorSubject<ConversionHistoryItem[]>(this.readStorage());
  readonly history$ = this.historySubject.asObservable();

  addHistoryEntry(response: ConversionResponse) {
    const history = this.readStorage();
    const entry: ConversionHistoryItem = {
      id: this.createId(),
      timestamp: new Date().toISOString(),
      date: response.date,
      base: response.base,
      target: response.target,
      amount: response.amount,
      result: response.result,
    };
    const updated = [entry, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    this.historySubject.next(updated);
    return updated;
  }

  clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    this.historySubject.next([]);
  }

  private readStorage(): ConversionHistoryItem[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as ConversionHistoryItem[];
    } catch {
      return [];
    }
  }

  private createId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
