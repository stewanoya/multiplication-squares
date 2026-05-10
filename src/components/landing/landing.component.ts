import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';
import { VARIANT_LIST, VariantConfig } from '../../models/variant.model';

interface ComingSoonGame {
  label: string;
  icon: string;
  gradeRange?: string;
  comingSoon: true;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, RouterLink, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  activeGames: VariantConfig[] = VARIANT_LIST;

  comingSoonGames: ComingSoonGame[] = [
    { label: 'Factors', icon: 'f', comingSoon: true },
    { label: 'Multiples', icon: 'm', comingSoon: true },
    { label: 'Prime & Composite', icon: 'p', comingSoon: true },
  ];

  constructor(private _router: Router, private seo: SeoService) {}

  ngOnInit() {
    this.seo.set({
      title: 'Math Squares — Free Online Math Games for Classrooms',
      description: 'Free browser-based math games for classrooms. Practice addition, subtraction, multiplication, and division with the Math Squares dots-and-boxes games. No printing or prep needed.',
      canonical: 'https://m-squares.anoya.ca/'
    });
  }

  play(variantId: string) {
    this._router.navigate(['/play', variantId]);
  }
}
