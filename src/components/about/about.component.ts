import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.seo.set({
      title: 'About Multiplication Squares — Free Browser-Based Math Game',
      description: 'Learn how Multiplication Squares works, why it keeps students engaged, and how to use it in your classroom. Free, no prep, no account required.',
      canonical: 'https://m-squares.anoya.ca/about'
    });
  }
}
