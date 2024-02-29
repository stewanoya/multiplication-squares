import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { DieModel } from '../../models/die.model';
import { Observable, combineLatest, combineLatestWith, first, firstValueFrom, last, lastValueFrom, scan } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

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

  constructor() {
  }

  ngOnInit(): void {
    this.firstDie = new DieModel(this.game!.maxValue as number)
    this.secondDie = new DieModel(this.game!.maxValue as number);
    this.firstDie?.value
      .pipe(combineLatestWith(this.secondDie!.value))
      .subscribe((vals) => {
        this.diceValuesEvent.emit(vals);
    })
  }

  onDrawClick() {
    this.onDrawEvent.emit();
  }

  onSkipTurnClick() {
    this.skipTurnEvent.emit();
  }

 async onRollClick() {
    this.firstDie!.start$.next(this.game!.maxValue);
    this.secondDie!.start$.next(this.game!.maxValue);
    this.diceRolledEvent.emit();
  }
}
