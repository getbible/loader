import {Action} from '../core/Action.js';
import {ModalElement} from './ModalElement.js';
import {InlineElement} from './InlineElement.js';
import {TooltipElement} from './TooltipElement.js';

/**
 * Element class responsible for creating and managing different types of elements
 * based on the specified format.
 */
export class Element {
  /**
   * Constructs an Element instance based on the given format.
   *
   * @param {Action} action - The action element that triggers the inline display.
   */
  constructor(action) {
    const elementTypes = {
      'modal': ModalElement,
      'inline': InlineElement,
      'tooltip': TooltipElement
    };

    const format = action.format;
    const ElementType = elementTypes[format] || InlineElement;
    this.element = new ElementType(action);

    if (process.env.DEBUG) {
      console.log(`${format} element selected`);
    }
  }

  /**
   * Load the content into the element.
   *
   * @param {string} content - The content to load.
   */
  load(content) {
    this.element.load(content);
  }
}
