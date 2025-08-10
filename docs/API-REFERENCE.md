# OpenLifeOS API Reference

## Overview

OpenLifeOS provides a comprehensive API for developers to build plugins, integrate devices, and create custom experiences. This document covers the core APIs, plugin APIs, and REST endpoints.

## Table of Contents

1. [Core APIs](#core-apis)
2. [Plugin APIs](#plugin-apis)
3. [REST API](#rest-api)
4. [WebSocket API](#websocket-api)
5. [Event Types](#event-types)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

## Core APIs

### OpenLifeOS Instance

```typescript
interface OpenLifeOS {
  // Initialization
  initialize(config: Config): Promise<void>;
  
  // State management
  getState(): State;
  setState(state: Partial<State>): void;
  
  // Event handling
  on(event: string, handler: EventHandler): Subscription;
  emit(event: string, data: any): void;
  
  // Data ingestion
  ingest(data: LifeData): Promise<void>;
  
  // Interaction
  interact(message: string, context?: Context): Promise<Response>;
  
  // Plugin management
  loadPlugin(plugin: Plugin): Promise<void>;
  unloadPlugin(pluginId: string): Promise<void>;
}
```

### Configuration

```typescript
interface Config {
  // User settings
  userId: string;
  name?: string;
  timezone?: string;
  locale?: string;
  
  // Personality configuration
  personality?: {
    openness: number;        // 0-1
    conscientiousness: number; // 0-1
    extraversion: number;    // 0-1
    agreeableness: number;   // 0-1
    neuroticism: number;     // 0-1
  };
  
  // Privacy settings
  privacy?: {
    localOnly?: boolean;
    encryption?: boolean;
    anonymization?: boolean;
    dataRetention?: number; // days
  };
  
  // Performance settings
  performance?: {
    maxCPU?: number;        // percentage
    maxMemory?: number;     // MB
    cacheSize?: number;     // MB
    samplingRate?: number;  // Hz
  };
  
  // Integration settings
  integrations?: {
    openai?: { apiKey: string };
    anthropic?: { apiKey: string };
    elevenlabs?: { apiKey: string };
    // ... other integrations
  };
}
```

## Plugin APIs

### Plugin Interface

```typescript
interface Plugin {
  // Metadata
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  permissions: Permission[];
  
  // Lifecycle methods
  onInstall(context: PluginContext): Promise<void>;
  onEnable(context: PluginContext): Promise<void>;
  onDisable(context: PluginContext): Promise<void>;
  onUninstall(context: PluginContext): Promise<void>;
  
  // Event handling
  onEvent(event: LifeEvent, context: PluginContext): Promise<void>;
  
  // Optional: API endpoints
  endpoints?: Endpoint[];
  
  // Optional: UI components
  components?: Component[];
  
  // Optional: Background tasks
  tasks?: Task[];
}
```

### Plugin Context

```typescript
interface PluginContext {
  // Storage
  storage: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
  };
  
  // Events
  events: {
    emit(event: string, data: any): void;
    on(event: string, handler: EventHandler): Subscription;
  };
  
  // Data access
  data: {
    getBiometric(type: string): Promise<BiometricData>;
    getMemory(query: Query): Promise<Memory[]>;
    getPersonality(): Promise<Personality>;
  };
  
  // UI
  ui: {
    showNotification(notification: Notification): void;
    showDialog(dialog: Dialog): Promise<any>;
    registerComponent(component: Component): void;
  };
  
  // Utilities
  utils: {
    log(level: LogLevel, message: string): void;
    http(request: HttpRequest): Promise<HttpResponse>;
    schedule(task: Task): Promise<TaskHandle>;
  };
}
```

### Plugin Development Example

```javascript
// my-wellness-plugin.js
export default class WellnessPlugin {
  constructor() {
    this.id = 'wellness-plugin';
    this.name = 'Wellness Tracker';
    this.version = '1.0.0';
    this.permissions = ['biometric.read', 'notifications.send'];
  }
  
  async onInstall(context) {
    // Initialize plugin storage
    await context.storage.set('installDate', Date.now());
    context.utils.log('info', 'Wellness Plugin installed');
  }
  
  async onEvent(event, context) {
    if (event.type === 'biometric.heartRate') {
      const hr = event.data.value;
      
      // Check for abnormal heart rate
      if (hr > 100 && event.data.activity === 'resting') {
        await context.ui.showNotification({
          title: 'High Resting Heart Rate',
          message: `Your heart rate is ${hr} BPM while resting`,
          actions: [
            { label: 'Breathe', action: 'wellness.startBreathing' },
            { label: 'Dismiss', action: 'dismiss' }
          ]
        });
      }
      
      // Store heart rate data
      const history = await context.storage.get('heartRateHistory') || [];
      history.push({ timestamp: Date.now(), value: hr });
      await context.storage.set('heartRateHistory', history);
    }
  }
  
  async getStats(context) {
    const history = await context.storage.get('heartRateHistory') || [];
    return {
      average: history.reduce((sum, h) => sum + h.value, 0) / history.length,
      max: Math.max(...history.map(h => h.value)),
      min: Math.min(...history.map(h => h.value))
    };
  }
}
```

## REST API

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
```http
Authorization: Bearer <token>
```

### Endpoints

#### System Status
```http
GET /status
```

Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": 86400,
  "metrics": {
    "cpu": 5.2,
    "memory": 145,
    "events": 12453
  }
}
```

#### User Profile
```http
GET /profile
PUT /profile
```

Request Body (PUT):
```json
{
  "name": "John Doe",
  "timezone": "America/New_York",
  "personality": {
    "openness": 0.8,
    "conscientiousness": 0.7,
    "extraversion": 0.6,
    "agreeableness": 0.9,
    "neuroticism": 0.3
  }
}
```

#### Data Ingestion
```http
POST /ingest
```

Request Body:
```json
{
  "type": "biometric",
  "source": "apple_watch",
  "data": {
    "heartRate": 72,
    "heartRateVariability": 45,
    "steps": 5432,
    "calories": 234
  }
}
```

#### Interactions
```http
POST /interact
```

Request Body:
```json
{
  "message": "How am I doing today?",
  "context": {
    "mood": "curious",
    "location": "home"
  }
}
```

Response:
```json
{
  "response": "You're doing well! Your stress levels are 30% lower than yesterday...",
  "emotion": "supportive",
  "suggestions": [
    "Take a 5-minute walk",
    "Hydrate"
  ]
}
```

#### Memories
```http
GET /memories?type=episodic&limit=10
POST /memories
DELETE /memories/:id
```

#### Plugins
```http
GET /plugins
POST /plugins/install
DELETE /plugins/:id
GET /plugins/:id/settings
PUT /plugins/:id/settings
```

## WebSocket API

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'your-token'
  }));
});
```

### Real-time Events
```javascript
ws.on('message', (data) => {
  const event = JSON.parse(data);
  
  switch(event.type) {
    case 'biometric.update':
      updateBiometricDisplay(event.data);
      break;
    
    case 'ai.response':
      showAIResponse(event.data);
      break;
    
    case 'pattern.detected':
      handlePattern(event.data);
      break;
  }
});
```

### Sending Data
```javascript
ws.send(JSON.stringify({
  type: 'biometric.heartRate',
  data: {
    value: 75,
    timestamp: Date.now()
  }
}));
```

## Event Types

### System Events
```typescript
'system.startup'
'system.shutdown'
'system.error'
'system.update'
```

### Biometric Events
```typescript
'biometric.heartRate'
'biometric.heartRateVariability'
'biometric.bloodOxygen'
'biometric.temperature'
'biometric.steps'
'biometric.sleep'
```

### Digital Activity Events
```typescript
'digital.appOpen'
'digital.appClose'
'digital.screenTime'
'digital.keyboardActivity'
'digital.notification'
```

### AI Events
```typescript
'ai.interaction'
'ai.response'
'ai.prediction'
'ai.learning'
```

### Pattern Events
```typescript
'pattern.detected'
'pattern.stress'
'pattern.flow'
'pattern.fatigue'
```

## Data Models

### BiometricData
```typescript
interface BiometricData {
  type: string;
  value: number;
  unit: string;
  timestamp: number;
  source: string;
  confidence?: number;
  metadata?: Record<string, any>;
}
```

### Memory
```typescript
interface Memory {
  id: string;
  type: 'sensory' | 'working' | 'shortTerm' | 'longTerm' | 'episodic' | 'semantic';
  content: any;
  timestamp: number;
  importance: number;
  emotionalIntensity: number;
  associations: string[];
  metadata?: Record<string, any>;
}
```

### Pattern
```typescript
interface Pattern {
  id: string;
  type: string;
  confidence: number;
  description: string;
  triggers: string[];
  frequency: number;
  lastOccurrence: number;
  recommendations?: string[];
}
```

### Prediction
```typescript
interface Prediction {
  id: string;
  type: string;
  probability: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
  confidence: number;
}
```

## Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request body is invalid",
    "details": {
      "field": "personality.openness",
      "issue": "Value must be between 0 and 1"
    }
  }
}
```

### Error Codes
```typescript
enum ErrorCode {
  // Client errors
  INVALID_REQUEST = 'INVALID_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Plugin errors
  PLUGIN_NOT_FOUND = 'PLUGIN_NOT_FOUND',
  PLUGIN_ERROR = 'PLUGIN_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED'
}
```

### Error Handling Example
```javascript
try {
  const response = await lifeOS.interact('Hello');
  console.log(response);
} catch (error) {
  if (error.code === 'RATE_LIMITED') {
    console.log(`Rate limited. Retry after ${error.retryAfter} seconds`);
  } else if (error.code === 'UNAUTHORIZED') {
    console.log('Please authenticate first');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Rate Limiting

### Default Limits
- **API Calls**: 1000 requests per hour
- **WebSocket Messages**: 100 messages per minute
- **Data Ingestion**: 10 MB per minute
- **Plugin Executions**: 1000 per hour per plugin

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits
```javascript
class RateLimitHandler {
  async makeRequest(request) {
    try {
      return await request();
    } catch (error) {
      if (error.code === 'RATE_LIMITED') {
        const retryAfter = error.retryAfter * 1000;
        await this.wait(retryAfter);
        return await this.makeRequest(request);
      }
      throw error;
    }
  }
  
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { OpenLifeOS } from '@openlifeos/sdk';

const lifeOS = new OpenLifeOS({
  apiKey: 'your-api-key',
  baseURL: 'http://localhost:3000'
});

// Initialize
await lifeOS.initialize();

// Ingest data
await lifeOS.ingest({
  type: 'biometric',
  data: { heartRate: 72 }
});

// Interact
const response = await lifeOS.interact('How am I doing?');
console.log(response.text);

// Subscribe to events
lifeOS.on('pattern.detected', (pattern) => {
  console.log('Pattern detected:', pattern);
});
```

### Python
```python
from openlifeos import OpenLifeOS

# Initialize
life_os = OpenLifeOS(api_key='your-api-key')

# Ingest data
life_os.ingest({
    'type': 'biometric',
    'data': {'heart_rate': 72}
})

# Interact
response = life_os.interact('How am I doing?')
print(response.text)

# Subscribe to events
@life_os.on('pattern.detected')
def on_pattern(pattern):
    print(f'Pattern detected: {pattern}')
```

### REST API with cURL
```bash
# Get status
curl http://localhost:3000/api/v1/status

# Ingest data
curl -X POST http://localhost:3000/api/v1/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"type":"biometric","data":{"heartRate":72}}'

# Interact
curl -X POST http://localhost:3000/api/v1/interact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"message":"How am I doing?"}'
```

## Best Practices

1. **Always handle errors gracefully**
2. **Implement exponential backoff for retries**
3. **Cache responses when appropriate**
4. **Use WebSocket for real-time data**
5. **Batch API calls when possible**
6. **Respect rate limits**
7. **Validate data before sending**
8. **Use appropriate event granularity**

---

*For more examples and detailed documentation, visit [docs.openlifeos.dev](https://docs.openlifeos.dev)*