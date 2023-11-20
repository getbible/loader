import { BaseFormat } from './BaseFormat.js';

export class PlainFormat extends BaseFormat {
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
