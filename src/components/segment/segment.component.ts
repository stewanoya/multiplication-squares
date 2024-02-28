import { AfterContentChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SegmentOrientation } from '../../models/consts.model';
import { NumberCellModel } from '../../models/number-cell.model';
import { LineSegment } from '../../models/line-segment.model';
import { CommonModule } from '@angular/common';
import { BoardModel } from '../../models/board.model';

@Component({
  selector: 'line-segment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segment.component.html',
  styleUrl: './segment.component.scss'
})
export class SegmentComponent implements OnInit {
  @Input() orientation: SegmentOrientation | undefined;
  @Input() game: BoardModel | undefined
  @Input() neighbourCells: NumberCellModel[] = [];
  @Input() firstRow: boolean = false;
  @Input() firstCell: boolean = false;
  @Output() segmentClickEvent = new EventEmitter<LineSegment>();
  @ViewChild('segmentRef') segmentRef: ElementRef | undefined;
  segment: LineSegment | undefined;
  hover = false;
  constructor() {
  }

  addHover() {
    this.segmentRef?.nativeElement.classList.add(`hover${this.game?.currentPlayerTurn.color.replace('#', '-')}`)
  }
  removeHover() {
    this.segmentRef?.nativeElement.classList.remove(`hover${this.game?.currentPlayerTurn.color.replace('#', '-')}`)
  }

  ngOnInit(): void {
    this.segment = new LineSegment(this.orientation as SegmentOrientation, this.neighbourCells);
  }

  onSegmentClick() {
    this.segmentClickEvent.emit(this.segment);
  }
}
