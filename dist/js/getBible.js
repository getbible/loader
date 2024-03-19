/**
 * getBible Loader v3.1.0
 * https://getbible.net
 * (c) 2014 - 2024 Llewellyn van der Merwe
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
          const {data, timestamp} = JSON.parse(storedItem);
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

  /**
   * Class for handling chapter data.
   */
  class Reference {
    #data; // Private data member

    /**
     * Initializes the BibleVerse object with verse data.
     *
     * @param {Object} data - The JSON data containing verse information.
     * @param {string} data.translation - The name of the translation.
     * @param {string} data.abbreviation - The abbreviation of the translation.
     * @param {string} data.language - The full language name.
     * @param {string} data.lang - The language code.
     * @param {string} data.direction - The text direction (LTR or RTL).
     * @param {string} data.encoding - The encoding format (e.g., UTF-8).
     * @param {number} data.book_nr - The book number.
     * @param {string} data.book_name - The name of the book.
     * @param {number} data.chapter - The chapter number.
     * @param {string} data.name - The name of the chapter.
     * @param {Array<Object>} data.verses - An array of objects representing each verse.
     * @param {string|Array<string>} data.ref - The local reference string or array of strings.
     */
    constructor(data) {
      // Simple validation to check if essential properties are present
      const requiredProperties = [
        'translation', 'abbreviation', 'language', 'lang',
        'direction', 'encoding', 'book_nr', 'book_name',
        'chapter', 'name', 'verses', 'ref'
      ];

      if (!data || typeof data !== 'object') {
        throw new Error('Data must be a valid object.');
      }

      requiredProperties.forEach(prop => {
        if (data[prop] === undefined || data[prop] === null) {
          throw new Error(`Missing required property: '${prop}'.`);
        }
      });

      // Assign the data after validation
      this.#data = data;
    }

    /**
     * Retrieves the url values.
     *
     * @returns {string} The chapter number.
     */
    get bibleUrl() {
      return `${this.abbreviation}/${this.bookName}/${this.chapter}/${this.verseReference}`;
    }

    /**
     * Retrieves the translation name.
     *
     * @returns {string} The name of the translation.
     */
    get translation() {
      return this.#data.translation;
    }

    /**
     * Retrieves the abbreviation of the translation.
     *
     * @returns {string} The abbreviation of the translation.
     */
    get abbreviation() {
      return this.#data.abbreviation;
    }

    /**
     * Retrieves the full language name.
     *
     * @returns {string} The language code.
     */
    get language() {
      return this.#data.language;
    }

    /**
     * Retrieves the language code.
     *
     * @returns {string} The full name of the language.
     */
    get languageCode() {
      return this.#data.lang;
    }

    /**
     * Retrieves the text direction.
     *
     * @returns {string} The direction of the text (LTR or RTL).
     */
    get textDirection() {
      return this.#data.direction;
    }

    /**
     * Retrieves the encoding format.
     *
     * @returns {string} The encoding format (e.g., UTF-8).
     */
    get encoding() {
      return this.#data.encoding;
    }

    /**
     * Retrieves the book number.
     *
     * @returns {number} The book number.
     */
    get bookNumber() {
      return this.#data.book_nr;
    }

    /**
     * Retrieves the name of the book.
     *
     * @returns {string} The name of the book.
     */
    get bookName() {
      return this.#data.book_name;
    }

    /**
     * Retrieves the chapter number.
     *
     * @returns {number} The chapter number.
     */
    get chapter() {
      return this.#data.chapter;
    }

    /**
     * Retrieves the name of the chapter.
     *
     * @returns {string} The name of the chapter.
     */
    get chapterName() {
      return this.#data.name;
    }

    /**
     * Retrieves all verses of the chapter.
     *
     * @returns {Array<{chapter: number, verse: number, name: string, text: string}>}
     *          An array of objects representing each verse.
     */
    get verses() {
      return this.#data.verses;
    }

    /**
     * Retrieves a specific verse by its number.
     *
     * @param {number} verseNumber - The number of the verse to retrieve.
     * @returns {Object|null} The verse object if found, or null if not.
     */
    getVerse(verseNumber) {
      return this.#data.verses.find(verse => verse.verse === verseNumber);
    }

    /**
     * Retrieves a range of verses.
     *
     * @param {number} startVerse - The starting verse number.
     * @param {number} endVerse - The ending verse number.
     * @returns {Array<Object>} An array of verse objects within the range.
     */
    getVersesInRange(startVerse, endVerse) {
      return this.#data.verses.filter(verse => verse.verse >= startVerse && verse.verse <= endVerse);
    }

    /**
     * Get the local reference string set in the website.
     *
     * @returns {string} The reference string.
     */
    get localReference() {
      // Ensure that this.#data.ref is treated as an array.
      return Array.isArray(this.#data.ref) ? this.#data.ref.join('; ') : this.#data.ref;
    }

    /**
     * Generates a reference string for the (book chapter:verses).
     *
     * @returns {string} The reference string.
     */
    get reference() {
      return `${this.#data.name}:${this.verseReference}`;
    }

    /**
     * Generates a reference string for the (verses).
     *
     * @returns {string} The reference verses string.
     */
    get verseReference() {
      const verseNumbers = this.#data.verses.map(verse => verse.verse).sort((a, b) => a - b);
      let ranges = {};
      let rangeStart = null;
      let rangeEnd = null;
      let previousVerse = null;

      verseNumbers.forEach(verse => {
        if (rangeStart === null) {
          rangeStart = verse;
        } else if (verse === previousVerse + 1) {
          rangeEnd = verse;
        } else {
          ranges[rangeStart] = (rangeEnd !== null) ? `${rangeStart}-${rangeEnd}` : `${rangeStart}`;
          rangeStart = verse;
          rangeEnd = null;
        }
        previousVerse = verse;
      });

      // Handling the case for the last verse or a single-verse range
      if (rangeStart !== null) {
        ranges[rangeStart] = (rangeEnd !== null) ? `${rangeStart}-${rangeEnd}` : `${rangeStart}`;
      }

      // Join the range strings with commas
      return Object.values(ranges).join(',');
    }
  }

  /**
   * Class for handling Scripture.
   */
  class Scripture {
    #references; // Private array for storing references

    /**
     * Initializes the Bible translations, books, and chapters.
     *
     * @param {Object} data - An object with references data keyed by identifiers.
     */
    constructor(data) {
      this.#references = Object.values(data).map(reference => new Reference(reference));
    }

    /**
     * Iterates over all references and performs a callback function.
     *
     * @param {Function} callback - The callback function to execute for each chapter.
     */
    forEachReference(callback) {
      this.#references.forEach(callback);
    }
  }

  /**
   * Class for managing actions based on element data attributes.
   */
  class Action {
    #element;
    #format;
    #translations;
    #showBookName;
    #showReference;
    #showLocalReference;
    #showTranslation;
    #showAbbreviation;
    #showLanguage;
    #showLanguageCode;
    #showBibleLink;
    #bibleUrl;

    /**
     * Initializes the Actions object with a DOM element and its data attributes.
     *
     * @param {HTMLElement} element - The DOM element containing data attributes.
     */
    constructor(element) {

      if (!(element instanceof HTMLElement)) {
        throw new Error("triggerElement must be an instance of HTMLElement.");
      }

      this.#element = element;
      this.#format = (element.dataset.format || 'inline').toLowerCase();
      this.#translations = (element.dataset.translation || 'kjv').toLowerCase().split(';').map(translation => translation.trim());
      this.#showBookName = element.dataset.showBookName ? parseInt(element.dataset.showBookName, 10) : 0;
      this.#showReference = element.dataset.showReference ? parseInt(element.dataset.showReference, 10) : 1;
      this.#showLocalReference = element.dataset.showLocalReference ? parseInt(element.dataset.showLocalReference, 10) : 0;
      this.#showTranslation = element.dataset.showTranslation ? parseInt(element.dataset.showTranslation, 10) : 0;
      this.#showAbbreviation = element.dataset.showAbbreviation ? parseInt(element.dataset.showAbbreviation, 10) : 0;
      this.#showLanguage = element.dataset.showLanguage ? parseInt(element.dataset.showLanguage, 10) : 0;
      this.#showLanguageCode = element.dataset.showLanguageCode ? parseInt(element.dataset.showLanguageCode, 10) : 0;
      this.#showBibleLink = element.dataset.showBibleLink ? parseInt(element.dataset.showBibleLink, 10) : 0;
      this.#bibleUrl = element.dataset.bibleUrl ? element.dataset.bibleUrl : 'https://getBible.net/';

      if (this.#showLocalReference){
        this.#showReference = 0;
      }
      if (this.#bibleUrl !== 'https://getBible.net/'){
        this.#showBibleLink = 1;
      }
    }

    /**
     * Retrieves the bible url.
     *
     * @returns {string} The bible url as strings.
     */
    get bibleUrl() {
      return this.#bibleUrl;
    }

    /**
     * Retrieves the show bible link flag.
     *
     * @returns {number} The show  bible link flag (0 or 1).
     */
    get bibleLink() {
      return this.#showBibleLink;
    }

    /**
     * Retrieves the translations.
     *
     * @returns {Array<string>} An array of translation strings.
     */
    get translations() {
      return this.#translations;
    }

    /**
     * Retrieves the show book name flag.
     *
     * @returns {number} The show book name flag (0 or 1).
     */
    get bookName() {
      return this.#showBookName;
    }

    /**
     * Retrieves the show reference flag.
     *
     * @returns {number} The show reference flag (0 or 1).
     */
    get reference() {
      return this.#showReference;
    }

    /**
     * Retrieves the show local reference flag.
     *
     * @returns {number} The show reference flag (0 or 1).
     */
    get localReference() {
      return this.#showLocalReference;
    }

    /**
     * Retrieves the show translation flag.
     *
     * @returns {number} The show translation flag (0 or 1).
     */
    get translation() {
      return this.#showTranslation;
    }

    /**
     * Retrieves the show abbreviation flag.
     *
     * @returns {number} The show abbreviation flag (0 or 1).
     */
    get abbreviation() {
      return this.#showAbbreviation;
    }

    /**
     * Retrieves the show language flag.
     *
     * @returns {number} The show language flag (0 or 1).
     */
    get language() {
      return this.#showLanguage;
    }

    /**
     * Retrieves the show language code flog.
     *
     * @returns {number} The show language flag (0 or 1).
     */
    get languageCode() {
      return this.#showLanguageCode;
    }

    /**
     * Retrieves the element format.
     *
     * @returns {string} The element format.
     */
    get format() {
      return this.#format;
    }

    /**
     * Retrieves the DOM element.
     *
     * @returns {HTMLElement} The DOM element associated with this object.
     */
    get element() {
      return this.#element;
    }
  }

  class BaseFormat {
    #action;

    /**
     * Creates a new BaseTooltip instance.
     *
     * @param {Action} action - The action elements that triggers the tooltip.
     */
    constructor(action) {
      this.#action = action;
    }

    /**
     * Get action.
     *
     * @returns {Action} The current actions.
     */
    get action() {
      return this.#action;
    }

    /**
     * Get formats the verses.
     *
     * @param {Scripture} scripture - The data containing verses and their details.
     * @returns {string} The formatted verses.
     * @abstract
     */
    get(scripture) {
      throw new Error("The 'get' method must be implemented in BaseFormat subclass.");
    }

    /**
     * Get external link svg image.
     *
     * @param {string} title - The external link title.
     *
     * @returns {string} The external link svg image.
     */
    getExternalLinkImage(title) {
      // just to be safe
      title.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
      <title>${title}</title>
      <path
        fill="#36c"
        d="M6 1h5v5L8.86 3.85 4.7 8 4 7.3l4.15-4.16L6 1Z M2 3h2v1H2v6h6V8h1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
      />
    </svg>`;
    }
  }

  class BlockFormat extends BaseFormat {
    constructor(action) {
      super(action);
    }

    /**
     * Formats the verses for HTML block elements.
     *
     * @param {Scripture} scripture - The data containing verses and their details.
     * @returns {string} The formatted verses.
     */
    get(scripture) {
      let display = [];
      scripture.forEachReference((reference) => {
        let header = [];
        display.push(`<div dir="${reference.textDirection.toUpperCase()}" class="getbible-reference-block">`);
        if (this.action.bookName) {
          header.push(`<span class="getbible-book-name">${reference.bookName}</span>`);
        }
        if (this.action.reference) {
          header.push(`<span class="getbible-reference">${reference.reference}</span>`);
        }
        if (this.action.localReference) {
          header.push(`<span class="getbible-reference">${reference.localReference}</span>`);
        }
        if (this.action.translation) {
          header.push(`<span class="getbible-translation">${reference.translation}</span>`);
        }
        if (this.action.abbreviation) {
          header.push(`<span class="getbible-abbreviation">${reference.abbreviation}</span>`);
        }
        if (this.action.language) {
          header.push(`<span class="getbible-language">${reference.language}</span>`);
        }
        if (this.action.languageCode) {
          header.push(`<span class="getbible-language-code">${reference.languageCode}</span>`);
        }
        // Construct the header
        if (header.length > 0) {
          display.push(`<b class="getbible-header">${header.join(' - ')}</b>`);
        }
        // Add link to chapter
        if (this.action.bibleLink) {
          display.push(`&nbsp;<a class="getbible-link"
            href="${this.action.bibleUrl}${reference.bibleUrl}"
            target="_blank" style="text-decoration: unset;"
            title="${reference.reference}">${this.getExternalLinkImage(reference.reference)}</a>`);
        }
        const verses = reference.verses
          .map(verse => `<div class="getbible-verse">${verse.verse}. ${verse.text}</div>`)
          .join("\n");
        display.push(`<div class="getbible-verses">${verses}</div>`);
        display.push(`</div>`);
      });

      return `<div class="getbible-element getbible-block">${display.join("\n")}</div><br />`;
    }
  }

  class InlineFormat extends BaseFormat {
    constructor(action) {
      super(action);
    }

    /**
     * Formats the verses for HTML inline elements.
     *
     * @param {Scripture} scripture - The data containing verses and their details.
     * @returns {string} The formatted verses.
     */
    get(scripture) {
      let display = [];
      scripture.forEachReference((reference) => {
        let footer = [];
        display.push(`<div dir="${reference.textDirection.toUpperCase()}" class="getbible-reference-inline">`);
        if (this.action.bookName) {
          footer.push(`<span class="getbible-book-name">${reference.bookName}</span>`);
        }
        if (this.action.reference) {
          footer.push(`<span class="getbible-reference">${reference.reference}</span>`);
        }
        if (this.action.localReference) {
          footer.push(`<span class="getbible-reference">${reference.localReference}</span>`);
        }
        if (this.action.translation) {
          footer.push(`<span class="getbible-translation">${reference.translation}</span>`);
        }
        if (this.action.abbreviation) {
          footer.push(`<span class="getbible-abbreviation">${reference.abbreviation}</span>`);
        }
        if (this.action.language) {
          footer.push(`<span class="getbible-language">${reference.language}</span>`);
        }
        if (this.action.languageCode) {
          footer.push(`<span class="getbible-language-code">${reference.languageCode}</span>`);
        }
        const verses = reference.verses
          .map(verse => `<span class="getbible-verse">${verse.verse}. ${verse.text}</span>`)
          .join("\n");
        display.push(`<span class="getbible-verses">${verses}</span>`);
        // Construct the footer
        if (footer.length > 0) {
          display.push(`<b class="getbible-footer">${footer.join(' - ')}</b>`);
        }
        // Add link to chapter
        if (this.action.bibleLink) {
          display.push(`<a class="getbible-link"
            href="${this.action.bibleUrl}${reference.bibleUrl}"
            target="_blank" style="text-decoration: unset;"
            title="${reference.reference}">${this.getExternalLinkImage(reference.reference)}</a>`);
        }
        display.push(`</div>`);
      });

      return `<div class="getbible-element getbible-inline">${display.join("\n")}</div>`;
    }
  }

  class PlainFormat extends BaseFormat {
    constructor(action) {
      super(action);
    }

    /**
     * Formats the verses for plain text display.
     *
     * @param {Scripture} scripture - The data containing verses and their details.
     * @returns {string} The formatted verses.
     */
    get(scripture) {
      let display = [];
      scripture.forEachReference((reference) => {
        let header = [];
        if (this.action.bookName) {
          header.push(`${reference.bookName}`);
        }
        if (this.action.reference) {
          header.push(`${reference.reference}`);
        }
        if (this.action.localReference) {
          header.push(`${reference.localReference}`);
        }
        if (this.action.translation) {
          header.push(`${reference.translation}`);
        }
        if (this.action.abbreviation) {
          header.push(`${reference.abbreviation}`);
        }
        if (this.action.language) {
          header.push(`${reference.language}`);
        }
        if (this.action.languageCode) {
          header.push(`${reference.languageCode}`);
        }
        // Construct the header
        if (header.length > 0) {
          display.push(`[${header.join(' - ')}]`);
        }
        display.push(
          reference.verses
            .map(verse => `${verse.verse}. ${verse.text}`)
            .join("\n")
        );
      });

      return `${display.join("\n")}\n`;
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
     * @param {Action} action - The action details for this element
     */
    constructor(action) {
      const formatTypes = {
        'modal': BlockFormat,
        'inline': InlineFormat,
        'tooltip': PlainFormat
      };

      const format = action.format;
      const FormatType = formatTypes[format] || InlineFormat;
      this.format = new FormatType(action);
    }

    /**
     * Get the formatted verses.
     *
     * @param {Scripture} scripture - The data containing verses and their details.
     * @returns {string} The formatted verses.
     */
    get(scripture) {
      return this.format.get(scripture);
    }
  }

  class BaseModal {
    #modalId;
    #action;

    /**
     * Creates a new BaseModal instance.
     *
     * @param {Action} action - The action element triggering the modal.
     */
    constructor(action) {
      this.#modalId = `modal-${Math.random().toString(36).slice(2, 11)}`;
      this.#action = action;
      this.element.style.cursor = 'pointer';
      this.initializeTrigger();
    }

    /**
     * Loads content into the modal.
     *
     * @param {string} content - The content to load into the modal.
     */
    load(content) {
      const existingModal = document.getElementById(this.id);
      // Check if modal already exists
      if (existingModal) {
        // Update the content of the existing modal
        const contentDiv = document.getElementById(`${this.id}-content`);
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
    <div id="${this.id}" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background-color:rgba(0, 0, 0, 0.5); justify-content:center; align-items:center;">
      <div style="position:relative; background-color:white; padding:20px; border-radius:5px; max-width:300px;">
        <button class="getbible-modal-close" type="button" onclick="document.getElementById('${this.id}').style.display='none'" style="position:absolute; top:7px; right:7px; border:none; background:transparent; font-size:20px; cursor:pointer;">✖</button>
        <div id="${this.id}-content">
          ${content}
        </div>
      </div>
    </div>`;
      this.insertIntoDOM(modalHtml);

      const modalElement = document.getElementById(this.id);
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
      this.element.addEventListener('click', () => {
        document.getElementById(this.id).style.display = 'flex';
      });
    }

    /**
     * Get the modal ID
     *
     * @returns {string} - The modal ID
     */
    get id() {
      return this.#modalId;
    }

    /**
     * Get the action element
     *
     * @returns {HTMLElement} - The DOM element being worked with.
     */
    get element() {
      return this.#action.element;
    }
  }

  class UikitModal extends BaseModal {
    constructor(action) {
      super(action);
    }

    show() {
      UIkit.modal(`#${this.id}`).show();
    }

    hide() {
      UIkit.modal(`#${this.id}`).hide();
    }

    create(content) {
      const modalHtml = `
      <div id="${this.id}" uk-modal>
        <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <div id="${this.id}-content">
            ${content}
          </div>
        </div>
      </div>`;
      this.insertIntoDOM(modalHtml);
    }

    initializeTrigger() {
      this.element.setAttribute('uk-toggle', `target: #${this.id}`);
    }
  }

  class BootstrapModal extends BaseModal {
    constructor(action) {
      super(action);
    }

    show() {
      const modal = new bootstrap.Modal(document.getElementById(this.id));
      modal.show();
    }

    hide() {
      const modal = bootstrap.Modal.getInstance(document.getElementById(this.id));
      if (modal) {
        modal.hide();
      }
    }

    create(content) {
      const modalHtml = `
      <div class="modal fade" id="${this.id}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content p-3">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="${this.id}-content" class="modal-body">
              ${content}
            </div>
          </div>
        </div>
      </div>`;
      this.insertIntoDOM(modalHtml);
    }

    initializeTrigger() {
      this.element.setAttribute('data-bs-toggle', 'modal');
      this.element.setAttribute('data-bs-target', `#${this.id}`);
    }
  }

  class FoundationModal extends BaseModal {
    constructor(action) {
      super(action);
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
      <div class="reveal" id="${this.id}" data-reveal>
        <div id="${this.id}-content">
          ${content}
        </div>
        <button class="close-button" data-close aria-label="Close modal" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`;
      this.insertIntoDOM(modalHtml);
      this.modalElement = new Foundation.Reveal(document.getElementById(this.id));
    }

    initializeTrigger() {
      this.element.setAttribute('data-open', this.id);
    }
  }

  class TailwindModal extends BaseModal {
    constructor(action) {
      super(action);
    }

    show() {
      document.getElementById(this.id).classList.remove('hidden');
    }

    hide() {
      document.getElementById(this.id).classList.add('hidden');
    }

    create(content) {
      const modalHtml = `
      <div class="modal hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="${this.id}">
        <div class="modal-content container mx-auto p-5 bg-white">
          <div id="${this.id}-content">
            ${content}
          </div>
          <button class="close-button" onclick="document.getElementById('${this.id}').classList.add('hidden')">Close</button>
        </div>
      </div>`;
      this.insertIntoDOM(modalHtml);
    }

    initializeTrigger() {
      this.element.addEventListener('click', () => {
        document.getElementById(this.id).classList.remove('hidden');
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
     * @param {Action} action - The action element that triggers the modal.
     */
    constructor(action) {
      this.modal = ModalElement.framework(action);
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
     * @param {Action} action - The action element triggering the modal.
     * @returns {BaseModal|BootstrapModal|UikitModal|FoundationModal|TailwindModal} The modal instance.
     */
    static framework(action) {
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
          return new ModalType(action);
        }
      }

      {
        console.log(`base modal selected`);
      }
      return new BaseModal(action);
    }
  }

  /**
   * InlineElement class responsible for adding inline elements.
   */
  class InlineElement {
    #action;

    /**
     * Creates an instance of InlineElement.
     *
     * @param {Action} action - The action element that triggers the inline display.
     */
    constructor(action) {
      this.#action = action;
      // Clear initial content
      this.element.innerHTML = '';
    }

    /**
     * Loads content into the trigger element. Appends new content if existing content is present.
     *
     * @param {string} content - The content to load into the trigger element.
     */
    load(content) {
      const existingContent = this.element.innerHTML;
      this.element.innerHTML = existingContent ? `${existingContent}\n ${content}` : content;
    }

    /**
     * Get the action element
     *
     * @returns {HTMLElement} - The DOM element being worked with.
     */
    get element() {
      return this.#action.element;
    }
  }

  class BaseTooltip {
    #action;

    /**
     * Creates a new BaseTooltip instance.
     *
     * @param {Action} action - The action elements that triggers the tooltip.
     */
    constructor(action) {
      this.#action = action;
      this.element.style.cursor = 'help';
    }

    /**
     * Loads content into the tooltip. If the trigger elements already has a title,
     * the new content is appended to it.
     *
     * @param {string} content - The content to load into the tooltip.
     * @throws {Error} Throws an error if the trigger elements is not valid.
     */
    load(content) {
      const existingTitle = this.element.getAttribute('title');
      const newTitle = existingTitle ? existingTitle + "\n" + content : content;
      this.element.setAttribute('title', newTitle);
    }

    /**
     * Get the action element
     *
     * @returns {HTMLElement} - The DOM element being worked with.
     */
    get element() {
      return this.#action.element;
    }
  }

  class BootstrapTooltip extends BaseTooltip {
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

  class UikitTooltip extends BaseTooltip {
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

  class FoundationTooltip extends BaseTooltip {
    constructor(action) {
      super(action);
    }

    load(content) {
      try {
        this.element.setAttribute('data-tooltip', '');
        super.load(content);
        this.element.classList.add('has-tip');

        new Foundation.Tooltip(this.element, {
          // Default options
          disableHover: false, // Allows tooltip to be hoverable
          fadeOutDuration: 150, // Duration of fade out animation in milliseconds
          fadeInDuration: 150, // Duration of fade in animation in milliseconds
          showOn: 'all', // Can be 'all', 'large', 'medium', 'small'
          templateClasses: '', // Custom class(es) to be added to the tooltip template
          tipText: () => this.element.getAttribute('title'), // Function to define tooltip text
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
      this.tooltipElement.textContent = this.element.getAttribute('title');
      document.body.appendChild(this.tooltipElement);
    }

    _initializeEvents() {
      this.element.addEventListener('mouseenter', () => {
        const rect = this.element.getBoundingClientRect();
        this._title = this.element.getAttribute('title');
        this.tooltipElement.style.left = `${rect.left + window.scrollX}px`;
        this.tooltipElement.style.top = `${rect.bottom + 5 + window.scrollY}px`;
        this.tooltipElement.classList.remove('invisible');
        this.tooltipElement.classList.add('opacity-100');
        this.element.setAttribute('title', '');
      });

      this.element.addEventListener('mouseleave', () => {
        this.tooltipElement.classList.add('invisible');
        this.tooltipElement.classList.remove('opacity-100');
        this.element.setAttribute('title', this._title);
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
     * @param {Action} action - The action element that triggers the tooltip.
     */
    constructor(action) {
      this.tooltip = TooltipElement.framework(action);
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
     * @param {Action} action - The action element triggering the tooltip.
     * @returns {BaseTooltip|BootstrapTooltip|UikitTooltip|FoundationTooltip|TailwindTooltip} The tooltip instance.
     */
    static framework(action) {
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
          return new TooltipType(action);
        }
      }

      {
        console.log(`base tooltip selected`);
      }
      return new BaseTooltip(action);
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
     * @param {Action} action - The action element that triggers the inline display.
     */
    constructor(action) {
      const elementTypes = {
        'modal': ModalElement,
        'inline': InlineElement,
        'tooltip': TooltipElement
      };

      const format = action.format;
      const ElementType = elementTypes[format] || InlineElement;
      this.element = new ElementType(action);

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
   * Loader class responsible for handling the loading of Reference references.
   * It initializes necessary components and loads data into a specified HTML element.
   */
  class Loader {
    #api;
    #action;
    #element;
    #format;

    /**
     * Constructs a Loader instance.
     * Allows for dependency injection of the Api class for easier testing and flexibility.
     * @param {Api} api - Instance of Api class for making API calls.
     */
    constructor(api) {
      this.#api = api;
    }

    /**
     * Load the Reference references into the specified HTML element.
     * This method extracts references from the element, validates them, and loads each valid reference.
     * @param {HTMLElement} element - The element to load Reference references into.
     */
    async load(element) {
      const references = element.innerHTML.split(';').map(ref => ref.trim());

      if (references.length === 0) {
        console.error("No references found in the getBible tagged class.");
        return;
      }

      const validReferences = this.#validateReferences(references);
      if (validReferences.length === 0) {
        console.error("No valid references found in the getBible tagged class.");
        return;
      }

      this.#init(element);
      await this.#processReferences(validReferences);
    }

    /**
     * Validates a list of references to ensure each is no longer than 30 characters and contains at least one number.
     * Invalid references are logged and excluded from the return value.
     * @param {string[]} references - The array of references to validate.
     * @returns {string[]} A filtered array of valid references.
     * @private
     */
    #validateReferences(references) {
      return references.filter(reference => {
        // Check if the reference is not longer than 30 characters and contains at least one number
        const isValid = reference.length <= 30 && /\d/.test(reference);
        // Log invalid references
        if (!isValid) {
          console.error(`Invalid getBible reference: ${reference}`);
          return false;
        }
        return true;
      });
    }

    /**
     * Processes each valid reference by fetching translations and loading the scripture.
     * This method handles the asynchronous nature of API calls.
     * @param {string[]} validReferences - Array of valid references to be processed.
     * @private
     */
    async #processReferences(validReferences) {
      for (const reference of validReferences) {
        for (const translation of this.#action.translations) {
          try {
            const scripture = await this.#api.get(reference, translation);
            if (scripture) {
              this.#load(scripture);
            }
          } catch (error) {
            console.error(`Error loading reference ${reference}:`, error);
          }
        }
      }
    }

    /**
     * Initializes components necessary for loading references.
     * This includes action, element, and format components.
     * @param {HTMLElement} element - The element to be initialized for loading.
     * @private
     */
    #init(element) {
      this.#action = new Action(element);
      this.#element = new Element(this.#action);
      this.#format = new Format(this.#action);
    }

    /**
     * Loads the scripture data into the initialized element in the specified format.
     * This method is responsible for the final rendering of scripture data.
     * @param {Object} scripture - The data containing verses and their details.
     * @private
     */
    #load(scripture) {
      this.#element.load(this.#format.get(new Scripture(scripture)));
    }
  }

  /**
   * Initializes loaders for elements with class 'getBible'.
   * Each element gets its own Loader instance because each loader maintains state
   * specific to the element it operates on. This function encapsulates the logic
   * for finding relevant elements and initializing loaders for them.
   * @param {Api} api - The Api instance to be used by each Loader.
   */
  function initializeGetBibleLoaders(api) {
    const elements = document.querySelectorAll('.getBible');
    elements.forEach(element => {
      // Create a new loader instance for each element
      const loader = new Loader(api);
      loader.load(element).catch(error => {
        // Error handling for each loader instance
        console.error(`Loading error for element ${element}:`, error);
      });
    });
  }

  /**
   * Entry point to load Reference references.
   * Attaches event listener to DOMContentLoaded to ensure the DOM is fully loaded
   * before attempting to initialize loaders.
   */
  document.addEventListener('DOMContentLoaded', (event) => {
    try {
      const api = new Api();
      initializeGetBibleLoaders(api);
    } catch (error) {
      console.error("Error initializing GetBible loaders:", error);
    }
  });

}));
