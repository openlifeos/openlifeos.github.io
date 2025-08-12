/**
 * OpenLifeOS Analytics & Error Tracking System
 * Privacy-first analytics with error monitoring
 */
class OpenLifeOSAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.events = [];
        this.errors = [];
        this.performance = {};
        
        this.init();
    }

    /**
     * Initialize analytics system
     */
    init() {
        this.setupErrorTracking();
        this.setupPerformanceTracking();
        this.setupUserInteractionTracking();
        this.startSessionTracking();
        
        // Privacy-first: only track if user hasn't opted out
        if (!this.hasOptedOut()) {
            this.trackPageView();
        }
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Check if user has opted out of analytics
     */
    hasOptedOut() {
        return localStorage.getItem('openlifeos_analytics_opt_out') === 'true';
    }

    /**
     * Allow users to opt out
     */
    optOut() {
        localStorage.setItem('openlifeos_analytics_opt_out', 'true');
        console.log('Analytics opt-out successful');
    }

    /**
     * Setup global error tracking
     */
    setupErrorTracking() {
        // JavaScript errors
        window.addEventListener('error', (event) => {
            this.trackError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error ? event.error.stack : null,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.trackError({
                type: 'promise_rejection',
                message: event.reason ? event.reason.toString() : 'Unhandled promise rejection',
                stack: event.reason ? event.reason.stack : null,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Network errors for fetch requests
        this.interceptFetch();
    }

    /**
     * Intercept fetch requests to track network errors
     */
    interceptFetch() {
        const originalFetch = window.fetch;
        
        window.fetch = async (...args) => {
            const startTime = performance.now();
            
            try {
                const response = await originalFetch(...args);
                const endTime = performance.now();
                
                // Track API performance
                if (args[0].includes('api.openai.com') || args[0].includes('anthropic.com')) {
                    this.trackEvent('api_request', {
                        url: args[0],
                        status: response.status,
                        duration: endTime - startTime,
                        success: response.ok
                    });
                }
                
                // Track failed requests
                if (!response.ok) {
                    this.trackError({
                        type: 'network',
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        url: args[0],
                        status: response.status,
                        timestamp: Date.now()
                    });
                }
                
                return response;
            } catch (error) {
                const endTime = performance.now();
                
                this.trackError({
                    type: 'network',
                    message: error.message,
                    url: args[0],
                    duration: endTime - startTime,
                    timestamp: Date.now(),
                    stack: error.stack
                });
                
                throw error;
            }
        };
    }

    /**
     * Setup performance tracking
     */
    setupPerformanceTracking() {
        // Page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                this.performance = {
                    pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                    firstPaint: this.getFirstPaint(),
                    firstContentfulPaint: this.getFirstContentfulPaint(),
                    largestContentfulPaint: this.getLargestContentfulPaint()
                };
                
                this.trackEvent('page_performance', this.performance);
            }, 1000);
        });

        // Core Web Vitals
        this.trackCoreWebVitals();
    }

    /**
     * Get First Paint timing
     */
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    /**
     * Get First Contentful Paint timing
     */
    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return fcp ? fcp.startTime : null;
    }

    /**
     * Get Largest Contentful Paint timing
     */
    getLargestContentfulPaint() {
        return new Promise((resolve) => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                    observer.disconnect();
                });
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            } else {
                resolve(null);
            }
        });
    }

    /**
     * Track Core Web Vitals
     */
    trackCoreWebVitals() {
        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                let cumulativeScore = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        cumulativeScore += entry.value;
                    }
                }
                
                if (cumulativeScore > 0) {
                    this.trackEvent('core_web_vital', {
                        metric: 'CLS',
                        value: cumulativeScore,
                        rating: cumulativeScore < 0.1 ? 'good' : cumulativeScore < 0.25 ? 'needs-improvement' : 'poor'
                    });
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    /**
     * Setup user interaction tracking
     */
    setupUserInteractionTracking() {
        // Demo button clicks
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a[href*="/demos/"], button[onclick*="demo"]');
            if (target) {
                this.trackEvent('demo_click', {
                    demo: this.extractDemoName(target.href || target.onclick),
                    element: target.tagName,
                    text: target.textContent.trim().substring(0, 50)
                });
            }
        });

        // API key input tracking (privacy-safe)
        document.addEventListener('input', (event) => {
            if (event.target.type === 'password' && event.target.name.includes('api')) {
                this.trackEvent('api_key_input', {
                    provider: this.extractProvider(event.target.name),
                    hasValue: event.target.value.length > 0
                });
            }
        });

        // Page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                hidden: document.hidden,
                timestamp: Date.now()
            });
        });
    }

    /**
     * Extract demo name from URL or onclick
     */
    extractDemoName(source) {
        if (!source) return 'unknown';
        
        const demoMatches = source.match(/\/demos\/([^\/\?"]+)/);
        return demoMatches ? demoMatches[1].replace('.html', '') : 'unknown';
    }

    /**
     * Extract API provider from input name
     */
    extractProvider(name) {
        if (name.includes('openai')) return 'openai';
        if (name.includes('anthropic')) return 'anthropic';
        if (name.includes('google')) return 'google';
        return 'unknown';
    }

    /**
     * Start session tracking
     */
    startSessionTracking() {
        // Track session duration
        setInterval(() => {
            const duration = Date.now() - this.startTime;
            
            // Send heartbeat every 30 seconds
            this.trackEvent('session_heartbeat', {
                duration: duration,
                active: !document.hidden
            });
        }, 30000);

        // Track session end
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_end', {
                duration: Date.now() - this.startTime,
                events_count: this.events.length,
                errors_count: this.errors.length
            });
            
            // Send any pending data
            this.sendPendingData();
        });
    }

    /**
     * Track page view
     */
    trackPageView() {
        this.trackEvent('page_view', {
            url: window.location.href,
            referrer: document.referrer,
            title: document.title,
            timestamp: Date.now(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: screen.width,
                height: screen.height
            },
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }

    /**
     * Track custom event
     */
    trackEvent(eventName, properties = {}) {
        if (this.hasOptedOut()) return;

        const event = {
            id: this.generateEventId(),
            sessionId: this.sessionId,
            name: eventName,
            properties: properties,
            timestamp: Date.now(),
            url: window.location.href
        };

        this.events.push(event);
        
        // Send events in batches
        if (this.events.length >= 10) {
            this.sendEvents();
        }
        
        console.log('[Analytics]', eventName, properties);
    }

    /**
     * Track error
     */
    trackError(errorData) {
        if (this.hasOptedOut()) return;

        const error = {
            id: this.generateEventId(),
            sessionId: this.sessionId,
            ...errorData
        };

        this.errors.push(error);
        
        // Send errors immediately
        this.sendErrors();
        
        console.error('[Error Tracking]', errorData);
    }

    /**
     * Generate unique event ID
     */
    generateEventId() {
        return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Send events to analytics service
     */
    sendEvents() {
        if (this.events.length === 0) return;

        // In production, this would send to your analytics service
        // For privacy, we'll just log locally or use a privacy-first service
        
        try {
            // Store locally for demo purposes
            const stored = JSON.parse(localStorage.getItem('openlifeos_analytics') || '[]');
            stored.push(...this.events);
            
            // Keep only last 1000 events
            if (stored.length > 1000) {
                stored.splice(0, stored.length - 1000);
            }
            
            localStorage.setItem('openlifeos_analytics', JSON.stringify(stored));
            
            console.log(`[Analytics] Sent ${this.events.length} events`);
            this.events = [];
            
        } catch (error) {
            console.error('[Analytics] Failed to send events:', error);
        }
    }

    /**
     * Send errors to monitoring service
     */
    sendErrors() {
        if (this.errors.length === 0) return;

        try {
            // Store errors locally for demo purposes
            const stored = JSON.parse(localStorage.getItem('openlifeos_errors') || '[]');
            stored.push(...this.errors);
            
            // Keep only last 100 errors
            if (stored.length > 100) {
                stored.splice(0, stored.length - 100);
            }
            
            localStorage.setItem('openlifeos_errors', JSON.stringify(stored));
            
            console.log(`[Error Tracking] Sent ${this.errors.length} errors`);
            this.errors = [];
            
        } catch (error) {
            console.error('[Error Tracking] Failed to send errors:', error);
        }
    }

    /**
     * Send pending data before page unload
     */
    sendPendingData() {
        this.sendEvents();
        this.sendErrors();
    }

    /**
     * Get analytics summary
     */
    getAnalyticsSummary() {
        try {
            const events = JSON.parse(localStorage.getItem('openlifeos_analytics') || '[]');
            const errors = JSON.parse(localStorage.getItem('openlifeos_errors') || '[]');
            
            return {
                totalEvents: events.length,
                totalErrors: errors.length,
                sessionDuration: Date.now() - this.startTime,
                performance: this.performance,
                currentSession: {
                    id: this.sessionId,
                    events: this.events.length,
                    errors: this.errors.length
                }
            };
        } catch (error) {
            return {
                error: 'Failed to retrieve analytics data'
            };
        }
    }

    /**
     * Clear all analytics data
     */
    clearData() {
        localStorage.removeItem('openlifeos_analytics');
        localStorage.removeItem('openlifeos_errors');
        this.events = [];
        this.errors = [];
        console.log('[Analytics] All data cleared');
    }
}

// Initialize analytics system
const analytics = new OpenLifeOSAnalytics();

// Export for global use
window.OpenLifeOSAnalytics = OpenLifeOSAnalytics;
window.analytics = analytics;

// Helper function for manual event tracking
window.trackEvent = (name, properties) => analytics.trackEvent(name, properties);
window.trackError = (error) => analytics.trackError(error);