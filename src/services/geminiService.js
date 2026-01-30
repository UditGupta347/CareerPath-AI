import { GoogleGenerativeAI } from '@google/generative-ai';


const initGemini = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️ Gemini API key not configured. Resume Builder & ATS Analyzer will use OpenRouter API.');
    console.info('💡 To use Gemini directly, get a free key from: https://aistudio.google.com/app/apikey');
    return null;
  }
  
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error.message);
    return null;
  }
};

const genAI = initGemini();


export async function generateProjectRoadmap(
  projectTitle, 
  projectDescription, 
  techStack = [], 
  complexity = 'Intermediate',
  estimatedTime = '3-4 weeks'
) {
  if (!genAI) {
    console.error('Gemini AI not initialized. Check your API key.');
    return getFallbackRoadmap();
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a project planning expert. Create a detailed project roadmap for the following project.

Project Title: ${projectTitle}
Description: ${projectDescription}
Tech Stack: ${techStack.join(', ')}
Complexity Level: ${complexity}
Estimated Time: ${estimatedTime}

Generate a comprehensive roadmap with EXACTLY 4 phases: Design, Development, Testing, and Deployment.

For each phase, provide:
1. Phase name (must be one of: Design, Development, Testing, Deployment)
2. Duration (e.g., "3 days", "2 weeks")
3. A list of 5-8 specific tasks

For each task, provide:
1. A unique id (format: phasename-number, e.g., "design-1", "dev-2")
2. Title (concise, action-oriented)
3. Description (detailed explanation of what to do)
4. Duration (e.g., "1 day", "2 days", "3-4 hours")

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
{
  "phases": [
    {
      "name": "Design",
      "duration": "3 days",
      "tasks": [
        {
          "id": "design-1",
          "title": "Task title",
          "description": "Detailed description",
          "duration": "1 day"
        }
      ]
    }
  ]
}

Important:
- Be specific and practical for the given tech stack
- Tasks should be actionable and measurable
- Durations should be realistic
- Return ONLY the JSON object, nothing else`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    
    const roadmap = parseRoadmapResponse(text);
    
    console.log('✅ Successfully generated roadmap for:', projectTitle);
    return roadmap;
    
  } catch (error) {
    console.error('Error generating roadmap with Gemini AI:', error);
    return getFallbackRoadmap();
  }
}


function parseRoadmapResponse(text) {
  try {
    
    let cleanedText = text.trim();
    
    
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    const roadmap = JSON.parse(cleanedText);
    
    
    if (!roadmap.phases || !Array.isArray(roadmap.phases)) {
      throw new Error('Invalid roadmap structure: missing phases array');
    }
    
    
    roadmap.phases = roadmap.phases.map(phase => ({
      name: phase.name || 'Unnamed Phase',
      duration: phase.duration || '1 week',
      tasks: Array.isArray(phase.tasks) ? phase.tasks.map(task => ({
        id: task.id || `task-${Math.random().toString(36).substr(2, 9)}`,
        title: task.title || 'Untitled Task',
        description: task.description || '',
        duration: task.duration || '1 day'
      })) : []
    }));
    
    return roadmap;
    
  } catch (error) {
    console.error('Error parsing roadmap response:', error);
    console.error('Response text:', text);
    return getFallbackRoadmap();
  }
}


function getFallbackRoadmap() {
  return {
    phases: [
      {
        name: 'Design',
        duration: '3-5 days',
        tasks: [
          {
            id: 'design-1',
            title: 'Create project wireframes and mockups',
            description: 'Design the user interface and user experience',
            duration: '1-2 days'
          },
          {
            id: 'design-2',
            title: 'Plan system architecture',
            description: 'Design the overall system architecture and data flow',
            duration: '1-2 days'
          },
          {
            id: 'design-3',
            title: 'Define API contracts',
            description: 'Specify API endpoints and data structures',
            duration: '1 day'
          }
        ]
      },
      {
        name: 'Development',
        duration: '2-3 weeks',
        tasks: [
          {
            id: 'dev-1',
            title: 'Set up development environment',
            description: 'Initialize project structure and install dependencies',
            duration: '1 day'
          },
          {
            id: 'dev-2',
            title: 'Implement core features',
            description: 'Build the main functionality of the application',
            duration: '1-2 weeks'
          },
          {
            id: 'dev-3',
            title: 'Integrate third-party services',
            description: 'Connect external APIs and services',
            duration: '2-3 days'
          },
          {
            id: 'dev-4',
            title: 'Build user interface',
            description: 'Create responsive UI components',
            duration: '3-5 days'
          }
        ]
      },
      {
        name: 'Testing',
        duration: '3-5 days',
        tasks: [
          {
            id: 'test-1',
            title: 'Write unit tests',
            description: 'Test individual components and functions',
            duration: '1-2 days'
          },
          {
            id: 'test-2',
            title: 'Perform integration testing',
            description: 'Test the complete application flow',
            duration: '1-2 days'
          },
          {
            id: 'test-3',
            title: 'User acceptance testing',
            description: 'Validate with end users and fix issues',
            duration: '1 day'
          }
        ]
      },
      {
        name: 'Deployment',
        duration: '2-3 days',
        tasks: [
          {
            id: 'deploy-1',
            title: 'Prepare production environment',
            description: 'Set up hosting and configure servers',
            duration: '1 day'
          },
          {
            id: 'deploy-2',
            title: 'Deploy application',
            description: 'Push code to production and verify deployment',
            duration: '1 day'
          },
          {
            id: 'deploy-3',
            title: 'Monitor and optimize',
            description: 'Set up monitoring and optimize performance',
            duration: '1 day'
          }
        ]
      }
    ]
  };
}


function getDomainSpecificTech(domain) {
  const techByDomain = {
    'AI/ML': '- AI/ML: Gemini 2.0, GPT-4, PyTorch, TensorFlow, LangChain\n- Backend: Python, FastAPI\n- Frontend: React, Streamlit',
    'Web Development': '- Frontend: React 19, Next.js 14+, shadcn/ui, TailwindCSS\n- Backend: Node.js 20+, Bun, tRPC\n- Database: Supabase, PostgreSQL, Prisma',
    'Blockchain': '- Platforms: Ethereum, Solana, Polygon\n- Smart Contracts: Solidity, Hardhat\n- Frontend: ethers.js, wagmi, Web3.js',
    'Cloud Computing': '- Platforms: AWS, Google Cloud, Azure\n- Infrastructure: Terraform, Kubernetes, Docker\n- Serverless: Vercel, Cloudflare Workers',
    'Mobile Development': '- Cross-platform: React Native, Flutter, Expo\n- Native: Swift, Kotlin\n- Backend: Firebase, Supabase',
    'IoT': '- Hardware: Arduino, Raspberry Pi, ESP32\n- Protocols: MQTT, CoAP\n- Cloud: AWS IoT, Azure IoT Hub',
    'Cybersecurity': '- Tools: Kali Linux, Metasploit, Burp Suite\n- Languages: Python, Go\n- Frameworks: OWASP, NIST',
    'Data Science': '- Languages: Python, R\n- Libraries: Pandas, NumPy, Scikit-learn\n- Visualization: Plotly, Streamlit',
    'DevOps': '- CI/CD: GitHub Actions, GitLab CI\n- Containers: Docker, Kubernetes\n- IaC: Terraform, Pulumi',
    'AR/VR': '- Engines: Unity, Unreal Engine\n- Frameworks: Meta Quest SDK, ARKit\n- Languages: C#, C++'
  };
  
  return techByDomain[domain] || '- Use modern, relevant technologies for this domain';
}


export async function generateFullProject({
  domain,
  complexity,
  targetRole,
  interests = '',
  existingSkills = ''
}) {
  if (!genAI) {
    console.error('Gemini AI not initialized. Check your API key.');
    throw new Error('Gemini AI not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a specialized project advisor. Generate a unique, innovative project idea that MUST be in the ${domain} domain.

REQUIREMENTS:
- Domain: ${domain} (STRICTLY ENFORCE - project MUST be in this domain)
- Experience Level: ${complexity}
- Target Job Role: ${targetRole}
- Specific Interests: ${interests || 'General'}
- Existing Skills: ${existingSkills || 'Basic programming'}

IMPORTANT - Domain Enforcement:
- The project MUST be clearly related to ${domain}
- ALL technologies in the tech stack MUST be relevant to ${domain}
- If domain is "AI/ML", include AI/ML frameworks and tools
- If domain is "Web Development", focus on web technologies
- If domain is "Blockchain", include blockchain platforms and smart contracts
- If domain is "Cloud Computing", include cloud services and infrastructure
- DO NOT mix unrelated domains

Use ONLY 2026 cutting-edge technologies relevant to ${domain}:
${getDomainSpecificTech(domain)}

Return ONLY valid JSON (no markdown, no code blocks, just pure JSON):

{
  "title": "Creative and specific project name relevant to ${domain}",
  "description": "2-3 sentence compelling description that clearly explains what the project does and its value in ${domain}",
  "domain": "${domain}",
  "complexity": "${complexity}",
  "tech_stack": ["${domain} tech 1", "${domain} tech 2", "${domain} tech 3", "${domain} tech 4", "${domain} tech 5"],
  "estimated_time": "X-Y weeks",
  "use_cases": ["practical ${domain} use case 1", "use case 2", "use case 3"],
  "target_roles": ["${targetRole}"],
  "is_trending": true,
  "resources": [
    {"title": "Official ${domain} Documentation", "type": "Documentation", "level": "Beginner", "source": "Official Site", "url": "https://example.com", "description": "Getting started with ${domain}"},
    {"title": "${domain} Tutorial Series", "type": "Video", "level": "Beginner", "source": "YouTube", "url": "https://youtube.com", "description": "Step by step ${domain} course"},
    {"title": "${domain} GitHub Template", "type": "GitHub", "level": "Intermediate", "source": "GitHub", "url": "https://github.com", "description": "${domain} starter code repository"},
    {"title": "${domain} Best Practices", "type": "Article", "level": "Intermediate", "source": "Medium", "url": "https://medium.com", "description": "${domain} industry best practices"},
    {"title": "Advanced ${domain} Course", "type": "Course", "level": "Advanced", "source": "Udemy", "url": "https://udemy.com", "description": "Deep dive ${domain} course"}
  ],
  "github_structure": "project-root/\\n├── src/\\n│   ├── components/\\n│   ├── pages/\\n│   ├── services/\\n│   └── utils/\\n├── tests/\\n├── docs/\\n├── README.md\\n└── package.json",
  "architecture": "Brief description of the ${domain} system architecture, key components, and how they interact",
  "deployment_guide": "Step-by-step deployment instructions for ${domain} project:\\n1. First step\\n2. Second step\\n3. Third step"
}

CRITICAL Requirements:
- Project MUST be 100% focused on ${domain}
- Tech stack MUST use only ${domain}-relevant technologies
- Make the project practical and achievable for ${complexity} level
- Project should be portfolio-worthy and demonstrate ${domain} expertise
- Use cases must be real-world ${domain} applications
- Make it innovative but not overly complex
- Return ONLY the JSON object, nothing else`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    
    const project = parseProjectResponse(text);
    
    
    const roadmap = await generateProjectRoadmap(
      project.title,
      project.description,
      project.tech_stack,
      project.complexity,
      project.estimated_time
    );
    
    
    project.roadmap = roadmap;
    
    console.log('✅ Successfully generated full project:', project.title);
    return project;
    
  } catch (error) {
    console.error('Error generating project with Gemini AI:', error);
    throw error;
  }
}


function parseProjectResponse(text) {
  try {
    
    let cleanedText = text.trim();
    
    
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    const project = JSON.parse(cleanedText);
    
    
    return {
      title: project.title || 'Untitled Project',
      description: project.description || 'No description provided',
      domain: project.domain,
      complexity: project.complexity,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
      estimated_time: project.estimated_time || '4 weeks',
      use_cases: Array.isArray(project.use_cases) ? project.use_cases : [],
      target_roles: Array.isArray(project.target_roles) ? project.target_roles : [],
      is_trending: project.is_trending !== false,
      resources: Array.isArray(project.resources) ? project.resources : [],
      github_structure: project.github_structure || 'No structure defined',
      architecture: project.architecture || 'No architecture defined',
      deployment_guide: project.deployment_guide || 'No deployment guide available'
    };
    
  } catch (error) {
    console.error('Error parsing project response:', error);
    console.error('Response text:', text);
    throw new Error('Failed to parse project response from AI');
  }
}


export async function generateProjectSuggestions(domain, complexity = 'Intermediate') {
  if (!genAI) {
    console.error('Gemini AI not initialized. Check your API key.');
    throw new Error('Gemini AI not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate 5 trending project ideas for ${complexity} level students/developers in the ${domain} domain.

For each project, provide:
- A catchy, specific title
- A brief 2-sentence description
- 4-5 modern, trending technologies to use
- Estimated time to complete
- 3 real-world use cases

Focus on projects that:
- Use the LATEST and most TRENDING technologies in ${domain} as of 2026
- Are practical and portfolio-worthy
- Can realistically be completed by a ${complexity} level developer
- Solve real-world problems

Return ONLY valid JSON array (no markdown, no code blocks):
[
  {
    "title": "Project Name",
    "description": "Brief compelling description in 2 sentences",
    "tech_stack": ["Modern Tech 1", "Tech 2", "Tech 3", "Tech 4"],
    "estimated_time": "X weeks",
    "complexity": "${complexity}",
    "domain": "${domain}",
    "use_cases": ["Use case 1", "Use case 2", "Use case 3"]
  }
]

Make projects innovative and use cutting-edge ${domain} technologies.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    
    const projects = parseProjectListResponse(text);
    
    console.log(`✅ Generated ${projects.length} project suggestions for ${domain}`);
    return projects;
    
  } catch (error) {
    console.error('Error generating project suggestions:', error);
    throw error;
  }
}


function parseProjectListResponse(text) {
  try {
    
    let cleanedText = text.trim();
    
    
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    const projects = JSON.parse(cleanedText);
    
    if (!Array.isArray(projects)) {
      throw new Error('Response is not an array');
    }
    
    
    return projects.map((project, idx) => ({
      id: `gen-${Date.now()}-${idx}`,
      title: project.title || 'Untitled Project',
      description: project.description || 'No description',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
      estimated_time: project.estimated_time || '4 weeks',
      complexity: project.complexity,
      domain: project.domain,
      use_cases: Array.isArray(project.use_cases) ? project.use_cases : [],
      is_trending: true,
      target_roles: []
    }));
    
  } catch (error) {
    console.error('Error parsing project list response:', error);
    console.error('Response text:', text);
    throw new Error('Failed to parse project list from AI');
  }
}


export function isGeminiConfigured() {
  return genAI !== null;
}


export async function generateProjectsFromSearch(searchQuery, options = {}) {
  const {
    domain = null,
    complexity = null,
    count = 6,
    useCache = true
  } = options;

  if (!genAI) {
    console.error('Gemini AI not initialized. Check your API key.');
    throw new Error('Gemini AI not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  
  if (useCache) {
    const cached = getFromProjectCache(searchQuery, domain, complexity);
    if (cached) {
      console.log('📦 Using cached projects for:', searchQuery);
      return cached;
    }
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    
    const domainContext = domain ? `in the ${domain} domain` : 'across various tech domains';
    const complexityContext = complexity ? `for ${complexity} level` : 'for various skill levels';
    
    const prompt = `You are a tech project advisor. Generate ${count} unique, innovative, and practical project ideas based on the following search query and filters.

Search Query: "${searchQuery}"
Domain Filter: ${domain || 'Any domain'}
Complexity: ${complexity || 'Mixed levels'}

IMPORTANT: Use ONLY 2026 cutting-edge technologies! Include:
- AI/ML: Gemini 2.0, GPT-4, Claude 3, LangChain, Vector DBs
- Frontend: React 19, Next.js 14+, Astro, Svelte 5, shadcn/ui
- Backend: Node.js 20+, Bun, Deno 2.0, FastAPI, tRPC
- Databases: Supabase, PostgreSQL, Prisma, Drizzle ORM
- Cloud: Vercel, Cloudflare, Edge Functions

For each project, provide complete information. Return ONLY valid JSON array (no markdown, no code blocks):

[
  {
    "title": "Specific, catchy project name",
    "description": "Compelling 2-3 sentence description explaining the project and its value",
    "domain": "${domain || 'Appropriate domain'}",
    "complexity": "${complexity || 'Appropriate level (Beginner/Intermediate/Advanced)'}",
    "tech_stack": ["Modern Tech 1", "Tech 2", "Tech 3", "Tech 4", "Tech 5"],
    "estimated_time": "X-Y weeks",
    "use_cases": ["Real-world use case 1", "Use case 2", "Use case 3"],
    "target_roles": ["Relevant job role 1", "Role 2"],
    "resources": [
      {
        "type": "Documentation",
        "title": "Official Resource Name",
        "url": "https://real-url.com",
        "description": "What this resource provides",
        "level": "Beginner/Intermediate/Advanced",
        "source": "Official source name"
      },
      {
        "type": "Video",
        "title": "Tutorial Video Title",
        "url": "https://youtube.com/relevant",
        "description": "Video course description",
        "level": "Beginner",
        "source": "YouTube"
      },
      {
        "type": "GitHub",
        "title": "Example Repository",
        "url": "https://github.com/example",
        "description": "Code example",
        "level": "Intermediate",
        "source": "GitHub"
      }
    ],
    "github_structure": "project-root/\\n├── src/\\n│   ├── components/\\n│   ├── pages/\\n│   └── services/\\n├── tests/\\n└── README.md",
    "architecture": "Brief description of the system architecture and key components",
    "deployment_guide": "1. Setup step\\n2. Deploy step\\n3. Verify step"
  }
]

Requirements:
- Projects MUST be relevant to the search query: "${searchQuery}"
- Use 2026 modern technologies only
- Be practical and achievable
- Include portfolio-worthy projects
- Solve real-world problems
- Each project should be unique and creative`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    
    const projects = parseSearchProjectsResponse(text);
    
    
    const enrichedProjects = projects.map((project, idx) => ({
      ...project,
      id: `search-${Date.now()}-${idx}`,
      is_trending: true,
      likes: Math.floor(Math.random() * 200) + 50,
      created_date: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      generated_from_search: searchQuery,
      market_relevance: 85 + Math.floor(Math.random() * 15) 
    }));
    
    
    if (useCache) {
      saveToProjectCache(searchQuery, domain, complexity, enrichedProjects);
    }
    
    console.log(`✅ Generated ${enrichedProjects.length} projects for search: "${searchQuery}"`);
    return enrichedProjects;
    
  } catch (error) {
    console.error('Error generating projects from search:', error);
    throw error;
  }
}


function parseSearchProjectsResponse(text) {
  try {
    let cleanedText = text.trim();
    
    
    cleanedText = cleanedText.replace(/```json\s*/g, '');
    cleanedText = cleanedText.replace(/```\s*/g, '');
    
    
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    const projects = JSON.parse(cleanedText);
    
    if (!Array.isArray(projects)) {
      throw new Error('Response is not an array');
    }
    
    
    return projects.map(project => ({
      title: project.title || 'Untitled Project',
      description: project.description || 'No description provided',
      domain: project.domain || 'General',
      complexity: project.complexity || 'Intermediate',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack : [],
      estimated_time: project.estimated_time || '3-4 weeks',
      use_cases: Array.isArray(project.use_cases) ? project.use_cases : [],
      target_roles: Array.isArray(project.target_roles) ? project.target_roles : [],
      resources: Array.isArray(project.resources) ? project.resources : [],
      github_structure: project.github_structure || 'No structure defined',
      architecture: project.architecture || 'No architecture defined',
      deployment_guide: project.deployment_guide || 'No deployment guide available',
      
      roadmap: null
    }));
    
  } catch (error) {
    console.error('Error parsing search projects response:', error);
    console.error('Response text:', text);
    throw new Error('Failed to parse projects from AI response');
  }
}


function getFromProjectCache(searchQuery, domain, complexity) {
  try {
    const cacheKey = `project_search_${searchQuery}_${domain || 'all'}_${complexity || 'all'}`.toLowerCase();
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const { projects, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const CACHE_DURATION = 24 * 60 * 60 * 1000; 
    
    if (age > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return projects;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}


function saveToProjectCache(searchQuery, domain, complexity, projects) {
  try {
    const cacheKey = `project_search_${searchQuery}_${domain || 'all'}_${complexity || 'all'}`.toLowerCase();
    localStorage.setItem(cacheKey, JSON.stringify({
      projects,
      timestamp: Date.now()
    }));
    console.log('💾 Cached projects for:', searchQuery);
  } catch (error) {
    console.error('Cache write error:', error);
  }
}


export function clearProjectCache() {
  try {
    const cacheKey = 'gemini_project_cache';
    localStorage.removeItem(cacheKey);
    console.log('✅ Project search cache cleared');
    return true;
  } catch (error) {
    console.error('Error clearing project cache:', error);
    return false;
  }
}


export async function extractSkillsWithAI(text, context = 'resume') {
  if (!genAI) {
    console.warn('⚠️ Gemini not configured, using fallback skill extraction');
    return extractSkillsFallback(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an expert technical recruiter and skill analyst. Extract ALL technical and soft skills from the following ${context}.

${context === 'github' ? 'GitHub Profile Data:' : 'Text:'}
${text}

CRITICAL INSTRUCTIONS FOR SKILL EXTRACTION:
1. Extract EVERY skill mentioned, including:
   - Direct mentions (e.g., "JavaScript", "React")
   - Abbreviations (e.g., "JS" for JavaScript, "ML" for Machine Learning)
   - Variations (e.g., "Node.js", "NodeJS", "Node")
   - Context-based skills (e.g., if they built a REST API, they know REST APIs)
   - Technologies implied by projects (e.g., web scraping implies Python/BeautifulSoup)

2. Extract BOTH full names AND common abbreviations:
   - "JavaScript" AND "JS"
   - "Machine Learning" AND "ML"
   - "TypeScript" AND "TS"
   - "React.js" AND "React"

3. Infer skills from context:
   - Built a web app → likely knows HTML, CSS, JavaScript
   - Data science project → likely knows Python, Pandas, NumPy
   - Mobile app → React Native or Flutter
   - Deployed to cloud → AWS/Azure/GCP

4. Use PROPER capitalization:
   - "JavaScript" not "javascript"
   - "React" not "react"
   - "Node.js" not "nodejs"
   - "ML" not "ml"

Return a JSON object with this structure (NO markdown, just JSON):
{
  "languages": ["All programming languages found - include abbreviations"],
  "frameworks": ["All frameworks and libraries - include variations like React, React.js, ReactJS"],
  "tools": ["Development tools, IDEs, platforms, Git, Docker, etc."],
  "databases": ["All database technologies - MongoDB, SQL, PostgreSQL, etc."],
  "cloud": ["Cloud platforms - AWS, Azure, GCP, Vercel, etc."],
  "soft": ["Soft skills - teamwork, leadership, communication, problem-solving"],
  "other": ["Any other technical skills - REST API, GraphQL, Microservices, CI/CD, etc."]
}

Examples of what to extract:
- If text says "built with JS" → extract both "JavaScript" and "JS"
- If text says "React Native app" → extract "React", "React Native", "JavaScript"
- If text says "ML model" → extract "Machine Learning", "ML", "Python"
- If text says "deployed on AWS" → extract "AWS", "Cloud Computing"

BE COMPREHENSIVE - extract ALL skills, including implied ones!`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    console.log('🤖 Gemini skill extraction response:', textResponse);

    
    const skills = parseSkillsResponse(textResponse);
    return skills;

  } catch (error) {
    console.error('Error extracting skills with AI:', error);
    return extractSkillsFallback(text);
  }
}


function parseSkillsResponse(text) {
  try {
    
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonText);

    return {
      languages: parsed.languages || [],
      frameworks: parsed.frameworks || [],
      tools: parsed.tools || [],
      databases: parsed.databases || [],
      cloud: parsed.cloud || [],
      soft: parsed.soft || [],
      other: parsed.other || []
    };

  } catch (error) {
    console.error('Error parsing skills response:', error);
    return {
      languages: [],
      frameworks: [],
      tools: [],
      databases: [],
      cloud: [],
      soft: [],
      other: []
    };
  }
}

/**
 * Fallback skill extraction using keyword matching
 * Used when Gemini AI is not available
 */
function extractSkillsFallback(text) {
  const textLower = text.toLowerCase();

  // Comprehensive skill patterns with variations
  const skillPatterns = {
    languages: [
      'javascript', 'js', 'typescript', 'ts',
      'python', 'py', 'python3',
      'java', 'c++', 'cpp', 'c#', 'csharp',
      'go', 'golang', 'rust', 'rustlang',
      'php', 'ruby', 'swift', 'kotlin',
      'scala', 'r', 'matlab', 'sql'
    ],
    frameworks: [
      'react', 'reactjs', 'react.js', 'react native',
      'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
      'django', 'flask', 'fastapi',
      'spring', 'spring boot',
      'express', 'expressjs', 'express.js',
      'next.js', 'nextjs', 'nuxt', 'nuxtjs',
      'nest.js', 'nestjs',
      'laravel', 'rails', 'ruby on rails',
      'asp.net', '.net', 'dotnet',
      'tensorflow', 'pytorch', 'keras',
      'scikit-learn', 'sklearn'
    ],
    tools: [
      'git', 'github', 'gitlab', 'bitbucket',
      'docker', 'kubernetes', 'k8s',
      'jenkins', 'travis', 'circleci',
      'vs code', 'vscode', 'visual studio',
      'intellij', 'pycharm', 'webstorm',
      'postman', 'insomnia',
      'jira', 'confluence', 'slack',
      'figma', 'sketch', 'adobe xd',
      'webpack', 'vite', 'rollup', 'babel',
      'npm', 'yarn', 'pnpm',
      'linux', 'unix', 'bash', 'shell scripting'
    ],
    databases: [
      'mongodb', 'mongo',
      'postgresql', 'postgres', 'psql',
      'mysql', 'mariadb',
      'redis', 'memcached',
      'sqlite', 'sql server',
      'dynamodb', 'cassandra',
      'firebase', 'firestore',
      'elasticsearch', 'couchdb'
    ],
    cloud: [
      'aws', 'amazon web services', 's3', 'ec2', 'lambda',
      'azure', 'microsoft azure',
      'gcp', 'google cloud', 'google cloud platform',
      'heroku', 'vercel', 'netlify',
      'digitalocean', 'linode',
      'cloudflare', 'terraform', 'ansible'
    ],
    soft: [
      'leadership', 'team lead', 'lead',
      'communication', 'verbal', 'written',
      'teamwork', 'team work', 'collaboration',
      'problem solving', 'analytical',
      'agile', 'scrum', 'kanban',
      'project management', 'time management'
    ],
    other: [
      'rest', 'rest api', 'restful',
      'graphql', 'graph ql',
      'websocket', 'websockets',
      'microservices', 'micro services',
      'ci/cd', 'cicd', 'devops',
      'testing', 'unit testing', 'tdd', 'test driven',
      'machine learning', 'ml', 'deep learning', 'dl',
      'artificial intelligence', 'ai',
      'data structures', 'algorithms', 'dsa',
      'oop', 'object oriented', 'functional programming',
      'system design', 'architecture',
      'api design', 'web development',
      'mobile development', 'responsive design',
      'html', 'html5', 'css', 'css3', 'sass', 'scss', 'tailwind',
      'node.js', 'nodejs', 'node', 'deno', 'bun',
      'numpy', 'pandas', 'matplotlib'
    ]
  };

  const extracted = {
    languages: [],
    frameworks: [],
    tools: [],
    databases: [],
    cloud: [],
    soft: [],
    other: []
  };

  // Extract skills with proper capitalization
  for (const [category, patterns] of Object.entries(skillPatterns)) {
    const foundSkills = new Set();
    
    patterns.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        // Capitalize properly based on common conventions
        let capitalizedSkill = skill;
        
        // Special cases for known technologies
        const specialCases = {
          'javascript': 'JavaScript',
          'js': 'JavaScript',
          'typescript': 'TypeScript',
          'ts': 'TypeScript',
          'nodejs': 'Node.js',
          'node.js': 'Node.js',
          'reactjs': 'React',
          'react.js': 'React',
          'vuejs': 'Vue.js',
          'vue.js': 'Vue.js',
          'mongodb': 'MongoDB',
          'postgresql': 'PostgreSQL',
          'mysql': 'MySQL',
          'graphql': 'GraphQL',
          'github': 'GitHub',
          'gitlab': 'GitLab',
          'vs code': 'VS Code',
          'vscode': 'VS Code',
          'ml': 'Machine Learning',
          'ai': 'Artificial Intelligence',
          'html': 'HTML',
          'css': 'CSS',
          'sql': 'SQL',
          'api': 'API',
          'rest': 'REST API',
          'aws': 'AWS',
          'gcp': 'GCP',
          'k8s': 'Kubernetes'
        };
        
        if (specialCases[skill.toLowerCase()]) {
          capitalizedSkill = specialCases[skill.toLowerCase()];
        } else {
          // Default capitalization: capitalize first letter of each word
          capitalizedSkill = skill.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
        }
        
        foundSkills.add(capitalizedSkill);
      }
    });
    
    extracted[category] = Array.from(foundSkills);
  }

  console.log('📋 Fallback skill extraction result:', extracted);
  return extracted;
}

/**
 * Analyze skill gap and provide AI recommendations
 * @param {Array<string>} userSkills - User's current skills
 * @param {Array<string>} requiredSkills - Required skills for target role
 * @returns {Promise<Object>} - AI recommendations for learning path
 */
export async function analyzeSkillGap(userSkills, requiredSkills) {
  if (!genAI || requiredSkills.length === 0) {
    return {
      recommendations: [],
      learningPath: 'Focus on building projects that use the missing skills.',
      estimatedTime: '3-6 months'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a career advisor for software developers. A developer has the following skills and wants to learn new ones.

Current Skills: ${userSkills.join(', ')}
Missing Skills to Learn: ${requiredSkills.join(', ')}

Provide a learning strategy in JSON format (NO markdown, just raw JSON):
{
  "recommendations": [
    {
      "skill": "Skill Name",
      "priority": "High/Medium/Low",
      "reason": "Why this skill is important",
      "prerequisites": ["Skills needed before learning this"],
      "resources": ["Type of resources to use"]
    }
  ],
  "learningPath": "Brief description of recommended learning order and strategy",
  "estimatedTime": "Realistic time estimate to learn all skills"
}

Focus on:
1. Learning dependencies (what to learn first)
2. Which skills are most critical
3. Practical learning approach`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    console.log('🤖 Gemini gap analysis response');

    // Parse the response
    const analysis = parseGapAnalysisResponse(textResponse);
    return analysis;

  } catch (error) {
    console.error('Error analyzing skill gap:', error);
    return {
      recommendations: requiredSkills.slice(0, 5).map(skill => ({
        skill,
        priority: 'High',
        reason: 'Required for target role',
        prerequisites: [],
        resources: ['Online courses', 'Documentation', 'Practice projects']
      })),
      learningPath: 'Focus on fundamental skills first, then advance to specialized topics.',
      estimatedTime: '6-12 months'
    };
  }
}

/**
 * Parse gap analysis response
 */
function parseGapAnalysisResponse(text) {
  try {
    // Remove markdown code blocks
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonText);
    return {
      recommendations: parsed.recommendations || [],
      learningPath: parsed.learningPath || '',
      estimatedTime: parsed.estimatedTime || '3-6 months'
    };

  } catch (error) {
    console.error('Error parsing gap analysis:', error);
    return {
      recommendations: [],
      learningPath: 'Focus on practical projects to learn missing skills.',
      estimatedTime: '3-6 months'
    };
  }
}
