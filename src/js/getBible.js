import { Loader } from "./core/Loader.js";

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
