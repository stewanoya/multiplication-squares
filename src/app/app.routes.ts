import { Routes } from '@angular/router';
import { LandingComponent } from '../components/landing/landing.component';
import { BoardComponent } from '../components/board/board.component';
import { AboutComponent } from '../components/about/about.component';
import { FaqComponent } from '../components/faq/faq.component';
import { PrintableComponent } from '../components/printable/printable.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'play', component: BoardComponent, data: { prerender: false } },
  { path: 'print', component: PrintableComponent },
  { path: 'about', component: AboutComponent },
  { path: 'faq', component: FaqComponent },
  { path: '**', redirectTo: '' }
];
