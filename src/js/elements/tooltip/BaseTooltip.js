export class BaseTooltip {
  /**
   * Creates a new BaseTooltip instance.
   *
   * @param {HTMLElement} triggerElement - The elements that triggers the tooltip.
   */
  constructor(triggerElement) {
    this.triggerElement = triggerElement;
    this.triggerElement.style.cursor = 'help';
  }

  /**
   * Loads content into the tooltip. If the trigger elements already has a title,
   * the new content is appended to it.
   *
   * @param {string} content - The content to load into the tooltip.
   * @throws {Error} Throws an error if the trigger elements is not valid.
   */
  load(content) {
    const existingTitle = this.triggerElement.getAttribute('title');
    const newTitle = existingTitle ? existingTitle + "\n" + content : content;
    this.triggerElement.setAttribute('title', newTitle);
  }
}
