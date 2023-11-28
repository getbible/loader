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
      display.push(`<div dir="${reference.getTextDirection().toUpperCase()}" class="getbible-reference-block">`);
      if (this.action().showBookName()) {
        header.push(`<span class="getbible-book-name">${reference.getBookName()}</span>`);
      }
      if (this.action().showReference()) {
        header.push(`<span class="getbible-reference">${reference.getReference()}</span>`);
      }
      if (this.action().showTranslation()) {
        header.push(`<span class="getbible-translation">${reference.getTranslation()}</span>`);
      }
      if (this.action().showAbbreviation()) {
        header.push(`<span class="getbible-abbreviation">${reference.getAbbreviation()}</span>`);
      }
      if (this.action().showLanguage()) {
        header.push(`<span class="getbible-language">${reference.getLanguage()}</span>`);
      }
      // Construct the header
      if (header.length > 0) {
        display.push(`<b class="getbible-header">${header.join(' - ')}</b>`);
      }
      const verses = reference.getVerses()
        .map(verse => `<div class="getbible-verse">${verse.verse}. ${verse.text}</div>`)
        .join("\n");
      display.push(`<div class="getbible-verses">${verses}</div>`);
      display.push(`</div>`);
    });

    return `<div class="getbible-element getbible-block">${display.join("\n")}</div><br />`;
  }
}
