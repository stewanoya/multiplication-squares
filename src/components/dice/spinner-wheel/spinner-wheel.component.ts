import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Segment {
  path: string;
  color: string;
  textX: number;
  textY: number;
  textRotation: number;
  label: number;
}

const PALETTE = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];

@Component({
  selector: 'spinner-wheel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner-wheel.component.html',
  styleUrl: './spinner-wheel.component.scss',
})
export class SpinnerWheelComponent implements OnChanges {
  @Input() maxValue: number = 6;
  @Input() targetValue: number | null = null;
  @Input() displayValue: number | null = null;

  rotation = 0;
  isAnimating = false;
  segments: Segment[] = [];

  private lastMaxValue = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxValue'] && this.maxValue !== this.lastMaxValue) {
      this.lastMaxValue = this.maxValue;
      this.buildSegments();
    }
    if (changes['targetValue'] && this.targetValue !== null) {
      this.spin(this.targetValue);
    }
  }

  private buildSegments(): void {
    const cx = 100, cy = 100, r = 90, labelR = 54;
    const n = this.maxValue;
    const segAngle = 360 / n;
    this.segments = Array.from({ length: n }, (_, i) => {
      const startDeg = -90 + i * segAngle;
      const endDeg = startDeg + segAngle;
      const startRad = (startDeg * Math.PI) / 180;
      const endRad = (endDeg * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startRad);
      const y1 = cy + r * Math.sin(startRad);
      const x2 = cx + r * Math.cos(endRad);
      const y2 = cy + r * Math.sin(endRad);
      const largeArc = segAngle > 180 ? 1 : 0;
      const midDeg = startDeg + segAngle / 2;
      const midRad = (midDeg * Math.PI) / 180;
      // textRotation = DCT angle of this segment's midpoint (degrees-from-top clockwise)
      // When the wheel spins to land this segment at top, textRotation + wheelRotation ≡ 0°,
      // so the label appears perfectly upright.
      const textRotation = (i + 0.5) * segAngle;
      return {
        path: `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`,
        color: PALETTE[i % PALETTE.length],
        textX: cx + labelR * Math.cos(midRad),
        textY: cy + labelR * Math.sin(midRad),
        textRotation,
        label: i + 1,
      };
    });
  }

  private spin(target: number): void {
    const segAngle = 360 / this.maxValue;
    // DCT angle of target segment's midpoint
    const targetMidDeg = (target - 1 + 0.5) * segAngle;
    // For the segment at DCT θ to appear under the pointer (DCT 0 = top),
    // wheel must rotate R such that θ + R ≡ 0 (mod 360) → R ≡ -θ ≡ 360 - θ
    const targetRotMod = (360 - targetMidDeg % 360) % 360;
    const currentMod = ((this.rotation % 360) + 360) % 360;
    let delta = (targetRotMod - currentMod + 360) % 360;
    if (delta < 90) delta += 360;
    this.rotation += 5 * 360 + delta;
    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
    }, 2000);
  }

  get centerLabel(): string {
    if (this.isAnimating || this.targetValue === null) return '?';
    return String(this.displayValue ?? this.targetValue);
  }
}
