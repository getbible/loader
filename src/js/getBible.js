import {Api} from './core/Api.js';
import {Loader} from "./core/Loader.js";

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
