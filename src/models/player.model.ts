import { GameColor } from "./consts.model";

export class PlayerModel {
  name: string;
  color: GameColor;
  score: number = 0;

  constructor(name: string, color: GameColor) {
    this.name = name;
    this.color = color;
  }
}
