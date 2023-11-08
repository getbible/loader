/*! getBible Loader v2.0.0 | https://getbible.net | (c) 2023 Llewellyn van der Merwe | MIT License */

class GetBibleTooltip {
  constructor() {
    this.apiEndpoint = 'https://query.getbible.net/v2/';
    this.findAndFetchScriptureReferences();
  }

  // Find elements with the 'getBible' class and fetch their references individually
  findAndFetchScriptureReferences() {
    const elements = document.querySelectorAll('.getBible');
    elements.forEach(element => {
      const references = element.innerHTML.split(';');
      const translations = (element.dataset.translation || 'kjv').toLowerCase().split(';');
      const showBookName = element.dataset.showBookName ?
        parseInt(element.dataset.showBookName, 10) : 1;
      const showTranslation = element.dataset.showTranslation ?
        parseInt(element.dataset.showTranslation, 10) : 0;
      const showAbbreviation = element.dataset.showAbbreviation ?
        parseInt(element.dataset.showAbbreviation, 10) : 0;
      const showLanguage = element.dataset.showLanguage ?
        parseInt(element.dataset.showLanguage, 10) : 0;
      if (references) {
        references.forEach(reference => {
          translations.forEach(translation => {
            this.fetchScripture(reference.trim(), translation.trim()).then(scripture => {
              if (scripture) {
                this.addToolTip(
                  element,
                  scripture,
                  showBookName,
                  showTranslation,
                  showAbbreviation,
                  showLanguage
                );
              }
            }).catch(error => console.error(error));
          });
        });
      }
    });
  }

  // Fetch scripture from the API endpoint using the reference
  async fetchScripture(reference, translation) {
    try {
      const response = await fetch(`${this.apiEndpoint}${encodeURIComponent(translation)}/${encodeURIComponent(reference)}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        // Attempt to read the JSON response to get the error message
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to fetch scripture';
        throw new Error(errorMessage);
      }
    } catch (error) {
      // If the response is not JSON or another error occurs, throw the default error message
      if (error instanceof SyntaxError) {
        // This indicates a problem with JSON parsing, meaning the response was not JSON
        throw new Error('Failed to fetch scripture');
      } else {
        // Re-throw the error that we constructed from the JSON response
        throw error;
      }
    }
  }

  // Format the verses for tooltip display
  formatScriptureText(data, showBook, showTrans, showAbbr, showLang) {
    let formattedText = '';
    let setBookName = new Set();
    let setTranslation = new Set();
    let setAbbreviation = new Set();
    let setLanguage = new Set();

    for (const key in data) {
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

      // Construct the header if there are any parts to include
      if (headerParts.length > 0) {
        formattedText += '[' + headerParts.join(' - ') + "]\n";
      }

      // Add verses
      const verses = data[key].verses.map(verse => `${verse.verse}. ${verse.text}`).join("\n");
      formattedText += verses + "\n\n"; // Add extra newline for separation between entries
    }

    return formattedText.trim();
  }

  // Add or append tooltip to the element
  addToolTip(element, data, showBook, showTrans, showAbbr, showLang) {
    const scriptureText = this.formatScriptureText(data, showBook, showTrans, showAbbr, showLang);
    const existingToolTip = element.title;
    element.title = existingToolTip ? existingToolTip + "\n" + scriptureText : scriptureText;
  }
}
document.addEventListener('DOMContentLoaded', (event) => {
  new GetBibleTooltip();
});