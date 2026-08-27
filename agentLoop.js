import { runClaudeAgentLoop } from './claudeAdapter.js';
import { runAutonomousFallbackAgent } from './fallbackAgent.js';
import { sessionStore } from '../store/sessionStore.js';
import { v4 as uuidv4 } from 'uuid';
export async function executeAgentTurn(options) {
    const { sessionId, userMessage, anthropicApiKey, provider, onStepProgress } = options;
    // Add the incoming user message to the session store
    const userChatMsg = {
        id: uuidv4(),
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
    };
    sessionStore.addMessage(sessionId, userChatMsg);
    const effectiveAnthropicKey = anthropicApiKey || process.env.ANTHROPIC_API_KEY;
    let assistantResponse;
    try {
        if (provider === 'claude' || (effectiveAnthropicKey && provider !== 'autonomous')) {
            console.log(`[AgentLoop] Running Claude Agent with Anthropic Tool Use API for session ${sessionId}`);
            assistantResponse = await runClaudeAgentLoop(sessionId, userMessage, effectiveAnthropicKey, onStepProgress);
        }
        else {
            console.log(`[AgentLoop] Running Autonomous Agent Reasoning Engine for session ${sessionId}`);
            assistantResponse = await runAutonomousFallbackAgent(sessionId, userMessage, onStepProgress);
        }
    }
    catch (error) {
        console.error('[AgentLoop Error]', error);
        // If Claude API fails (e.g. invalid key, rate limit), gracefully fallback to the autonomous engine
        console.log('[AgentLoop] Falling back to Autonomous Agent Engine...');
        assistantResponse = await runAutonomousFallbackAgent(sessionId, userMessage, onStepProgress);
        // Append notice
        assistantResponse.content += `\n\n*(Note: Ran using Autonomous Multi-Step Engine. ${error.message ? `Provider notice: ${error.message}` : ''})*`;
    }
    // Save the assistant's reply and steps in session store
    sessionStore.addMessage(sessionId, assistantResponse);
    return assistantResponse;
}
