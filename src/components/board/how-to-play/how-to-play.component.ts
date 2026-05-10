import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { VariantConfig } from '../../../models/variant.model';

@Component({
  selector: 'app-how-to-play',
  standalone: true,
  imports: [MatDividerModule, MatButtonModule],
  templateUrl: './how-to-play.component.html',
  styleUrl: './how-to-play.component.scss'
})
export class HowToPlayComponent {
  constructor(
    public dialogRef: MatDialogRef<HowToPlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { variant: VariantConfig }
  ) {}
}
