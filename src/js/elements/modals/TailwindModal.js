import { BaseModal } from './BaseModal.js';

export class TailwindModal extends BaseModal {
  constructor(triggerElement) {
    super(triggerElement);
  }

  show() {
    document.getElementById(this.modalId).classList.remove('hidden');
  }

  hide() {
    document.getElementById(this.modalId).classList.add('hidden');
  }

  create(content) {
    const modalHtml = `
      <div class="modal hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="${this.modalId}">
        <div class="modal-content container mx-auto p-5 bg-white">
          <div id="${this.modalId}-content">
            ${content}
          </div>
          <button class="close-button" onclick="document.getElementById('${this.modalId}').classList.add('hidden')">Close</button>
        </div>
      </div>`;
    this.insertIntoDOM(modalHtml);
  }

  initializeTrigger(triggerElement) {
    this.triggerElement.addEventListener('click', () => {
      document.getElementById(this.modalId).classList.remove('hidden');
    });
  }
}

