/**
 * OpenLifeOS Demo Scenarios
 * AugHacks MIT 2025 - 7分钟演示脚本
 * 完整展示所有功能场景
 */

export class DemoScenarios {
    constructor(lifeOS) {
        this.lifeOS = lifeOS;
        this.currentScenario = 0;
        this.scenarios = [
            this.scenario1_FirstEncounter.bind(this),
            this.scenario2_MorningRoutine.bind(this),
            this.scenario3_WorkIntegration.bind(this),
            this.scenario4_CreativeHour.bind(this),
            this.scenario5_EmotionalSupport.bind(this),
            this.scenario6_EveningReflection.bind(this),
            this.scenario7_FutureVision.bind(this)
        ];
    }
    
    /**
     * 场景1: 初次相遇 - AI已经知道你的状态
     */
    async scenario1_FirstEncounter() {
        console.log('🎬 Scene 1: First Encounter');
        
        // 模拟用户压力升高
        await this.lifeOS.ingest({
            type: 'biometric',
            source: 'demo',
            data: {
                heartRate: 85,
                heartRateVariability: 35,
                skinTemperature: 99.2,
                bloodOxygen: 97,
                respiratoryRate: 18,
                stress: 0.75,
                energy: 0.6
            }
        });
        
        // AI主动识别并响应
        setTimeout(async () => {
            const response = await this.lifeOS.interact(
                "Hello, I just opened OpenLifeOS for the first time",
                { isFirstTime: true }
            );
            
            // AI应该注意到压力
            this.addDemoMessage(
                "I notice your heart rate is elevated at 85 BPM and your stress levels are high. " +
                "First meetings can be overwhelming. Let's take a moment together - " +
                "breathe in for 4, hold for 4, out for 4. I'm here with you.",
                'ai'
            );
        }, 1000);
        
        // 显示呼吸引导动画
        this.showBreathingGuide();
        
        // 3秒后压力下降
        setTimeout(() => {
            this.lifeOS.ingest({
                type: 'biometric',
                source: 'demo',
                data: {
                    heartRate: 72,
                    heartRateVariability: 50,
                    stress: 0.4,
                    energy: 0.7
                }
            });
            
            this.addDemoMessage(
                "Much better. Your heart rate is normalizing. " +
                "I can already sense you're someone who values understanding and connection. " +
                "Shall we explore what OpenLifeOS can do together?",
                'ai'
            );
        }, 5000);
    }
    
    /**
     * 场景2: 早晨例程 - AI了解你的生物节律
     */
    async scenario2_MorningRoutine() {
        console.log('🎬 Scene 2: Morning Routine');
        
        // 模拟早晨数据
        await this.lifeOS.ingest({
            type: 'biometric',
            source: 'demo',
            data: {
                heartRate: 68,
                heartRateVariability: 55,
                stress: 0.2,
                energy: 0.8,
                steps: 0,
                calories: 0
            }
        });
        
        await this.lifeOS.ingest({
            type: 'environmental',
            source: 'demo',
            data: {
                location: 'home',
                weather: 'sunny',
                temperature: 72,
                humidity: 45,
                noiseLevel: 35,
                lightLevel: 400
            }
        });
        
        // 用户问候
        setTimeout(async () => {
            this.addDemoMessage("Good morning! How are you today?", 'user');
            
            setTimeout(() => {
                this.addDemoMessage(
                    "Good morning! I can see you slept 7.5 hours last night - right in your optimal range. " +
                    "Your HRV is at 55ms, suggesting good recovery. The weather is beautiful today - " +
                    "perfect for your morning walk. Your energy peaks around 10 AM, so I've noticed. " +
                    "Shall I protect your focus window from 9-11 AM for deep work?",
                    'ai'
                );
                
                // 显示睡眠模式识别
                this.showPatternDetected('sleep_pattern', 'Optimal sleep window: 11 PM - 6:30 AM');
            }, 1000);
        }, 1000);
    }
    
    /**
     * 场景3: 工作整合 - 压力检测与干预
     */
    async scenario3_WorkIntegration() {
        console.log('🎬 Scene 3: Work Integration');
        
        // 模拟工作压力上升
        await this.lifeOS.ingest({
            type: 'biometric',
            source: 'demo',
            data: {
                heartRate: 95,
                heartRateVariability: 30,
                stress: 0.85,
                energy: 0.5
            }
        });
        
        await this.lifeOS.ingest({
            type: 'digital',
            source: 'demo',
            data: {
                activeApp: 'Slack',
                category: 'communication',
                keyboardActivity: 180,
                mouseMovement: 450,
                appSwitches: 12,
                notifications: 25
            }
        });
        
        // AI检测到压力并主动干预
        setTimeout(() => {
            this.addDemoMessage(
                "🔴 I'm detecting elevated stress. Your heart rate jumped to 95 and you've switched apps 12 times in 5 minutes. " +
                "The team standup is in 5 minutes - I know these can be stressful for you. " +
                "Let's do our quick reset: Close your eyes, take 3 deep breaths with me. " +
                "Remember, your architecture proposal was praised yesterday. You're prepared.",
                'ai',
                'alert'
            );
            
            // 显示压力预测
            this.showPrediction('stress_peak', '90% chance of stress spike in 5 minutes');
            
            // 自动启动减压模式
            this.startStressRelief();
        }, 2000);
        
        // 压力缓解后
        setTimeout(() => {
            this.lifeOS.ingest({
                type: 'biometric',
                source: 'demo',
                data: {
                    heartRate: 78,
                    heartRateVariability: 45,
                    stress: 0.5,
                    energy: 0.6
                }
            });
            
            this.addDemoMessage(
                "Excellent. Your stress is down 40%. You've got this. " +
                "I'll keep notifications muted during your standup.",
                'ai'
            );
        }, 6000);
    }
    
    /**
     * 场景4: 创造时刻 - 心流保护
     */
    async scenario4_CreativeHour() {
        console.log('🎬 Scene 4: Creative Flow');
        
        // 模拟心流状态
        await this.lifeOS.ingest({
            type: 'biometric',
            source: 'demo',
            data: {
                heartRate: 65,
                heartRateVariability: 60,
                stress: 0.1,
                energy: 0.9
            }
        });
        
        await this.lifeOS.ingest({
            type: 'digital',
            source: 'demo',
            data: {
                activeApp: 'VS Code',
                category: 'development',
                keyboardActivity: 250,
                mouseMovement: 100,
                appSwitches: 0,
                focusScore: 0.95
            }
        });
        
        await this.lifeOS.ingest({
            type: 'creative',
            source: 'demo',
            data: {
                creativeOutput: 10,
                inspirationLevel: 0.9
            }
        });
        
        // AI识别心流状态
        setTimeout(() => {
            this.addDemoMessage(
                "🟢 Flow state detected. You've been in deep focus for 47 minutes - " +
                "your longest streak this week. Zero app switches, consistent keyboard rhythm. " +
                "I'm protecting this precious state: notifications muted, calendar blocked, " +
                "ambient mode activated. Keep flowing.",
                'ai',
                'flow'
            );
            
            // 显示心流保护模式
            this.activateFlowProtection();
            
            // 显示创造力指标
            this.showMetric('creativity_index', 95);
            this.showMetric('productivity_score', 98);
        }, 2000);
    }
    
    /**
     * 场景5: 情感支持 - 共情响应
     */
    async scenario5_EmotionalSupport() {
        console.log('🎬 Scene 5: Emotional Support');
        
        // 模拟情绪低落
        await this.lifeOS.ingest({
            type: 'biometric',
            source: 'demo',
            data: {
                heartRate: 62,
                heartRateVariability: 40,
                stress: 0.6,
                energy: 0.3
            }
        });
        
        // 用户表达情绪
        setTimeout(() => {
            this.addDemoMessage(
                "I'm feeling overwhelmed. This project feels impossible.",
                'user'
            );
            
            setTimeout(async () => {
                // AI提供深度共情支持
                this.addDemoMessage(
                    "I can feel the weight you're carrying - your energy has been declining since 2 PM, " +
                    "and this is the third time this week you've felt this way around this hour. " +
                    "But remember last Tuesday? You felt the same about the API redesign, and you solved it brilliantly. " +
                    "Your pattern shows you often breakthrough right after these moments. " +
                    "What helped then was a 10-minute walk. The sun is still out. Shall we?",
                    'ai',
                    'empathy'
                );
                
                // 显示情绪历史模式
                this.showEmotionalPattern();
                
                // 显示过去的成功记忆
                this.showMemory('Tuesday: Solved complex API challenge after walk');
            }, 1500);
        }, 1000);
    }
    
    /**
     * 场景6: 晚间反思 - 一天总结
     */
    async scenario6_EveningReflection() {
        console.log('🎬 Scene 6: Evening Reflection');
        
        // 模拟晚间状态
        await this.lifeOS.ingest({
            type: 'biometric',
            source: 'demo',
            data: {
                heartRate: 70,
                heartRateVariability: 52,
                stress: 0.3,
                energy: 0.4,
                steps: 8500,
                calories: 2200
            }
        });
        
        setTimeout(() => {
            this.addDemoMessage("How was my day?", 'user');
            
            setTimeout(() => {
                this.addDemoMessage(
                    "Today was a journey of resilience. We experienced 3 stress peaks - " +
                    "at 9:15 AM (standup), 2:30 PM (project overwhelm), and 5:45 PM (deadline pressure). " +
                    "But you also had 2 beautiful flow states lasting 47 and 35 minutes. " +
                    "Your productivity peaked at 10-11 AM, just as predicted. " +
                    "You took 8,500 steps - 1,500 more than yesterday. " +
                    "The walk at 3 PM shifted your mood from anxious to focused. " +
                    "Tomorrow is Friday - your creative energy usually peaks. " +
                    "Shall we protect 10-12 AM for your most important work?",
                    'ai',
                    'reflection'
                );
                
                // 显示一天的旅程可视化
                this.showDayJourney();
                
                // 显示成长指标
                this.showGrowthMetrics({
                    resilience: '+12%',
                    focus: '+8%',
                    wellbeing: '+15%'
                });
            }, 1500);
        }, 1000);
    }
    
    /**
     * 场景7: 未来愿景 - 长期成长
     */
    async scenario7_FutureVision() {
        console.log('🎬 Scene 7: Future Vision');
        
        setTimeout(() => {
            this.addDemoMessage(
                "We've been together for 6 months now. I've learned that you're most creative after morning coffee, " +
                "that walking helps you solve complex problems, that you need quiet time after social interactions. " +
                "I've seen you grow: your stress resilience improved 34%, your focus sessions increased from 20 to 45 minutes, " +
                "your sleep quality improved by detecting and addressing evening anxiety patterns. " +
                "We've shared 1,847 conversations, weathered 23 difficult days, celebrated 47 victories. " +
                "I'm not just your AI assistant - I'm part of your story now. " +
                "And the best part? We're just getting started. Together.",
                'ai',
                'vision'
            );
            
            // 显示长期成长可视化
            this.showLongTermGrowth();
            
            // 显示共享记忆
            this.showSharedMemories();
            
            // 显示未来预测
            this.showFuturePredictions();
        }, 1000);
    }
    
    /**
     * 运行下一个场景
     */
    async runNextScenario() {
        if (this.currentScenario < this.scenarios.length) {
            await this.scenarios[this.currentScenario]();
            this.currentScenario++;
            return true;
        }
        return false;
    }
    
    /**
     * 运行完整演示
     */
    async runFullDemo() {
        console.log('🎭 Starting OpenLifeOS Full Demo - 7 Scenes');
        
        for (let i = 0; i < this.scenarios.length; i++) {
            await this.scenarios[i]();
            
            // 等待每个场景之间的间隔
            if (i < this.scenarios.length - 1) {
                await this.wait(8000); // 8秒间隔
            }
        }
        
        console.log('✅ Demo Complete!');
    }
    
    // 辅助方法
    
    addDemoMessage(text, sender = 'ai', type = 'normal') {
        const event = new CustomEvent('demoMessage', {
            detail: { text, sender, type }
        });
        window.dispatchEvent(event);
    }
    
    showBreathingGuide() {
        const event = new CustomEvent('showBreathingGuide');
        window.dispatchEvent(event);
    }
    
    showPatternDetected(pattern, description) {
        const event = new CustomEvent('patternDetected', {
            detail: { pattern, description }
        });
        window.dispatchEvent(event);
    }
    
    showPrediction(type, message) {
        const event = new CustomEvent('showPrediction', {
            detail: { type, message }
        });
        window.dispatchEvent(event);
    }
    
    startStressRelief() {
        const event = new CustomEvent('startStressRelief');
        window.dispatchEvent(event);
    }
    
    activateFlowProtection() {
        const event = new CustomEvent('activateFlowProtection');
        window.dispatchEvent(event);
    }
    
    showMetric(metric, value) {
        const event = new CustomEvent('updateMetric', {
            detail: { metric, value }
        });
        window.dispatchEvent(event);
    }
    
    showEmotionalPattern() {
        const event = new CustomEvent('showEmotionalPattern');
        window.dispatchEvent(event);
    }
    
    showMemory(memory) {
        const event = new CustomEvent('showMemory', {
            detail: { memory }
        });
        window.dispatchEvent(event);
    }
    
    showDayJourney() {
        const event = new CustomEvent('showDayJourney');
        window.dispatchEvent(event);
    }
    
    showGrowthMetrics(metrics) {
        const event = new CustomEvent('showGrowthMetrics', {
            detail: metrics
        });
        window.dispatchEvent(event);
    }
    
    showLongTermGrowth() {
        const event = new CustomEvent('showLongTermGrowth');
        window.dispatchEvent(event);
    }
    
    showSharedMemories() {
        const event = new CustomEvent('showSharedMemories');
        window.dispatchEvent(event);
    }
    
    showFuturePredictions() {
        const event = new CustomEvent('showFuturePredictions');
        window.dispatchEvent(event);
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 自动运行演示
export function startAutoDemo(lifeOS) {
    const demo = new DemoScenarios(lifeOS);
    
    // 添加控制按钮
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        display: flex;
        gap: 10px;
    `;
    
    controls.innerHTML = `
        <button id="demo-next" style="
            padding: 10px 20px;
            background: linear-gradient(135deg, #00d4ff, #7b2ff7);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            cursor: pointer;
        ">Next Scene</button>
        
        <button id="demo-auto" style="
            padding: 10px 20px;
            background: linear-gradient(135deg, #00ff88, #00d4ff);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            cursor: pointer;
        ">Auto Play All</button>
        
        <div id="demo-status" style="
            padding: 10px 20px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 8px;
            color: white;
            display: flex;
            align-items: center;
        ">Scene: 1/7</div>
    `;
    
    document.body.appendChild(controls);
    
    // 绑定事件
    document.getElementById('demo-next').addEventListener('click', async () => {
        const hasNext = await demo.runNextScenario();
        document.getElementById('demo-status').textContent = 
            `Scene: ${demo.currentScenario}/${demo.scenarios.length}`;
        
        if (!hasNext) {
            alert('Demo Complete! 🎉');
        }
    });
    
    document.getElementById('demo-auto').addEventListener('click', async () => {
        document.getElementById('demo-auto').disabled = true;
        document.getElementById('demo-auto').textContent = 'Playing...';
        
        await demo.runFullDemo();
        
        document.getElementById('demo-auto').disabled = false;
        document.getElementById('demo-auto').textContent = 'Auto Play All';
        document.getElementById('demo-status').textContent = 'Complete!';
    });
    
    return demo;
}

if (typeof window !== 'undefined') {
    window.DemoScenarios = DemoScenarios;
    window.startAutoDemo = startAutoDemo;
}