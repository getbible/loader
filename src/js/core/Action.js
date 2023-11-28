/**
 * Class for managing actions based on element data attributes.
 */
export class Action {
  #element;
  #format;
  #translations;
  #showBookName;
  #showReference;
  #showTranslation;
  #showAbbreviation;
  #showLanguage;

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
    this.#showTranslation = element.dataset.showTranslation ? parseInt(element.dataset.showTranslation, 10) : 0;
    this.#showAbbreviation = element.dataset.showAbbreviation ? parseInt(element.dataset.showAbbreviation, 10) : 0;
    this.#showLanguage = element.dataset.showLanguage ? parseInt(element.dataset.showLanguage, 10) : 0;
  }

  /**
   * Retrieves the translations.
   *
   * @returns {Array<string>} An array of translation strings.
   */
  getTranslations() {
    return this.#translations;
  }

  /**
   * Retrieves the show book name flag.
   *
   * @returns {number} The show book name flag (0 or 1).
   */
  showBookName() {
    return this.#showBookName;
  }

  /**
   * Retrieves the show reference flag.
   *
   * @returns {number} The show reference flag (0 or 1).
   */
  showReference() {
    return this.#showReference;
  }

  /**
   * Retrieves the show translation flag.
   *
   * @returns {number} The show translation flag (0 or 1).
   */
  showTranslation() {
    return this.#showTranslation;
  }

  /**
   * Retrieves the show abbreviation flag.
   *
   * @returns {number} The show abbreviation flag (0 or 1).
   */
  showAbbreviation() {
    return this.#showAbbreviation;
  }

  /**
   * Retrieves the show language flag.
   *
   * @returns {number} The show language flag (0 or 1).
   */
  showLanguage() {
    return this.#showLanguage;
  }

  /**
   * Retrieves the element format.
   *
   * @returns {string} The element format.
   */
  getFormat() {
    return this.#format;
  }

  /**
   * Retrieves the DOM element.
   *
   * @returns {HTMLElement} The DOM element associated with this object.
   */
  getElement() {
    return this.#element;
  }
}
