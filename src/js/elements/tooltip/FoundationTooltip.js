import { BaseTooltip } from './BaseTooltip.js';

export class FoundationTooltip extends BaseTooltip {
  constructor(triggerElement) {
    super(triggerElement);
  }

  load(content) {
    try {
      this.triggerElement.setAttribute('data-tooltip', '');
      super.load(content);
      this.triggerElement.classList.add('has-tip');

      new Foundation.Tooltip(this.triggerElement, {
        // Default options
        disableHover: false, // Allows tooltip to be hoverable
        fadeOutDuration: 150, // Duration of fade out animation in milliseconds
        fadeInDuration: 150, // Duration of fade in animation in milliseconds
        showOn: 'all', // Can be 'all', 'large', 'medium', 'small'
        templateClasses: '', // Custom class(es) to be added to the tooltip template
        tipText: () => this.triggerElement.getAttribute('title'), // Function to define tooltip text
        triggerClass: 'has-tip', // Class to be added on the trigger elements
        touchCloseText: 'tap to close', // Text for close button on touch devices
        positionClass: 'top', // Position of tooltip, can be 'top', 'bottom', 'left', 'right', etc.
        vOffset: 10, // Vertical offset
        hOffset: 12, // Horizontal offset
        allowHtml: false // Allow HTML in tooltip content
      });
    } catch (error) {
      console.error('Error loading FoundationTooltip:', error);
    }
  }
}
