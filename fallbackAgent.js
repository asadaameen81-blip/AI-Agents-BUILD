import { v4 as uuidv4 } from 'uuid';
import { executeTool, getUserProfile } from './tools.js';
export async function runAutonomousFallbackAgent(sessionId, userMessage, onStepProgress) {
    const currentProfile = getUserProfile(sessionId);
    const lowerMsg = userMessage.toLowerCase();
    const collectedSteps = [];
    let structuredCareerResults;
    let structuredSkillGap;
    let structuredRoadmap;
    let structuredCourses;
    // Helper to record and execute a step
    const runStep = async (thought, toolName, args) => {
        const toolLog = {
            id: uuidv4(),
            toolName,
            args,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        const step = {
            thought,
            toolCalls: [toolLog]
        };
        try {
            const result = await executeTool(toolName, args, sessionId);
            toolLog.result = result;
            toolLog.status = 'success';
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
        }
        catch (err) {
            toolLog.status = 'error';
            toolLog.result = { error: err.message };
        }
        collectedSteps.push(step);
        if (onStepProgress)
            onStepProgress(step);
        return toolLog.result;
    };
    // ----------------------------------------------------
    // STEP 1: Assess & Extract User Profile Details
    // ----------------------------------------------------
    const detectedInterests = [];
    const detectedSkills = [];
    let detectedStage;
    let detectedTime;
    let detectedBudget;
    // Keyword extraction rules
    const interestKeywords = [
        { key: 'ai', val: 'Artificial Intelligence' },
        { key: 'artificial intelligence', val: 'Artificial Intelligence' },
        { key: 'machine learning', val: 'Machine Learning' },
        { key: 'biology', val: 'Biology & Genomics' },
        { key: 'genomics', val: 'Genomics' },
        { key: 'bioinformatics', val: 'Bioinformatics' },
        { key: 'design', val: 'UI / UX Design' },
        { key: 'ui', val: 'UI Design' },
        { key: 'ux', val: 'User Experience' },
        { key: 'frontend', val: 'Frontend Web Development' },
        { key: 'backend', val: 'Backend & Systems' },
        { key: 'web', val: 'Web Development' },
        { key: 'game', val: 'Game Development' },
        { key: 'gaming', val: 'Game Design' },
        { key: 'security', val: 'Cybersecurity' },
        { key: 'cyber', val: 'Cybersecurity' },
        { key: 'finance', val: 'Quantitative Finance & Markets' },
        { key: 'trading', val: 'Quantitative Trading' },
        { key: 'climate', val: 'Climate & Sustainability' },
        { key: 'sustainability', val: 'Corporate Sustainability' },
        { key: 'health', val: 'Healthcare & Informatics' },
        { key: 'robot', val: 'Robotics & Control Systems' },
        { key: 'management', val: 'Product Management' },
        { key: 'marketing', val: 'Growth Marketing' },
        { key: 'writing', val: 'Technical Writing' }
    ];
    for (const item of interestKeywords) {
        if (lowerMsg.includes(item.key) && !detectedInterests.includes(item.val)) {
            detectedInterests.push(item.val);
        }
    }
    const skillKeywords = [
        'python', 'javascript', 'typescript', 'react', 'node.js', 'sql', 'c++', 'c#', 'java',
        'html', 'css', 'figma', 'pandas', 'pytorch', 'tensorflow', 'linux', 'docker',
        'kubernetes', 'git', 'aws', 'gcp', 'excel', 'tableau', 'r', 'statistics'
    ];
    for (const sk of skillKeywords) {
        if (lowerMsg.includes(sk)) {
            const formatted = sk.toUpperCase() === 'SQL' || sk.toUpperCase() === 'AWS' || sk.toUpperCase() === 'GCP' || sk.toUpperCase() === 'GIT' || sk.toUpperCase() === 'HTML' || sk.toUpperCase() === 'CSS'
                ? sk.toUpperCase()
                : sk.charAt(0).toUpperCase() + sk.slice(1);
            if (!detectedSkills.includes(formatted)) {
                detectedSkills.push(formatted);
            }
        }
    }
    if (lowerMsg.includes('high school'))
        detectedStage = 'High School Student';
    else if (lowerMsg.includes('freshman') || lowerMsg.includes('1st year'))
        detectedStage = '1st Year College Undergrad';
    else if (lowerMsg.includes('sophomore') || lowerMsg.includes('2nd year'))
        detectedStage = '2nd Year College Undergrad';
    else if (lowerMsg.includes('junior') || lowerMsg.includes('3rd year'))
        detectedStage = '3rd Year College Undergrad';
    else if (lowerMsg.includes('senior') || lowerMsg.includes('4th year') || lowerMsg.includes('final year'))
        detectedStage = 'Graduating College Senior';
    else if (lowerMsg.includes('bootcamp'))
        detectedStage = 'Bootcamp Student';
    else if (lowerMsg.includes('switch') || lowerMsg.includes('career change') || lowerMsg.includes('non-tech'))
        detectedStage = 'Career Switcher';
    if (lowerMsg.includes('hr') || lowerMsg.includes('hour')) {
        const match = lowerMsg.match(/(\d+[\s-]*\d*)\s*(?:hrs|hours|hr)/i);
        if (match)
            detectedTime = `${match[1]} hrs/week`;
    }
    if (lowerMsg.includes('free'))
        detectedBudget = 'Free resources only';
    else if (lowerMsg.includes('$')) {
        const match = lowerMsg.match(/(\$\d+)/);
        if (match)
            detectedBudget = `Budget around ${match[1]}`;
    }
    // Update profile if new signals were extracted
    if (detectedInterests.length > 0 || detectedSkills.length > 0 || detectedStage || detectedTime || detectedBudget) {
        await runStep(`Analyzing user input to extract background signals: identified stage (${detectedStage || 'unchanged'}), new interests (${detectedInterests.join(', ') || 'none'}), and skills (${detectedSkills.join(', ') || 'none'}). Updating persistent profile memory.`, 'update_user_profile', {
            academicStage: detectedStage,
            interests: detectedInterests.length > 0 ? detectedInterests : undefined,
            currentSkills: detectedSkills.length > 0 ? detectedSkills : undefined,
            constraints: (detectedTime || detectedBudget) ? {
                timeCommitment: detectedTime || currentProfile.constraints?.timeCommitment,
                budget: detectedBudget || currentProfile.constraints?.budget
            } : undefined
        });
    }
    // Refresh profile snapshot
    const profile = getUserProfile(sessionId);
    // ----------------------------------------------------
    // STEP 2: Determine Agent Intent & Next Autonomous Action
    // ----------------------------------------------------
    let finalResponseText = '';
    const isAskingForRoadmap = lowerMsg.includes('roadmap') || lowerMsg.includes('plan') || lowerMsg.includes('schedule') || lowerMsg.includes('path') && (lowerMsg.includes('how') || lowerMsg.includes('create') || lowerMsg.includes('generate'));
    const isAskingForSkillGap = lowerMsg.includes('gap') || lowerMsg.includes('skill') || lowerMsg.includes('assess') || lowerMsg.includes('ready') || lowerMsg.includes('missing') || lowerMsg.includes('what do i need');
    const isAskingForCourses = lowerMsg.includes('course') || lowerMsg.includes('cert') || lowerMsg.includes('learn') || lowerMsg.includes('resource') || lowerMsg.includes('tutorial');
    // Check if user specifically named a career or selected one
    const allKnownCareers = [
        'machine learning engineer', 'data scientist', 'full stack software engineer',
        'cloud & devops engineer', 'cybersecurity analyst', 'ui / ux designer',
        'product manager (tech)', 'bioinformatics specialist', 'health informatics analyst',
        'ai ethics & governance specialist', 'financial quantitative analyst',
        'sustainability & climate data analyst', 'game gameplay & systems developer',
        'growth marketing & analytics strategist', 'technical writer & developer advocate',
        'robotics & autonomous systems engineer', 'technology & strategy management consultant',
        'clinical research coordinator'
    ];
    let targetCareerMentioned = profile.selectedCareer;
    for (const careerName of allKnownCareers) {
        if (lowerMsg.includes(careerName) || lowerMsg.includes(careerName.split(' ')[0] + ' ' + (careerName.split(' ')[1] || ''))) {
            targetCareerMentioned = careerName;
            await runStep(`User indicated explicit interest in "${careerName}". Saving as selected career target in profile.`, 'update_user_profile', { selectedCareer: careerName, targetCareers: [careerName] });
            break;
        }
    }
    // Branch 1: User wants a roadmap or selected a career path
    if (isAskingForRoadmap && (targetCareerMentioned || profile.selectedCareer)) {
        const career = targetCareerMentioned || profile.selectedCareer;
        // Step A: Assess skill gap
        await runStep(`Evaluating current skills [${profile.currentSkills.join(', ')}] against the core requirements for ${career}.`, 'assess_skill_gap', {
            currentSkills: profile.currentSkills,
            targetCareer: career
        });
        // Step B: Search relevant courses
        await runStep(`Querying curated course catalog for accredited courses and projects mapped to ${career}.`, 'search_courses', {
            careerPath: career,
            targetSkills: profile.currentSkills.length > 0 ? profile.currentSkills : undefined,
            maxResults: 4
        });
        // Step C: Generate Phased Roadmap
        const roadmapRes = await runStep(`Synthesizing a step-by-step phased learning and portfolio roadmap for ${career} tailored to ${profile.constraints?.timeCommitment || '10-15 hrs/week'}.`, 'generate_roadmap', {
            careerPath: career,
            timeframe: profile.constraints?.timeCommitment ? `6 months (${profile.constraints.timeCommitment})` : '6 months',
            currentSkills: profile.currentSkills
        });
        finalResponseText = `### 🗺️ Custom Career Roadmap: ${roadmapRes.careerPath}\n\nI have evaluated your current profile, calculated your skill gaps, and generated an actionable **${roadmapRes.timeframe}** learning roadmap.\n\n` +
            `#### 📊 Skill Gap Assessment Highlights\n` +
            `- **Overall Readiness Match**: **${structuredSkillGap?.overallMatchScore || 60}%**\n` +
            `- **Strengths/Mastered**: ${structuredSkillGap?.masteredSkills?.length ? structuredSkillGap.masteredSkills.join(', ') : 'Ready to start with foundational prerequisites'}\n` +
            `- **Priority Focus Areas**: ${structuredSkillGap?.missingCriticalSkills?.slice(0, 3).join(', ') || 'Core domain tools'}\n\n` +
            `Review the interactive roadmap cards and course links below to start Phase 1. You can export this roadmap anytime!`;
    }
    // Branch 2: User asking about skill gaps or courses for a career
    else if ((isAskingForSkillGap || isAskingForCourses) && (targetCareerMentioned || profile.selectedCareer)) {
        const career = targetCareerMentioned || profile.selectedCareer;
        await runStep(`Executing detailed skill gap matrix calculation for "${career}".`, 'assess_skill_gap', {
            currentSkills: profile.currentSkills,
            targetCareer: career
        });
        await runStep(`Finding top accredited and free learning resources to bridge identified skill gaps in ${career}.`, 'search_courses', {
            careerPath: career,
            maxResults: 4
        });
        finalResponseText = `### 🎯 Skill Gap & Course Recommendations for **${career}**\n\n` +
            `Here is a complete breakdown of where your skills align and the exact steps to bridge the gap:\n\n` +
            `- **Match Score**: **${structuredSkillGap?.overallMatchScore}%** (${structuredSkillGap?.difficultyToTransition} Transition Difficulty)\n` +
            `- **Estimated Time to Bridge**: ${structuredSkillGap?.estimatedTimeToBridge}\n` +
            `- **Mastered / Transferable Skills**: ${structuredSkillGap?.masteredSkills?.join(', ') || 'Foundational readiness'}\n` +
            `- **Critical Skills to Build**: ${structuredSkillGap?.missingCriticalSkills?.join(', ')}\n\n` +
            `Check out the curated courses below. Whenever you're ready, say **"Generate my roadmap"** to get a week-by-week timeline!`;
    }
    // Branch 3: We have enough signal to search careers or user asks for suggestions
    else if (profile.interests.length > 0 || profile.currentSkills.length > 0 || lowerMsg.includes('recommend') || lowerMsg.includes('career') || lowerMsg.includes('options') || lowerMsg.includes('explore')) {
        const searchTerms = [...profile.interests, ...profile.currentSkills].join(' ');
        const careerSearchRes = await runStep(`Querying career database using discovered profile attributes: interests [${profile.interests.join(', ')}] and skills [${profile.currentSkills.join(', ')}].`, 'search_careers', {
            query: searchTerms || lowerMsg,
            skillsFilter: profile.currentSkills,
            maxResults: 3
        });
        const careerTitles = (careerSearchRes?.careers || []).map((c) => c.title);
        finalResponseText = `### 🌟 Recommended Career Pathways for You\n\nBased on your background in **${profile.academicStage || 'your studies'}**, your interest in **${profile.interests.join(', ') || 'technology'}**, and your skills in **${profile.currentSkills.join(', ') || 'problem-solving'}**, here are top high-growth career options:\n\n` +
            (careerSearchRes?.careers || []).map((c, idx) => `**${idx + 1}. ${c.title}** (${c.domain})\n` +
                `> 💰 **Median Salary**: ${c.medianSalary} | 📈 **Growth**: ${c.growthRate}\n` +
                `> ${c.description}\n` +
                `> *Key Core Skills*: \`${c.coreSkills.slice(0, 4).join('`, `')}\`\n`).join('\n') +
            `\n\n👉 **Which of these paths resonates most with you?** (Or click any card below to run an instant Skill Gap analysis and Course lookup!)`;
    }
    // Branch 4: Initial discovery questions
    else {
        await runStep(`User provided initial query. Inspecting profile completeness to formulate structured discovery questions.`, 'get_user_profile', {});
        finalResponseText = `Thanks for reaching out! To give you hyper-personalized recommendations, I'm analyzing your profile.\n\n` +
            `Could you share a bit more about:\n` +
            `1. **What topics or activities energize you?** (e.g. building apps, visual design, analyzing biological data, cybersecurity, financial trading)\n` +
            `2. **What tools or languages do you already know or enjoy?** (e.g. Python, Figma, Excel, Java, or none yet)\n` +
            `3. **What is your current timeline or weekly study bandwidth?** (e.g. 5-10 hrs/week, looking for internships next summer)`;
    }
    const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: finalResponseText,
        timestamp: new Date().toISOString(),
        steps: collectedSteps,
        careerResults: structuredCareerResults,
        skillGapResult: structuredSkillGap,
        roadmapResult: structuredRoadmap,
        courseResults: structuredCourses,
        profileSnapshot: getUserProfile(sessionId)
    };
    return assistantMessage;
}
