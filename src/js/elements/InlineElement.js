/**
 * InlineElement class responsible for adding inline elements.
 */
export class InlineElement {
    /**
     * Creates an instance of InlineElement.
     *
     * @param {HTMLElement} triggerElement - The element that triggers the inline display.
     */
    constructor(triggerElement) {
        if (!(triggerElement instanceof HTMLElement)) {
            throw new Error("triggerElement must be an instance of HTMLElement.");
        }
        this.triggerElement = triggerElement;
        // Clear initial content
        this.triggerElement.innerHTML = '';
    }

    /**
     * Loads content into the trigger element. Appends new content if existing content is present.
     *
     * @param {string} content - The content to load into the trigger element.
     */
    load(content) {
        const existingContent = this.triggerElement.innerHTML;
        this.triggerElement.innerHTML = existingContent ? `${existingContent}\n ${content}` : content;
    }
}
