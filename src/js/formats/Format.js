import {BlockFormat} from './BlockFormat.js';
import {InlineFormat} from './InlineFormat.js';
import {PlainFormat} from './PlainFormat.js';
import {Scripture} from '../core/Scripture.js';
import {Action} from '../core/Action.js';

/**
 * Format class responsible for creating and managing different types of formats
 * based on the specified type.
 */
export class Format {
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

    const format = action.getFormat();
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
