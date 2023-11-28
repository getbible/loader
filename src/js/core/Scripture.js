import {Reference} from './Reference.js';

/**
 * Class for handling Scripture.
 */
export class Scripture {
  #references; // Private array for storing references

  /**
   * Initializes the Bible translations, books, and chapters.
   *
   * @param {Object} data - An object with references data keyed by identifiers.
   */
  constructor(data) {
    this.#references = Object.values(data).map(reference => new Reference(reference));
  }

  /**
   * Gets a reference by its numerical index.
   *
   * @param {number} index - The index of the reference.
   * @returns {Reference|null} The Reference instance or null if out of bounds.
   */
  getReference(index) {
    return (index >= 0 && index < this.#references.length) ? this.#references[index] : null;
  }

  /**
   * Gets the translation.
   *
   * @param {number} index - The index of the reference.
   * @returns {Reference|null} The Reference instance or null if out of bounds.
   */
  getReference(index) {
    return (index >= 0 && index < this.#references.length) ? this.#references[index] : null;
  }

  /**
   * Iterates over all references and performs a callback function.
   *
   * @param {Function} callback - The callback function to execute for each chapter.
   */
  forEachReference(callback) {
    this.#references.forEach(callback);
  }
}
