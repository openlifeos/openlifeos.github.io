# API Documentation

## Core Modules

### DigitalHuman

The main consciousness engine that orchestrates all subsystems.

#### Constructor
```javascript
new DigitalHuman(config)
```

**Parameters:**
- `config` (Object): Configuration object
  - `name` (String): Name of the digital human (default: 'Digital Human')
  - `personalityConfig` (Object): Personality trait values
  - `memoryConfig` (Object): Memory system configuration
  - `emotionsConfig` (Object): Emotion system configuration

**Example:**
```javascript
const human = new DigitalHuman({
    name: 'Nova',
    personalityConfig: {
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.6,
        agreeableness: 0.75,
        neuroticism: 0.3
    }
});
```

#### Methods

##### interact(input)
Process user input and generate response.

**Parameters:**
- `input` (String): User's message

**Returns:**
- `Promise<String>`: Generated response

**Example:**
```javascript
const response = await human.interact("Hello, how are you?");
```

##### getState()
Get current state of the digital human.

**Returns:**
- `Object`: Current state including emotions, personality, memory stats

##### destroy()
Clean up resources and stop background processes.

---

### Memory

9-layer memory architecture for storing and retrieving information.

#### Constructor
```javascript
new Memory(config)
```

**Parameters:**
- `config` (Object): Configuration
  - `consolidationInterval` (Number): MS between consolidations (default: 5000)
  - `maxShortTerm` (Number): Max short-term memories (default: 20)
  - `maxWorkingMemory` (Number): Working memory capacity (default: 7)
  - `decayRate` (Number): Memory decay rate (default: 0.95)

#### Methods

##### store(memory)
Store a memory in the appropriate layer.

**Parameters:**
- `memory` (Object): Memory to store
  - `type` (String): 'sensory', 'working', 'episodic', 'semantic', 'procedural', 'emotional'
  - `content` (String): Memory content
  - `importance` (Number): 0-1 importance score
  - Additional type-specific fields

**Returns:**
- `Object`: Enriched memory with ID and metadata

**Example:**
```javascript
const memory = memory.store({
    type: 'episodic',
    content: 'User mentioned they like music',
    importance: 0.7,
    emotion: { joy: 60, surprise: 20 }
});
```

##### recall(cues)
Retrieve memories based on cues.

**Parameters:**
- `cues` (String|Array): Search cues

**Returns:**
- `Array`: Matching memories sorted by relevance

##### getStatistics()
Get memory system statistics.

**Returns:**
- `Object`: Statistics including layer counts, consolidations, recalls

---

### Personality

Big Five personality trait system.

#### Constructor
```javascript
new Personality(config)
```

**Parameters:**
- `config` (Object): Initial trait values
  - `openness` (Number): 0-1 (default: random 0.5-1)
  - `conscientiousness` (Number): 0-1 (default: random 0.5-1)
  - `extraversion` (Number): 0-1 (default: random 0.5-1)
  - `agreeableness` (Number): 0-1 (default: random 0.5-1)
  - `neuroticism` (Number): 0-1 (default: random 0-0.3)

#### Methods

##### getTraits()
Get current personality traits.

**Returns:**
- `Object`: Current OCEAN trait values

##### getResponseModifier()
Get modifiers for response generation.

**Returns:**
- `Object`: Response modification parameters

##### processExperience(experience)
Process an experience that may affect personality.

**Parameters:**
- `experience` (Object): Experience details
  - `type` (String): Experience type
  - `impact` (Number): Impact strength (0-1)

##### getProfile()
Get comprehensive personality profile.

**Returns:**
- `Object`: Profile including type, strengths, challenges

---

### Emotions

Complex emotional processing system.

#### Constructor
```javascript
new Emotions(config)
```

**Parameters:**
- `config` (Object): Configuration
  - `volatility` (Number): Emotional volatility (default: 0.3)
  - `baseline` (String): Baseline emotional state (default: 'calm')
  - `sensitivity` (Number): Input sensitivity (default: 0.5)

#### Methods

##### getState()
Get current emotional state.

**Returns:**
- `Object`: Current emotions, mood, and metrics

##### updateFromInput(analysis)
Update emotions based on input analysis.

**Parameters:**
- `analysis` (Object): Input analysis results

##### express(emotion, intensity)
Express a specific emotion.

**Parameters:**
- `emotion` (String): Emotion to express
- `intensity` (Number): Expression intensity (0-100)

##### trigger(emotion, intensity)
Trigger an emotional state.

---

## Plugin System

### ModuleRegistry

Central registry for managing modules and plugins.

#### Constructor
```javascript
new ModuleRegistry()
```

#### Methods

##### register(name, module, options)
Register a module or plugin.

**Parameters:**
- `name` (String): Module name
- `module` (Object): Module instance
- `options` (Object): Registration options
  - `version` (String): Version
  - `dependencies` (Array): Required modules
  - `enabled` (Boolean): Enable on registration

**Example:**
```javascript
registry.register('MyPlugin', new MyPlugin(), {
    version: '1.0.0',
    dependencies: ['DigitalHuman']
});
```

##### get(name)
Get a registered module.

**Parameters:**
- `name` (String): Module name

**Returns:**
- `Object`: Module instance

##### executeHook(hookName, ...args)
Execute a hook across all registered handlers.

**Parameters:**
- `hookName` (String): Hook name
- `args` (Any): Arguments to pass to handlers

**Returns:**
- `Promise<Array>`: Results from all handlers

##### list()
List all registered modules.

**Returns:**
- `Array`: Module information

---

### Plugin Base Class

Base class for creating plugins.

#### Constructor
```javascript
class MyPlugin extends Plugin {
    constructor(config) {
        super('MyPlugin', config);
    }
}
```

#### Lifecycle Methods

##### onInit()
Called when plugin is registered.

##### onCleanup()
Called when plugin is unregistered.

#### Available Hooks

- `beforeInteraction`: Before processing user input
- `afterInteraction`: After generating response
- `onMemoryStore`: When storing memory
- `onEmotionChange`: When emotions change
- `onDreamState`: During dream cycles
- `onKnowledgeUpdate`: When knowledge updates

---

## Biometric System

### BiometricSystem

Real-time vital signs simulation.

#### Constructor
```javascript
new BiometricSystem()
```

#### Methods

##### getVitalsSnapshot()
Get current vital signs.

**Returns:**
- `Object`: Current vitals including heart rate, blood pressure, temperature

##### getBrainwaveData()
Get current brainwave activity.

**Returns:**
- `Object`: Brainwave frequencies and amplitudes

##### getHealthMetrics()
Get overall health metrics.

**Returns:**
- `Object`: Health scores and indicators

##### simulateExercise()
Trigger exercise simulation.

##### simulateStress()
Trigger stress response.

##### simulateRest()
Trigger rest state.

---

## Voice Interface

### VoiceInterface

Multi-modal voice input/output system.

#### Constructor
```javascript
new VoiceInterface(digitalHuman, config)
```

**Parameters:**
- `digitalHuman` (Object): Digital human instance
- `config` (Object): Configuration
  - `mode` (String): 'openai-realtime', 'whisper-local', 'web-speech'
  - `openaiApiKey` (String): OpenAI API key
  - `language` (String): Language code (default: 'en')

#### Methods

##### initialize()
Initialize voice interface.

**Returns:**
- `Promise<void>`

##### startRecording()
Start voice recording.

##### stopRecording()
Stop voice recording.

##### speak(text)
Convert text to speech.

**Parameters:**
- `text` (String): Text to speak

---

## Events

### DigitalHuman Events

- `initialized`: System initialized
- `tick`: Lifecycle tick
- `emotionChange`: Emotion state changed
- `memoryConsolidation`: Memory consolidated
- `spontaneousThought`: Spontaneous thought generated
- `interactionStart`: Interaction started
- `interactionEnd`: Interaction completed
- `dreamStateEntered`: Entered dream state
- `dreamStateExited`: Exited dream state
- `knowledgeUpdate`: Knowledge updated
- `destroyed`: System destroyed

### Memory Events

- `memoryStored`: Memory stored
- `consolidation`: Memory consolidation occurred
- `recall`: Memory recalled
- `forgotten`: Memory forgotten

### Emotion Events

- `stateChange`: Emotional state changed
- `regulation`: Emotional regulation applied
- `expression`: Emotion expressed

### Module Registry Events

- `moduleRegistered`: Module registered
- `moduleUnregistered`: Module unregistered
- `moduleStateChanged`: Module enabled/disabled

---

## Error Handling

All methods that can fail will throw errors with descriptive messages:

```javascript
try {
    const module = registry.get('NonExistent');
} catch (error) {
    console.error('Module not found:', error.message);
}
```

## Best Practices

1. **Always cleanup**: Call `destroy()` methods when done
2. **Handle async operations**: Use async/await or promises
3. **Subscribe to events**: Use event listeners for real-time updates
4. **Configure appropriately**: Adjust configurations for your use case
5. **Test thoroughly**: Use the test suite to verify functionality

## Examples

See the `/examples` directory for complete working examples:
- Basic interaction
- Memory management
- Emotional responses
- Plugin development
- Biometric monitoring
- Voice integration