import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  set(config: { title: string; description: string; canonical: string; schema?: object }) {
    this.title.setTitle(config.title);
    this.meta.updateTag({ name: 'description', content: config.description });

    let canonicalEl = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = this.doc.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', config.canonical);

    if (config.schema) {
      const id = 'page-schema';
      let script = this.doc.getElementById(id);
      if (!script) {
        script = this.doc.createElement('script');
        script.id = id;
        script.setAttribute('type', 'application/ld+json');
        this.doc.head.appendChild(script);
      }
      script.textContent = JSON.stringify(config.schema);
    }
  }
}
