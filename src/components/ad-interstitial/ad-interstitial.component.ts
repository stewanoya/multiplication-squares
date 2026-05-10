import { AfterViewInit, Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

const AD_DURATION = 5;

@Component({
  selector: 'app-ad-interstitial',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './ad-interstitial.component.html',
  styleUrl: './ad-interstitial.component.scss',
})
export class AdInterstitialComponent implements OnInit, AfterViewInit, OnDestroy {
  countdown = AD_DURATION;
  private sub?: Subscription;

  constructor(private _dialogRef: MatDialogRef<AdInterstitialComponent>) {}

  ngOnInit() {
    this.sub = interval(1000)
      .pipe(take(AD_DURATION))
      .subscribe(() => this.countdown--);
  }

  ngAfterViewInit() {
    if (!isDevMode()) {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get canContinue(): boolean {
    return this.countdown <= 0;
  }

  continue() {
    if (this.canContinue) {
      this._dialogRef.close();
    }
  }
}
