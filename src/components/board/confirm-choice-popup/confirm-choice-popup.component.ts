import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-confirm-choice-popup',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule],
  templateUrl: './confirm-choice-popup.component.html',
  styleUrl: './confirm-choice-popup.component.scss'
})
export class ConfirmChoicePopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ConfirmChoicePopupComponent>) {

  }

}
