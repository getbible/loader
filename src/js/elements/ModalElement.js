import { BaseModal } from './modals/BaseModal.js';
import { UikitModal } from './modals/UikitModal.js';
import { BootstrapModal } from './modals/BootstrapModal.js';
import { FoundationModal } from './modals/FoundationModal.js';
import { TailwindModal } from './modals/TailwindModal.js';

/**
 * ModalElement class responsible for creating and managing modal elements.
 * It dynamically selects the appropriate modal style based on the available UI framework.
 */
export class ModalElement {
  /**
   * Constructs an instance of ModalElement with the appropriate modal type
   * based on the detected UI framework.
   *
   * @param {HTMLElement} triggerElement - The element that triggers the modal.
   */
  constructor(triggerElement) {
    this.modal = ModalElement.framework(triggerElement);
  }

  /**
   * Loads content into the modal.
   *
   * @param {string} content - The content to load into the modal.
   */
  load(content) {
    this.modal.load(content);
  }

  /**
   * Determines the appropriate modal implementation based on the available UI framework.
   *
   * @param {HTMLElement} triggerElement - The element triggering the modal.
   * @returns {BaseModal|BootstrapModal|UikitModal|FoundationModal|TailwindModal} The modal instance.
   */
  static framework(triggerElement) {
    const frameworks = {
      'UIkit': UikitModal,
      'bootstrap': BootstrapModal,
      'Foundation': FoundationModal,
      'tailwind': TailwindModal
    };

    for (const [key, ModalType] of Object.entries(frameworks)) {
      if (typeof window[key] !== 'undefined' || (key === 'tailwind' && document.querySelector('.tailwind-class') !== null)) {
        if (process.env.DEBUG) {
          console.log(`${key} modal selected`);
        }
        return new ModalType(triggerElement);
      }
    }

    if (process.env.DEBUG) {
      console.log(`base modal selected`);
    }
    return new BaseModal(triggerElement);
  }
}
