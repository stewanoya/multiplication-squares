import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from '../components/board/board.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'math-squares';
}
