import {Action} from '../../core/Action.js';

export class BaseTooltip {
  #action;

  /**
   * Creates a new BaseTooltip instance.
   *
   * @param {Action} action - The action elements that triggers the tooltip.
   */
  constructor(action) {
    this.#action = action;
    this.getElement().style.cursor = 'help';
  }

  /**
   * Loads content into the tooltip. If the trigger elements already has a title,
   * the new content is appended to it.
   *
   * @param {string} content - The content to load into the tooltip.
   * @throws {Error} Throws an error if the trigger elements is not valid.
   */
  load(content) {
    const existingTitle = this.getElement().getAttribute('title');
    const newTitle = existingTitle ? existingTitle + "\n" + content : content;
    this.getElement().setAttribute('title', newTitle);
  }

  /**
   * Get the action element
   *
   * @returns {HTMLElement} - The DOM element being worked with.
   */
  getElement() {
    return this.#action.getElement();
  }
}
