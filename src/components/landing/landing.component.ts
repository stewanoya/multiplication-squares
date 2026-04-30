import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  constructor(private _router: Router, private seo: SeoService) {}

  ngOnInit() {
    this.seo.set({
      title: 'Multiplication Squares: Free Online Math Game',
      description: 'Play Multiplication Squares free in your browser. No printing, no prep. Roll dice, capture squares, practice times tables. Works for Grades 1 to 8.',
      canonical: 'https://m-squares.anoya.ca/'
    });
  }

  play() {
    this._router.navigate(['/play']);
  }
}
