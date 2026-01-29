import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('api')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('currencies')
  async getCurrencies() {
    const currencies = await this.currencyService.getCurrencies();
    return { data: currencies };
  }

  @Get('historical')
  async getHistoricalRate(
    @Query('date') date: string,
    @Query('base') base: string,
    @Query('target') target: string,
    @Query('amount') amount = '1',
  ) {
    if (!base || !target) {
      throw new BadRequestException('Base and target currencies are required.');
    }
    const normalizedDate = date || new Date().toISOString().split('T')[0];
    const rate = await this.currencyService.getHistoricalRate({ date: normalizedDate, base, target });
    const amountValue = Number(amount);
    const converted = Number.isFinite(amountValue) ? amountValue * rate : rate;
    return {
      date: normalizedDate,
      base,
      target,
      rate,
      amount: Number.isFinite(amountValue) ? amountValue : 1,
      result: converted,
    };
  }
}
