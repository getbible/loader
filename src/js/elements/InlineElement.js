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
    this.element.innerHTML = '';
  }

  /**
   * Loads content into the trigger element. Appends new content if existing content is present.
   *
   * @param {string} content - The content to load into the trigger element.
   */
  load(content) {
    const existingContent = this.element.innerHTML;
    this.element.innerHTML = existingContent ? `${existingContent}\n ${content}` : content;
  }

  /**
   * Get the action element
   *
   * @returns {HTMLElement} - The DOM element being worked with.
   */
  get element() {
    return this.#action.element;
  }
}
