import {Action} from '../core/Action.js';

/**
 * InlineElement class responsible for adding inline elements.
 */
export class InlineElement {
  #action;

  /**
   * Creates an instance of InlineElement.
   *
   * @param {Action} action - The action element that triggers the inline display.
   */
  constructor(action) {
    this.#action = action;
    // Clear initial content
    this.getElement().innerHTML = '';
  }

  /**
   * Loads content into the trigger element. Appends new content if existing content is present.
   *
   * @param {string} content - The content to load into the trigger element.
   */
  load(content) {
    const existingContent = this.getElement().innerHTML;
    this.getElement().innerHTML = existingContent ? `${existingContent}\n ${content}` : content;
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
