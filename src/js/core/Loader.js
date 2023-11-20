import { Api } from './Api.js';
import { Format } from '../formats/Format.js';
import { Element } from '../elements/Element.js';

/**
 * Loader class responsible for handling the loading of Bible references.
 */
export class Loader {
    /**
     * Constructs a Loader instance.
     */
    constructor() {
        this.api = new Api();
    }

    /**
     * Load the Bible references into the specified HTML element.
     *
     * @param {HTMLElement} element - The element to load Bible references into.
     */
    load(element) {
        const references = element.innerHTML.split(';');
        if (references) {
            this.#init(element);
            const translations = (element.dataset.translation || 'kjv').toLowerCase().split(';');
            this.showBookName = element.dataset.showBookName ? parseInt(element.dataset.showBookName, 10) : 1;
            this.showTranslation = element.dataset.showTranslation ? parseInt(element.dataset.showTranslation, 10) : 0;
            this.showAbbreviation = element.dataset.showAbbreviation ? parseInt(element.dataset.showAbbreviation, 10) : 0;
            this.showLanguage = element.dataset.showLanguage ? parseInt(element.dataset.showLanguage, 10) : 0;

            references.forEach(reference => {
                translations.forEach(translation => {
                    this.api.get(reference.trim(), translation.trim()).then(scripture => {
                        if (scripture) {
                            this.#load(scripture);
                        }
                    }).catch(error => console.error(error));
                });
            });
        }
    }

    /**
     * Initialize the target format and element for loading the Bible.
     *
     * @param {HTMLElement} element - The element to be initialized.
     * @private
     */
    #init(element) {
        const format = (element.dataset.format || 'inline').toLowerCase();
        this.element = new Element(element, format);
        this.format = new Format(format);
    }

    /**
     * Load the Bible data in the target format into the initialized element.
     *
     * @param {Object} data - The data containing verses and their details.
     * @private
     */
    #load(data) {
        this.element.load(
            this.format.get(
                data,
                this.showBookName,
                this.showTranslation,
                this.showAbbreviation,
                this.showLanguage
            )
        );
    }
}
