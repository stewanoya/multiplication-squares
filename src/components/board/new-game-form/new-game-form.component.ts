import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Colors } from '../../../models/consts.model';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-new-game-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './new-game-form.component.html',
  styleUrl: './new-game-form.component.scss'
})
export class NewGameFormComponent  {
  constructor(private _fb: FormBuilder, private _snackbar: MatSnackBar, private _dialogRef: MatDialogRef<NewGameFormComponent>) {}

  playerGroups: FormGroup[] = this.createPlayers();
  Colors = Colors;

  max = new FormControl(6);
  nums = [4,5,6,7,8,9,10,11,12];

  get colorChoices() {
    return Object
    .keys(Colors)
    .filter(i => i !== 'none');
  }

  colorIsSelected(colorKey: string) {
    if (this.playerGroups.some(i => i.controls['color'].value === Colors[colorKey])) {
      return true;
    } else {
      return false;
    }
  }

  onGameStartClick() {
    if (!this.atLeastTwoPlayers()) {
      this._snackbar.open("Please put in at least 2 names to play", "Dismiss", {duration: 5000});
      return;
    }

    this._dialogRef.close({max: this.max.value, players: this.playerGroups.map(i => i.value).filter(i => i.name)})
  }

  atLeastTwoPlayers() {
    let count = 0;
    this.playerGroups
      .forEach(i => {
        if (i.controls['name'].value) {
          count++;
        }
      })

    return count >= 2;
  }

  createPlayers() {
    return [
      this._fb.group({
        name: [''],
        color: [Colors['blue']]
      }),
      this._fb.group({
        name: [''],
        color: [Colors['red']]
      }),
      this._fb.group({
        name: [''],
        color: [Colors['green']]
      }),
      this._fb.group({
        name: [''],
        color: [Colors['yellow']]
      }),
    ]
  }
}
