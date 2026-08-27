import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sessionStore } from '../store/sessionStore.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load datasets
const careersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/careers.json'), 'utf-8'));
const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/courses.json'), 'utf-8'));
/**
 * 1. get_user_profile
 */
export function getUserProfile(sessionId) {
    const session = sessionStore.getSession(sessionId);
    return session.userProfile;
}
/**
 * 2. update_user_profile
 */
export function updateUserProfile(sessionId, updates) {
    const updated = sessionStore.updateProfile(sessionId, updates);
    return {
        success: true,
        updatedProfile: updated,
        message: `User profile updated. Interests: [${updated.interests.join(', ')}], Skills: [${updated.currentSkills.join(', ')}], Stage: "${updated.academicStage || 'Not specified'}"`
    };
}
/**
 * 3. search_careers
 */
export function searchCareers(criteria) {
    const queryLower = (criteria.query || '').toLowerCase().trim();
    const domainLower = (criteria.domain || '').toLowerCase().trim();
    const skillsFilter = (criteria.skillsFilter || []).map(s => s.toLowerCase());
    const max = criteria.maxResults || 4;
    const scoredCareers = careersData.map(career => {
        let score = 0;
        // Search in title, domain, description, summary
        if (queryLower) {
            if (career.title.toLowerCase().includes(queryLower))
                score += 15;
            if (career.domain.toLowerCase().includes(queryLower))
                score += 10;
            if (career.description.toLowerCase().includes(queryLower))
                score += 5;
            if (career.summary.toLowerCase().includes(queryLower))
                score += 5;
            if (career.dayInTheLife.toLowerCase().includes(queryLower))
                score += 3;
        }
        // Domain filter
        if (domainLower && career.domain.toLowerCase().includes(domainLower)) {
            score += 10;
        }
        // Skill overlap scoring
        if (skillsFilter.length > 0) {
            for (const skill of skillsFilter) {
                const hasCore = career.coreSkills.some(cs => cs.toLowerCase().includes(skill) || skill.includes(cs.toLowerCase()));
                if (hasCore)
                    score += 8;
                const hasRec = career.recommendedSkills.some(rs => rs.toLowerCase().includes(skill) || skill.includes(rs.toLowerCase()));
                if (hasRec)
                    score += 4;
            }
        }
        // Default baseline score so broad searches return the most popular
        if (!queryLower && !domainLower && skillsFilter.length === 0) {
            score = career.marketDemand === 'Very High' ? 10 : 5;
        }
        return { career, score };
    });
    const sorted = scoredCareers
        .filter(item => (queryLower || domainLower || skillsFilter.length > 0) ? item.score > 0 : true)
        .sort((a, b) => b.score - a.score)
        .map(item => item.career)
        .slice(0, max);
    // If no direct keyword match, return top recommended careers
    const finalResults = sorted.length > 0 ? sorted : careersData.slice(0, max);
    return {
        careers: finalResults,
        matchCount: finalResults.length,
        searchSummary: `Found ${finalResults.length} matching career pathways: ${finalResults.map(c => c.title).join(', ')}`
    };
}
/**
 * 4. search_courses
 */
export function searchCourses(params) {
    const careerLower = (params.careerPath || '').toLowerCase().trim();
    const targetSkills = (params.targetSkills || []).map(s => s.toLowerCase());
    const max = params.maxResults || 6;
    const matched = coursesData.filter(course => {
        let matchesCareer = true;
        if (careerLower) {
            matchesCareer = course.careerPaths.some(cp => cp.toLowerCase().includes(careerLower) || careerLower.includes(cp.toLowerCase()));
        }
        let matchesSkills = true;
        if (targetSkills.length > 0) {
            matchesSkills = targetSkills.some(ts => course.targetSkills.some(cs => cs.toLowerCase().includes(ts) || ts.includes(cs.toLowerCase())));
        }
        let matchesCost = true;
        if (params.costType) {
            matchesCost = course.costType.toLowerCase() === params.costType.toLowerCase();
        }
        let matchesLevel = true;
        if (params.level) {
            matchesLevel = course.level.toLowerCase() === params.level.toLowerCase();
        }
        return (matchesCareer || matchesSkills) && matchesCost && matchesLevel;
    });
    const results = (matched.length > 0 ? matched : coursesData).slice(0, max);
    return {
        courses: results,
        count: results.length,
        message: `Retrieved ${results.length} curated courses for ${params.careerPath || 'recommended skills'}`
    };
}
/**
 * 5. assess_skill_gap
 */
export function assessSkillGap(params) {
    const currentSkillsLower = (params.currentSkills || []).map(s => s.toLowerCase().trim());
    const targetCareerLower = params.targetCareer.toLowerCase().trim();
    // Find the target career object
    const career = careersData.find(c => c.title.toLowerCase().includes(targetCareerLower) ||
        targetCareerLower.includes(c.title.toLowerCase()) ||
        c.id.toLowerCase().includes(targetCareerLower)) || careersData[0];
    const mastered = [];
    const transferable = [];
    const missingCritical = [];
    const recommendedElective = [];
    // Evaluate core skills
    for (const core of career.coreSkills) {
        const isMastered = currentSkillsLower.some(cs => cs === core.toLowerCase() ||
            core.toLowerCase().includes(cs) ||
            cs.includes(core.toLowerCase()));
        if (isMastered) {
            mastered.push(core);
        }
        else {
            missingCritical.push(core);
        }
    }
    // Evaluate recommended skills
    for (const rec of career.recommendedSkills) {
        const isMastered = currentSkillsLower.some(cs => cs === rec.toLowerCase() ||
            rec.toLowerCase().includes(cs) ||
            cs.includes(rec.toLowerCase()));
        if (isMastered) {
            transferable.push(rec);
        }
        else {
            recommendedElective.push(rec);
        }
    }
    // Any unmatched current skills can be considered transferable strengths
    for (const userSkill of params.currentSkills) {
        const isAlreadyCategorized = mastered.some(m => m.toLowerCase() === userSkill.toLowerCase()) ||
            transferable.some(t => t.toLowerCase() === userSkill.toLowerCase());
        if (!isAlreadyCategorized) {
            transferable.push(userSkill);
        }
    }
    const totalCore = career.coreSkills.length;
    const matchRatio = totalCore > 0 ? (mastered.length / totalCore) : 0.5;
    const overallMatchScore = Math.min(100, Math.max(15, Math.round(matchRatio * 100)));
    let difficulty = 'Moderate';
    let estimatedTime = '3-6 months (10-12 hrs/week)';
    if (overallMatchScore >= 70) {
        difficulty = 'Low';
        estimatedTime = '1-3 months (fast-track)';
    }
    else if (overallMatchScore < 40) {
        difficulty = 'High';
        estimatedTime = '6-12 months (comprehensive training)';
    }
    return {
        careerTitle: career.title,
        overallMatchScore,
        masteredSkills: mastered,
        transferableSkills: transferable,
        missingCriticalSkills: missingCritical,
        recommendedElectiveSkills: recommendedElective.slice(0, 4),
        difficultyToTransition: difficulty,
        estimatedTimeToBridge: estimatedTime,
        keyRecommendations: [
            missingCritical.length > 0
                ? `Focus immediately on core foundational gap: ${missingCritical.slice(0, 2).join(' and ')}`
                : `Strong core alignment! Prioritize advanced electives like ${recommendedElective.slice(0, 2).join(', ')}`,
            `Build 2-3 portfolio-grade capstone projects demonstrating ${missingCritical[0] || career.coreSkills[0]} in action`,
            `Target practical hands-on certifications to validate newly acquired proficiencies`
        ]
    };
}
/**
 * 6. generate_roadmap
 */
export function generateRoadmap(params) {
    const careerLower = params.careerPath.toLowerCase().trim();
    const career = careersData.find(c => c.title.toLowerCase().includes(careerLower) ||
        careerLower.includes(c.title.toLowerCase())) || careersData[0];
    const timeframeStr = params.timeframe || '6 months (10-15 hrs/week)';
    const matchedCourses = coursesData.filter(c => c.careerPaths.some(cp => cp.toLowerCase().includes(career.title.toLowerCase())));
    const phases = [
        {
            weekOrMonth: "Month 1-2",
            phase: "Phase 1: Core Fundamentals & Prerequisite Tools",
            focus: `Master the essential foundational languages and tools required for ${career.title}.`,
            actionItems: [
                `Complete the introductory modules for ${career.coreSkills.slice(0, 2).join(' and ')}`,
                `Set up a professional local development & version control environment with Git/GitHub`,
                `Solve 25+ fundamental practice problems and build 2 micro-exercises`
            ],
            skillsToAcquire: career.coreSkills.slice(0, 3),
            recommendedCourses: matchedCourses.slice(0, 2).map(c => `${c.title} (${c.provider})`),
            portfolioProject: {
                title: "Foundational Micro-App / Script Suite",
                description: `Build a standalone working prototype showcasing clean code and ${career.coreSkills[0]} basics.`,
                deliverable: "GitHub repository with README documentation and unit tests."
            }
        },
        {
            weekOrMonth: "Month 3-4",
            phase: "Phase 2: Deep Technical Competence & Architecture",
            focus: `Dive into domain-specific frameworks, system architecture, and intermediate techniques.`,
            actionItems: [
                `Learn ${career.coreSkills.slice(2, 4).join(', ')} and implement end-to-end workflows`,
                `Integrate industry-standard frameworks (${career.recommendedSkills.slice(0, 2).join(', ')})`,
                `Participate in code reviews and study production-grade open source implementations`
            ],
            skillsToAcquire: [...career.coreSkills.slice(2, 5), ...career.recommendedSkills.slice(0, 2)],
            recommendedCourses: matchedCourses.slice(1, 3).map(c => `${c.title} (${c.provider})`),
            portfolioProject: {
                title: `Production-Ready ${career.title} Capstone`,
                description: `Architect a full end-to-end application or analytical pipeline solving a realistic domain challenge.`,
                deliverable: "Live deployed demo URL, interactive dashboard or API, plus architecture diagram."
            }
        },
        {
            weekOrMonth: "Month 5-6",
            phase: "Phase 3: Portfolio Polish, Certifications & Career Launch",
            focus: "Demonstrate domain mastery, obtain industry credentials, and execute a targeted job search.",
            actionItems: [
                `Polish GitHub portfolio and write 2 technical case study blog posts breaking down your projects`,
                `Prepare for technical interviews (coding challenges, system design, case studies)`,
                `Network with practitioners and alumni in ${career.domain} on LinkedIn and attend community meetups`
            ],
            skillsToAcquire: [...career.recommendedSkills.slice(2, 4), ...career.softSkills.slice(0, 2)],
            recommendedCourses: [
                "Technical Interview & System Design Preparation",
                "Open Source Contribution Sprint"
            ],
            portfolioProject: {
                title: "Enterprise/Client-Grade Signature Showcase",
                description: "Contribute to a major open source repository or deliver a pro-bono client project demonstrating production excellence.",
                deliverable: "Published case study article + live production deployment."
            }
        }
    ];
    return {
        careerPath: career.title,
        timeframe: timeframeStr,
        summary: `Structured step-by-step learning journey designed to bridge all core skill gaps and position you as a competitive candidate for ${career.title} within ${timeframeStr}.`,
        phases,
        tipsForSuccess: [
            "Prioritize building and deploying projects over passive video watching.",
            "Document your learnings publicly (Twitter/X, LinkedIn, Dev.to) to build an organic inbound network.",
            "Stay consistent: 90 minutes of focused daily study outperforms sporadic weekend cramming."
        ]
    };
}
/**
 * Tool metadata schema for Claude / Anthropic Tool Use API
 */
export const toolDefinitions = [
    {
        name: "get_user_profile",
        description: "Retrieve the student's current profile from conversation memory, including interests, current skills, academic stage, constraints (budget/time), target careers, and career values.",
        input_schema: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "update_user_profile",
        description: "Save or update the student's profile information as you discover it during conversation (e.g. newly mentioned skills, interests, academic background, budget constraints, preferred career paths).",
        input_schema: {
            type: "object",
            properties: {
                academicStage: {
                    type: "string",
                    description: "The user's educational stage (e.g. 'High School Senior', '2nd Year CS Undergrad', 'Career Switcher from Finance')"
                },
                interests: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of subjects, topics, or industries the user finds engaging (e.g. ['Artificial Intelligence', 'Biomedicine', 'Game Design'])"
                },
                currentSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Technical or domain skills the user currently possesses (e.g. ['Python', 'SQL', 'Figma', 'Excel'])"
                },
                constraints: {
                    type: "object",
                    properties: {
                        timeCommitment: { type: "string", description: "Available study time (e.g. '10 hrs/week')" },
                        budget: { type: "string", description: "Budget preference (e.g. 'Free only', 'Under $200')" },
                        preferredStyle: { type: "string", description: "Learning format (e.g. 'Hands-on projects', 'Self-paced video')" },
                        locationOrRemote: { type: "string", description: "Work arrangement preference (e.g. 'Remote', 'Hybrid')" }
                    },
                    description: "User's practical constraints"
                },
                targetCareers: {
                    type: "array",
                    items: { type: "string" },
                    description: "Candidate career titles the user has shown interest in exploring"
                },
                selectedCareer: {
                    type: "string",
                    description: "The primary career path selected for deep-dive gap analysis or roadmap generation"
                },
                careerValues: {
                    type: "array",
                    items: { type: "string" },
                    description: "What matters to the user (e.g. ['High compensation', 'Work-life balance', 'Social impact'])"
                }
            },
            required: []
        }
    },
    {
        name: "search_careers",
        description: "Query the career database filtered by user interests, skills, keywords, or domain. Returns 2-4 high-relevance career paths with salary, market demand, and skill requirements.",
        input_schema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Keywords or topic (e.g. 'AI and biology', 'creative coding', 'finance data analytics', 'cybersecurity')"
                },
                domain: {
                    type: "string",
                    description: "Optional industry domain filter (e.g. 'Tech', 'Data & AI', 'Healthcare & Science', 'Design & Creative', 'Business & Finance', 'Engineering')"
                },
                skillsFilter: {
                    type: "array",
                    items: { type: "string" },
                    description: "Skills to match against career requirements"
                },
                maxResults: {
                    type: "integer",
                    description: "Number of careers to return (default 3, max 5)"
                }
            },
            required: []
        }
    },
    {
        name: "search_courses",
        description: "Look up accredited online courses, certifications, and learning resources mapped to a specific career path or target skill set.",
        input_schema: {
            type: "object",
            properties: {
                careerPath: {
                    type: "string",
                    description: "Target career path (e.g. 'Machine Learning Engineer', 'UI / UX Designer')"
                },
                targetSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Specific skill gaps to find courses for (e.g. ['PyTorch', 'Docker', 'Figma'])"
                },
                costType: {
                    type: "string",
                    description: "Optional cost filter: 'Free', 'Free to Audit', 'Paid', 'Certification'"
                },
                level: {
                    type: "string",
                    description: "Difficulty level: 'Beginner', 'Intermediate', 'Advanced'"
                },
                maxResults: {
                    type: "integer",
                    description: "Max number of courses to return (default 4)"
                }
            },
            required: []
        }
    },
    {
        name: "assess_skill_gap",
        description: "Compare the user's current skills against what a target career requires. Computes match percentage, lists mastered skills, identified missing critical skills, and provides transition difficulty.",
        input_schema: {
            type: "object",
            properties: {
                currentSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "The user's existing skills (e.g. ['Python', 'HTML', 'Git'])"
                },
                targetCareer: {
                    type: "string",
                    description: "The name of the target career path (e.g. 'Machine Learning Engineer', 'Bioinformatics Specialist')"
                }
            },
            required: ["targetCareer"]
        }
    },
    {
        name: "generate_roadmap",
        description: "Produce a structured, step-by-step phased learning and portfolio roadmap for a target career path tailored to the user's timeframe.",
        input_schema: {
            type: "object",
            properties: {
                careerPath: {
                    type: "string",
                    description: "The chosen career path to build a roadmap for"
                },
                timeframe: {
                    type: "string",
                    description: "Desired timeframe (e.g. '3 months', '6 months (10 hrs/week)', '1 year')"
                },
                weeklyHours: {
                    type: "string",
                    description: "Hours per week the student can commit (e.g. '10-15 hrs/week')"
                },
                currentSkills: {
                    type: "array",
                    items: { type: "string" },
                    description: "Current skills to tailor the starting phase"
                }
            },
            required: ["careerPath"]
        }
    }
];
/**
 * Universal Tool Dispatcher
 */
export async function executeTool(toolName, args, sessionId) {
    switch (toolName) {
        case 'get_user_profile':
            return getUserProfile(sessionId);
        case 'update_user_profile':
            return updateUserProfile(sessionId, args);
        case 'search_careers':
            return searchCareers(args);
        case 'search_courses':
            return searchCourses(args);
        case 'assess_skill_gap': {
            let skills = args.currentSkills;
            if (!skills || skills.length === 0) {
                const profile = getUserProfile(sessionId);
                skills = profile.currentSkills;
            }
            return assessSkillGap({
                currentSkills: skills,
                targetCareer: args.targetCareer
            });
        }
        case 'generate_roadmap': {
            let skills = args.currentSkills;
            if (!skills || skills.length === 0) {
                const profile = getUserProfile(sessionId);
                skills = profile.currentSkills;
            }
            return generateRoadmap({
                careerPath: args.careerPath,
                timeframe: args.timeframe,
                weeklyHours: args.weeklyHours,
                currentSkills: skills
            });
        }
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
