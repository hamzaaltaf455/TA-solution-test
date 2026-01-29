import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyApiService } from '../../services/currency-api.service';
import { ConversionHistoryService } from '../../services/conversion-history.service';
import { CurrencyOption, ConversionResponse } from '../../models/currency.models';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AutoFocusDirective,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss',
})
export class ConverterComponent implements OnInit {
  currencies: CurrencyOption[] = [];
  loadingCurrencies = true;
  converting = false;
  result: ConversionResponse | null = null;
  errorMessage = '';
  readonly maxDate = new Date();

  readonly form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly currencyApiService: CurrencyApiService,
    private readonly historyService: ConversionHistoryService,
  ) {
    this.form = this.formBuilder.group({
      amount: [1, [Validators.required, Validators.min(0.01)]],
      base: ['', Validators.required],
      target: ['', Validators.required],
      date: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.currencyApiService.getCurrencies().subscribe({
      next: (currencies) => {
        this.currencies = currencies;
        if (!this.form.value.base && currencies.length > 0) {
          this.form.patchValue({
            base: currencies[0].code,
            target: currencies[1]?.code ?? currencies[0].code,
          });
        }
        this.loadingCurrencies = false;
      },
      error: () => {
        this.loadingCurrencies = false;
        this.errorMessage = 'Unable to load currencies. Please try again.';
      },
    });
  }

  convert(): void {
    this.errorMessage = '';
    if (this.form.invalid || this.converting) {
      this.form.markAllAsTouched();
      return;
    }
    const { amount, base, target, date } = this.form.getRawValue();
    if (!amount || !base || !target || !date) return;
    const formattedDate = this.formatDate(date);
    this.converting = true;
    this.currencyApiService.getHistoricalRate({ amount, base, target, date: formattedDate }).subscribe({
      next: (response) => {
        this.result = response;
        this.historyService.addHistoryEntry(response);
        this.converting = false;
      },
      error: () => {
        this.errorMessage = 'Unable to convert currency for the selected date.';
        this.converting = false;
      },
    });
  }

  trackByCode(_index: number, option: CurrencyOption) {
    return option.code;
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
