import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Colors } from '../../../models/consts.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';

const ADJECTIVES = [
  'Brave', 'Silly', 'Fuzzy', 'Bouncy', 'Sparkly', 'Fluffy', 'Wiggly', 'Zany',
  'Cheerful', 'Clumsy', 'Daring', 'Goofy', 'Happy', 'Jazzy', 'Lucky', 'Mighty',
  'Peppy', 'Speedy', 'Tiny', 'Wacky', 'Bold', 'Bubbly', 'Dizzy', 'Funky',
  'Giggly', 'Jumpy', 'Playful', 'Sunny', 'Wobbly', 'Zippy', 'Fancy', 'Jolly',
  'Snappy', 'Puffy', 'Rosy', 'Shiny', 'Grumpy', 'Sneaky', 'Cosmic', 'Tricky',
];

const ANIMALS = [
  'Panda', 'Tiger', 'Bunny', 'Penguin', 'Dolphin', 'Koala', 'Hedgehog', 'Llama',
  'Sloth', 'Otter', 'Flamingo', 'Narwhal', 'Axolotl', 'Capybara', 'Meerkat',
  'Platypus', 'Quokka', 'Gecko', 'Toucan', 'Chameleon', 'Parrot', 'Cheetah',
  'Elephant', 'Giraffe', 'Hippo', 'Monkey', 'Zebra', 'Fox', 'Raccoon',
  'Squirrel', 'Hamster', 'Turtle', 'Frog', 'Owl', 'Eagle', 'Bear', 'Wolf',
];


@Component({
  selector: 'app-new-game-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './new-game-form.component.html',
  styleUrl: './new-game-form.component.scss'
})
export class NewGameFormComponent {
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<NewGameFormComponent>,
    private _dialog: MatDialog,
  ) {}

  step = 0;
  numPlayers = 0;
  playerGroups: FormGroup[] = [];
  max = new FormControl(6);
  nums = [4, 5, 6, 7, 8, 9, 10, 11, 12];

  get colorChoices(): { key: string; hex: string }[] {
    return Object.entries(Colors)
      .filter(([key]) => key !== 'none')
      .map(([key, hex]) => ({ key, hex }));
  }

  get currentGroup(): FormGroup {
    return this.playerGroups[this.step - 1];
  }

  get isPlayerStep(): boolean {
    return this.step >= 1 && this.step <= this.numPlayers;
  }

  get isTableStep(): boolean {
    return this.step === this.numPlayers + 1;
  }

  get progressPercent(): number {
    const total = this.numPlayers + 2;
    return Math.round((this.step / total) * 100);
  }

  colorIsSelected(hex: string): boolean {
    return this.playerGroups.some(g => g.controls['color'].value === hex);
  }

  colorIsSelectedByOther(hex: string): boolean {
    const myHex = this.currentGroup?.controls['color'].value;
    return myHex !== hex && this.playerGroups.some(
      g => g.controls['color'].value && g.controls['color'].value === hex
    );
  }

  selectColor(hex: string) {
    if (this.colorIsSelectedByOther(hex)) return;
    this.currentGroup.controls['color'].setValue(hex);
  }

  get currentColorMissing(): boolean {
    return this.isPlayerStep && !this.currentGroup?.controls['color'].value;
  }

  choosePlayerCount(n: number) {
    this.numPlayers = n;
    this.playerGroups = Array.from({ length: n }, () =>
      this._fb.group({
        name: [''],
        color: [''],
      })
    );
    this.step = 1;
  }

  private randomName(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return `${adj} ${animal}`;
  }

  next() {
    if (this.isPlayerStep && !this.currentGroup.controls['name'].value) {
      this.currentGroup.controls['name'].setValue(this.randomName());
    }
    if (this.isTableStep) {
      this.startGame();
    } else {
      this.step++;
    }
  }

  back() {
    if (this.step > 0) this.step--;
  }

  onHowToPlayClick() {
    this._dialog.open(HowToPlayComponent, { width: '80%', height: '80%' });
  }

  startGame() {
    const missingColorIndex = this.playerGroups.findIndex(g => !g.controls['color'].value);
    if (missingColorIndex !== -1) {
      this.step = missingColorIndex + 1;
      return;
    }
    this._dialogRef.close({
      max: this.max.value,
      players: this.playerGroups.map(g => g.value),
    });
  }
}
