import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  color: string;
  width: number;
  height: number;
  borderRadius: string;
  tx: string;
  ty: string;
  rot: string;
  duration: string;
  delay: string;
}

const COLORS = ['#f44336', '#e91e63', '#9c27b0', '#2196f3', '#00bcd4', '#4caf50', '#ffeb3b', '#ff9800', '#ff5722'];
const PARTICLE_COUNT = 120;

@Component({
  selector: 'app-celebration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './celebration.component.html',
  styleUrl: './celebration.component.scss'
})
export class CelebrationComponent implements OnChanges {
  @Input() visible = false;
  @Input() message = '';

  particles: Particle[] = [];

  private rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible']?.currentValue === true) {
      this.particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const isCircle = Math.random() < 0.3;
        const isThin = !isCircle && Math.random() < 0.5;
        const w = Math.round(this.rand(8, 16));
        return {
          color: COLORS[Math.floor(this.rand(0, COLORS.length))],
          width: isThin ? Math.round(this.rand(4, 8)) : w,
          height: isThin ? Math.round(this.rand(14, 22)) : w,
          borderRadius: isCircle ? '50%' : '2px',
          tx: `${this.rand(-600, 600).toFixed(0)}px`,
          ty: `${this.rand(-480, 480).toFixed(0)}px`,
          rot: `${this.rand(180, 1080).toFixed(0)}deg`,
          duration: `${this.rand(1.8, 3.2).toFixed(2)}s`,
          delay: `${this.rand(0, 0.4).toFixed(2)}s`,
        };
      });
    }
  }
}
