import {BaseModal} from './BaseModal.js';

export class UikitModal extends BaseModal {
  constructor(action) {
    super(action);
  }

  show() {
    UIkit.modal(`#${this.getModalId()}`).show();
  }

  hide() {
    UIkit.modal(`#${this.getModalId()}`).hide();
  }

  create(content) {
    const modalHtml = `
      <div id="${this.getModalId()}" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div id="${this.getModalId()}-content">
            ${content}
          </div>
        </div>
      </div>`;
    this.insertIntoDOM(modalHtml);
  }

  initializeTrigger() {
    this.getElement().setAttribute('uk-toggle', `target: #${this.getModalId()}`);
  }
}

