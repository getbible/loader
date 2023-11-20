import { BaseModal } from './BaseModal.js';

export class BootstrapModal extends BaseModal {
  constructor(triggerElement) {
    super(triggerElement);
  }

  show() {
    const modal = new bootstrap.Modal(document.getElementById(this.modalId));
    modal.show();
  }

  hide() {
    const modal = bootstrap.Modal.getInstance(document.getElementById(this.modalId));
    if (modal) {
      modal.hide();
    }
  }

  create(content) {
    const modalHtml = `
      <div class="modal fade" id="${this.modalId}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content p-3">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="${this.modalId}-content" class="modal-body">
              ${content}
            </div>
          </div>
        </div>
      </div>`;
    this.insertIntoDOM(modalHtml);
  }

  initializeTrigger() {
    this.triggerElement.setAttribute('data-bs-toggle', 'modal');
    this.triggerElement.setAttribute('data-bs-target', `#${this.modalId}`);
  }
}
