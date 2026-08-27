import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import { SYSTEM_PROMPT } from './prompt.js';
import { toolDefinitions, executeTool } from './tools.js';
import { sessionStore } from '../store/sessionStore.js';
export async function runClaudeAgentLoop(sessionId, userMessage, apiKey, onStepProgress) {
    const anthropic = new Anthropic({ apiKey });
    const session = sessionStore.getSession(sessionId);
    // Build Anthropic message history from existing session
    const messages = [];
    for (const msg of session.messages) {
        if (msg.role === 'user') {
            messages.push({ role: 'user', content: msg.content });
        }
        else if (msg.role === 'assistant') {
            messages.push({ role: 'assistant', content: msg.content });
        }
    }
    // Add the current user message
    messages.push({ role: 'user', content: userMessage });
    const collectedSteps = [];
    let finalContent = '';
    let iterations = 0;
    const MAX_ITERATIONS = 6;
    let structuredCareerResults;
    let structuredSkillGap;
    let structuredRoadmap;
    let structuredCourses;
    while (iterations < MAX_ITERATIONS) {
        iterations++;
        const response = await anthropic.messages.create({
            model: 'claude-3-7-sonnet-20250219',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: messages,
            tools: toolDefinitions
        });
        const currentStep = {
            thought: '',
            toolCalls: []
        };
        const textBlocks = [];
        const toolUseBlocks = [];
        for (const block of response.content) {
            if (block.type === 'text') {
                textBlocks.push(block.text);
            }
            else if (block.type === 'tool_use') {
                toolUseBlocks.push(block);
            }
        }
        if (textBlocks.length > 0) {
            currentStep.thought = textBlocks.join('\n\n');
        }
        // If no tools were called, we have our final response
        if (toolUseBlocks.length === 0 || response.stop_reason === 'end_turn') {
            finalContent = textBlocks.join('\n\n');
            if (currentStep.thought || currentStep.toolCalls.length > 0) {
                collectedSteps.push(currentStep);
                if (onStepProgress)
                    onStepProgress(currentStep);
            }
            break;
        }
        // Execute tool calls
        const toolResultBlocks = [];
        for (const toolUse of toolUseBlocks) {
            const toolCallId = toolUse.id;
            const toolName = toolUse.name;
            const toolArgs = toolUse.input;
            const toolLog = {
                id: toolCallId,
                toolName,
                args: toolArgs,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            currentStep.toolCalls.push(toolLog);
            try {
                const result = await executeTool(toolName, toolArgs, sessionId);
                toolLog.result = result;
                toolLog.status = 'success';
                // Capture structured artifacts for UI rich rendering
                if (toolName === 'search_careers' && result?.careers) {
                    structuredCareerResults = result.careers;
                }
                else if (toolName === 'assess_skill_gap') {
                    structuredSkillGap = result;
                }
                else if (toolName === 'generate_roadmap') {
                    structuredRoadmap = result;
                }
                else if (toolName === 'search_courses' && result?.courses) {
                    structuredCourses = result.courses;
                }
                toolResultBlocks.push({
                    type: 'tool_result',
                    tool_use_id: toolCallId,
                    content: JSON.stringify(result)
                });
            }
            catch (err) {
                toolLog.status = 'error';
                toolLog.result = { error: err.message || 'Tool execution failed' };
                toolResultBlocks.push({
                    type: 'tool_result',
                    tool_use_id: toolCallId,
                    is_error: true,
                    content: `Error executing tool: ${err.message}`
                });
            }
        }
        collectedSteps.push(currentStep);
        if (onStepProgress)
            onStepProgress(currentStep);
        // Append assistant tool use message & user tool results to conversation loop
        messages.push({
            role: 'assistant',
            content: response.content
        });
        messages.push({
            role: 'user',
            content: toolResultBlocks
        });
    }
    // Construct final message
    const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: finalContent || "I've analyzed your profile and executed the necessary assessments. Here is my guidance.",
        timestamp: new Date().toISOString(),
        steps: collectedSteps,
        careerResults: structuredCareerResults,
        skillGapResult: structuredSkillGap,
        roadmapResult: structuredRoadmap,
        courseResults: structuredCourses,
        profileSnapshot: sessionStore.getSession(sessionId).userProfile
    };
    return assistantMessage;
}
