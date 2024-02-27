import { Component } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { CommonModule } from '@angular/common';
import { NumberCellModel } from '../../models/number-cell.model';
import { SegmentComponent } from '../segment/segment.component';
import { LineSegment } from '../../models/line-segment.model';
import { SegmentOrientation } from '../../models/consts.model';
import { PlayerService } from '../../services/player.service';
import { DiceComponent } from '../dice/dice.component';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'board',
  standalone: true,
  imports: [CommonModule, SegmentComponent, DiceComponent, MatSnackBarModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  game: BoardModel;
  maxValue: number = 6;

  constructor(private _players: PlayerService,
    private _snackbar: MatSnackBar) {
    this.game = new BoardModel(6, _players.createDummyPlayers());
  }

  getNeighbourCells(row: NumberCellModel[], rowIndex: number, cell: NumberCellModel, orientation: SegmentOrientation, firstInstance?: boolean): NumberCellModel[] {
    if (orientation === 'vert') {
      if (cell.index === 0 && firstInstance) {
        return [cell];
      }

      if (cell.index === row.length - 1) {
        return [cell];
      }

      return [cell, row[cell.index + 1]].sort((a,b) => a.index - b.index);
   }

   if (orientation === 'horiz') {
    if (rowIndex === 0 && firstInstance) {
      return [cell];
    }

    if (rowIndex === this.game.currentBoard.length - 1) {
      return [cell];
    }

    return [cell, this.game.currentBoard[rowIndex + 1][cell.index]].sort((a,b) => a.row - b.row);
   }

   return [];
  }

  cellsMatchProduct(cells: NumberCellModel[]): boolean {
    return cells.some(i => i.value === this.game.product);
  }

  showSnack(msg: string) {
    this._snackbar.open(msg, "Dismiss", {duration: 5000});
  }

  onSegmentSelected(segment: LineSegment, row: NumberCellModel[], rowIndex: number) {
    if (!this.cellsMatchProduct(segment.borderingCells)) {
      if (this.game.product === -1) {
        this.showSnack("Roll the dice first!");
      } else if (this.game.product === 0) {
        this.showSnack("You already took your turn, the next player should roll the dice!");
      } else {
        this.showSnack(`Sorry, ${this.game.die1Value} x ${this.game.die2Value} does not equal ${segment.borderingCells.map(i => i.value).join(", or ")}`)
      }
      return;
    }

    if (segment.isSelected) {
      return;
    }
    segment.isSelected = true;
    segment.fillColor = this.game.currentPlayerTurn.color;

    if (segment.orientation === 'vert') {
      if (segment.borderingCells.length === 1) {
        const lonelyCell = segment.borderingCells[0];
        lonelyCell.index === row.length - 1 ? lonelyCell.rightSelected = true : lonelyCell.leftSelected = true;
      } else {
        const leftCell = segment.borderingCells[0];
        const rightCell = segment.borderingCells[1];
        leftCell.rightSelected = true;
        rightCell.leftSelected = true;
      }
    }

    if (segment.orientation === 'horiz') {
      if (segment.borderingCells.length === 1) {
        const lonelyCell = segment.borderingCells[0];
        rowIndex === 0 ? lonelyCell.topSelected = true : lonelyCell.bottomSelected = true;

      } else {
        const topCell = segment.borderingCells[0];
        const bottomCell = segment.borderingCells[1];

        topCell.bottomSelected = true;
        bottomCell.topSelected = true;
      }
    }

    this.resetProduct();
    this.checkIfAnyCellsAreComplete(segment.borderingCells);
  }

  resetProduct() {
    this.game.updateProduct(0, 0);
  }

  checkIfAnyCellsAreComplete(cells: NumberCellModel[]) {
    console.log("cells", cells);
    for (const cell of cells) {
      if (cell.allSidesSelected) {
        cell.fillColor = this.game.currentPlayerTurn.color;
        this.game.updateScore();
      }
    }
  }

  onDiceValueUpdate(nums: number[]) {
    this.game.updateProduct(nums[0], nums[1]);
  }

}
