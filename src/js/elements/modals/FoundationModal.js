import { BaseModal } from './BaseModal.js';

export class FoundationModal extends BaseModal {
  constructor(triggerElement) {
    super(triggerElement);
    this.modalElement = null;
  }

  show() {
    if (this.modalElement) {
      this.modalElement.open();
    }
  }

  hide() {
    if (this.modalElement) {
      this.modalElement.close();
    }
  }

  create(content) {
    const modalHtml = `
      <div class="reveal" id="${this.modalId}" data-reveal>
        <div id="${this.modalId}-content">
          ${content}
        </div>
        <button class="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
    this.insertIntoDOM(modalHtml);
    this.modalElement = new Foundation.Reveal(document.getElementById(this.modalId));
  }

  initializeTrigger() {
    this.triggerElement.setAttribute('data-open', this.modalId);
  }
}
