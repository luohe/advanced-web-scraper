import { Logger } from './logger';

/**
 * Utility function to handle retries for failed requests.
 * @param {Function} fn - The function to execute that may fail.
 * @param {number} retries - The number of retry attempts.
 * @param {number} delay - The delay between retries in milliseconds.
 * @returns {Promise<any>} - The result of the function if successful, or throws an error after retries are exhausted.
 */
export const retryHandler = async (fn: Function, retries: number = 3, delay: number = 1000): Promise<any> => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            // Attempt to execute the function
            return await fn();
        } catch (error) {
            Logger.error(`Attempt ${attempt + 1} failed: ${error.message}`);
            // If it's the last attempt, throw the error
            if (attempt === retries - 1) {
                throw new Error(`All ${retries} attempts failed: ${error.message}`);
            }
            // Wait for the specified delay before retrying
            await new Promise(res => setTimeout(res, delay));
        }
    }
};