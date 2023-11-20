import { ModalElement } from './ModalElement.js';
import { InlineElement } from './InlineElement.js';
import { TooltipElement } from './TooltipElement.js';

/**
 * Element class responsible for creating and managing different types of elements
 * based on the specified format.
 */
export class Element {
    /**
     * Constructs an Element instance based on the given format.
     *
     * @param {HTMLElement} triggerElement - The trigger element.
     * @param {string} format - The format type.
     */
    constructor(triggerElement, format = 'tooltip') {
        if (!(triggerElement instanceof HTMLElement)) {
            throw new Error("triggerElement must be an instance of HTMLElement.");
        }

        const elementTypes = {
            'modal': ModalElement,
            'inline': InlineElement,
            'tooltip': TooltipElement
        };

        const ElementType = elementTypes[format] || TooltipElement;
        this.element = new ElementType(triggerElement);

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
