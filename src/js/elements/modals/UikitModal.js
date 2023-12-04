import {BaseModal} from './BaseModal.js';

export class UikitModal extends BaseModal {
  constructor(action) {
    super(action);
  }

  show() {
    UIkit.modal(`#${this.id}`).show();
  }

  hide() {
    UIkit.modal(`#${this.id}`).hide();
  }

  create(content) {
    const modalHtml = `
      <div id="${this.id}" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div id="${this.id}-content">
            ${content}
          </div>
        </div>
      </div>`;
    this.insertIntoDOM(modalHtml);
  }

  initializeTrigger() {
    this.element.setAttribute('uk-toggle', `target: #${this.id}`);
  }
}

