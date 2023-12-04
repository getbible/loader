import {BaseModal} from './BaseModal.js';

export class TailwindModal extends BaseModal {
  constructor(action) {
    super(action);
  }

  show() {
    document.getElementById(this.id).classList.remove('hidden');
  }

  hide() {
    document.getElementById(this.id).classList.add('hidden');
  }

  create(content) {
    const modalHtml = `
      <div class="modal hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="${this.id}">
        <div class="modal-content container mx-auto p-5 bg-white">
          <div id="${this.id}-content">
            ${content}
          </div>
          <button class="close-button" onclick="document.getElementById('${this.id}').classList.add('hidden')">Close</button>
        </div>
      </div>`;
    this.insertIntoDOM(modalHtml);
  }

  initializeTrigger() {
    this.element.addEventListener('click', () => {
      document.getElementById(this.id).classList.remove('hidden');
    });
  }
}

