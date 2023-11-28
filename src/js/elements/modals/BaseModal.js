import {Action} from '../../core/Action.js';

export class BaseModal {
  #modalId;
  #action;

  /**
   * Creates a new BaseModal instance.
   *
   * @param {Action} action - The action element triggering the modal.
   */
  constructor(action) {
    this.#modalId = `modal-${Math.random().toString(36).slice(2, 11)}`;
    this.#action = action;
    this.getElement().style.cursor = 'pointer';
    this.initializeTrigger();
  }

  /**
   * Loads content into the modal.
   *
   * @param {string} content - The content to load into the modal.
   */
  load(content) {
    const existingModal = document.getElementById(this.getModalId());
    // Check if modal already exists
    if (existingModal) {
      // Update the content of the existing modal
      const contentDiv = document.getElementById(`${this.getModalId()}-content`);
      if (contentDiv) {
        contentDiv.innerHTML += content;
      }
    } else {
      // If modal doesn't exist, create it with the new content
      this.create(content);
    }
  }

  /**
   * Insert HTML into the dom.
   *
   * @param {string} html - The html to insert.
   */
  insertIntoDOM(html) {
    document.body.insertAdjacentHTML('beforeend', html);
  }

  /**
   * Creates the modal.
   *
   * @param {string} content - The initial content of the modal.
   */
  create(content) {
    const modalHtml = `
    <div id="${this.getModalId()}" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0, 0, 0, 0.5); justify-content:center; align-items:center;">
      <div style="position:relative; background-color:white; padding:20px; border-radius:5px; max-width:300px;">
        <button class="getbible-modal-close" type="button" onclick="document.getElementById('${this.getModalId()}').style.display='none'" style="position:absolute; top:7px; right:7px; border:none; background:transparent; font-size:20px; cursor:pointer;">✖</button>
        <div id="${this.getModalId()}-content">
          ${content}
        </div>
      </div>
    </div>`;
    this.insertIntoDOM(modalHtml);

    const modalElement = document.getElementById(this.getModalId());
    modalElement.addEventListener('click', (event) => {
      if (event.target === modalElement) {
        modalElement.style.display = 'none';
      }
    });
  }

  /**
   * Initializes the modal trigger.
   *
   */
  initializeTrigger() {
    this.getElement().addEventListener('click', () => {
      document.getElementById(this.getModalId()).style.display = 'flex';
    });
  }

  /**
   * Get the modal ID
   *
   * @returns {string} - The modal ID
   */
  getModalId() {
    return this.#modalId;
  }

  /**
   * Get the action element
   *
   * @returns {HTMLElement} - The DOM element being worked with.
   */
  getElement() {
    return this.#action.getElement();
  }
}
