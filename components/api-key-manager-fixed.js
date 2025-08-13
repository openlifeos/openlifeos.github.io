/**
 * API Key Manager Component - Fixed Version
 * Provides UI for managing API keys with secure storage
 */
class APIKeyManagerFixed extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.apiManager = window.secureAPIManager || new SecureAPIManager();
        this.providers = ['openai', 'anthropic', 'groq', 'google'];
        this.isExpanded = false;
    }

    connectedCallback() {
        this.render();
        this.loadSavedKeys();
        this.attachEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .api-key-widget {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    padding: 12px;
                    transition: all 0.3s ease;
                    min-width: 60px;
                    max-width: 400px;
                }

                .api-key-widget.expanded {
                    padding: 20px;
                    width: 350px;
                }

                .widget-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    cursor: pointer;
                }

                .widget-title {
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .toggle-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease;
                }

                .toggle-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                .api-form {
                    display: none;
                }

                .api-form.visible {
                    display: block;
                }

                .provider-section {
                    margin-bottom: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px;
                }

                .provider-label {
                    color: white;
                    font-size: 14px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #ff4444;
                }

                .status-indicator.active {
                    background: #44ff44;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }

                .api-input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 6px;
                    font-size: 13px;
                    transition: all 0.3s ease;
                }

                .api-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .api-input:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.4);
                }

                .save-btn {
                    width: 100%;
                    padding: 10px;
                    background: linear-gradient(135deg, #44ff44 0%, #00ff88 100%);
                    color: #1a1a1a;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 15px;
                }

                .save-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(68, 255, 68, 0.4);
                }

                .message {
                    margin-top: 10px;
                    padding: 8px;
                    border-radius: 6px;
                    font-size: 13px;
                    text-align: center;
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .message.success {
                    background: rgba(68, 255, 68, 0.2);
                    color: #44ff44;
                }

                .message.error {
                    background: rgba(255, 68, 68, 0.2);
                    color: #ff4444;
                }

                .minimized-icon {
                    width: 36px;
                    height: 36px;
                    display: none;
                }

                .widget-content {
                    display: block;
                }

                :host(.minimized) .widget-content {
                    display: none;
                }

                :host(.minimized) .minimized-icon {
                    display: block;
                    cursor: pointer;
                }

                @media (max-width: 480px) {
                    :host {
                        right: 10px;
                        bottom: 10px;
                    }

                    .api-key-widget.expanded {
                        width: calc(100vw - 40px);
                    }
                }
            </style>

            <div class="api-key-widget ${this.isExpanded ? 'expanded' : ''}">
                <div class="minimized-icon" title="API Key Manager">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                    </svg>
                </div>
                
                <div class="widget-content">
                    <div class="widget-header">
                        <div class="widget-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                            </svg>
                            API Keys
                        </div>
                        <button class="toggle-btn" title="${this.isExpanded ? 'Collapse' : 'Expand'}">
                            ${this.isExpanded ? '−' : '+'}
                        </button>
                    </div>

                    <div class="api-form ${this.isExpanded ? 'visible' : ''}">
                        ${this.providers.map(provider => `
                            <div class="provider-section">
                                <label class="provider-label">
                                    <span class="status-indicator" data-provider="${provider}"></span>
                                    ${provider.charAt(0).toUpperCase() + provider.slice(1)} API
                                </label>
                                <input 
                                    type="password" 
                                    class="api-input" 
                                    data-provider="${provider}"
                                    placeholder="Enter ${provider} API key..."
                                >
                            </div>
                        `).join('')}
                        
                        <button class="save-btn">Save All Keys</button>
                        <div class="message" style="display: none;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const widget = this.shadowRoot.querySelector('.api-key-widget');
        const toggleBtn = this.shadowRoot.querySelector('.toggle-btn');
        const header = this.shadowRoot.querySelector('.widget-header');
        const saveBtn = this.shadowRoot.querySelector('.save-btn');
        const minimizedIcon = this.shadowRoot.querySelector('.minimized-icon');

        // Toggle expand/collapse
        header.addEventListener('click', (e) => {
            if (e.target !== saveBtn && !e.target.closest('.api-input')) {
                this.toggleExpand();
            }
        });

        // Minimize icon click
        minimizedIcon.addEventListener('click', () => {
            this.classList.remove('minimized');
        });

        // Save button
        saveBtn.addEventListener('click', () => this.saveAllKeys());

        // Auto-save on input
        this.shadowRoot.querySelectorAll('.api-input').forEach(input => {
            input.addEventListener('blur', () => {
                const provider = input.dataset.provider;
                const value = input.value.trim();
                if (value) {
                    this.saveKey(provider, value);
                }
            });
        });
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        const widget = this.shadowRoot.querySelector('.api-key-widget');
        const form = this.shadowRoot.querySelector('.api-form');
        const toggleBtn = this.shadowRoot.querySelector('.toggle-btn');

        if (this.isExpanded) {
            widget.classList.add('expanded');
            form.classList.add('visible');
            toggleBtn.textContent = '−';
        } else {
            widget.classList.remove('expanded');
            form.classList.remove('visible');
            toggleBtn.textContent = '+';
        }
    }

    async loadSavedKeys() {
        for (const provider of this.providers) {
            try {
                const key = await this.apiManager.getAPIKey(provider);
                if (key) {
                    const input = this.shadowRoot.querySelector(`input[data-provider="${provider}"]`);
                    const indicator = this.shadowRoot.querySelector(`.status-indicator[data-provider="${provider}"]`);
                    
                    if (input) {
                        input.value = '••••••••••••••••';
                        input.dataset.hasKey = 'true';
                    }
                    
                    if (indicator) {
                        indicator.classList.add('active');
                    }
                }
            } catch (error) {
                console.warn(`Failed to load ${provider} key:`, error);
            }
        }
    }

    async saveKey(provider, apiKey) {
        try {
            await this.apiManager.setAPIKey(provider, apiKey);
            const indicator = this.shadowRoot.querySelector(`.status-indicator[data-provider="${provider}"]`);
            if (indicator) {
                indicator.classList.add('active');
            }
            return true;
        } catch (error) {
            console.error(`Failed to save ${provider} key:`, error);
            return false;
        }
    }

    async saveAllKeys() {
        const message = this.shadowRoot.querySelector('.message');
        let savedCount = 0;
        let failedCount = 0;

        for (const provider of this.providers) {
            const input = this.shadowRoot.querySelector(`input[data-provider="${provider}"]`);
            if (input && input.value && input.value !== '••••••••••••••••' && !input.dataset.hasKey) {
                const success = await this.saveKey(provider, input.value.trim());
                if (success) {
                    savedCount++;
                    input.value = '••••••••••••••••';
                    input.dataset.hasKey = 'true';
                } else {
                    failedCount++;
                }
            }
        }

        // Show message
        if (savedCount > 0 || failedCount > 0) {
            message.style.display = 'block';
            if (failedCount === 0) {
                message.className = 'message success';
                message.textContent = `✓ Saved ${savedCount} API key${savedCount > 1 ? 's' : ''}`;
            } else {
                message.className = 'message error';
                message.textContent = `⚠ ${savedCount} saved, ${failedCount} failed`;
            }

            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);
        }

        // Dispatch event for other components
        this.dispatchEvent(new CustomEvent('api-keys-updated', {
            detail: { savedCount, failedCount },
            bubbles: true,
            composed: true
        }));
    }

    // Public method to check if a provider has a key
    hasAPIKey(provider) {
        return this.apiManager.apiKeys.has(provider);
    }

    // Public method to minimize the widget
    minimize() {
        this.classList.add('minimized');
    }

    // Public method to restore the widget
    restore() {
        this.classList.remove('minimized');
    }
}

// Register the custom element
customElements.define('api-key-manager-fixed', APIKeyManagerFixed);

// Export for module usage
export default APIKeyManagerFixed;