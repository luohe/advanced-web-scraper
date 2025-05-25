import { injectable } from 'tsyringe';
import { ProxyConfiguration  } from 'crawlee';

@injectable()
export class ProxyService {
    private proxies: string[];
    private currentProxyIndex: number;

    constructor() {
        // Initialize the proxy list and index
        this.proxies = [
            'http://proxy1.example.com:8080',
            'http://proxy2.example.com:8080',
            'http://proxy3.example.com:8080',
        ];
        this.currentProxyIndex = 0;
    }

    // Get the next proxy in the list, rotating through them
    public getNextProxy(): string {
        const proxy = this.proxies[this.currentProxyIndex];
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.proxies.length;
        return proxy;
    }

    // Configure Puppeteer to use the selected proxy
    public configurePuppeteerProxy(): ProxyConfiguration {
        return new ProxyConfiguration({
            proxyUrls: this.getProxies()
        })
    }

    // Add a new proxy to the list
    public addProxy(proxy: string): void {
        if (!this.proxies.includes(proxy)) {
            this.proxies.push(proxy);
        }
    }

    // Remove a proxy from the list
    public removeProxy(proxy: string): void {
        this.proxies = this.proxies.filter(p => p !== proxy);
    }

    // Get the current list of proxies
    public getProxies(): string[] {
        return this.proxies;
    }

    // Get the current proxy without rotating
    public getProxy(): string {
        return this.proxies[this.currentProxyIndex];
    }
}