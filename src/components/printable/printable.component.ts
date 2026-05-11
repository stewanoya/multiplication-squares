import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';
import { DifficultyLevel, getVariant, VARIANT_LIST, VariantConfig } from '../../models/variant.model';
import { MatDialog } from '@angular/material/dialog';
import { AdInterstitialComponent } from '../ad-interstitial/ad-interstitial.component';

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
  variantList = VARIANT_LIST;
  selectedVariant: VariantConfig = VARIANT_LIST[0];
  variantCtrl = new FormControl<VariantConfig>(this.selectedVariant);
  difficultyCtrl = new FormControl<DifficultyLevel | null>(null);
  grid: GridCell[] = [];

  selectedBase: DifficultyLevel | null = null;
  mixed = false;
  upTo12 = false;

  constructor(
    private seo: SeoService,
    private _dialog: MatDialog,
    private _route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    const variantId = this._route.snapshot.paramMap.get('variant') ?? 'multiplication';
    try {
      this.selectedVariant = getVariant(variantId);
    } catch {
      this.selectedVariant = VARIANT_LIST[0];
    }

    this.variantCtrl.setValue(this.selectedVariant);
    this.selectedBase = this.baseDifficulties[0] ?? null;
    this.mixed = false;
    this.upTo12 = false;
    this.difficultyCtrl.setValue(this.resolvedDifficulty);

    this.seo.set({
      title: `${this.selectedVariant.label} Squares — Free Printable Game Board`,
      description: `Free printable ${this.selectedVariant.label} Squares game board. Pick your level, get a random board, and print it for class.`,
      canonical: `https://m-squares.anoya.ca/print/${this.selectedVariant.id}`,
    });

    this.variantCtrl.valueChanges.subscribe((v) => {
      if (!v) return;
      this.selectedVariant = v;
      this.selectedBase = this.baseDifficulties[0] ?? null;
      this.mixed = false;
      this.upTo12 = false;
      this.difficultyCtrl.setValue(this.resolvedDifficulty);
      this.generateBoard();
    });

    this.difficultyCtrl.valueChanges.subscribe(() => this.generateBoard());

    this.generateBoard();
  }

  get baseDifficulties(): DifficultyLevel[] {
    return this.selectedVariant.difficulties.filter(d => !d.isUpTo12 && !d.isMixed);
  }

  get resolvedDifficulty(): DifficultyLevel | null {
    const v = this.selectedVariant;
    if (this.mixed && v.supportsMixed) {
      if (v.id === 'multiplication') {
        const n = this.selectedBase?.fixedOperand ?? 10;
        return v.difficulties.find(d => !!d.isMixed && d.spinnerMax === n) ?? null;
      }
      return v.difficulties.find(d => !!d.isMixed) ?? null;
    }
    if (!this.selectedBase) return null;
    const n = this.selectedBase.fixedOperand;
    const wantUpTo12 = this.upTo12 && v.supportsUpTo12;
    return v.difficulties.find(d => !d.isMixed && d.fixedOperand === n && !!d.isUpTo12 === wantUpTo12) ?? null;
  }

  onDifficultyChange() {
    this.difficultyCtrl.setValue(this.resolvedDifficulty);
  }

  get currentDifficulty(): DifficultyLevel | null {
    return this.difficultyCtrl.value;
  }

  generateBoard() {
    const values = this.currentDifficulty?.boardValues() ?? [];
    if (!values.length) return;

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

  compareVariants(a: VariantConfig, b: VariantConfig): boolean {
    return a?.id === b?.id;
  }

  compareDifficulties(a: DifficultyLevel, b: DifficultyLevel): boolean {
    return a?.id === b?.id;
  }

  get isSingleSpinner(): boolean {
    return (this.currentDifficulty?.spinnerCount ?? 1) === 1;
  }

  get spinnerMax(): number {
    return this.currentDifficulty?.spinnerMax ?? 10;
  }

  spinnerSegments(max: number): { path: string; tx: number; ty: number; label: string }[] {
    const cx = 150, cy = 150, r = 138, tr = 98;
    return Array.from({ length: max }, (_, i) => {
      const startAngle = (i * 360 / max - 90) * Math.PI / 180;
      const endAngle = ((i + 1) * 360 / max - 90) * Math.PI / 180;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = (360 / max) > 180 ? 1 : 0;
      const midAngle = ((i + 0.5) * 360 / max - 90) * Math.PI / 180;
      return {
        path: `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`,
        tx: cx + tr * Math.cos(midAngle),
        ty: cy + tr * Math.sin(midAngle),
        label: String(i + 1),
      };
    });
  }

  print() {
    const adRef = this._dialog.open(AdInterstitialComponent, {
      disableClose: true,
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        messageOverride: "Print board",
      }
    });
    adRef.afterClosed().subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.print();
      }
    });

  }
}
