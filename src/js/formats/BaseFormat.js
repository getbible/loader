export class BaseFormat {
  /**
   * Get formats the verses.
   *
   * @param {Object} data - The data containing verses and their details.
   * @param {boolean} showBook - Whether to show book names.
   * @param {boolean} showTrans - Whether to show translations.
   * @param {boolean} showAbbr - Whether to show abbreviations.
   * @param {boolean} showLang - Whether to show languages.
   * @returns {string} The formatted verses.
   * @abstract
   */
  get(data, showBook, showTrans, showAbbr, showLang) {
    throw new Error("The 'get' method must be implemented in BaseFormat subclass.");
  }
}
