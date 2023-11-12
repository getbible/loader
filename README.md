# GetBible Tooltips Integration Guide

## Overview

GetBible Tooltips is an intuitive and lightweight JavaScript solution for embedding Bible scripture tooltips into your website. By simply adding the `getBible` class to any element on your webpage, you can enable users to see the full scripture text in a tooltip when they hover over a reference.

## How to Add GetBible Tooltips to Your Website

1. **Include the GetBible JavaScript File:**

   First, include the GetBible script in the `<head>` section of your HTML document:

   ```html
   <!-- Include the GetBible tooltips script from jsDelivr CDN -->
   <script src="https://cdn.jsdelivr.net/gh/getbible/loader@2.0.0/dist/js/getBible.min.js"></script>
   ```

2. **Markup Your Scripture References:**

   In the body of your HTML document, apply the `getBible` class to any element that should display a scripture tooltip. Here is an example using a `ul` list:

   ```html
   <ul>
     <li class="getBible">John 3:16</li>
     <li class="getBible">1 John 3:16-19,22</li>
     <!-- Add more elements as needed -->
   </ul>
   ```

   For a detailed example, check out the [basic usage example](https://git.vdm.dev/getBible/loader/src/branch/master/example/basic.html) in the `getbible/loader` repository.

## Utilizing Data Attributes

Data attributes allow you to customize the behavior and display of the scripture tooltips.

- `data-translation`: Specify the Bible translations to use, separated by semicolons (e.g., `kjv;aov`). The tooltip will fetch the scripture from each translation listed.
- `data-show-translation`: Set to `1` to display the translation name in the tooltip.
- `data-show-abbreviation`: Set to `1` to display the abbreviation of the translation in the tooltip.
- `data-show-language`: Set to `1` to display the language of the translation in the tooltip.

Here's how you might use these attributes:

```html
<span class="getBible" data-translation="kjv;aov" data-show-translation="1" data-show-language="1">John 3:16,19</span>
```

In the example above, the tooltip for this list item will show text from both the King James Version (KJV) and another version abbreviated as AOV. It will also display the translation name and language for each scripture reference.

## Scripture Reference Formatting

Nearly **all** abbreviations on almost **all** languages should work.

[Here you can view all the files of the various translations we use to parse each reference in their respective languages](https://git.vdm.dev/getBible/librarian/src/branch/master/src/getbible/data).

Should you see room for improvement to these, please open an issue at our [support desk](https://git.vdm.dev/getBible/support/issues), we welcome any help to make this work even better.

### Some Guidelines

- **Chapter and Verse**: Follow the book name with the chapter number, a colon, and the verse number(s) (e.g., "Jn3:16").
- **Multiple Verses**: Separate multiple verses with commas (e.g., "Jn 3:16,17").
- **Verse Ranges**: Indicate a range of verses using a hyphen (e.g., "John 3:16-19").
- **Multiple References**: Separate different scripture references with semicolons (e.g., "Joh 3:16-17; 1 Jo3:16-19").
- **One Chapter Per/Reference**: Each reference should only target one chapter.
- **Missing Chapter**: All references that does not have a chapter will **default to chapter 1** (e.g., "Jhn :16-19").
- **Missing Verses**: All references that does not have verses will **default to verse 1** (e.g., "Jn3").

## Copyright and License

Copyright [Llewellyn van der Merwe](https://getBible.net) under the [MIT license](LICENSE.md).
