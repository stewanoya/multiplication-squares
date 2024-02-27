import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { DieModel } from '../../models/die.model';
import { Observable, combineLatest, combineLatestWith, first, firstValueFrom, last, lastValueFrom, scan } from 'rxjs';

@Component({
  selector: 'dice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dice.component.html',
  styleUrl: './dice.component.scss'
})
export class DiceComponent implements OnInit {
  @Input() game: BoardModel | undefined;
  @Input() maxValue: number | undefined;
  @Output() diceValuesEvent = new EventEmitter<number[]>();
  firstDie: DieModel | undefined;
  secondDie: DieModel | undefined;

  constructor() {
  }

  ngOnInit(): void {
    this.firstDie = new DieModel(this.maxValue as number)
    this.secondDie = new DieModel(this.maxValue as number);
    this.firstDie?.value
      .pipe(combineLatestWith(this.secondDie!.value))
      .subscribe((vals) => {
        this.diceValuesEvent.emit(vals);
    })
  }

 async onRollClick() {
    this.firstDie!.start$.next(this.maxValue);
    this.secondDie!.start$.next(this.maxValue);
  }
}
