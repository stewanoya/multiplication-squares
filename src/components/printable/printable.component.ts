import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';

interface GridCell {
  type: 'dot' | 'h-line' | 'v-line' | 'number';
  value?: number;
}

@Component({
  selector: 'app-printable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './printable.component.html',
  styleUrl: './printable.component.scss',
})
export class PrintableComponent implements OnInit {
  maxTable = new FormControl(12);
  nums = [4, 5, 6, 7, 8, 9, 10, 11, 12];
  grid: GridCell[] = [];

  constructor(
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.seo.set({
      title: 'Multiplication Squares — Free Printable Game Board',
      description: 'Free printable multiplication squares game board. Pick your max times table (up to 12×12), get a random board, print it. Ready to use in class.',
      canonical: 'https://m-squares.anoya.ca/print',
    });
    this.generateBoard();
    this.maxTable.valueChanges.subscribe(() => this.generateBoard());
  }

  generateBoard() {
    const max = this.maxTable.value ?? 12;
    const values = this.getUniqueProducts(max);
    const board: number[][] = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => values[Math.floor(Math.random() * values.length)])
    );

    const cells: GridCell[] = [];
    for (let row = 0; row < 21; row++) {
      for (let col = 0; col < 21; col++) {
        const evenRow = row % 2 === 0;
        const evenCol = col % 2 === 0;
        if (evenRow && evenCol) {
          cells.push({ type: 'dot' });
        } else if (evenRow && !evenCol) {
          cells.push({ type: 'h-line' });
        } else if (!evenRow && evenCol) {
          cells.push({ type: 'v-line' });
        } else {
          cells.push({ type: 'number', value: board[Math.floor(row / 2)][Math.floor(col / 2)] });
        }
      }
    }
    this.grid = cells;
  }

  print() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  private getUniqueProducts(max: number): number[] {
    const values: number[] = [];
    for (let i = 1; i <= max; i++) {
      for (let j = 1; j <= max; j++) {
        values.push(i * j);
      }
    }
    return [...new Set(values)];
  }
}
