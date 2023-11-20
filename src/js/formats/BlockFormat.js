import { BaseFormat } from './BaseFormat.js';

export class BlockFormat extends BaseFormat {
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
