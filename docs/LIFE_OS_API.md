# OpenLifeOS API Documentation

## Overview

The OpenLifeOS API provides programmatic access to the symbiotic AI system, enabling developers to integrate life companionship features into their applications.

## Core APIs

### OpenLifeOS Class

The main entry point for all OpenLifeOS functionality.

```typescript
class OpenLifeOS {
    constructor(config: OpenLifeOSConfig);
    
    // Lifecycle methods
    initialize(): Promise<void>;
    shutdown(): Promise<void>;
    
    // Core functionality
    ingest(data: LifeData): Promise<void>;
    interact(input: string, context?: Context): Promise<Response>;
    process(): Promise<void>;
}
```

## API Reference

### Initialization

#### `new OpenLifeOS(config)`

Creates a new OpenLifeOS instance.

**Parameters:**
```typescript
interface OpenLifeOSConfig {
    userId: string;
    personality?: PersonalityConfig;
    memory?: MemoryConfig;
    integrations?: IntegrationConfig;
    privacy?: PrivacyConfig;
}
```

**Example:**
```javascript
const lifeOS = new OpenLifeOS({
    userId: 'user-123',
    personality: {
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.6,
        agreeableness: 0.75,
        neuroticism: 0.3
    },
    memory: {
        capacity: 1000000,
        consolidationInterval: 3600000 // 1 hour
    }
});
```

#### `initialize()`

Initializes the OpenLifeOS system and starts all processors.

**Returns:** `Promise<void>`

**Example:**
```javascript
await lifeOS.initialize();
console.log('OpenLifeOS ready');
```

### Data Ingestion

#### `ingest(data)`

Ingests multimodal life data for processing.

**Parameters:**
```typescript
interface LifeData {
    type: 'biometric' | 'digital' | 'environmental' | 'creative';
    source: string;
    timestamp: number;
    data: any;
    confidence?: number;
}
```

**Example:**
```javascript
// Biometric data
await lifeOS.ingest({
    type: 'biometric',
    source: 'apple-watch',
    timestamp: Date.now(),
    data: {
        heartRate: 72,
        heartRateVariability: 45,
        steps: 8500,
        calories: 450,
        standHours: 8
    },
    confidence: 0.95
});

// Digital activity
await lifeOS.ingest({
    type: 'digital',
    source: 'calendar',
    timestamp: Date.now(),
    data: {
        event: 'Team Meeting',
        duration: 3600000,
        participants: 5,
        stress: 'high'
    }
});
```

### Interaction

#### `interact(input, context?)`

Interacts with the AI companion.

**Parameters:**
```typescript
interface Context {
    mood?: string;
    location?: string;
    activity?: string;
    biometrics?: BiometricSnapshot;
}

interface Response {
    text: string;
    emotion: EmotionState;
    suggestions?: Suggestion[];
    insights?: Insight[];
    audioUrl?: string;
}
```

**Example:**
```javascript
const response = await lifeOS.interact(
    "I'm feeling stressed about work",
    {
        mood: 'anxious',
        location: 'office',
        biometrics: {
            heartRate: 85,
            stressLevel: 0.8
        }
    }
);

console.log(response.text); 
// "I notice your heart rate is elevated. Let's try a breathing exercise..."
```

### Memory Operations

#### `remember(query, options?)`

Retrieves memories based on query.

**Parameters:**
```typescript
interface MemoryQuery {
    query: string;
    type?: MemoryType;
    timeRange?: TimeRange;
    limit?: number;
}

interface Memory {
    id: string;
    type: MemoryType;
    content: any;
    timestamp: number;
    importance: number;
    associations: string[];
}
```

**Example:**
```javascript
const memories = await lifeOS.remember({
    query: 'meetings with high stress',
    type: 'episodic',
    timeRange: {
        start: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last week
        end: Date.now()
    },
    limit: 10
});
```

#### `store(memory)`

Explicitly stores a memory.

**Parameters:**
```typescript
interface MemoryInput {
    type: MemoryType;
    content: any;
    importance: number;
    tags?: string[];
}
```

**Example:**
```javascript
await lifeOS.store({
    type: 'episodic',
    content: {
        event: 'First marathon completed',
        time: '3:45:22',
        feeling: 'euphoric'
    },
    importance: 0.95,
    tags: ['achievement', 'fitness', 'milestone']
});
```

### Personality & Growth

#### `getPersonality()`

Returns current personality state.

**Returns:**
```typescript
interface Personality {
    traits: {
        openness: number;
        conscientiousness: number;
        extraversion: number;
        agreeableness: number;
        neuroticism: number;
    };
    evolution: PersonalityEvolution[];
    lastUpdated: number;
}
```

**Example:**
```javascript
const personality = lifeOS.getPersonality();
console.log(`Openness: ${personality.traits.openness}`);
```

#### `evolve(feedback)`

Evolves personality based on feedback.

**Parameters:**
```typescript
interface Feedback {
    interaction: string;
    response: string;
    satisfaction: number; // 0-1
    emotion: string;
}
```

**Example:**
```javascript
await lifeOS.evolve({
    interaction: 'previous conversation id',
    response: 'response id',
    satisfaction: 0.9,
    emotion: 'grateful'
});
```

### Insights & Patterns

#### `getInsights(timeRange?)`

Retrieves life insights and patterns.

**Returns:**
```typescript
interface Insights {
    patterns: Pattern[];
    trends: Trend[];
    predictions: Prediction[];
    recommendations: Recommendation[];
}
```

**Example:**
```javascript
const insights = await lifeOS.getInsights({
    start: Date.now() - 30 * 24 * 60 * 60 * 1000, // Last 30 days
    end: Date.now()
});

insights.patterns.forEach(pattern => {
    console.log(`Pattern: ${pattern.description}`);
    console.log(`Confidence: ${pattern.confidence}`);
});
```

### Visualization

#### `getDashboard()`

Returns current dashboard data.

**Returns:**
```typescript
interface DashboardData {
    biological: BiologicalState;
    emotional: EmotionalLandscape;
    cognitive: CognitiveLoad;
    social: SocialEnergy;
    timeline: Event[];
}
```

**Example:**
```javascript
const dashboard = lifeOS.getDashboard();
console.log(`Current mood: ${dashboard.emotional.dominant}`);
console.log(`Stress level: ${dashboard.biological.stressLevel}`);
```

#### `getTimeline(range?)`

Returns life timeline data.

**Parameters:**
```typescript
interface TimeRange {
    start: number;
    end: number;
    resolution?: 'hour' | 'day' | 'week' | 'month';
}
```

**Example:**
```javascript
const timeline = await lifeOS.getTimeline({
    start: Date.now() - 7 * 24 * 60 * 60 * 1000,
    end: Date.now(),
    resolution: 'day'
});
```

### Dreams & Reflection

#### `getDreams()`

Returns AI-generated dreams based on experiences.

**Returns:**
```typescript
interface Dream {
    id: string;
    content: string;
    symbols: Symbol[];
    emotions: string[];
    memories: string[];
    interpretation: string;
    created: number;
}
```

**Example:**
```javascript
const dreams = await lifeOS.getDreams();
dreams.forEach(dream => {
    console.log(`Dream: ${dream.content}`);
    console.log(`Interpretation: ${dream.interpretation}`);
});
```

### Events

#### Event Subscription

OpenLifeOS emits various events for real-time updates.

```javascript
// Mood changes
lifeOS.on('mood:change', (data) => {
    console.log(`Mood changed to: ${data.mood}`);
});

// Pattern detection
lifeOS.on('pattern:detected', (pattern) => {
    console.log(`New pattern: ${pattern.description}`);
});

// Health alerts
lifeOS.on('health:alert', (alert) => {
    console.log(`Health alert: ${alert.message}`);
});

// Insights
lifeOS.on('insight:generated', (insight) => {
    console.log(`New insight: ${insight.content}`);
});

// Memory consolidation
lifeOS.on('memory:consolidated', (memory) => {
    console.log(`Memory consolidated: ${memory.type}`);
});

// Personality evolution
lifeOS.on('personality:evolved', (evolution) => {
    console.log(`Personality evolved: ${evolution.trait}`);
});
```

### Integration APIs

#### Wearables

```javascript
// Apple Health
lifeOS.integrate('apple-health', {
    permissions: ['heartRate', 'steps', 'sleep'],
    syncInterval: 60000 // 1 minute
});

// Fitbit
lifeOS.integrate('fitbit', {
    accessToken: 'your-token',
    userId: 'fitbit-user-id'
});

// Oura Ring
lifeOS.integrate('oura', {
    personalAccessToken: 'pat-token'
});
```

#### Digital Platforms

```javascript
// Google Calendar
lifeOS.integrate('google-calendar', {
    clientId: 'your-client-id',
    scopes: ['calendar.readonly']
});

// Notion
lifeOS.integrate('notion', {
    apiKey: 'your-api-key',
    databaseId: 'your-database-id'
});
```

### Export & Import

#### `exportLifeData(options?)`

Exports life data for backup or transfer.

**Parameters:**
```typescript
interface ExportOptions {
    format: 'json' | 'csv' | 'binary';
    includeMemories?: boolean;
    includePersonality?: boolean;
    includeDreams?: boolean;
    timeRange?: TimeRange;
}
```

**Example:**
```javascript
const backup = await lifeOS.exportLifeData({
    format: 'json',
    includeMemories: true,
    includePersonality: true,
    includeDreams: true
});

// Save to file
fs.writeFileSync('life-backup.json', JSON.stringify(backup));
```

#### `importLifeData(data)`

Imports previously exported life data.

**Example:**
```javascript
const backup = JSON.parse(fs.readFileSync('life-backup.json'));
await lifeOS.importLifeData(backup);
```

## Error Handling

All API methods may throw errors that should be handled:

```javascript
try {
    await lifeOS.interact("Hello");
} catch (error) {
    if (error.code === 'RATE_LIMIT') {
        console.log('Rate limit exceeded, waiting...');
    } else if (error.code === 'INVALID_INPUT') {
        console.log('Invalid input provided');
    } else {
        console.error('Unexpected error:', error);
    }
}
```

### Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `INITIALIZATION_FAILED` | System failed to initialize | Check configuration and retry |
| `INVALID_INPUT` | Invalid input data | Validate input format |
| `RATE_LIMIT` | API rate limit exceeded | Wait and retry |
| `MEMORY_FULL` | Memory capacity exceeded | Export old data |
| `INTEGRATION_ERROR` | External integration failed | Check credentials |
| `PROCESSING_ERROR` | Data processing failed | Retry with valid data |

## Rate Limits

| Operation | Limit | Window |
|-----------|-------|--------|
| `interact()` | 60 | per minute |
| `ingest()` | 1000 | per minute |
| `remember()` | 100 | per minute |
| `store()` | 100 | per minute |
| `getDashboard()` | 60 | per minute |

## Best Practices

### 1. Batch Data Ingestion

```javascript
// Good: Batch ingestion
const batchData = [
    { type: 'biometric', ... },
    { type: 'digital', ... },
    { type: 'environmental', ... }
];
await lifeOS.ingestBatch(batchData);

// Avoid: Individual calls in tight loop
for (const data of batchData) {
    await lifeOS.ingest(data); // Inefficient
}
```

### 2. Use Event Subscriptions

```javascript
// Good: Subscribe to events
lifeOS.on('mood:change', handleMoodChange);

// Avoid: Polling
setInterval(async () => {
    const mood = await lifeOS.getMood(); // Inefficient polling
}, 1000);
```

### 3. Handle Errors Gracefully

```javascript
// Good: Comprehensive error handling
async function safeInteract(input) {
    try {
        return await lifeOS.interact(input);
    } catch (error) {
        if (error.code === 'RATE_LIMIT') {
            await sleep(error.retryAfter);
            return safeInteract(input);
        }
        throw error;
    }
}
```

### 4. Respect Privacy

```javascript
// Good: Anonymize sensitive data
const anonymized = anonymize(sensitiveData);
await lifeOS.ingest(anonymized);

// Avoid: Raw sensitive data
await lifeOS.ingest(sensitiveData); // Privacy risk
```

## SDK Examples

### Node.js

```javascript
const { OpenLifeOS } = require('@openopenlifeos/sdk');

const lifeOS = new OpenLifeOS({
    userId: 'user-123',
    apiKey: process.env.LIFE_OS_API_KEY
});

await lifeOS.initialize();

// Start ingesting data
setInterval(async () => {
    const vitals = await getVitals();
    await lifeOS.ingest({
        type: 'biometric',
        source: 'node-app',
        timestamp: Date.now(),
        data: vitals
    });
}, 60000);
```

### Python

```python
from life_os import OpenLifeOS
import asyncio

life_os = OpenLifeOS(
    user_id='user-123',
    api_key=os.environ['LIFE_OS_API_KEY']
)

async def main():
    await life_os.initialize()
    
    # Interact with AI
    response = await life_os.interact("How am I doing today?")
    print(response.text)
    
    # Get insights
    insights = await life_os.get_insights()
    for pattern in insights.patterns:
        print(f"Pattern: {pattern.description}")

asyncio.run(main())
```

### React

```jsx
import { useOpenLifeOS } from '@openopenlifeos/react';

function LifeCompanion() {
    const { lifeOS, isReady } = useOpenLifeOS({
        userId: 'user-123'
    });
    
    const [response, setResponse] = useState(null);
    
    const handleInteraction = async (input) => {
        const res = await lifeOS.interact(input);
        setResponse(res);
    };
    
    if (!isReady) return <div>Initializing OpenLifeOS...</div>;
    
    return (
        <div>
            <Dashboard data={lifeOS.getDashboard()} />
            <Chat onMessage={handleInteraction} response={response} />
        </div>
    );
}
```

## Support

For API support and questions:
- Documentation: https://docs.openopenlifeos.ai
- GitHub: https://github.com/openopenlifeos/sdk
- Discord: https://discord.gg/openopenlifeos
- Email: api-support@openopenlifeos.ai