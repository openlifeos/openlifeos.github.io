/**
 * OpenLifeOS Performance Optimization Module
 * Implements lazy loading, resource hints, and performance monitoring
 */

(function() {
    'use strict';

    // Performance optimization configuration
    const config = {
        lazyLoadOffset: 50,
        imageFadeInDuration: 300,
        enablePrefetch: true,
        enablePreconnect: true,
        criticalCSS: true
    };

    /**
     * Lazy Loading for Images
     */
    class LazyImageLoader {
        constructor() {
            this.images = [];
            this.imageObserver = null;
            this.init();
        }

        init() {
            // Convert all img[data-src] to lazy loaded images
            this.images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                this.initIntersectionObserver();
            } else {
                // Fallback for older browsers
                this.loadImagesImmediately();
            }
        }

        initIntersectionObserver() {
            const options = {
                root: null,
                rootMargin: `${config.lazyLoadOffset}px`,
                threshold: 0.01
            };

            this.imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            this.images.forEach(img => {
                this.imageObserver.observe(img);
            });
        }

        loadImage(img) {
            const src = img.dataset.src || img.src;
            
            if (img.dataset.src) {
                img.src = src;
                img.removeAttribute('data-src');
            }

            img.classList.add('lazy-loaded');
            
            // Add fade-in effect
            img.style.opacity = '0';
            img.onload = () => {
                img.style.transition = `opacity ${config.imageFadeInDuration}ms`;
                img.style.opacity = '1';
            };
        }

        loadImagesImmediately() {
            this.images.forEach(img => this.loadImage(img));
        }
    }

    /**
     * Resource Hints Manager
     */
    class ResourceHints {
        constructor() {
            this.init();
        }

        init() {
            if (config.enablePreconnect) {
                this.addPreconnect();
            }
            
            if (config.enablePrefetch) {
                this.addPrefetch();
            }

            this.addDNSPrefetch();
        }

        addPreconnect() {
            const origins = [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://api.openai.com',
                'https://api.anthropic.com'
            ];

            origins.forEach(origin => {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = origin;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });
        }

        addPrefetch() {
            // Prefetch next likely navigation targets
            const prefetchUrls = [
                '/demos/life-os-ultimate-v2.html',
                '/components/secure-api-manager.js'
            ];

            prefetchUrls.forEach(url => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = url;
                document.head.appendChild(link);
            });
        }

        addDNSPrefetch() {
            const domains = [
                'openlifeos.ai',
                'github.com',
                'githubusercontent.com'
            ];

            domains.forEach(domain => {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = `//${domain}`;
                document.head.appendChild(link);
            });
        }
    }

    /**
     * Performance Monitor
     */
    class PerformanceMonitor {
        constructor() {
            this.metrics = {};
            this.init();
        }

        init() {
            if ('performance' in window && 'PerformanceObserver' in window) {
                this.observePerformance();
                this.measureVitals();
            }
        }

        observePerformance() {
            // Observe Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
                    console.log('LCP:', this.metrics.lcp);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                // LCP not supported
            }

            // Observe First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.metrics.fid = entry.processingStart - entry.startTime;
                        console.log('FID:', this.metrics.fid);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                // FID not supported
            }

            // Observe Cumulative Layout Shift
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.metrics.cls = clsValue;
                    console.log('CLS:', this.metrics.cls);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                // CLS not supported
            }
        }

        measureVitals() {
            // Measure page load time
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.metrics.loadTime = perfData.loadEventEnd - perfData.fetchStart;
                    this.metrics.domReady = perfData.domContentLoadedEventEnd - perfData.fetchStart;
                    this.metrics.ttfb = perfData.responseStart - perfData.fetchStart;
                    
                    console.log('Performance Metrics:', this.metrics);
                    
                    // Send metrics to analytics if available
                    if (window.analytics && window.analytics.track) {
                        window.analytics.track('performance', this.metrics);
                    }
                }
            });
        }

        getMetrics() {
            return this.metrics;
        }
    }

    /**
     * Script Loader with Defer/Async
     */
    class ScriptLoader {
        static loadScript(src, options = {}) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                
                if (options.async) script.async = true;
                if (options.defer) script.defer = true;
                if (options.module) script.type = 'module';
                
                script.onload = resolve;
                script.onerror = reject;
                
                document.head.appendChild(script);
            });
        }

        static loadScripts(scripts) {
            return Promise.all(scripts.map(script => 
                this.loadScript(script.src, script.options)
            ));
        }
    }

    /**
     * CSS Optimization
     */
    class CSSOptimizer {
        constructor() {
            this.criticalCSS = null;
            this.init();
        }

        init() {
            if (config.criticalCSS) {
                this.injectCriticalCSS();
                this.loadNonCriticalCSS();
            }
        }

        injectCriticalCSS() {
            // Critical CSS is already inlined in HTML
            // This method would extract and inline critical CSS in production
        }

        loadNonCriticalCSS() {
            // Load non-critical CSS asynchronously
            const nonCriticalStyles = [
                '/css/animations.css',
                '/css/components.css'
            ];

            nonCriticalStyles.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = href;
                link.onload = function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                };
                document.head.appendChild(link);
            });
        }
    }

    /**
     * Request Idle Callback Polyfill
     */
    window.requestIdleCallback = window.requestIdleCallback || function(callback) {
        const start = Date.now();
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
            });
        }, 1);
    };

    /**
     * Initialize Performance Optimizations
     */
    class PerformanceOptimizer {
        constructor() {
            this.lazyLoader = null;
            this.resourceHints = null;
            this.monitor = null;
            this.cssOptimizer = null;
            
            this.init();
        }

        init() {
            // Initialize on DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        }

        initialize() {
            // Use requestIdleCallback for non-critical initializations
            requestIdleCallback(() => {
                this.lazyLoader = new LazyImageLoader();
                this.resourceHints = new ResourceHints();
                this.cssOptimizer = new CSSOptimizer();
            });

            // Initialize performance monitoring immediately
            this.monitor = new PerformanceMonitor();

            // Optimize animations
            this.optimizeAnimations();

            // Setup passive event listeners
            this.setupPassiveListeners();
        }

        optimizeAnimations() {
            // Reduce motion for users who prefer it
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            
            if (prefersReducedMotion.matches) {
                document.documentElement.classList.add('reduce-motion');
            }

            prefersReducedMotion.addEventListener('change', (e) => {
                if (e.matches) {
                    document.documentElement.classList.add('reduce-motion');
                } else {
                    document.documentElement.classList.remove('reduce-motion');
                }
            });
        }

        setupPassiveListeners() {
            // Convert scroll and touch listeners to passive
            const passiveOptions = { passive: true, capture: false };
            
            // Re-attach common event listeners as passive
            const events = ['touchstart', 'touchmove', 'wheel', 'scroll'];
            events.forEach(event => {
                document.addEventListener(event, () => {}, passiveOptions);
            });
        }

        // Public API
        getMetrics() {
            return this.monitor ? this.monitor.getMetrics() : {};
        }

        loadScript(src, options) {
            return ScriptLoader.loadScript(src, options);
        }

        loadScripts(scripts) {
            return ScriptLoader.loadScripts(scripts);
        }
    }

    // Export to global scope
    window.OpenLifeOSPerformance = new PerformanceOptimizer();

    // Also export individual classes for advanced usage
    window.OpenLifeOSPerformance.LazyImageLoader = LazyImageLoader;
    window.OpenLifeOSPerformance.ResourceHints = ResourceHints;
    window.OpenLifeOSPerformance.PerformanceMonitor = PerformanceMonitor;
    window.OpenLifeOSPerformance.ScriptLoader = ScriptLoader;
    window.OpenLifeOSPerformance.CSSOptimizer = CSSOptimizer;

})();