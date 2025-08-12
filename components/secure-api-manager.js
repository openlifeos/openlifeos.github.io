/**
 * Secure API Manager for OpenLifeOS
 * Enhanced security with encryption and validation
 */
class SecureAPIManager {
    constructor() {
        this.apiKeys = new Map();
        this.encryptionKey = null;
        this.initSecurity();
    }

    /**
     * Initialize security measures
     */
    async initSecurity() {
        // Generate or retrieve encryption key
        if (crypto.subtle) {
            this.encryptionKey = await this.generateEncryptionKey();
        }
        
        // Set security headers for API requests
        this.setupSecureDefaults();
    }

    /**
     * Generate encryption key for local storage
     */
    async generateEncryptionKey() {
        try {
            return await crypto.subtle.generateKey(
                {
                    name: 'AES-GCM',
                    length: 256
                },
                false,
                ['encrypt', 'decrypt']
            );
        } catch (error) {
            console.warn('Crypto API not available, falling back to basic security');
            return null;
        }
    }

    /**
     * Setup secure defaults for API requests
     */
    setupSecureDefaults() {
        // Rate limiting
        this.lastRequestTime = 0;
        this.requestInterval = 1000; // 1 second minimum between requests
        
        // Request validation
        this.maxRequestsPerMinute = 30;
        this.requestHistory = [];
    }

    /**
     * Securely store API key with encryption
     */
    async setAPIKey(provider, apiKey) {
        if (!this.validateAPIKey(provider, apiKey)) {
            throw new Error('Invalid API key format');
        }

        try {
            if (this.encryptionKey && crypto.subtle) {
                const encryptedKey = await this.encryptData(apiKey);
                sessionStorage.setItem(`openlifeos_${provider}_key`, encryptedKey);
            } else {
                // Fallback: obfuscated storage
                const obfuscatedKey = this.obfuscateKey(apiKey);
                sessionStorage.setItem(`openlifeos_${provider}_key`, obfuscatedKey);
            }
            
            this.apiKeys.set(provider, apiKey);
            this.logSecurityEvent('API_KEY_STORED', provider);
            
        } catch (error) {
            console.error('Failed to store API key securely:', error);
            throw new Error('Failed to store API key securely');
        }
    }

    /**
     * Securely retrieve API key with decryption
     */
    async getAPIKey(provider) {
        try {
            // First check memory cache
            if (this.apiKeys.has(provider)) {
                return this.apiKeys.get(provider);
            }

            const stored = sessionStorage.getItem(`openlifeos_${provider}_key`);
            if (!stored) return null;

            let decryptedKey;
            if (this.encryptionKey && crypto.subtle) {
                decryptedKey = await this.decryptData(stored);
            } else {
                decryptedKey = this.deobfuscateKey(stored);
            }

            this.apiKeys.set(provider, decryptedKey);
            return decryptedKey;
            
        } catch (error) {
            console.error('Failed to retrieve API key:', error);
            this.clearAPIKey(provider);
            return null;
        }
    }

    /**
     * Encrypt sensitive data
     */
    async encryptData(data) {
        if (!this.encryptionKey) throw new Error('Encryption not available');
        
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            this.encryptionKey,
            dataBuffer
        );
        
        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);
        
        return btoa(String.fromCharCode(...combined));
    }

    /**
     * Decrypt sensitive data
     */
    async decryptData(encryptedData) {
        if (!this.encryptionKey) throw new Error('Decryption not available');
        
        const combined = new Uint8Array(
            atob(encryptedData).split('').map(char => char.charCodeAt(0))
        );
        
        const iv = combined.slice(0, 12);
        const encrypted = combined.slice(12);
        
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            this.encryptionKey,
            encrypted
        );
        
        return new TextDecoder().decode(decrypted);
    }

    /**
     * Basic obfuscation for fallback security
     */
    obfuscateKey(key) {
        return btoa(key.split('').reverse().join(''));
    }

    /**
     * Deobfuscate key
     */
    deobfuscateKey(obfuscated) {
        return atob(obfuscated).split('').reverse().join('');
    }

    /**
     * Validate API key format
     */
    validateAPIKey(provider, apiKey) {
        if (!apiKey || typeof apiKey !== 'string') return false;
        
        const patterns = {
            openai: /^sk-[A-Za-z0-9]{48,}$/,
            anthropic: /^sk-ant-[A-Za-z0-9-_]{95,}$/,
            google: /^[A-Za-z0-9-_]{39}$/
        };
        
        const pattern = patterns[provider.toLowerCase()];
        return pattern ? pattern.test(apiKey) : apiKey.length > 20;
    }

    /**
     * Rate limiting check
     */
    checkRateLimit() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Clean old requests
        this.requestHistory = this.requestHistory.filter(time => time > oneMinuteAgo);
        
        // Check limits
        if (this.requestHistory.length >= this.maxRequestsPerMinute) {
            throw new Error('Rate limit exceeded. Please wait before making more requests.');
        }
        
        if (now - this.lastRequestTime < this.requestInterval) {
            throw new Error('Please wait before making another request.');
        }
        
        this.requestHistory.push(now);
        this.lastRequestTime = now;
    }

    /**
     * Secure API request wrapper
     */
    async secureRequest(provider, endpoint, options = {}) {
        this.checkRateLimit();
        
        const apiKey = await this.getAPIKey(provider);
        if (!apiKey) {
            throw new Error(`No API key found for ${provider}`);
        }

        // Add security headers
        const secureHeaders = {
            'User-Agent': 'OpenLifeOS/1.0.0',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers
        };

        // Provider-specific header setup
        switch (provider.toLowerCase()) {
            case 'openai':
                secureHeaders['Authorization'] = `Bearer ${apiKey}`;
                secureHeaders['Content-Type'] = 'application/json';
                break;
            case 'anthropic':
                secureHeaders['x-api-key'] = apiKey;
                secureHeaders['anthropic-version'] = '2023-06-01';
                secureHeaders['Content-Type'] = 'application/json';
                break;
        }

        const requestOptions = {
            ...options,
            headers: secureHeaders,
            mode: 'cors',
            credentials: 'omit' // Don't send cookies
        };

        try {
            const response = await fetch(endpoint, requestOptions);
            
            if (!response.ok) {
                this.logSecurityEvent('API_REQUEST_FAILED', provider, {
                    status: response.status,
                    endpoint: endpoint.replace(apiKey, '[REDACTED]')
                });
                throw new Error(`API request failed: ${response.status}`);
            }
            
            return response;
            
        } catch (error) {
            this.logSecurityEvent('API_REQUEST_ERROR', provider, {
                error: error.message,
                endpoint: endpoint.replace(apiKey, '[REDACTED]')
            });
            throw error;
        }
    }

    /**
     * Clear API key securely
     */
    clearAPIKey(provider) {
        this.apiKeys.delete(provider);
        sessionStorage.removeItem(`openlifeos_${provider}_key`);
        this.logSecurityEvent('API_KEY_CLEARED', provider);
    }

    /**
     * Clear all API keys
     */
    clearAllAPIKeys() {
        this.apiKeys.clear();
        const keysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('openlifeos_') && key.endsWith('_key')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        this.logSecurityEvent('ALL_API_KEYS_CLEARED');
    }

    /**
     * Security event logging
     */
    logSecurityEvent(event, provider = null, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            provider: provider,
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...details
        };
        
        // In production, this would send to a security monitoring service
        console.log('[Security Event]', logEntry);
    }

    /**
     * Get security status
     */
    getSecurityStatus() {
        return {
            encryptionAvailable: !!this.encryptionKey,
            storedKeys: Array.from(this.apiKeys.keys()),
            rateLimitRemaining: this.maxRequestsPerMinute - this.requestHistory.length,
            securityLevel: this.encryptionKey ? 'HIGH' : 'MEDIUM'
        };
    }
}

// Global instance
const secureAPIManager = new SecureAPIManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureAPIManager;
}

// Legacy support
window.SecureAPIManager = SecureAPIManager;
window.secureAPIManager = secureAPIManager;