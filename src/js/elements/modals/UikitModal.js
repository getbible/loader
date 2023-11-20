import { BaseModal } from './BaseModal.js';

export class UikitModal extends BaseModal {
  constructor(triggerElement) {
    super(triggerElement);
  }

  show() {
    UIkit.modal(`#${this.modalId}`).show();
  }

  hide() {
    UIkit.modal(`#${this.modalId}`).hide();
  }

  create(content) {
    const modalHtml = `
      <div id="${this.modalId}" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div id="${this.modalId}-content">
            ${content}
          </div>
        </div>
      </div>`;
    this.insertIntoDOM(modalHtml);
  }

  initializeTrigger() {
    this.triggerElement.setAttribute('uk-toggle', `target: #${this.modalId}`);
  }
}

