import { Component } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { CommonModule } from '@angular/common';
import { NumberCellModel } from '../../models/number-cell.model';
import { SegmentComponent } from '../segment/segment.component';
import { LineSegment } from '../../models/line-segment.model';
import { SegmentOrientation } from '../../models/consts.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'board',
  standalone: true,
  imports: [CommonModule, SegmentComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

  game: BoardModel;

  constructor(private _players: PlayerService) {
    this.game = new BoardModel(6, _players.createDummyPlayers());
  }

  // onBottomSegmentClick(cell: NumberCellModel) {
  //   console.log("bottom clicked", cell);
  // }

  // onTopSegmentClick(cell: NumberCellModel) {
  //   console.log("top clicked", cell);
  // }

  // onLeftSegmentClick(cell: NumberCellModel) {
  //   console.log("left clicked", cell);
  // }

  // onRightSegmentClick(cell: NumberCellModel) {
  //   console.log("right clicked", cell);
  // }

  getNeighbourCells(row: NumberCellModel[], rowIndex: number, cell: NumberCellModel, orientation: SegmentOrientation, firstRow?: boolean): NumberCellModel[] {
    if (orientation === 'vert') {
      if (cell.index === 0) {
        return [cell];
      }

      if (cell.index === row.length - 1) {
        return [cell];
      }

      return [cell, row[cell.index + 1]].sort((a,b) => a.index - b.index);
   }

   if (orientation === 'horiz') {
    if (rowIndex === 0 && !firstRow) {
      return [cell];
    }

    if (rowIndex === this.game.currentBoard.length - 1) {
      return [cell];
    }

    return [cell, this.game.currentBoard[rowIndex + 1][cell.index]].sort((a,b) => a.row - b.row);
   }

   return [];
  }

  onSegmentSelected(segment: LineSegment, row: NumberCellModel[], rowIndex: number) {
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

    this.checkIfAnyCellsAreComplete(segment.borderingCells);
    this.game.nextTurn();
  }

  checkIfAnyCellsAreComplete(cells: NumberCellModel[]) {
    for (const cell of cells) {
      if (cell.allSidesSelected) {
        cell.fillColor = this.game.currentPlayerTurn.color;
        this.game.updateScore();
      }
    }
  }

}
