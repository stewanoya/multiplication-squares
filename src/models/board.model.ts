import { NumberCellModel } from "./number-cell.model";
import { PlayerModel } from "./player.model";
import { DifficultyLevel } from "./variant.model";

export class BoardModel {
  currentBoard: NumberCellModel[][] = [];
  boardValues: number[] = [];
  currentResult: number = -1;
  die1Value: number = 0;
  die2Value: number = 0;
  currentPlayerTurn: PlayerModel;
  players: PlayerModel[] = [];
  difficulty: DifficultyLevel;

  // Kept for backward compat with dice component maxValue reads
  get maxValue(): number {
    return this.difficulty.spinnerMax;
  }

  constructor(difficulty: DifficultyLevel, players: PlayerModel[]) {
    this.difficulty = difficulty;
    this.players = players;
    this.currentPlayerTurn = players[0];
    this.boardValues = difficulty.boardValues();
    this.generateBoard();
  }

  generateBoard() {
    this.currentBoard = [];
    for (let i = 0; i < 10; i++) {
      const row: NumberCellModel[] = [];
      for (let j = 0; j < 10; j++) {
        const val = this.boardValues[Math.floor(Math.random() * this.boardValues.length)];
        row.push(new NumberCellModel(j, val, i));
      }
      this.currentBoard.push(row);
    }
  }

  updateScore() {
    for (const player of this.players) {
      player.score = this.currentBoard.flat().filter(i => i.fillColor === player.color).length;
    }
  }

  nextTurn() {
    const index = this.players.indexOf(this.currentPlayerTurn);
    this.currentPlayerTurn = this.players[(index + 1) % this.players.length];
  }

  updateResult(die1: number, die2?: number) {
    this.die1Value = die1;
    this.die2Value = die2 ?? 0;
    this.currentResult = this.difficulty.computeResult(die1, die2);
  }
}
