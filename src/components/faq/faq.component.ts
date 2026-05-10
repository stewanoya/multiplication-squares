import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';

const FAQ_ITEMS = [
  {
    question: 'What grade levels is this for?',
    answer: 'The four games cover Grades 1–5. Addition and subtraction for Grades 1–2, multiplication and division for Grades 3–5. Each has multiple difficulty levels so you can match it to your class.'
  },
  {
    question: 'How many players can play?',
    answer: '2 to 4. Works for partner work, small groups, or a projector demo with two teams.'
  },
  {
    question: 'Do students need an account or download?',
    answer: 'No. It runs in a browser tab. Open the link and play.'
  },
  {
    question: 'Does it work on Chromebooks and tablets?',
    answer: 'Yes, in any modern browser — Chrome, Safari, Firefox, Edge. Chromebooks, iPads, tablets, laptops, desktops all work.'
  },
  {
    question: 'Can I display it on a projector or interactive whiteboard?',
    answer: 'Yes. It scales to fill the screen.'
  },
  {
    question: 'Is it free?',
    answer: 'Yes. No subscription, no premium version, no catch.'
  },
  {
    question: 'How do you play Math Squares?',
    answer: 'Spin to get a number, solve the math problem for your game, find that answer on the board. Draw a line on one side of a matching square. Close all four sides and you own it. Most squares at the end wins.'
  },
  {
    question: 'Can students play from home?',
    answer: 'Yes. Any device with a browser works. No school account needed.'
  },
  {
    question: 'Is there a printable version?',
    answer: 'Yes. Go to the print page, pick a game and level, and print. Hit Regenerate for a different layout — the board randomizes each time.'
  },
  {
    question: 'What do I need to play the printed version?',
    answer: 'One printed sheet per group, colored pencils (one color per player), and a spinner or dice.'
  },
  {
    question: 'How is this different from printed versions?',
    answer: 'Printed versions mean finding the file, printing it, handing it out, and collecting it after. This opens in a browser tab. Nothing to prep, nothing to collect.'
  },
  {
    question: 'How do I reset for a new round?',
    answer: 'Hit the reset button in the game.'
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
      title: 'FAQ — Math Squares',
      description: 'Common teacher questions about Math Squares: grade levels, player count, Chromebook support, and how to use it in class.',
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
