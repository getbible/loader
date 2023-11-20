import { BlockFormat } from './BlockFormat.js';
import { InlineFormat } from './InlineFormat.js';
import { PlainFormat } from './PlainFormat.js';

/**
 * Format class responsible for creating and managing different types of formats
 * based on the specified type.
 */
export class Format {
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
