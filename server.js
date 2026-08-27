import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sessionStore } from './store/sessionStore.js';
import { executeAgentTurn } from './agent/agentLoop.js';
import { executeTool } from './agent/tools.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Load raw data for catalog views
const careersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/careers.json'), 'utf-8'));
const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/courses.json'), 'utf-8'));
// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
        careerCount: careersData.length,
        courseCount: coursesData.length
    });
});
// List all sessions
app.get('/api/sessions', (req, res) => {
    res.json({ sessions: sessionStore.listSessions() });
});
// Create a new session
app.post('/api/session/new', (req, res) => {
    const { title } = req.body;
    const session = sessionStore.createSession(undefined, title);
    res.json({ session });
});
// Get session details
app.get('/api/session/:id', (req, res) => {
    const session = sessionStore.getSession(req.params.id);
    res.json({ session });
});
// Update profile directly from UI sidebar
app.post('/api/session/:id/profile', (req, res) => {
    const { profile } = req.body;
    if (!profile) {
        return res.status(400).json({ error: 'Profile data is required' });
    }
    const updated = sessionStore.setDirectProfile(req.params.id, profile);
    res.json({ success: true, profile: updated });
});
// Clear session history
app.post('/api/session/:id/clear', (req, res) => {
    sessionStore.clearHistory(req.params.id);
    res.json({ success: true, session: sessionStore.getSession(req.params.id) });
});
// Direct Tool Execution endpoint (for quick UI testing or interactive cards)
app.post('/api/tools/execute', async (req, res) => {
    const { toolName, args, sessionId } = req.body;
    try {
        const result = await executeTool(toolName, args, sessionId || 'demo-session');
        res.json({ success: true, result });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
// Main Chat Turn endpoint
app.post('/api/chat', async (req, res) => {
    const { sessionId, message, apiKey, provider } = req.body;
    if (!sessionId || !message) {
        return res.status(400).json({ error: 'sessionId and message are required' });
    }
    try {
        const assistantMessage = await executeAgentTurn({
            sessionId,
            userMessage: message,
            anthropicApiKey: apiKey,
            provider: provider || (apiKey ? 'claude' : 'autonomous')
        });
        const session = sessionStore.getSession(sessionId);
        res.json({
            success: true,
            message: assistantMessage,
            userProfile: session.userProfile
        });
    }
    catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: error.message || 'Internal Agent error' });
    }
});
// Streaming Chat endpoint with Server-Sent Events (SSE)
app.get('/api/chat/stream', async (req, res) => {
    const sessionId = req.query.sessionId;
    const message = req.query.message;
    const apiKey = req.query.apiKey;
    const provider = req.query.provider || (apiKey ? 'claude' : 'autonomous');
    if (!sessionId || !message) {
        return res.status(400).send('sessionId and message are required');
    }
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const sendEvent = (event, data) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };
    try {
        sendEvent('start', { timestamp: new Date().toISOString() });
        const assistantMessage = await executeAgentTurn({
            sessionId,
            userMessage: message,
            anthropicApiKey: apiKey,
            provider,
            onStepProgress: (step) => {
                sendEvent('step', step);
            }
        });
        const session = sessionStore.getSession(sessionId);
        sendEvent('complete', {
            message: assistantMessage,
            userProfile: session.userProfile
        });
        res.end();
    }
    catch (err) {
        sendEvent('error', { error: err.message });
        res.end();
    }
});
// Data exploration endpoints
app.get('/api/careers', (req, res) => {
    const { domain, query } = req.query;
    let results = careersData;
    if (domain) {
        results = results.filter(c => c.domain.toLowerCase() === domain.toLowerCase());
    }
    if (query) {
        const q = query.toLowerCase();
        results = results.filter(c => c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.coreSkills.some(s => s.toLowerCase().includes(q)));
    }
    res.json({ careers: results });
});
app.get('/api/courses', (req, res) => {
    const { career, skill } = req.query;
    let results = coursesData;
    if (career) {
        const cStr = career.toLowerCase();
        results = results.filter(c => c.careerPaths.some(cp => cp.toLowerCase().includes(cStr)));
    }
    if (skill) {
        const sStr = skill.toLowerCase();
        results = results.filter(c => c.targetSkills.some(ts => ts.toLowerCase().includes(sStr)));
    }
    res.json({ courses: results });
});
app.listen(PORT, () => {
    console.log(`🚀 Agentic AI Career Guidance Server running on http://localhost:${PORT}`);
});
