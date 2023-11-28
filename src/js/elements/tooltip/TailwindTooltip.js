import {BaseTooltip} from './BaseTooltip.js';

export class TailwindTooltip extends BaseTooltip {
  constructor(triggerElement) {
    super(triggerElement);
  }

  load(content) {
    try {
      super.load(content);
      this._createTooltipElement();
      this._initializeEvents();
    } catch (error) {
      console.error('Error loading TailwindTooltip:', error);
    }
  }

  _createTooltipElement() {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.id = this.tooltipId;
    this.tooltipElement.className = 'absolute invisible bg-gray-800 text-white text-xs px-2 py-1 rounded-md';
    this.tooltipElement.style.transition = 'visibility 0.3s linear, opacity 0.3s linear';
    this.tooltipElement.textContent = this.getElement().getAttribute('title');
    document.body.appendChild(this.tooltipElement);
  }

  _initializeEvents() {
    this.getElement().addEventListener('mouseenter', () => {
      const rect = this.getElement().getBoundingClientRect();
      this._title = this.getElement().getAttribute('title');
      this.tooltipElement.style.left = `${rect.left + window.scrollX}px`;
      this.tooltipElement.style.top = `${rect.bottom + 5 + window.scrollY}px`;
      this.tooltipElement.classList.remove('invisible');
      this.tooltipElement.classList.add('opacity-100');
      this.getElement().setAttribute('title', '');
    });

    this.getElement().addEventListener('mouseleave', () => {
      this.tooltipElement.classList.add('invisible');
      this.tooltipElement.classList.remove('opacity-100');
      this.getElement().setAttribute('title', this._title);
    });
  }
}
