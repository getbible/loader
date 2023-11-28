/**
 * Class for managing local storage of scripture data.
 */
export class Memory {
  // Constant representing one month in milliseconds.
  static ONE_MONTH_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

  /**
   * Stores scripture data in local storage.
   *
   * @param {string} reference - The scripture reference.
   * @param {string} translation - The translation.
   * @param {Object} data - The scripture data to be stored.
   * @throws {Error} If storing data fails.
   */
  static set(reference, translation, data) {
    const key = this.#key(reference, translation);
    const item = {
      data,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error storing data in local storage:', error);
      throw error;
    }
  }

  /**
   * Retrieves scripture data from local storage.
   *
   * @param {string} reference - The scripture reference.
   * @param {string} translation - The translation.
   * @returns {Promise<Object|null>} The scripture data or null if not found.
   */
  static async get(reference, translation) {
    return this.#get(reference, translation);
  }

  /**
   * Internal method to check local storage for scripture data.
   *
   * @param {string} reference - The scripture reference.
   * @param {string} translation - The translation.
   * @returns {Object|null} The stored data or null if not found.
   * @throws {Error} If parsing or retrieval from local storage fails.
   * @private
   */
  static #get(reference, translation) {
    const key = this.#key(reference, translation);
    try {
      const storedItem = localStorage.getItem(key);
      if (storedItem) {
        const {data, timestamp} = JSON.parse(storedItem);
        if (timestamp > Date.now() - Memory.ONE_MONTH_IN_MILLISECONDS) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error parsing or retrieving data from local storage:', error);
      throw error;
    }
  }

  /**
   * Generates a key for scripture data storage.
   *
   * @param {string} reference - The scripture reference.
   * @param {string} translation - The translation.
   * @returns {string} A unique key for local storage.
   * @private
   */
  static #key(reference, translation) {
    return `getBible-${translation}-${reference}`;
  }
}
