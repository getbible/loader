export class BaseModal {
  /**
   * Creates a new BaseModal instance.
   *
   * @param {HTMLElement} triggerElement - The elements that triggers the modal.
   */
  constructor(triggerElement) {
    this.modalId = `modal-${Math.random().toString(36).slice(2, 11)}`;
    this.triggerElement = triggerElement;
    this.triggerElement.style.cursor = 'pointer';
    this.initializeTrigger();
  }

  /**
   * Loads content into the modal.
   *
   * @param {string} content - The content to load into the modal.
   */
  load(content) {
    const existingModal = document.getElementById(this.modalId);
    // Check if modal already exists
    if (existingModal) {
      // Update the content of the existing modal
      const contentDiv = document.getElementById(`${this.modalId}-content`);
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
    <div id="${this.modalId}" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0, 0, 0, 0.5); justify-content:center; align-items:center;">
      <div style="position:relative; background-color:white; padding:20px; border-radius:5px; max-width:300px;">
        <button class="getbible-modal-close" type="button" onclick="document.getElementById('${this.modalId}').style.display='none'" style="position:absolute; top:10px; right:10px; border:none; background:transparent; font-size:24px; cursor:pointer;">✖</button>
        <div id="${this.modalId}-content">
          ${content}
        </div>
      </div>
    </div>`;
    this.insertIntoDOM(modalHtml);

    const modalElement = document.getElementById(this.modalId);
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
    this.triggerElement.addEventListener('click', () => {
      document.getElementById(this.modalId).style.display = 'flex';
    });
  }
}
