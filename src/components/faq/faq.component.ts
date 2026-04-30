import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';

const FAQ_ITEMS = [
  {
    question: 'What grade levels is this for?',
    answer: 'Multiplication Squares works for Grades 1–8. The board size adjusts — a smaller board covers lower products, while a larger board extends to bigger multiplication facts. Choose the size that matches what your class is working on.'
  },
  {
    question: 'How many players can play?',
    answer: '2 to 4 players per game. It works well for partner work, math centers, or small groups. You can also run it as a whole-class activity on a projector with two student teams.'
  },
  {
    question: 'Do students need an account or download?',
    answer: 'No. The game runs entirely in a browser tab — no login, no app, no download required. Just open the link and play.'
  },
  {
    question: 'Does it work on Chromebooks and tablets?',
    answer: 'Yes. Multiplication Squares works in any modern browser — Chrome, Firefox, Safari, and Edge. It runs on Chromebooks, iPads, Android tablets, laptops, and desktops.'
  },
  {
    question: 'Can I display it on a projector or interactive whiteboard?',
    answer: 'Yes. The game scales to fit the screen and works well on large displays. It\'s a good option for whole-class warm-ups or live demonstrations.'
  },
  {
    question: 'Is it free?',
    answer: 'Yes, completely free. No subscription, no premium version, no cost.'
  },
  {
    question: 'How do you play Multiplication Squares?',
    answer: 'Players take turns rolling dice and multiplying the two numbers together. Find a square on the board that matches the product and draw a line on one side of it. If your line completes a square — surrounding all four sides — that square is captured and scored to you. The player with the most squares when no moves remain wins.'
  },
  {
    question: 'Can students play from home?',
    answer: 'Yes. The game is accessible from any device with a browser. No school network or account is required.'
  },
  {
    question: 'How is this different from printed versions of Multiplication Squares?',
    answer: 'Printed versions require finding the file, printing it, and distributing physical copies. This version opens in a browser tab in seconds — no prep time, no printing costs, and nothing to collect or hand back.'
  },
  {
    question: 'How do I reset for a new round?',
    answer: 'There is a reset option in the game. You can start a fresh round without reloading the page.'
  }
];

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
  readonly items = FAQ_ITEMS;

  constructor(private seo: SeoService) {}

  ngOnInit() {
    this.seo.set({
      title: 'FAQ — Multiplication Squares',
      description: 'Answers to common teacher questions about Multiplication Squares: grade levels, player count, Chromebook support, and how to use it in class.',
      canonical: 'https://m-squares.anoya.ca/faq',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    });
  }
}
