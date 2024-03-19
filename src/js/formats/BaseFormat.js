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
  get action() {
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

  /**
   * Get external link svg image.
   *
   * @param {string} title - The external link title.
   *
   * @returns {string} The external link svg image.
   */
  getExternalLinkImage(title) {
    // just to be safe
    title.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
      <title>${title}</title>
      <path
        fill="#36c"
        d="M6 1h5v5L8.86 3.85 4.7 8 4 7.3l4.15-4.16L6 1Z M2 3h2v1H2v6h6V8h1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
      />
    </svg>`;
  }
}
