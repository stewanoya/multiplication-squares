import { AfterViewInit, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, fromEvent, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-canvas-popup',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './canvas-popup.component.html',
  styleUrl: './canvas-popup.component.scss'
})
export class CanvasPopupComponent implements AfterViewInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CanvasPopupComponent>) {}

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement> | undefined;
  context: CanvasRenderingContext2D | undefined;

  fitToContainer(canvas: any){
    canvas.nativeElement.style.width='100%';
    canvas.nativeElement.style.height='100%';
    canvas.nativeElement.width  = canvas.nativeElement.offsetWidth;
    canvas.nativeElement.height = canvas.nativeElement.offsetHeight;
  }

  onClearClick() {
    this.context!.clearRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);
  }


  ngAfterViewInit(): void {
    this.fitToContainer(this.canvas);
    this.context = this.canvas?.nativeElement.getContext('2d') as any;
    const mouseDownStream = fromEvent(this.canvas!.nativeElement, 'pointerdown');
    const mouseMoveStream = fromEvent(this.canvas!.nativeElement, 'pointermove');
    const mouseUpStream = fromEvent(window, 'pointerup');
    mouseDownStream.pipe(
      tap((event: any) => {
        event.preventDefault();
        this.context!.beginPath();
        this.context!.strokeStyle = this.data.color;
        this.context!.lineWidth = 3;
        this.context!.lineJoin = 'round';
        this.context!.moveTo(event.offsetX, event.offsetY);
      }),
      switchMap(() => mouseMoveStream.pipe(
        tap((event: any) => {
          event.preventDefault();
          this.context!.lineTo(event.offsetX, event.offsetY);
          this.context!.stroke();
        }),
        takeUntil(mouseUpStream),
        finalize(() => {
          this.context!.closePath();
        })
      ))
    ).subscribe();
  }

}
