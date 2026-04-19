import { Routes } from '@angular/router';
import { LandingComponent } from '../components/landing/landing.component';
import { BoardComponent } from '../components/board/board.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'play', component: BoardComponent, data: { prerender: false } },
  { path: '**', redirectTo: '' }
];
