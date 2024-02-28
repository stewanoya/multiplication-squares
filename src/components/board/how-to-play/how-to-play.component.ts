import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-how-to-play',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule],
  templateUrl: './how-to-play.component.html',
  styleUrl: './how-to-play.component.scss'
})
export class HowToPlayComponent {
  constructor(public dialogRef: MatDialogRef<HowToPlayComponent>) {}

}
