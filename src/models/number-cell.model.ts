import { GameColor, SegmentOrientation } from "./consts.model";

export class NumberCellModel {
  value: number;
  index: number;
  row: number;

  topSelected: boolean = false;
  bottomSelected: boolean = false;
  leftSelected: boolean = false;
  rightSelected: boolean = false;

  get allSidesSelected() {
    return this.topSelected &&
      this.bottomSelected &&
      this.rightSelected &&
      this.leftSelected;
  }

  fillColor: GameColor = '';

  constructor(index: number, value: number, row: number) {
    this.row = row;
    this.value = value;
    this.index = index;
  }
}
