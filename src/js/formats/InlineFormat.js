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
      display.push(`<div dir="${reference.getTextDirection().toUpperCase()}" class="getbible-reference-inline">`);
      if (this.action().showBookName()) {
        footer.push(`<span class="getbible-book-name">${reference.getBookName()}</span>`);
      }
      if (this.action().showReference()) {
        footer.push(`<span class="getbible-reference">${reference.getReference()}</span>`);
      }
      if (this.action().showTranslation()) {
        footer.push(`<span class="getbible-translation">${reference.getTranslation()}</span>`);
      }
      if (this.action().showAbbreviation()) {
        footer.push(`<span class="getbible-abbreviation">${reference.getAbbreviation()}</span>`);
      }
      if (this.action().showLanguage()) {
        footer.push(`<span class="getbible-language">${reference.getLanguage()}</span>`);
      }
      const verses = reference.getVerses()
        .map(verse => `<span class="getbible-verse">${verse.verse}. ${verse.text}</span>`)
        .join("\n");
      display.push(`<span class="getbible-verses">${verses}</span>`);
      // Construct the footer
      if (footer.length > 0) {
        display.push(`<b class="getbible-footer">${footer.join(' - ')}</b>`);
      }
      display.push(`</div>`);
    });

    return `<div class="getbible-element getbible-inline">${display.join("\n")}</div>`;
  }
}
