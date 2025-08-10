/**
 * OpenLifeOS Ultimate - Real-time Data Streaming & Simulation
 * AugHacks MIT 2025
 */

class OpenLifeOSDataStream {
    constructor() {
        this.biometrics = {
            heartRate: 72,
            heartRateVariability: 45,
            respiratoryRate: 16,
            skinTemperature: 98.6,
            bloodOxygen: 98,
            bloodPressure: { systolic: 120, diastolic: 80 },
            galvanicSkinResponse: 0.5,
            brainWaves: {
                alpha: 0.7,
                beta: 0.5,
                theta: 0.3,
                delta: 0.1,
                gamma: 0.2
            }
        };
        
        this.environmental = {
            temperature: 72,
            humidity: 45,
            lightLevel: 500,
            noiseLevel: 45,
            airQuality: 95,
            location: { lat: 42.3601, lng: -71.0893 }, // MIT location
            weather: 'partly_cloudy'
        };
        
        this.digital = {
            screenTime: 0,
            appUsage: {},
            keyboardActivity: 0,
            mouseMovement: 0,
            notifications: 0,
            focusScore: 0.75,
            productivity: 0.80
        };
        
        this.emotional = {
            valence: 0.6,
            arousal: 0.5,
            dominance: 0.7,
            mood: 'focused',
            stress: 0.3,
            energy: 0.75
        };
        
        this.patterns = [];
        this.predictions = [];
        this.memories = [];
        
        this.startStreaming();
    }
    
    startStreaming() {
        // Biometric streaming at 60Hz
        setInterval(() => this.streamBiometrics(), 16);
        
        // Environmental updates every second
        setInterval(() => this.updateEnvironmental(), 1000);
        
        // Digital activity updates
        setInterval(() => this.updateDigitalActivity(), 500);
        
        // Pattern detection every 5 seconds
        setInterval(() => this.detectPatterns(), 5000);
        
        // Predictions every 10 seconds
        setInterval(() => this.generatePredictions(), 10000);
        
        // Memory consolidation every 30 seconds
        setInterval(() => this.consolidateMemories(), 30000);
    }
    
    streamBiometrics() {
        // Simulate realistic biometric variations
        const time = Date.now() / 1000;
        
        // Heart rate with natural variability
        const baseHR = 72;
        const hrVariation = Math.sin(time * 0.1) * 5 + Math.random() * 2 - 1;
        this.biometrics.heartRate = Math.round(baseHR + hrVariation);
        
        // HRV fluctuations
        this.biometrics.heartRateVariability = 45 + Math.sin(time * 0.05) * 10 + Math.random() * 5;
        
        // Respiratory rate (slower variation)
        this.biometrics.respiratoryRate = 16 + Math.sin(time * 0.03) * 2;
        
        // Brain waves (different frequencies)
        this.biometrics.brainWaves.alpha = 0.7 + Math.sin(time * 0.2) * 0.2;
        this.biometrics.brainWaves.beta = 0.5 + Math.sin(time * 0.3) * 0.3;
        this.biometrics.brainWaves.theta = 0.3 + Math.sin(time * 0.1) * 0.2;
        this.biometrics.brainWaves.delta = 0.1 + Math.sin(time * 0.05) * 0.05;
        this.biometrics.brainWaves.gamma = 0.2 + Math.sin(time * 0.4) * 0.1;
        
        // Emit biometric event
        this.emit('biometrics', this.biometrics);
    }
    
    updateEnvironmental() {
        // Simulate environmental changes
        const hour = new Date().getHours();
        
        // Light level based on time of day
        if (hour >= 6 && hour <= 18) {
            this.environmental.lightLevel = 500 + Math.random() * 200;
        } else {
            this.environmental.lightLevel = 50 + Math.random() * 50;
        }
        
        // Temperature variations
        this.environmental.temperature = 72 + Math.sin(Date.now() / 10000) * 3;
        
        // Noise level variations
        this.environmental.noiseLevel = 40 + Math.random() * 20;
        
        this.emit('environmental', this.environmental);
    }
    
    updateDigitalActivity() {
        // Simulate digital activity
        this.digital.screenTime += 0.5;
        this.digital.keyboardActivity = Math.random() * 200;
        this.digital.mouseMovement = Math.random() * 500;
        this.digital.notifications = Math.floor(Math.random() * 3);
        
        // Focus score based on activity
        const activityLevel = (this.digital.keyboardActivity + this.digital.mouseMovement) / 700;
        this.digital.focusScore = Math.min(1, activityLevel * 0.8 + Math.random() * 0.2);
        
        this.emit('digital', this.digital);
    }
    
    detectPatterns() {
        const patterns = [];
        
        // Stress pattern detection
        if (this.biometrics.heartRate > 85 && this.biometrics.heartRateVariability < 40) {
            patterns.push({
                type: 'stress_detected',
                confidence: 0.85,
                description: 'Elevated stress indicators detected',
                timestamp: Date.now()
            });
        }
        
        // Flow state detection
        if (this.digital.focusScore > 0.8 && this.emotional.stress < 0.3) {
            patterns.push({
                type: 'flow_state',
                confidence: 0.92,
                description: 'Deep focus state achieved',
                timestamp: Date.now()
            });
        }
        
        // Fatigue detection
        if (this.emotional.energy < 0.3 && this.digital.screenTime > 240) {
            patterns.push({
                type: 'fatigue',
                confidence: 0.78,
                description: 'Energy depletion detected',
                timestamp: Date.now()
            });
        }
        
        // Creativity window
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 11 && this.biometrics.brainWaves.alpha > 0.7) {
            patterns.push({
                type: 'creative_peak',
                confidence: 0.88,
                description: 'Optimal creative window active',
                timestamp: Date.now()
            });
        }
        
        this.patterns = patterns;
        this.emit('patterns', patterns);
    }
    
    generatePredictions() {
        const predictions = [];
        
        // Stress prediction
        const stressTrend = this.analyzeStressTrend();
        if (stressTrend.rising) {
            predictions.push({
                type: 'stress_peak',
                timeframe: '30 minutes',
                probability: stressTrend.probability,
                recommendation: 'Consider a brief meditation or walk'
            });
        }
        
        // Energy prediction
        const energyForecast = this.forecastEnergy();
        predictions.push({
            type: 'energy_level',
            timeframe: '2 hours',
            predicted: energyForecast,
            optimal_activities: this.getOptimalActivities(energyForecast)
        });
        
        // Focus window prediction
        const focusWindow = this.predictFocusWindow();
        predictions.push({
            type: 'focus_window',
            start: focusWindow.start,
            duration: focusWindow.duration,
            quality: focusWindow.quality
        });
        
        // Wellness trajectory
        const wellnessScore = this.calculateWellnessTrajectory();
        predictions.push({
            type: 'wellness',
            trend: wellnessScore.trend,
            change: wellnessScore.change,
            factors: wellnessScore.factors
        });
        
        this.predictions = predictions;
        this.emit('predictions', predictions);
    }
    
    consolidateMemories() {
        // Create memory nodes from significant events
        if (this.patterns.length > 0) {
            const memory = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                patterns: [...this.patterns],
                biometrics: { ...this.biometrics },
                emotional: { ...this.emotional },
                significance: this.calculateSignificance()
            };
            
            this.memories.push(memory);
            
            // Keep memory limited
            if (this.memories.length > 100) {
                this.memories.shift();
            }
            
            this.emit('memory', memory);
        }
    }
    
    // Analysis functions
    analyzeStressTrend() {
        const rising = this.emotional.stress > 0.5;
        const probability = Math.min(0.95, this.emotional.stress + 0.2);
        return { rising, probability };
    }
    
    forecastEnergy() {
        const hour = new Date().getHours();
        const circadianFactor = Math.sin((hour - 6) * Math.PI / 12);
        return Math.max(0.2, Math.min(1, this.emotional.energy + circadianFactor * 0.2));
    }
    
    predictFocusWindow() {
        const now = new Date();
        const start = new Date(now.getTime() + 15 * 60000); // 15 minutes from now
        const duration = 45 + Math.random() * 30; // 45-75 minutes
        const quality = this.digital.focusScore * 0.7 + Math.random() * 0.3;
        return { start, duration, quality };
    }
    
    calculateWellnessTrajectory() {
        const factors = [];
        let score = 0.7;
        
        if (this.emotional.stress < 0.4) {
            score += 0.1;
            factors.push('Low stress');
        }
        
        if (this.emotional.energy > 0.6) {
            score += 0.1;
            factors.push('Good energy');
        }
        
        if (this.biometrics.heartRateVariability > 50) {
            score += 0.05;
            factors.push('High HRV');
        }
        
        const trend = score > 0.75 ? 'improving' : 'stable';
        const change = `+${Math.round((score - 0.7) * 100)}%`;
        
        return { trend, change, factors };
    }
    
    calculateSignificance() {
        // Calculate memory significance score
        let significance = 0.5;
        
        if (this.patterns.some(p => p.type === 'flow_state')) {
            significance += 0.3;
        }
        
        if (this.emotional.stress > 0.7 || this.emotional.stress < 0.2) {
            significance += 0.2;
        }
        
        return Math.min(1, significance);
    }
    
    getOptimalActivities(energyLevel) {
        if (energyLevel > 0.7) {
            return ['Deep work', 'Creative tasks', 'Problem solving'];
        } else if (energyLevel > 0.4) {
            return ['Meetings', 'Email', 'Planning'];
        } else {
            return ['Rest', 'Light reading', 'Meditation'];
        }
    }
    
    // Event emitter
    emit(event, data) {
        window.dispatchEvent(new CustomEvent(`lifeos-${event}`, { detail: data }));
    }
    
    // Get current state
    getState() {
        return {
            biometrics: this.biometrics,
            environmental: this.environmental,
            digital: this.digital,
            emotional: this.emotional,
            patterns: this.patterns,
            predictions: this.predictions,
            memories: this.memories
        };
    }
}

// Singleton instance
const openLifeOSData = new LifeOSDataStream();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LifeOSDataStream;
}