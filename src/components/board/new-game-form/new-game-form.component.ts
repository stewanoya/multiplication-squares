import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Colors } from '../../../models/consts.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HowToPlayComponent } from '../how-to-play/how-to-play.component';
import { DifficultyLevel, VariantConfig } from '../../../models/variant.model';

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
  variant: VariantConfig;
  step = 0;
  numPlayers = 0;
  playerGroups: FormGroup[] = [];
  difficulty = new FormControl<DifficultyLevel | null>(null);

  selectedBase: DifficultyLevel | null = null;
  mixed = false;
  upTo12 = false;

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<NewGameFormComponent>,
    private _dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: { variant: VariantConfig },
  ) {
    this.variant = data?.variant ?? { difficulties: [] } as any;
    this.selectedBase = this.baseDifficulties[0] ?? null;
    this.difficulty.setValue(this.resolvedDifficulty);
  }

  get baseDifficulties(): DifficultyLevel[] {
    return this.variant.difficulties.filter(d => !d.isUpTo12 && !d.isMixed);
  }

  get resolvedDifficulty(): DifficultyLevel | null {
    const v = this.variant;
    if (this.mixed && v.supportsMixed) {
      if (v.id === 'multiplication') {
        const n = this.selectedBase?.fixedOperand ?? 10;
        return v.difficulties.find(d => !!d.isMixed && d.spinnerMax === n) ?? null;
      }
      return v.difficulties.find(d => !!d.isMixed) ?? null;
    }
    if (!this.selectedBase) return null;
    const n = this.selectedBase.fixedOperand;
    const wantUpTo12 = this.upTo12 && v.supportsUpTo12;
    return v.difficulties.find(d => !d.isMixed && d.fixedOperand === n && !!d.isUpTo12 === wantUpTo12) ?? null;
  }

  get mixedHint(): string {
    switch (this.variant.id) {
      case 'multiplication': {
        const n = this.selectedBase?.fixedOperand ?? 10;
        return `Spin two spinners and multiply them together. Your biggest spin is ${n}.`;
      }
      case 'addition':    return 'Spin two spinners and add them together.';
      case 'subtraction': return 'Spin two spinners and subtract one from the other.';
      default:            return 'Spin two spinners.';
    }
  }

  onDifficultyChange() {
    this.difficulty.setValue(this.resolvedDifficulty);
  }

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
      this._fb.group({ name: [''], color: [''] })
    );
    this.step = 1;
  }

  private randomName(): string {
    return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
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

  get difficultyHint(): string {
    const d = this.resolvedDifficulty;
    if (!d) return '';
    if (d.spinnerCount === 1 && d.fixedLabel) {
      const op = d.fixedLabel.trim()[0];
      const operand = d.fixedLabel.trim().slice(2).trim();
      const verbs: Record<string, string> = {
        '×': `Multiply what you get by ${operand}, then find that answer on the board.`,
        '+': `Add ${operand} to your number, then find that answer on the board.`,
        '−': `Subtract ${operand} from your number, then find that answer on the board.`,
        '÷': `Divide your number by ${operand}, then find the answer on the board.`,
      };
      return `Spin once. ${verbs[op] ?? ''}`;
    }
    const op = d.dualOperator ?? '×';
    const verbs: Record<string, string> = {
      '×': 'Multiply the two numbers together, then find that answer on the board.',
      '+': 'Add the two numbers together, then find that answer on the board.',
      '−': 'Subtract the smaller from the larger, then find that answer on the board.',
    };
    return `Two spins. ${verbs[op] ?? ''}`;
  }

  compareById(a: DifficultyLevel, b: DifficultyLevel): boolean {
    return a?.id === b?.id;
  }

  onHowToPlayClick() {
    this._dialog.open(HowToPlayComponent, { width: '80%', height: '80%', data: { variant: this.variant } });
  }

  startGame() {
    const missingColorIndex = this.playerGroups.findIndex(g => !g.controls['color'].value);
    if (missingColorIndex !== -1) {
      this.step = missingColorIndex + 1;
      return;
    }
    this._dialogRef.close({
      difficulty: this.difficulty.value,
      players: this.playerGroups.map(g => g.value),
    });
  }
}
