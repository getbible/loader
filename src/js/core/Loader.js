import {Api} from './Api.js';
import {Scripture} from './Scripture.js';
import {Action} from './Action.js';
import {Format} from '../formats/Format.js';
import {Element} from '../elements/Element.js';

/**
 * Loader class responsible for handling the loading of Reference references.
 * It initializes necessary components and loads data into a specified HTML element.
 */
export class Loader {
  #api;
  #action;
  #element;
  #format;

  /**
   * Constructs a Loader instance.
   * Allows for dependency injection of the Api class for easier testing and flexibility.
   * @param {Api} api - Instance of Api class for making API calls.
   */
  constructor(api = new Api()) {
    this.#api = api;
  }

  /**
   * Load the Reference references into the specified HTML element.
   * This method extracts references from the element, validates them, and loads each valid reference.
   * @param {HTMLElement} element - The element to load Reference references into.
   */
  async load(element) {
    const references = element.innerHTML.split(';').map(ref => ref.trim());

    if (references.length === 0) {
      console.error("No references found in the getBible tagged class.");
      return;
    }

    const validReferences = this.#validateReferences(references);
    if (validReferences.length === 0) {
      console.error("No valid references found in the getBible tagged class.");
      return;
    }

    this.#init(element);
    await this.#processReferences(validReferences);
  }

  /**
   * Validates a list of references to ensure each is no longer than 30 characters and contains at least one number.
   * Invalid references are logged and excluded from the return value.
   * @param {string[]} references - The array of references to validate.
   * @returns {string[]} A filtered array of valid references.
   * @private
   */
  #validateReferences(references) {
    return references.filter(reference => {
      // Check if the reference is not longer than 30 characters and contains at least one number
      const isValid = reference.length <= 30 && /\d/.test(reference);
      // Log invalid references
      if (!isValid) {
        console.error(`Invalid getBible reference: ${reference}`);
        return false;
      }
      return true;
    });
  }

  /**
   * Processes each valid reference by fetching translations and loading the scripture.
   * This method handles the asynchronous nature of API calls.
   * @param {string[]} validReferences - Array of valid references to be processed.
   * @private
   */
  async #processReferences(validReferences) {
    for (const reference of validReferences) {
      for (const translation of this.#action.getTranslations()) {
        try {
          const scripture = await this.#api.get(reference, translation);
          if (scripture) {
            this.#load(scripture);
          }
        } catch (error) {
          console.error(`Error loading reference ${reference}:`, error);
        }
      }
    }
  }

  /**
   * Initializes components necessary for loading references.
   * This includes action, element, and format components.
   * @param {HTMLElement} element - The element to be initialized for loading.
   * @private
   */
  #init(element) {
    this.#action = new Action(element);
    this.#element = new Element(this.#action);
    this.#format = new Format(this.#action);
  }

  /**
   * Loads the scripture data into the initialized element in the specified format.
   * This method is responsible for the final rendering of scripture data.
   * @param {Object} scripture - The data containing verses and their details.
   * @private
   */
  #load(scripture) {
    this.#element.load(this.#format.get(new Scripture(scripture)));
  }
}

