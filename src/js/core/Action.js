/**
 * Class for managing actions based on element data attributes.
 */
export class Action {
  #element;
  #format;
  #translations;
  #showBookName;
  #showReference;
  #showLocalReference;
  #showTranslation;
  #showAbbreviation;
  #showLanguage;
  #showLanguageCode;

  /**
   * Initializes the Actions object with a DOM element and its data attributes.
   *
   * @param {HTMLElement} element - The DOM element containing data attributes.
   */
  constructor(element) {

    if (!(element instanceof HTMLElement)) {
      throw new Error("triggerElement must be an instance of HTMLElement.");
    }

    this.#element = element;
    this.#format = (element.dataset.format || 'inline').toLowerCase();
    this.#translations = (element.dataset.translation || 'kjv').toLowerCase().split(';').map(translation => translation.trim());
    this.#showBookName = element.dataset.showBookName ? parseInt(element.dataset.showBookName, 10) : 0;
    this.#showReference = element.dataset.showReference ? parseInt(element.dataset.showReference, 10) : 1;
    this.#showLocalReference = element.dataset.showLocalReference ? parseInt(element.dataset.showLocalReference, 10) : 0;
    this.#showTranslation = element.dataset.showTranslation ? parseInt(element.dataset.showTranslation, 10) : 0;
    this.#showAbbreviation = element.dataset.showAbbreviation ? parseInt(element.dataset.showAbbreviation, 10) : 0;
    this.#showLanguage = element.dataset.showLanguage ? parseInt(element.dataset.showLanguage, 10) : 0;
    this.#showLanguageCode = element.dataset.showLanguageCode ? parseInt(element.dataset.showLanguageCode, 10) : 0;

    if (this.#showLocalReference){
      this.#showReference = 0;
    }
  }

  /**
   * Retrieves the translations.
   *
   * @returns {Array<string>} An array of translation strings.
   */
  get translations() {
    return this.#translations;
  }

  /**
   * Retrieves the show book name flag.
   *
   * @returns {number} The show book name flag (0 or 1).
   */
  get bookName() {
    return this.#showBookName;
  }

  /**
   * Retrieves the show reference flag.
   *
   * @returns {number} The show reference flag (0 or 1).
   */
  get reference() {
    return this.#showReference;
  }

  /**
   * Retrieves the show local reference flag.
   *
   * @returns {number} The show reference flag (0 or 1).
   */
  get localReference() {
    return this.#showLocalReference;
  }

  /**
   * Retrieves the show translation flag.
   *
   * @returns {number} The show translation flag (0 or 1).
   */
  get translation() {
    return this.#showTranslation;
  }

  /**
   * Retrieves the show abbreviation flag.
   *
   * @returns {number} The show abbreviation flag (0 or 1).
   */
  get abbreviation() {
    return this.#showAbbreviation;
  }

  /**
   * Retrieves the show language flag.
   *
   * @returns {number} The show language flag (0 or 1).
   */
  get language() {
    return this.#showLanguage;
  }

  /**
   * Retrieves the show language code flog.
   *
   * @returns {number} The show language flag (0 or 1).
   */
  get languageCode() {
    return this.#showLanguageCode;
  }

  /**
   * Retrieves the element format.
   *
   * @returns {string} The element format.
   */
  get format() {
    return this.#format;
  }

  /**
   * Retrieves the DOM element.
   *
   * @returns {HTMLElement} The DOM element associated with this object.
   */
  get element() {
    return this.#element;
  }
}
