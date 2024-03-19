import {BaseFormat} from './BaseFormat.js';
import {Scripture} from '../core/Scripture.js';

export class BlockFormat extends BaseFormat {
  constructor(action) {
    super(action);
  }

  /**
   * Formats the verses for HTML block elements.
   *
   * @param {Scripture} scripture - The data containing verses and their details.
   * @returns {string} The formatted verses.
   */
  get(scripture) {
    let display = [];
    scripture.forEachReference((reference) => {
      let header = [];
      display.push(`<div dir="${reference.textDirection.toUpperCase()}" class="getbible-reference-block">`);
      if (this.action.bookName) {
        header.push(`<span class="getbible-book-name">${reference.bookName}</span>`);
      }
      if (this.action.reference) {
        header.push(`<span class="getbible-reference">${reference.reference}</span>`);
      }
      if (this.action.localReference) {
        header.push(`<span class="getbible-reference">${reference.localReference}</span>`);
      }
      if (this.action.translation) {
        header.push(`<span class="getbible-translation">${reference.translation}</span>`);
      }
      if (this.action.abbreviation) {
        header.push(`<span class="getbible-abbreviation">${reference.abbreviation}</span>`);
      }
      if (this.action.language) {
        header.push(`<span class="getbible-language">${reference.language}</span>`);
      }
      if (this.action.languageCode) {
        header.push(`<span class="getbible-language-code">${reference.languageCode}</span>`);
      }
      // Construct the header
      if (header.length > 0) {
        display.push(`<b class="getbible-header">${header.join(' - ')}</b>`);
      }
      // Add link to chapter
      if (this.action.bibleLink) {
        display.push(`&nbsp;<a class="getbible-link"
            href="${this.action.bibleUrl}${reference.bibleUrl}"
            target="_blank" style="text-decoration: unset;"
            title="${reference.reference}">${this.getExternalLinkImage(reference.reference)}</a>`);
      }
      const verses = reference.verses
        .map(verse => `<div class="getbible-verse">${verse.verse}. ${verse.text}</div>`)
        .join("\n");
      display.push(`<div class="getbible-verses">${verses}</div>`);
      display.push(`</div>`);
    });

    return `<div class="getbible-element getbible-block">${display.join("\n")}</div><br />`;
  }
}
