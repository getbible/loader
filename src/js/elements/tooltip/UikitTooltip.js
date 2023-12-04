import {BaseTooltip} from './BaseTooltip.js';

export class UikitTooltip extends BaseTooltip {
  constructor(action) {
    super(action);
  }

  load(content) {
    try {
      super.load(content);
      UIkit.tooltip(this.element);
    } catch (error) {
      console.error('Error loading UikitTooltip:', error);
    }
  }
}
