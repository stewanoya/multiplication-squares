import { GameColor, SegmentOrientation } from "./consts.model";
import { NumberCellModel } from "./number-cell.model";

export class LineSegment {
  orientation: SegmentOrientation;
  borderingCells: NumberCellModel[];
  isSelected = false;
  fillColor: GameColor = "";

  constructor(orientation: SegmentOrientation, borderingCells: NumberCellModel[]) {
    this.orientation = orientation;
    this.borderingCells = borderingCells;
  }

}
