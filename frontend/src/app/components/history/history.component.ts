import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { ConversionHistoryService } from '../../services/conversion-history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent {
  readonly history$;

  constructor(private readonly historyService: ConversionHistoryService) {
    this.history$ = this.historyService.history$;
  }

  clearHistory() {
    this.historyService.clearHistory();
  }

  trackById(_index: number, item: { id: string }) {
    return item.id;
  }
}
