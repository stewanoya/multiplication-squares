import { Routes } from '@angular/router';
import { LandingComponent } from '../components/landing/landing.component';
import { BoardComponent } from '../components/board/board.component';
import { AboutComponent } from '../components/about/about.component';
import { FaqComponent } from '../components/faq/faq.component';
import { PrintableComponent } from '../components/printable/printable.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'play/:variant', component: BoardComponent, data: { prerender: false } },
  { path: 'play', redirectTo: '', pathMatch: 'full' },
  { path: 'print/:variant', component: PrintableComponent },
  { path: 'print', redirectTo: 'print/multiplication', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'faq', component: FaqComponent },
  { path: '**', redirectTo: '' }
];
