/**
 * getBible Loader v3.0.0
 * https://getbible.net
 * (c) 2014 - 2023 Llewellyn van der Merwe
 * MIT License
 **/

(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    /**
     * Class for managing local storage of scripture data.
     */
    class Memory {
        // Constant representing one month in milliseconds.
        static ONE_MONTH_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

        /**
         * Stores scripture data in local storage.
         *
         * @param {string} reference - The scripture reference.
         * @param {string} translation - The translation.
         * @param {Object} data - The scripture data to be stored.
         * @throws {Error} If storing data fails.
         */
        static set(reference, translation, data) {
            const key = this.#key(reference, translation);
            const item = {
                data,
                timestamp: Date.now(),
            };
            try {
                localStorage.setItem(key, JSON.stringify(item));
            } catch (error) {
                console.error('Error storing data in local storage:', error);
                throw error;
            }
        }

        /**
         * Retrieves scripture data from local storage.
         *
         * @param {string} reference - The scripture reference.
         * @param {string} translation - The translation.
         * @returns {Promise<Object|null>} The scripture data or null if not found.
         */
        static async get(reference, translation) {
            return this.#get(reference, translation);
        }

        /**
         * Internal method to check local storage for scripture data.
         *
         * @param {string} reference - The scripture reference.
         * @param {string} translation - The translation.
         * @returns {Object|null} The stored data or null if not found.
         * @throws {Error} If parsing or retrieval from local storage fails.
         * @private
         */
        static #get(reference, translation) {
            const key = this.#key(reference, translation);
            try {
                const storedItem = localStorage.getItem(key);
                if (storedItem) {
                    const { data, timestamp } = JSON.parse(storedItem);
                    if (timestamp > Date.now() - Memory.ONE_MONTH_IN_MILLISECONDS) {
                        return data;
                    }
                }
                return null;
            } catch (error) {
                console.error('Error parsing or retrieving data from local storage:', error);
                throw error;
            }
        }

        /**
         * Generates a key for scripture data storage.
         *
         * @param {string} reference - The scripture reference.
         * @param {string} translation - The translation.
         * @returns {string} A unique key for local storage.
         * @private
         */
        static #key(reference, translation) {
            return `getBible-${translation}-${reference}`;
        }
    }

    /**
     * Class for handling API calls to fetch scripture data.
     */
    class Api {
      /**
       * Constructs an Api instance with a default or specified API endpoint.
       *
       * @param {string} apiEndpoint - The endpoint URL for the API.
       */
      constructor(apiEndpoint = 'https://query.getbible.net/v2/') {
        this.apiEndpoint = apiEndpoint;
      }

      /**
       * Fetches scripture from the API, using local storage to cache responses.
       *
       * @param {string} reference - The scripture reference.
       * @param {string} translation - The translation.
       * @returns {Promise<Object>} A promise that resolves with the scripture data.
       * @throws {Error} If the API request fails.
       */
      async get(reference, translation) {
        try {
          const localStorageData = await Memory.get(reference, translation);
          if (localStorageData !== null) {
            return localStorageData;
          }

          const response = await fetch(this.#url(reference, translation));

          if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText || 'Failed to fetch scripture'}`);
          }

          const data = await response.json();
          await Memory.set(reference, translation, data);
          return data;
        } catch (error) {
          console.error('Error fetching data:', error);
          throw new Error(error.message || 'Error fetching scripture');
        }
      }

      /**
       * Constructs the URL for the API call.
       *
       * @param {string} reference - The scripture reference.
       * @param {string} translation - The translation.
       * @returns {string} The constructed URL for the API request.
       * @private
       */
      #url(reference, translation) {
        return `${this.apiEndpoint}${encodeURIComponent(translation)}/${encodeURIComponent(reference)}`;
      }
    }

    class BaseFormat {
      /**
       * Get formats the verses.
       *
       * @param {Object} data - The data containing verses and their details.
       * @param {boolean} showBook - Whether to show book names.
       * @param {boolean} showTrans - Whether to show translations.
       * @param {boolean} showAbbr - Whether to show abbreviations.
       * @param {boolean} showLang - Whether to show languages.
       * @returns {string} The formatted verses.
       * @abstract
       */
      get(data, showBook, showTrans, showAbbr, showLang) {
        throw new Error("The 'get' method must be implemented in BaseFormat subclass.");
      }
    }

    class BlockFormat extends BaseFormat {
        /**
         * Formats the verses for HTML block elements.
         *
         * @param {Object} data - The data containing verses and their details.
         * @param {boolean} showBook - Whether to show book names.
         * @param {boolean} showTrans - Whether to show translations.
         * @param {boolean} showAbbr - Whether to show abbreviations.
         * @param {boolean} showLang - Whether to show languages.
         * @returns {string} The formatted HTML string.
         */
        get(data, showBook, showTrans, showAbbr, showLang) {
            let formattedHtml = '';
            let setBookName = new Set();
            let setTranslation = new Set();
            let setAbbreviation = new Set();
            let setLanguage = new Set();

            for (const key in data) {
                if (!data.hasOwnProperty(key)) continue;

                let headerParts = [];
                if (showTrans && !setTranslation.has(key)) {
                    headerParts.push(`<span class="getbible-translation">${data[key].translation}</span>`);
                    setTranslation.add(key);
                }
                if (showAbbr && !setAbbreviation.has(key)) {
                    headerParts.push(`<span class="getbible-abbreviation">${data[key].abbreviation}</span>`);
                    setAbbreviation.add(key);
                }
                if (showBook && !setBookName.has(key)) {
                    headerParts.push(`<span class="getbible-book-name">${data[key].name}</span>`);
                    setBookName.add(key);
                }
                if (showLang && !setLanguage.has(key)) {
                    headerParts.push(`<span class="getbible-language">${data[key].language}</span>`);
                    setLanguage.add(key);
                }

                // Construct the header
                if (headerParts.length > 0) {
                    formattedHtml += `<div class="getbible-header">[${headerParts.join(' - ')}]</div>\n`;
                }

                // Add verses
                const verses = data[key].verses
                    .map(verse => `<span class="getbible-verse">${verse.verse}. ${verse.text}</span>`)
                    .join("<br />");
                formattedHtml += `<div class="getbible-verses">${verses}</div><br />`;
            }

            return `<div class="getbible-element getbible-block">${formattedHtml}</div>`;
        }
    }

    class InlineFormat extends BaseFormat {
        /**
         * Formats the verses for HTML inline elements.
         *
         * @param {Object} data - The data containing verses and their details.
         * @param {boolean} showBook - Whether to show book names.
         * @param {boolean} showTrans - Whether to show translations.
         * @param {boolean} showAbbr - Whether to show abbreviations.
         * @param {boolean} showLang - Whether to show languages.
         * @returns {string} The formatted HTML string.
         */
        get(data, showBook, showTrans, showAbbr, showLang) {
            let formattedHtml = '';
            let setBookName = new Set();
            let setTranslation = new Set();
            let setAbbreviation = new Set();
            let setLanguage = new Set();

            for (const key in data) {
                if (!data.hasOwnProperty(key)) continue;

                let footerParts = [];
                if (showTrans && !setTranslation.has(key)) {
                    footerParts.push(`<span class="getbible-translation">${data[key].translation}</span>`);
                    setTranslation.add(key);
                }
                if (showAbbr && !setAbbreviation.has(key)) {
                    footerParts.push(`<span class="getbible-abbreviation">${data[key].abbreviation}</span>`);
                    setAbbreviation.add(key);
                }
                if (showBook && !setBookName.has(key)) {
                    footerParts.push(`<span class="getbible-book-name">${data[key].name}</span>`);
                    setBookName.add(key);
                }
                if (showLang && !setLanguage.has(key)) {
                    footerParts.push(`<span class="getbible-language">${data[key].language}</span>`);
                    setLanguage.add(key);
                }

                // Add verses
                const verses = data[key].verses
                    .map(verse => `<span class="getbible-verse">${verse.verse}. ${verse.text}</span>`)
                    .join("\n");
                formattedHtml += `<span class="getbible-verses">${verses}</span>\n`;

                // Construct the footer
                if (footerParts.length > 0) {
                    formattedHtml += `<span class="getbible-footer">[${footerParts.join(' - ')}]</span>\n`;
                }
            }

            return `<span class="getbible-element getbible-inline">${formattedHtml}</span>`;
        }
    }

    class PlainFormat extends BaseFormat {
        /**
         * Formats the verses for plain text display.
         *
         * @param {Object} data - The data containing verses and their details.
         * @param {boolean} showBook - Whether to show book names.
         * @param {boolean} showTrans - Whether to show translations.
         * @param {boolean} showAbbr - Whether to show abbreviations.
         * @param {boolean} showLang - Whether to show languages.
         * @returns {string} The formatted text.
         */
        get(data, showBook, showTrans, showAbbr, showLang) {
            let formattedText = '';
            let setBookName = new Set();
            let setTranslation = new Set();
            let setAbbreviation = new Set();
            let setLanguage = new Set();

            for (const key in data) {
                if (!data.hasOwnProperty(key)) continue; // Ensure processing only own properties

                let headerParts = [];
                if (showTrans && !setTranslation.has(key)) {
                    headerParts.push(data[key].translation);
                    setTranslation.add(key);
                }
                if (showAbbr && !setAbbreviation.has(key)) {
                    headerParts.push(data[key].abbreviation);
                    setAbbreviation.add(key);
                }
                if (showBook && !setBookName.has(key)) {
                    headerParts.push(data[key].name);
                    setBookName.add(key);
                }
                if (showLang && !setLanguage.has(key)) {
                    headerParts.push(data[key].language);
                    setLanguage.add(key);
                }

                // Construct the header
                if (headerParts.length > 0) {
                    formattedText += '[' + headerParts.join(' - ') + "]\n";
                }

                // Add verses
                const verses = data[key].verses.map(verse => `${verse.verse}. ${verse.text}`).join("\n");
                formattedText += verses + "\n\n"; // Add extra newline for separation
            }

            return formattedText.trim();
        }
    }

    /**
     * Format class responsible for creating and managing different types of formats
     * based on the specified type.
     */
    class Format {
        /**
         * Constructs a Format instance based on the given type.
         *
         * @param {string} formatType - The format type.
         */
        constructor(formatType = 'tooltip') {
            const formatTypes = {
                'modal': BlockFormat,
                'inline': InlineFormat,
                'tooltip': PlainFormat
            };

            const FormatType = formatTypes[formatType] || PlainFormat;
            this.format = new FormatType();
        }

        /**
         * Get the formatted verses.
         *
         * @param {Object} data - The data containing verses and their details.
         * @param {boolean} showBook - Whether to show book names.
         * @param {boolean} showTrans - Whether to show translations.
         * @param {boolean} showAbbr - Whether to show abbreviations.
         * @param {boolean} showLang - Whether to show languages.
         * @returns {string} The formatted verses.
         */
        get(data, showBook, showTrans, showAbbr, showLang) {
            return this.format.get(data, showBook, showTrans, showAbbr, showLang);
        }
    }

    class BaseModal {
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

    class UikitModal extends BaseModal {
      constructor(triggerElement) {
        super(triggerElement);
      }

      show() {
        UIkit.modal(`#${this.modalId}`).show();
      }

      hide() {
        UIkit.modal(`#${this.modalId}`).hide();
      }

      create(content) {
        const modalHtml = `
      <div id="${this.modalId}" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div id="${this.modalId}-content">
            ${content}
          </div>
        </div>
      </div>`;
        this.insertIntoDOM(modalHtml);
      }

      initializeTrigger() {
        this.triggerElement.setAttribute('uk-toggle', `target: #${this.modalId}`);
      }
    }

    class BootstrapModal extends BaseModal {
      constructor(triggerElement) {
        super(triggerElement);
      }

      show() {
        const modal = new bootstrap.Modal(document.getElementById(this.modalId));
        modal.show();
      }

      hide() {
        const modal = bootstrap.Modal.getInstance(document.getElementById(this.modalId));
        if (modal) {
          modal.hide();
        }
      }

      create(content) {
        const modalHtml = `
      <div class="modal fade" id="${this.modalId}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content p-3">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="${this.modalId}-content" class="modal-body">
              ${content}
            </div>
          </div>
        </div>
      </div>`;
        this.insertIntoDOM(modalHtml);
      }

      initializeTrigger() {
        this.triggerElement.setAttribute('data-bs-toggle', 'modal');
        this.triggerElement.setAttribute('data-bs-target', `#${this.modalId}`);
      }
    }

    class FoundationModal extends BaseModal {
      constructor(triggerElement) {
        super(triggerElement);
        this.modalElement = null;
      }

      show() {
        if (this.modalElement) {
          this.modalElement.open();
        }
      }

      hide() {
        if (this.modalElement) {
          this.modalElement.close();
        }
      }

      create(content) {
        const modalHtml = `
      <div class="reveal" id="${this.modalId}" data-reveal>
        <div id="${this.modalId}-content">
          ${content}
        </div>
        <button class="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
        this.insertIntoDOM(modalHtml);
        this.modalElement = new Foundation.Reveal(document.getElementById(this.modalId));
      }

      initializeTrigger() {
        this.triggerElement.setAttribute('data-open', this.modalId);
      }
    }

    class TailwindModal extends BaseModal {
      constructor(triggerElement) {
        super(triggerElement);
      }

      show() {
        document.getElementById(this.modalId).classList.remove('hidden');
      }

      hide() {
        document.getElementById(this.modalId).classList.add('hidden');
      }

      create(content) {
        const modalHtml = `
      <div class="modal hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="${this.modalId}">
        <div class="modal-content container mx-auto p-5 bg-white">
          <div id="${this.modalId}-content">
            ${content}
          </div>
          <button class="close-button" onclick="document.getElementById('${this.modalId}').classList.add('hidden')">Close</button>
        </div>
      </div>`;
        this.insertIntoDOM(modalHtml);
      }

      initializeTrigger(triggerElement) {
        this.triggerElement.addEventListener('click', () => {
          document.getElementById(this.modalId).classList.remove('hidden');
        });
      }
    }

    /**
     * ModalElement class responsible for creating and managing modal elements.
     * It dynamically selects the appropriate modal style based on the available UI framework.
     */
    class ModalElement {
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
            {
              console.log(`${key} modal selected`);
            }
            return new ModalType(triggerElement);
          }
        }

        {
          console.log(`base modal selected`);
        }
        return new BaseModal(triggerElement);
      }
    }

    /**
     * InlineElement class responsible for adding inline elements.
     */
    class InlineElement {
        /**
         * Creates an instance of InlineElement.
         *
         * @param {HTMLElement} triggerElement - The element that triggers the inline display.
         */
        constructor(triggerElement) {
            if (!(triggerElement instanceof HTMLElement)) {
                throw new Error("triggerElement must be an instance of HTMLElement.");
            }
            this.triggerElement = triggerElement;
            // Clear initial content
            this.triggerElement.innerHTML = '';
        }

        /**
         * Loads content into the trigger element. Appends new content if existing content is present.
         *
         * @param {string} content - The content to load into the trigger element.
         */
        load(content) {
            const existingContent = this.triggerElement.innerHTML;
            this.triggerElement.innerHTML = existingContent ? `${existingContent}\n ${content}` : content;
        }
    }

    class BaseTooltip {
      /**
       * Creates a new BaseTooltip instance.
       *
       * @param {HTMLElement} triggerElement - The elements that triggers the tooltip.
       */
      constructor(triggerElement) {
        this.triggerElement = triggerElement;
        this.triggerElement.style.cursor = 'help';
      }

      /**
       * Loads content into the tooltip. If the trigger elements already has a title,
       * the new content is appended to it.
       *
       * @param {string} content - The content to load into the tooltip.
       * @throws {Error} Throws an error if the trigger elements is not valid.
       */
      load(content) {
        const existingTitle = this.triggerElement.getAttribute('title');
        const newTitle = existingTitle ? existingTitle + "\n" + content : content;
        this.triggerElement.setAttribute('title', newTitle);
      }
    }

    class BootstrapTooltip extends BaseTooltip {
      constructor(triggerElement) {
        super(triggerElement);
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

    class UikitTooltip extends BaseTooltip {
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

    class FoundationTooltip extends BaseTooltip {
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

    class TailwindTooltip extends BaseTooltip {
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
        this.tooltipElement.textContent = this.triggerElement.getAttribute('title');
        document.body.appendChild(this.tooltipElement);
      }

      _initializeEvents() {
        this.triggerElement.addEventListener('mouseenter', () => {
          const rect = this.triggerElement.getBoundingClientRect();
          this._title = this.triggerElement.getAttribute('title');
          this.tooltipElement.style.left = `${rect.left + window.scrollX}px`;
          this.tooltipElement.style.top = `${rect.bottom + 5 + window.scrollY}px`;
          this.tooltipElement.classList.remove('invisible');
          this.tooltipElement.classList.add('opacity-100');
          this.triggerElement.setAttribute('title', '');
        });

        this.triggerElement.addEventListener('mouseleave', () => {
          this.tooltipElement.classList.add('invisible');
          this.tooltipElement.classList.remove('opacity-100');
          this.triggerElement.setAttribute('title', this._title);
        });
      }
    }

    /**
     * TooltipElement class responsible for creating and managing tooltip elements.
     * It dynamically selects the appropriate tooltip style based on the available UI framework.
     */
    class TooltipElement {
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
            {
              console.log(`${key} tooltip selected`);
            }
            return new TooltipType(triggerElement);
          }
        }

        {
          console.log(`base tooltip selected`);
        }
        return new BaseTooltip(triggerElement);
      }
    }

    /**
     * Element class responsible for creating and managing different types of elements
     * based on the specified format.
     */
    class Element {
        /**
         * Constructs an Element instance based on the given format.
         *
         * @param {HTMLElement} triggerElement - The trigger element.
         * @param {string} format - The format type.
         */
        constructor(triggerElement, format = 'tooltip') {
            if (!(triggerElement instanceof HTMLElement)) {
                throw new Error("triggerElement must be an instance of HTMLElement.");
            }

            const elementTypes = {
                'modal': ModalElement,
                'inline': InlineElement,
                'tooltip': TooltipElement
            };

            const ElementType = elementTypes[format] || TooltipElement;
            this.element = new ElementType(triggerElement);

            {
                console.log(`${format} element selected`);
            }
        }

        /**
         * Load the content into the element.
         *
         * @param {string} content - The content to load.
         */
        load(content) {
            this.element.load(content);
        }
    }

    /**
     * Loader class responsible for handling the loading of Bible references.
     */
    class Loader {
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

    /**
     * Entry point to load Bible references.
     * Attaches event listener to DOMContentLoaded to find elements with class 'getBible'
     * and initializes Loader for each element.
     */
    document.addEventListener('DOMContentLoaded', (event) => {
      const elements = document.querySelectorAll('.getBible');
      elements.forEach(element => {
        const loader = new Loader();
        loader.load(element);
      });
    });

}));
