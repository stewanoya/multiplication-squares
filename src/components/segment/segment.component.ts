import { AfterContentChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SegmentOrientation } from '../../models/consts.model';
import { NumberCellModel } from '../../models/number-cell.model';
import { LineSegment } from '../../models/line-segment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'line-segment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segment.component.html',
  styleUrl: './segment.component.scss'
})
export class SegmentComponent implements OnInit {
  @Input() orientation: SegmentOrientation | undefined;
  @Input() neighbourCells: NumberCellModel[] = [];
  @Input() firstRow: boolean = false;
  @Input() firstCell: boolean = false;
  @Output() segmentClickEvent = new EventEmitter<LineSegment>();
  segment: LineSegment | undefined;
  constructor() {
  }

  ngOnInit(): void {
    this.segment = new LineSegment(this.orientation as SegmentOrientation, this.neighbourCells);
  }

  onSegmentClick() {
    this.segmentClickEvent.emit(this.segment);
  }
}
