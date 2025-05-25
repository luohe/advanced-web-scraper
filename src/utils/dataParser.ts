import { JSDOM } from 'jsdom';

/**
 * Parses the scraped HTML data and extracts relevant information.
 * @param {string} html - The HTML string to parse.
 * @returns {Object} - An object containing the extracted data.
 */
export function parseData(html: string): Object {
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Example: Extracting title and meta description
    const title = document.querySelector('title')?.textContent || '';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    // Return the parsed data as an object
    return {
        title,
        description,
        // Add more fields as needed
    };
}

/**
 * Formats the parsed data for storage or further processing.
 * @param {Object} data - The data object to format.
 * @returns {string} - A formatted string representation of the data.
 */
export function formatData(data: Object): string {
    // Example: Convert the data object to a JSON string
    return JSON.stringify(data, null, 2);
}