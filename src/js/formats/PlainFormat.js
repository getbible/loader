import {BaseFormat} from './BaseFormat.js';
import {Scripture} from '../core/Scripture.js';

export class PlainFormat extends BaseFormat {
  constructor(action) {
    super(action);
  }

  /**
   * Formats the verses for plain text display.
   *
   * @param {Scripture} scripture - The data containing verses and their details.
   * @returns {string} The formatted verses.
   */
  get(scripture) {
    let display = [];
    scripture.forEachReference((reference) => {
      let header = [];
      if (this.action().showBookName()) {
        header.push(`${reference.getBookName()}`);
      }
      if (this.action().showReference()) {
        header.push(`${reference.getReference()}`);
      }
      if (this.action().showTranslation()) {
        header.push(`${reference.getTranslation()}`);
      }
      if (this.action().showAbbreviation()) {
        header.push(`${reference.getAbbreviation()}`);
      }
      if (this.action().showLanguage()) {
        header.push(`${reference.getLanguage()}`);
      }
      // Construct the header
      if (header.length > 0) {
        display.push(`[${header.join(' - ')}]`);
      }
      display.push(
        reference.getVerses()
          .map(verse => `${verse.verse}. ${verse.text}`)
          .join("\n")
      );
    });

    return `${display.join("\n")}\n`;
  }
}
