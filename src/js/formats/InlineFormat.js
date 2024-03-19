import {BaseFormat} from './BaseFormat.js';
import {Scripture} from '../core/Scripture.js';

export class InlineFormat extends BaseFormat {
  constructor(action) {
    super(action);
  }

  /**
   * Formats the verses for HTML inline elements.
   *
   * @param {Scripture} scripture - The data containing verses and their details.
   * @returns {string} The formatted verses.
   */
  get(scripture) {
    let display = [];
    scripture.forEachReference((reference) => {
      let footer = [];
      display.push(`<div dir="${reference.textDirection.toUpperCase()}" class="getbible-reference-inline">`);
      if (this.action.bookName) {
        footer.push(`<span class="getbible-book-name">${reference.bookName}</span>`);
      }
      if (this.action.reference) {
        footer.push(`<span class="getbible-reference">${reference.reference}</span>`);
      }
      if (this.action.localReference) {
        footer.push(`<span class="getbible-reference">${reference.localReference}</span>`);
      }
      if (this.action.translation) {
        footer.push(`<span class="getbible-translation">${reference.translation}</span>`);
      }
      if (this.action.abbreviation) {
        footer.push(`<span class="getbible-abbreviation">${reference.abbreviation}</span>`);
      }
      if (this.action.language) {
        footer.push(`<span class="getbible-language">${reference.language}</span>`);
      }
      if (this.action.languageCode) {
        footer.push(`<span class="getbible-language-code">${reference.languageCode}</span>`);
      }
      const verses = reference.verses
        .map(verse => `<span class="getbible-verse">${verse.verse}. ${verse.text}</span>`)
        .join("\n");
      display.push(`<span class="getbible-verses">${verses}</span>`);
      // Construct the footer
      if (footer.length > 0) {
        display.push(`<b class="getbible-footer">${footer.join(' - ')}</b>`);
      }
      // Add link to chapter
      if (this.action.bibleLink) {
        display.push(`<a class="getbible-link"
            href="${this.action.bibleUrl}${reference.bibleUrl}"
            target="_blank" style="text-decoration: unset;"
            title="${reference.reference}">${this.getExternalLinkImage(reference.reference)}</a>`);
      }
      display.push(`</div>`);
    });

    return `<div class="getbible-element getbible-inline">${display.join("\n")}</div>`;
  }
}
