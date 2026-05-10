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
      title: 'About Math Squares — Free browser-based math games for classrooms',
      description: 'Math Squares is a free browser-based dots-and-boxes game for classrooms. Practice addition, subtraction, multiplication, and division — no account, no prep, no printing needed.',
      canonical: 'https://m-squares.anoya.ca/about'
    });
  }
}
