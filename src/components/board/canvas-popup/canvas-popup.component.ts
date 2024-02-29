import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, ViewChild } from '@angular/core';
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
export class CanvasPopupComponent implements AfterViewInit, OnDestroy{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CanvasPopupComponent>) {}

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement> | undefined;
  context: CanvasRenderingContext2D | undefined;
  bodyTouchStartListener: any;
  bodyTouchEndListener: any;
  bodyTouchMoveListener: any;

  fitToContainer(canvas: any){
    canvas.nativeElement.style.width='100%';
    canvas.nativeElement.style.height='100%';
    canvas.nativeElement.width  = canvas.nativeElement.offsetWidth;
    canvas.nativeElement.height = canvas.nativeElement.offsetHeight;
  }

  onClearClick() {
    this.context!.clearRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height);
  }

  ngOnDestroy(): void {
    this.removeScrollingPreventListeners();
  }

  removeScrollingPreventListeners() {
    document.body.removeEventListener("touchstart", this.bodyTouchStartListener);
    document.body.removeEventListener("touchend", this.bodyTouchEndListener);
    document.body.removeEventListener("touchmove", this.bodyTouchStartListener);
  }

  addScrollingPreventListeners() {
    // Prevent scrolling when touching the canvas
    this.bodyTouchStartListener = document.body.addEventListener("touchstart", (e) => {
      if (e.target == this.canvas as any) {
        e.preventDefault();
      }
    }, false);
    this.bodyTouchEndListener = document.body.addEventListener("touchend", (e) => {
      if (e.target == this.canvas as any) {
        e.preventDefault();
      }
    }, false);
    this.bodyTouchMoveListener = document.body.addEventListener("touchmove", (e) => {
      if (e.target == this.canvas as any) {
        e.preventDefault();
      }
    }, false);
  }

  setTouchListeners() {
    this.canvas?.nativeElement.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      })
      this.canvas?.nativeElement.dispatchEvent(mouseEvent);
    }, false)
    this.canvas?.nativeElement.addEventListener("touchend", (e) => {
      var mouseEvent = new MouseEvent("mouseup", {});
      this.canvas?.nativeElement.dispatchEvent(mouseEvent);
    }, false);
    this.canvas?.nativeElement.addEventListener("touchmove", (e) => {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      this.canvas?.nativeElement.dispatchEvent(mouseEvent);
    }, false);
  }


  ngAfterViewInit(): void {
    this.fitToContainer(this.canvas);
    this.addScrollingPreventListeners();
    this.context = this.canvas?.nativeElement.getContext('2d') as any;
    this.setTouchListeners()
    const mouseDownStream = fromEvent(this.canvas!.nativeElement, 'mousedown');
    const mouseMoveStream = fromEvent(this.canvas!.nativeElement, 'mousemove');
    const mouseUpStream = fromEvent(window, 'mouseup');
    mouseDownStream.pipe(
      tap((event: any) => {
        // event.preventDefault();
        this.context!.beginPath();
        this.context!.strokeStyle = this.data.color;
        this.context!.lineWidth = 3;
        this.context!.lineJoin = 'round';
        this.context!.moveTo(event.offsetX, event.offsetY);
      }),
      switchMap(() => mouseMoveStream.pipe(
        tap((event: any) => {
          // event.preventDefault();
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
