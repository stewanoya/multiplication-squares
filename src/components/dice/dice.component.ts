import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { DieModel } from '../../models/die.model';
import { combineLatestWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

type DiceMode = 'number' | 'pip';

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
  imports: [CommonModule, MatButtonModule],
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

  ngOnInit(): void {
    const max = this.game!.maxValue;
    this.firstDie = new DieModel(max);

    if (this.isSingleSpinner) {
      this.firstDie.value.subscribe((v1) => {
        this.die1Raw = v1;
        this.diceValuesEvent.emit([v1]);
      });
    } else {
      this.secondDie = new DieModel(max);
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

  onDrawClick() {
    this.onDrawEvent.emit();
  }

  onSkipTurnClick() {
    this.skipTurnEvent.emit();
  }

  onRollClick() {
    this.isRolling = true;
    this.firstDie!.start$.next(this.game!.maxValue);
    if (!this.isSingleSpinner) {
      this.secondDie!.start$.next(this.game!.maxValue);
    }
    this.diceRolledEvent.emit();
    setTimeout(() => { this.isRolling = false; }, 550);
  }
}
