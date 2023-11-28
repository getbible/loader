import {BaseTooltip} from './BaseTooltip.js';

export class BootstrapTooltip extends BaseTooltip {
  constructor(action) {
    super(action);
  }

  load(content) {
    try {
      super.load(content);
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    } catch (error) {
      console.error('Error loading BootstrapTooltip:', error);
    }
  }
}
