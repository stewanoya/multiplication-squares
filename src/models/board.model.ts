import { NumberCellModel } from "./number-cell.model";
import { PlayerModel } from "./player.model";

export class BoardModel {
  currentBoard: NumberCellModel[][] = [];
  flatMultiplicationValues: number[] = [];
  product: number = -1;
  maxValue: number
  die1Value: number = 0;
  die2Value: number = 0;
  currentPlayerTurn: PlayerModel;
  players: PlayerModel[] = [];
  //10x10 board
  // should include products from 1-6 times tables (or bigger numbers depending on user inputs);
  //

  constructor(maxTable: number, players: PlayerModel[]) {
    this.maxValue = maxTable;
    this.players = players;
    this.currentPlayerTurn = players[0];
    this.flatMultiplicationValues = this.generateMultipicationTableValues(maxTable);
    this.generateBoard();
  }

  generateBoard() {
    for (let i = 0; i < 10; i++) {
      const row: NumberCellModel[] = [];
      for (let j = 0; j < 10; j++) {
        const randomValue = this.flatMultiplicationValues[Math.floor(Math.random() * this.flatMultiplicationValues.length)];
        row.push(new NumberCellModel(j, randomValue, i));
      }
      this.currentBoard.push(row);
    }
  }

  generateMultipicationTableValues(maxTable: number) {
    const values = [];
    for (let i = 1; i <= maxTable; i++) {
      for (let j = 1; j <= maxTable; j++) {
        values.push(i * j);
      }
    }

    return [...new Set(values)];
  }

  updateScore() {
    for (const player of this.players) {
      player.score = this.currentBoard.flat().filter(i => i.fillColor === player.color).length;
    }
  }

  nextTurn() {
    const index = this.players.indexOf(this.currentPlayerTurn);

    if (index === this.players.length - 1) {
      this.currentPlayerTurn = this.players[0];
    } else {
      this.currentPlayerTurn = this.players[index + 1];
    }
  }

  updateProduct(num1: number, num2: number) {
    this.die1Value = num1;
    this.die2Value = num2;
    this.product = num1 * num2;
  }

}
