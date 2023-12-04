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
      if (this.action.bookName) {
        header.push(`${reference.bookName}`);
      }
      if (this.action.reference) {
        header.push(`${reference.reference}`);
      }
      if (this.action.localReference) {
        header.push(`${reference.localReference}`);
      }
      if (this.action.translation) {
        header.push(`${reference.translation}`);
      }
      if (this.action.abbreviation) {
        header.push(`${reference.abbreviation}`);
      }
      if (this.action.language) {
        header.push(`${reference.language}`);
      }
      if (this.action.languageCode) {
        header.push(`${reference.languageCode}`);
      }
      // Construct the header
      if (header.length > 0) {
        display.push(`[${header.join(' - ')}]`);
      }
      display.push(
        reference.verses
          .map(verse => `${verse.verse}. ${verse.text}`)
          .join("\n")
      );
    });

    return `${display.join("\n")}\n`;
  }
}
