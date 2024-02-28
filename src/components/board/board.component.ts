import { Component, OnInit } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { CommonModule } from '@angular/common';
import { NumberCellModel } from '../../models/number-cell.model';
import { SegmentComponent } from '../segment/segment.component';
import { LineSegment } from '../../models/line-segment.model';
import { SegmentOrientation } from '../../models/consts.model';
import { PlayerService } from '../../services/player.service';
import { DiceComponent } from '../dice/dice.component';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewGameFormComponent } from './new-game-form/new-game-form.component';
import { MatCardModule } from '@angular/material/card'
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmChoicePopupComponent } from './confirm-choice-popup/confirm-choice-popup.component';
@Component({
  selector: 'board',
  standalone: true,
  imports: [
    CommonModule,
    SegmentComponent,
    DiceComponent,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

  game: BoardModel | undefined;
  diceRolled = false;

  constructor(
    private _snackbar: MatSnackBar,
    private _dialog: MatDialog,
    private _players: PlayerService) {
  }

  ngOnInit(): void {
    const ref = this._dialog.open(NewGameFormComponent, {
      disableClose: true,
      width: '90%',
      height: '90%'
    })

    ref.afterClosed().subscribe((gameSettings) => {
      if (gameSettings) {
        this.game = new BoardModel(gameSettings.max, gameSettings.players);
      }
    })

    // this.game = new BoardModel(6, this._players.createDummyPlayers());
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

    if (rowIndex === this.game!.currentBoard.length - 1) {
      return [cell];
    }

    return [cell, this.game!.currentBoard[rowIndex + 1][cell.index]].sort((a,b) => a.row - b.row);
   }

   return [];
  }

  cellsMatchProduct(cells: NumberCellModel[]): boolean {
    return cells.some(i => i.value === this.game!.product);
  }

  showSnack(msg: string) {
    this._snackbar.open(msg, "Dismiss", {duration: 5000});
  }

  onSegmentSelected(segment: LineSegment, row: NumberCellModel[], rowIndex: number) {
    if (!this.cellsMatchProduct(segment.borderingCells)) {
      if (this.game!.product === -1) {
        this._dialog.open(MessageDialogComponent, {data: {message: "Roll the dice first!"}});
      } else {
        this._dialog.open(MessageDialogComponent, {data: {message: `Sorry, ${this.game!.die1Value} x ${this.game!.die2Value} does not equal ${segment.borderingCells.map(i => i.value).join(", or ")}`}});
      }
      return;
    }

    if (segment.isSelected) {
      return;
    }
    segment.isSelected = true;
    segment.fillColor = this.game!.currentPlayerTurn.color;

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
    this.game!.nextTurn();
    this.diceRolled = false;
  }

  onDiceRolledEvent() {
    this.diceRolled = true;
  }

  resetProduct() {
    this.game!.updateProduct(1, -1);
  }

  checkIfAnyCellsAreComplete(cells: NumberCellModel[]) {
    console.log("cells", cells);
    for (const cell of cells) {
      if (cell.allSidesSelected) {
        cell.fillColor = this.game!.currentPlayerTurn.color;
        this.game!.updateScore();
      }
    }
  }

  onSkipTurnEvent() {
    const ref = this._dialog.open(ConfirmChoicePopupComponent, {
      data: {
        message: "Skip turn?"
      },
      width: "50%",
      maxWidth: "20rem"
    })

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.skipTurn();
      }
    })
  }

  skipTurn() {
    this.game?.nextTurn();
    this.diceRolled = false;
    this.resetProduct();
  }

  onResetGame() {
    const ref = this._dialog.open(ConfirmChoicePopupComponent, {
      width: "50%",
      maxWidth: "20rem",
      data: {
        message: "Reset Game?"
      }
    })

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.resetGame()
      }
    })
  }

  resetGame() {
    this.game = undefined;
    this.ngOnInit();
  }

  onDiceValueUpdate(nums: number[]) {
    this.game!.updateProduct(nums[0], nums[1]);
  }

}
