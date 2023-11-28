/**
 * Class for handling chapter data.
 */
export class Reference {
  #data; // Private data member

  /**
   * Initializes the BibleVerse object with verse data.
   *
   * @param {Object} data - The JSON data containing verse information.
   */
  constructor(data) {
    this.#data = data;
  }

  /**
   * Retrieves the translation name.
   *
   * @returns {string} The name of the translation.
   */
  getTranslation() {
    return this.#data.translation;
  }

  /**
   * Retrieves the abbreviation of the translation.
   *
   * @returns {string} The abbreviation of the translation.
   */
  getAbbreviation() {
    return this.#data.abbreviation;
  }

  /**
   * Retrieves the language code.
   *
   * @returns {string} The language code.
   */
  getLanguage() {
    return this.#data.lang;
  }

  /**
   * Retrieves the full language name.
   *
   * @returns {string} The full name of the language.
   */
  getLanguageName() {
    return this.#data.language;
  }

  /**
   * Retrieves the text direction.
   *
   * @returns {string} The direction of the text (LTR or RTL).
   */
  getTextDirection() {
    return this.#data.direction;
  }

  /**
   * Retrieves the encoding format.
   *
   * @returns {string} The encoding format (e.g., UTF-8).
   */
  getEncoding() {
    return this.#data.encoding;
  }

  /**
   * Retrieves the book number.
   *
   * @returns {number} The book number.
   */
  getBookNumber() {
    return this.#data.book_nr;
  }

  /**
   * Retrieves the name of the book.
   *
   * @returns {string} The name of the book.
   */
  getBookName() {
    return this.#data.book_name;
  }

  /**
   * Retrieves the chapter number.
   *
   * @returns {number} The chapter number.
   */
  getChapter() {
    return this.#data.chapter;
  }

  /**
   * Retrieves the name of the chapter.
   *
   * @returns {string} The name of the chapter.
   */
  getChapterName() {
    return this.#data.name;
  }

  /**
   * Retrieves all verses of the chapter.
   *
   * @returns {Array<Object>} An array of objects representing each verse.
   */
  getVerses() {
    return this.#data.verses;
  }

  /**
   * Retrieves a specific verse by its number.
   *
   * @param {number} verseNumber - The number of the verse to retrieve.
   * @returns {Object|null} The verse object if found, or null if not.
   */
  getVerse(verseNumber) {
    return this.#data.verses.find(verse => verse.verse === verseNumber);
  }

  /**
   * Retrieves a range of verses.
   *
   * @param {number} startVerse - The starting verse number.
   * @param {number} endVerse - The ending verse number.
   * @returns {Array<Object>} An array of verse objects within the range.
   */
  getVersesInRange(startVerse, endVerse) {
    return this.#data.verses.filter(verse => verse.verse >= startVerse && verse.verse <= endVerse);
  }

  /**
   * Generates a reference string for the verses.
   *
   * @returns {string} The reference string.
   */
  getReference() {
    const verseNumbers = this.#data.verses.map(verse => verse.verse).sort((a, b) => a - b);
    let refString = `${this.#data.name}:`;
    let ranges = {};
    let rangeStart = null;
    let rangeEnd = null;
    let previousVerse = null;

    verseNumbers.forEach(verse => {
      if (rangeStart === null) {
        rangeStart = verse;
      } else if (verse === previousVerse + 1) {
        rangeEnd = verse;
      } else {
        ranges[rangeStart] = (rangeEnd !== null) ? `${rangeStart}-${rangeEnd}` : `${rangeStart}`;
        rangeStart = verse;
        rangeEnd = null;
      }
      previousVerse = verse;
    });

    // Handling the case for the last verse or a single-verse range
    if (rangeStart !== null) {
      ranges[rangeStart] = (rangeEnd !== null) ? `${rangeStart}-${rangeEnd}` : `${rangeStart}`;
    }

    // Join the range strings with commas
    return refString + Object.values(ranges).join(',');
  }
}