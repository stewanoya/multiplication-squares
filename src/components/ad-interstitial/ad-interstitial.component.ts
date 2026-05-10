import { AfterViewInit, Component, ElementRef, isDevMode, OnDestroy, ViewChild } from '@angular/core';
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
export class AdInterstitialComponent implements AfterViewInit, OnDestroy {
  countdown = AD_DURATION;
  private sub?: Subscription;
  private mutationObserver?: MutationObserver;
  private resizeObserver?: ResizeObserver;
  private fallbackTimer?: ReturnType<typeof setTimeout>;

  @ViewChild('adSlot') adSlot!: ElementRef<HTMLElement>;

  constructor(private _dialogRef: MatDialogRef<AdInterstitialComponent>) {}

  ngAfterViewInit() {
    if (!isDevMode()) {
      const ins = this.adSlot.nativeElement;
      // Wait until the element has a real width (dialog animation may defer layout)
      this.resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width;
        if (width && width > 0) {
          this.resizeObserver!.disconnect();
          this.resizeObserver = undefined;
          this.pushAd(ins);
        }
      });
      this.resizeObserver.observe(ins);
    } else {
      this.startCountdown();
    }
  }

  private pushAd(ins: HTMLElement) {
    this.mutationObserver = new MutationObserver(() => {
      if (ins.getAttribute('data-ad-status')) {
        this.cleanupTimers();
        this.startCountdown();
      }
    });
    this.mutationObserver.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });

    // Fallback: start countdown if ad never fires (ad blocker, no fill, etc.)
    this.fallbackTimer = setTimeout(() => {
      this.cleanupTimers();
      this.startCountdown();
    }, 3000);

    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }

  private cleanupTimers() {
    this.mutationObserver?.disconnect();
    this.mutationObserver = undefined;
    if (this.fallbackTimer !== undefined) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = undefined;
    }
  }

  private startCountdown() {
    if (this.sub) return;
    this.sub = interval(1000)
      .pipe(take(AD_DURATION))
      .subscribe(() => this.countdown--);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.resizeObserver?.disconnect();
    this.cleanupTimers();
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
