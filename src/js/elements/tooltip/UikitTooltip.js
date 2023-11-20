import { BaseTooltip } from './BaseTooltip.js';

export class UikitTooltip extends BaseTooltip {
  constructor(triggerElement) {
    super(triggerElement);
  }

  load(content) {
    try {
      super.load(content);
      UIkit.tooltip(this.triggerElement);
    } catch (error) {
      console.error('Error loading UikitTooltip:', error);
    }
  }
}
