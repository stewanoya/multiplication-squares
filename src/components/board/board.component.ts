import { Component, Inject, isDevMode, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BoardModel } from '../../models/board.model';
import { CommonModule } from '@angular/common';
import { NumberCellModel } from '../../models/number-cell.model';
import { SegmentComponent } from '../segment/segment.component';
import { LineSegment } from '../../models/line-segment.model';
import { Colors, SegmentOrientation } from '../../models/consts.model';
import { PlayerService } from '../../services/player.service';
import { SeoService } from '../../services/seo.service';
import { DiceComponent } from '../dice/dice.component';
import { getVariant, VariantConfig } from '../../models/variant.model';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewGameFormComponent } from './new-game-form/new-game-form.component';
import { MatCardModule } from '@angular/material/card'
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmChoicePopupComponent } from './confirm-choice-popup/confirm-choice-popup.component';
import { CanvasPopupComponent } from './canvas-popup/canvas-popup.component';
import { PlayerModel } from '../../models/player.model';
import { CelebrationComponent } from '../celebration/celebration.component';
import { AdInterstitialComponent } from '../ad-interstitial/ad-interstitial.component';

const COMPLIMENTS = [
  'Nice job',
  'Great work',
  'Fantastic',
  'Well done',
  "You're on a roll",
  'Square-y nice move',
  'You nailed it',
  "That's acute move",
  "You're sum kind of genius",
  'Area you kidding me?!',
  'You drew the line',
  "That's a perfect square",
  'Four sides, all yours',
  'Box secured',
  'You squared it away',
  'Multiply that win',
  'Math wizard',
  "Line 'em up",
  'Boxed in beautifully',
  'Right on the dot',
];

@Component({
  selector: 'board',
  standalone: true,
  imports: [
    CommonModule,
    SegmentComponent,
    DiceComponent,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    CelebrationComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {

  game: BoardModel | undefined;
  variant: VariantConfig | undefined;
  diceRolled = false;
  celebrationVisible = false;
  celebrationMessage = '';

  constructor(
    private _route: ActivatedRoute,
    private _snackbar: MatSnackBar,
    private _dialog: MatDialog,
    private _players: PlayerService,
    private _seo: SeoService,
    @Inject(PLATFORM_ID) private _platformId: Object) {
  }

  ngOnInit(): void {
    const variantId = this._route.snapshot.paramMap.get('variant') ?? 'multiplication';
    try {
      this.variant = getVariant(variantId);
    } catch {
      this.variant = getVariant('multiplication');
    }

    this._seo.set({
      title: `Play ${this.variant.label} Squares — Free Math Game`,
      description: this.variant.description,
      canonical: `https://m-squares.anoya.ca/play/${this.variant.id}`,
    });

    if (!isPlatformBrowser(this._platformId)) return;

    const ref = this._dialog.open(NewGameFormComponent, {
      disableClose: true,
      width: '90%',
      height: '90%',
      data: { variant: this.variant },
    });

    ref.afterClosed().subscribe((gameSettings) => {
      if (gameSettings && !isDevMode()) {
        const adRef = this._dialog.open(AdInterstitialComponent, {
          disableClose: true,
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
        });
        adRef.afterClosed().subscribe(() => {
          this.game = new BoardModel(gameSettings.difficulty, gameSettings.players);
        });
      }

      if (isDevMode()) {
        this.game = new BoardModel(gameSettings.difficulty, gameSettings.players);
      }
    });
  }

  openDrawPopup() {
    const d = this.game?.difficulty;
    const die1Raw = this.game?.die1Value ?? 0;
    const die1Display = d?.die1DisplayTransform ? d.die1DisplayTransform(die1Raw) : die1Raw;
    const equation = d?.spinnerCount === 1
      ? `${die1Display} ${d?.fixedLabel}`
      : `${die1Raw} × ${this.game?.die2Value}`;
    this._dialog.open(CanvasPopupComponent, {
      data: { color: this.game?.currentPlayerTurn.color, equation },
      width: '100%',
      maxWidth: '98vw',
      height: '95%',
    });
  }

  getNeighbourCells(row: NumberCellModel[], rowIndex: number, cell: NumberCellModel, orientation: SegmentOrientation, firstInstance?: boolean): NumberCellModel[] {
    if (orientation === 'vert') {
      if (cell.index === 0 && firstInstance) return [cell];
      if (cell.index === row.length - 1) return [cell];
      return [cell, row[cell.index + 1]].sort((a, b) => a.index - b.index);
    }
    if (orientation === 'horiz') {
      if (rowIndex === 0 && firstInstance) return [cell];
      if (rowIndex === this.game!.currentBoard.length - 1) return [cell];
      return [cell, this.game!.currentBoard[rowIndex + 1][cell.index]].sort((a, b) => a.row - b.row);
    }
    return [];
  }

  cellMatchesResult(cells: NumberCellModel[]): boolean {
    return cells.some(i => i.value === this.game!.currentResult);
  }

  showSnack(msg: string) {
    this._snackbar.open(msg, "Dismiss", { duration: 5000 });
  }

  onSegmentSelected(segment: LineSegment, row: NumberCellModel[], rowIndex: number) {
    if (!this.cellMatchesResult(segment.borderingCells)) {
      if (this.game!.currentResult === -1) {
        this._dialog.open(MessageDialogComponent, { data: { message: "Roll the spinner first!" } });
      } else {
        const d = this.game!.difficulty;
        const die1Raw = this.game!.die1Value;
        const die1Display = d.die1DisplayTransform ? d.die1DisplayTransform(die1Raw) : die1Raw;
        const equation = d.spinnerCount === 1
          ? `${die1Display} ${d.fixedLabel}`
          : `${die1Raw} × ${this.game!.die2Value}`;
        const cellVals = segment.borderingCells.map(i => i.value).join(' or ');
        this._dialog.open(MessageDialogComponent, { data: { message: `${equation} doesn't equal ${cellVals}` } });
      }
      return;
    }

    if (segment.isSelected) return;

    segment.isSelected = true;
    segment.fillColor = this.game!.currentPlayerTurn.color;

    if (segment.orientation === 'vert') {
      if (segment.borderingCells.length === 1) {
        const lonelyCell = segment.borderingCells[0];
        lonelyCell.index === row.length - 1 ? lonelyCell.rightSelected = true : lonelyCell.leftSelected = true;
      } else {
        segment.borderingCells[0].rightSelected = true;
        segment.borderingCells[1].leftSelected = true;
      }
    }

    if (segment.orientation === 'horiz') {
      if (segment.borderingCells.length === 1) {
        const lonelyCell = segment.borderingCells[0];
        rowIndex === 0 ? lonelyCell.topSelected = true : lonelyCell.bottomSelected = true;
      } else {
        segment.borderingCells[0].bottomSelected = true;
        segment.borderingCells[1].topSelected = true;
      }
    }

    this.resetResult();
    this.checkIfAnyCellsAreComplete(segment.borderingCells);
    this.game!.nextTurn();
    this.diceRolled = false;
  }

  onDiceRolledEvent() {
    this.diceRolled = true;
  }

  resetResult() {
    this.game!.updateResult(1, -1);
  }

  checkIfAnyCellsAreComplete(cells: NumberCellModel[]) {
    for (const cell of cells) {
      if (cell.allSidesSelected) {
        cell.fillColor = this.game!.currentPlayerTurn.color;
        this.game!.updateScore();
        this.showCelebration(this.game!.currentPlayerTurn.name);
      }
    }
  }

  showCelebration(playerName: string) {
    const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    this.celebrationMessage = `${compliment}, ${playerName}!`;
    this.celebrationVisible = true;
    setTimeout(() => { this.celebrationVisible = false; }, 4000);
  }

  onSkipTurnEvent() {
    const ref = this._dialog.open(ConfirmChoicePopupComponent, {
      data: { message: "Skip turn?" },
      width: "50%",
      maxWidth: "20rem"
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.skipTurn();
    });
  }

  skipTurn() {
    this.game?.nextTurn();
    this.diceRolled = false;
    this.resetResult();
  }

  onResetGame() {
    const ref = this._dialog.open(ConfirmChoicePopupComponent, {
      width: "50%",
      maxWidth: "20rem",
      data: { message: "Reset Game?" }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.resetGame();
    });
  }

  resetGame() {
    this.game = undefined;
    this.ngOnInit();
  }

  onDiceValueUpdate(nums: number[]) {
    this.game!.updateResult(nums[0], nums[1]);
  }

  get dotGrid(): number[] {
    return Array.from({ length: 121 }, (_, i) => i);
  }
}
