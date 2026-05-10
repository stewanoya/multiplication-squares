import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { DieModel } from '../../models/die.model';
import { combineLatestWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { SpinnerWheelComponent } from './spinner-wheel/spinner-wheel.component';

type DiceMode = 'number' | 'pip';
type ViewMode = 'dice' | 'spinner';

interface PipPosition {
  r: number;
  c: number;
}

const PIP_POSITIONS: { [key: number]: PipPosition[] } = {
  1:  [                                       {r:2, c:2}                                     ],
  2:  [                    {r:1, c:3},                          {r:3, c:1}                   ],
  3:  [                    {r:1, c:3},        {r:2, c:2},       {r:3, c:1}                   ],
  4:  [ {r:1, c:1},        {r:1, c:3},                          {r:3, c:1}, {r:3, c:3}      ],
  5:  [ {r:1, c:1},        {r:1, c:3},        {r:2, c:2},       {r:3, c:1}, {r:3, c:3}      ],
  6:  [ {r:1, c:1},        {r:1, c:3}, {r:2, c:1},  {r:2, c:3}, {r:3, c:1}, {r:3, c:3}    ],
  7:  [ {r:1, c:1}, {r:1, c:2}, {r:1, c:3}, {r:2, c:1}, {r:2, c:3}, {r:3, c:1}, {r:3, c:3} ],
  8:  [ {r:1, c:1}, {r:1, c:2}, {r:1, c:3}, {r:2, c:1}, {r:2, c:3}, {r:3, c:1}, {r:3, c:2}, {r:3, c:3} ],
  9:  [ {r:1, c:1}, {r:1, c:2}, {r:1, c:3}, {r:2, c:1}, {r:2, c:2}, {r:2, c:3}, {r:3, c:1}, {r:3, c:2}, {r:3, c:3} ],
  10: [ {r:1, c:1}, {r:1, c:2}, {r:1, c:3}, {r:2, c:1}, {r:2, c:2}, {r:2, c:3}, {r:3, c:1}, {r:3, c:2}, {r:3, c:3}, {r:4, c:2} ],
  11: [ {r:1, c:1}, {r:1, c:2}, {r:1, c:3}, {r:2, c:1}, {r:2, c:2}, {r:2, c:3}, {r:3, c:1}, {r:3, c:2}, {r:3, c:3}, {r:4, c:1}, {r:4, c:3} ],
  12: [ {r:1, c:1}, {r:1, c:2}, {r:1, c:3}, {r:2, c:1}, {r:2, c:2}, {r:2, c:3}, {r:3, c:1}, {r:3, c:2}, {r:3, c:3}, {r:4, c:1}, {r:4, c:2}, {r:4, c:3} ],
};

@Component({
  selector: 'dice',
  standalone: true,
  imports: [CommonModule, MatButtonModule, SpinnerWheelComponent],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss'
})
export class DiceComponent implements OnInit {
  @Input() game: BoardModel | undefined;
  @Output() diceValuesEvent = new EventEmitter<number[]>();
  @Output() diceRolledEvent = new EventEmitter();
  @Output() skipTurnEvent = new EventEmitter();
  @Output() onDrawEvent = new EventEmitter();
  @Input() diceRolled: boolean = false;

  firstDie: DieModel | undefined;
  secondDie: DieModel | undefined;
  isRolling = false;
  diceMode: DiceMode = (localStorage.getItem('diceMode') as DiceMode) ?? 'number';
  viewMode: ViewMode = (localStorage.getItem('viewMode') as ViewMode) ?? 'dice';
  spinner1Target: number | null = null;
  spinner2Target: number | null = null;
  spinKey: number = 0;

  // raw die values (before any display transform)
  die1Raw: number | null = null;
  die2Raw: number | null = null;

  get isSingleSpinner(): boolean {
    return (this.game?.difficulty?.spinnerCount ?? 2) === 1;
  }

  get fixedLabel(): string {
    return this.game?.difficulty?.fixedLabel ?? '×';
  }

  get die1Display(): number | null {
    if (this.die1Raw === null) return null;
    const transform = this.game?.difficulty?.die1DisplayTransform;
    return transform ? transform(this.die1Raw) : this.die1Raw;
  }

  get dualOperator(): string {
    return this.game?.difficulty?.dualOperator ?? '×';
  }

  get isResultReady(): boolean {
    return (this.game?.currentResult ?? -1) !== -1;
  }

  get sectionTitle(): string {
    return this.viewMode === 'dice' ? 'Roll the Dice' : 'Spin the Spinner';
  }

  get rollButtonLabel(): string {
    return this.viewMode === 'dice' ? 'Roll' : 'Spin';
  }

  ngOnInit(): void {
    const max = this.game!.maxValue;
    this.firstDie = new DieModel(max);

    if (this.isSingleSpinner) {
      // rolling$ must be subscribed to activate its tap → value side-effect pipeline
      this.firstDie.rolling$.subscribe();
      this.firstDie.value.subscribe((v1) => {
        this.die1Raw = v1;
        this.diceValuesEvent.emit([v1]);
      });
    } else {
      this.secondDie = new DieModel(max);
      this.firstDie.rolling$.subscribe();
      this.secondDie.rolling$.subscribe();
      this.firstDie.value
        .pipe(combineLatestWith(this.secondDie.value))
        .subscribe(([v1, v2]) => {
          this.die1Raw = v1;
          this.die2Raw = v2;
          this.diceValuesEvent.emit([v1, v2]);
        });
    }
  }

  getPipPositions(value: number | null): PipPosition[] {
    if (!value) return [];
    return PIP_POSITIONS[Math.min(value, 12)] ?? [];
  }

  pipGridRows(value: number | null): number {
    return (value ?? 0) > 6 ? 4 : 3;
  }

  toggleDiceMode() {
    this.diceMode = this.diceMode === 'number' ? 'pip' : 'number';
    localStorage.setItem('diceMode', this.diceMode);
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'dice' ? 'spinner' : 'dice';
    localStorage.setItem('viewMode', this.viewMode);
    // Restore spinner display from last rolled values without triggering a new spin
    if (this.viewMode === 'spinner') {
      this.spinner1Target = this.die1Raw;
      this.spinner2Target = this.die2Raw;
    }
  }

  onDrawClick() {
    this.onDrawEvent.emit();
  }

  onSkipTurnClick() {
    this.skipTurnEvent.emit();
  }

  onRollClick() {
    this.diceRolledEvent.emit();

    if (this.viewMode === 'spinner') {
      const v1 = Math.floor(Math.random() * this.game!.maxValue) + 1;
      const v2 = this.isSingleSpinner ? null : Math.floor(Math.random() * this.game!.maxValue) + 1;
      this.spinner1Target = v1;
      this.spinner2Target = v2;
      this.spinKey++; // always increments so ngOnChanges fires even if same value
      setTimeout(() => {
        this.die1Raw = v1;
        this.die2Raw = v2;
        this.diceValuesEvent.emit(v2 !== null ? [v1, v2] : [v1]);
      }, 2000);
    } else {
      this.isRolling = true;
      this.firstDie!.start$.next(this.game!.maxValue);
      if (!this.isSingleSpinner) this.secondDie!.start$.next(this.game!.maxValue);
      setTimeout(() => { this.isRolling = false; }, 550);
    }
  }
}
