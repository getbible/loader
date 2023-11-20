import { BaseTooltip } from './tooltip/BaseTooltip.js';
import { BootstrapTooltip } from './tooltip/BootstrapTooltip.js';
import { UikitTooltip } from './tooltip/UikitTooltip.js';
import { FoundationTooltip } from './tooltip/FoundationTooltip.js';
import { TailwindTooltip } from './tooltip/TailwindTooltip.js';

/**
 * TooltipElement class responsible for creating and managing tooltip elements.
 * It dynamically selects the appropriate tooltip style based on the available UI framework.
 */
export class TooltipElement {
  /**
   * Constructs an instance of TooltipElement with the appropriate tooltip type
   * based on the detected UI framework.
   *
   * @param {HTMLElement} triggerElement - The element that triggers the tooltip.
   */
  constructor(triggerElement) {
    this.tooltip = TooltipElement.framework(triggerElement);
  }

  /**
   * Loads content into the tooltip.
   *
   * @param {string} content - The content to load into the tooltip.
   */
  load(content) {
    this.tooltip.load(content);
  }

  /**
   * Determines the appropriate tooltip implementation based on the available UI framework.
   *
   * @param {HTMLElement} triggerElement - The element triggering the tooltip.
   * @returns {BaseTooltip|BootstrapTooltip|UikitTooltip|FoundationTooltip|TailwindTooltip} The tooltip instance.
   * @param debug
   */
  static framework(triggerElement) {
    const frameworks = {
      'UIkit': UikitTooltip,
      'bootstrap': BootstrapTooltip,
      'Foundation': FoundationTooltip,
      'tailwind': TailwindTooltip
    };

    for (const [key, TooltipType] of Object.entries(frameworks)) {
      if (typeof window[key] !== 'undefined' || (key === 'tailwind' && document.querySelector('.tailwind-class') !== null)) {
        if (process.env.DEBUG) {
          console.log(`${key} tooltip selected`);
        }
        return new TooltipType(triggerElement);
      }
    }

    if (process.env.DEBUG) {
      console.log(`base tooltip selected`);
    }
    return new BaseTooltip(triggerElement);
  }
}
