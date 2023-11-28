import {Scripture} from '../core/Scripture.js';
import {Action} from '../core/Action.js';

export class BaseFormat {
  #action;

  /**
   * Creates a new BaseTooltip instance.
   *
   * @param {Action} action - The action elements that triggers the tooltip.
   */
  constructor(action) {
    this.#action = action;
  }

  /**
   * Get action.
   *
   * @returns {Action} The current actions.
   */
  action() {
    return this.#action;
  }

  /**
   * Get formats the verses.
   *
   * @param {Scripture} scripture - The data containing verses and their details.
   * @returns {string} The formatted verses.
   * @abstract
   */
  get(scripture) {
    throw new Error("The 'get' method must be implemented in BaseFormat subclass.");
  }
}
