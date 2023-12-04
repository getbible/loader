import {BaseModal} from './BaseModal.js';

export class FoundationModal extends BaseModal {
  constructor(action) {
    super(action);
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
      <div class="reveal" id="${this.id}" data-reveal>
        <div id="${this.id}-content">
          ${content}
        </div>
        <button class="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
    this.insertIntoDOM(modalHtml);
    this.modalElement = new Foundation.Reveal(document.getElementById(this.id));
  }

  initializeTrigger() {
    this.element.setAttribute('data-open', this.id);
  }
}
