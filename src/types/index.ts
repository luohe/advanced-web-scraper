// src/types/index.ts

// Define the interface for a scraping task
export interface ScrapingTask {
    url: string; // The URL to scrape
    method: 'GET' | 'POST'; // HTTP method to use
    payload?: Record<string, any>; // Optional payload for POST requests
}

// Define the interface for the scraped data
export interface ScrapedData {
    [key: string]: any; // Key-value pairs of scraped data
}

// Define the interface for the proxy service
export interface ProxyService {
    getProxy(): string; // Method to get a proxy for requests
}

// Define the interface for the logger utility
export interface Logger {
    log(message: string): void; // Method to log messages
    error(message: string): void; // Method to log errors
}

// Define the interface for the retry handler
export interface RetryHandler {
    retry<T>(fn: () => Promise<T>, retries: number): Promise<T>; // Method to handle retries
}