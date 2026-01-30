


import { generateProjectsFromSearch, generateFullProject } from './geminiService';
import { getMarketTrends, TECH_TRENDS_2026 } from './marketDataService';
import { enrichProjectWithStructure } from './projectStructureGenerator';

const CACHE_KEY = 'dynamic_projects_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; 
const MIN_PROJECTS_PER_DOMAIN = 1; 
const TARGET_TOTAL_PROJECTS = 12; 


const DOMAINS = [
  'AI/ML',
  'Web Development',
  'Mobile Development',
  'IoT',
  'Cybersecurity',
  'Blockchain',
  'Cloud Computing',
  'AR/VR',
  'Data Science',
  'DevOps'
];

const COMPLEXITY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];


export async function getDynamicProjects(forceRefresh = false) {
  try {
    
    if (!forceRefresh) {
      const cached = getCachedProjects();
      if (cached) {
        console.log('📦 Using cached dynamic projects:', cached.length);
        return cached;
      }
    }

    
    console.log('🔄 Generating dynamic projects from market trends...');
    const projects = await generateProjectsFromMarketTrends();
    
    
    cacheProjects(projects);
    
    console.log(`✅ Generated ${projects.length} dynamic projects`);
    return projects;
    
  } catch (error) {
    console.error('Error getting dynamic projects:', error);
    
    
    return getFallbackProjects();
  }
}


async function generateProjectsFromMarketTrends() {
  const trends = await getMarketTrends();
  const projects = [];
  
  
  const domainAllocation = calculateDomainAllocation(trends.domains);
  
  console.log('📊 Domain allocation:', domainAllocation);
  
  
  for (const [domain, count] of Object.entries(domainAllocation)) {
    try {
      console.log(`Generating ${count} projects for ${domain}...`);
      
      
      const complexityDistribution = distributeComplexity(count);
      
      for (const [complexity, complexityCount] of Object.entries(complexityDistribution)) {
        if (complexityCount > 0) {
          
          const domainProjects = await generateProjectsForDomain(
            domain,
            complexity,
            complexityCount,
            trends
          );
          projects.push(...domainProjects);
        }
      }
      
      
      await sleep(500);
      
    } catch (error) {
      console.error(`Failed to generate projects for ${domain}:`, error);
      
    }
  }
  
  return projects;
}


function calculateDomainAllocation(domainScores) {
  const allocation = {};
  
  
  const totalWeight = Object.values(domainScores).reduce((sum, score) => sum + score, 0);
  
  let allocatedProjects = 0;
  
  
  for (const [domain, score] of Object.entries(domainScores)) {
    
    const proportionalCount = Math.round((score / totalWeight) * TARGET_TOTAL_PROJECTS);
    
    
    const count = Math.max(MIN_PROJECTS_PER_DOMAIN, proportionalCount);
    
    allocation[domain] = count;
    allocatedProjects += count;
  }
  
  
  const difference = TARGET_TOTAL_PROJECTS - allocatedProjects;
  if (difference !== 0) {
    
    const topDomain = Object.entries(domainScores)
      .sort(([, a], [, b]) => b - a)[0][0];
    allocation[topDomain] = Math.max(MIN_PROJECTS_PER_DOMAIN, allocation[topDomain] + difference);
  }
  
  return allocation;
}


function distributeComplexity(totalCount) {
  if (totalCount <= 2) {
    return { 'Intermediate': totalCount };
  }
  
  
  const beginner = Math.max(0, Math.floor(totalCount * 0.3));
  const advanced = Math.max(0, Math.floor(totalCount * 0.2));
  const intermediate = totalCount - beginner - advanced;
  
  return {
    'Beginner': beginner,
    'Intermediate': intermediate,
    'Advanced': advanced
  };
}


async function generateProjectsForDomain(domain, complexity, count, trends) {
  const projects = [];
  
  try {
    
    const searchQuery = `${domain} projects for ${complexity} developers in 2026`;
    
    const generatedProjects = await generateProjectsFromSearch(searchQuery, {
      domain,
      complexity,
      count,
      useCache: false 
    });
    
    
    const enrichedProjects = generatedProjects.map(project => {
      const baseProject = {
        ...project,
        id: project.id || `dynamic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        domain,
        complexity,
        is_trending: trends.domains[domain] > 1.5,
        market_score: trends.domains[domain],
        created_date: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        generated_by: 'dynamic_service',
        likes: Math.floor(Math.random() * 200) + 50,
        trending_score: calculateTrendingScore(domain, trends.domains[domain])
      };
      
      
      return enrichProjectWithStructure(baseProject);
    });
    
    projects.push(...enrichedProjects);
    
  } catch (error) {
    console.error(`Error generating ${count} projects for ${domain} (${complexity}):`, error);
  }
  
  return projects;
}


function calculateTrendingScore(domain, marketScore) {
  const baseScore = 50;
  const marketBonus = (marketScore - 1.0) * 30; 
  const randomVariation = Math.random() * 15; 
  
  return Math.round(baseScore + marketBonus + randomVariation);
}


export async function initializeDynamicProjects() {
  try {
    const cached = getCachedProjects();
    
    if (cached && cached.length > 0) {
      console.log('✅ Dynamic projects already initialized:', cached.length);
      return cached;
    }
    
    console.log('🚀 Initializing dynamic projects for first time...');
    console.log('⏳ This may take 2-3 minutes with Gemini API...');
    
    const projects = await getDynamicProjects(true);
    
    console.log('✅ Dynamic projects initialized successfully:', projects.length);
    return projects;
    
  } catch (error) {
    console.error('Failed to initialize dynamic projects:', error);
    return getFallbackProjects();
  }
}


export async function refreshProjectsFromMarketTrends() {
  console.log('🔄 Refreshing all projects based on latest market trends...');
  
  
  clearProjectCache();
  return await getDynamicProjects(true);
}


function getCachedProjects() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { projects, timestamp, marketSnapshot } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    
    if (age > CACHE_DURATION) {
      console.log('⏰ Cache expired, will regenerate');
      clearProjectCache();
      return null;
    }
    
    
    if (hasMarketChangedSignificantly(marketSnapshot)) {
      console.log('📊 Market trends changed significantly, will regenerate');
      clearProjectCache();
      return null;
    }
    
    const hoursLeft = Math.round((CACHE_DURATION - age) / (1000 * 60 * 60));
    console.log(`📦 Cache valid for ${hoursLeft} more hours`);
    
    return projects;
    
  } catch (error) {
    console.error('Error reading project cache:', error);
    clearProjectCache();
    return null;
  }
}


function cacheProjects(projects) {
  try {
    const cacheData = {
      projects,
      timestamp: Date.now(),
      marketSnapshot: TECH_TRENDS_2026.domains, 
      version: '1.0'
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cached', projects.length, 'projects');
    
  } catch (error) {
    console.error('Error caching projects:', error);
  }
}


function hasMarketChangedSignificantly(oldMarketSnapshot) {
  if (!oldMarketSnapshot) return true;
  
  try {
    const currentMarket = TECH_TRENDS_2026.domains;
    
    
    for (const [domain, oldScore] of Object.entries(oldMarketSnapshot)) {
      const currentScore = currentMarket[domain] || 1.0;
      const change = Math.abs(currentScore - oldScore);
      const percentChange = (change / oldScore) * 100;
      
      if (percentChange > 10) {
        console.log(`📈 ${domain} trend changed by ${percentChange.toFixed(1)}%`);
        return true;
      }
    }
    
    return false;
    
  } catch (error) {
    console.error('Error checking market changes:', error);
    return true; 
  }
}


export function clearProjectCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Cleared dynamic projects cache');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}


function getFallbackProjects() {
  console.warn('⚠️ Using fallback projects (minimal set)');
  
  
  return DOMAINS.slice(0, 5).map((domain, idx) => enrichProjectWithStructure({
    id: `fallback-${idx}`,
    title: `${domain} Starter Project`,
    description: `Build a practical ${domain} project to demonstrate your skills. This is a fallback project generated when AI service is unavailable.`,
    domain,
    complexity: 'Intermediate',
    tech_stack: ['Modern technologies', 'Best practices', '2026 tools'],
    estimated_time: '3-4 weeks',
    use_cases: ['Portfolio building', 'Skill development', 'Learning'],
    target_roles: ['Developer', 'Engineer'],
    is_trending: false,
    likes: 50,
    trending_score: 50,
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    generated_by: 'fallback',
    roadmap: {
      phases: [
        {
          name: 'Planning',
          duration: '3 days',
          tasks: [
            {
              id: 'plan-1',
              title: 'Research and planning',
              description: 'Research best practices and plan the project',
              duration: '3 days'
            }
          ]
        },
        {
          name: 'Development',
          duration: '2-3 weeks',
          tasks: [
            {
              id: 'dev-1',
              title: 'Build core features',
              description: 'Implement main functionality',
              duration: '2-3 weeks'
            }
          ]
        },
        {
          name: 'Testing',
          duration: '3 days',
          tasks: [
            {
              id: 'test-1',
              title: 'Testing and debugging',
              description: 'Test and fix issues',
              duration: '3 days'
            }
          ]
        }
      ]
    },
    resources: [
      {
        type: 'Documentation',
        title: `${domain} Documentation`,
        url: 'https://example.com',
        description: 'Official documentation',
        level: 'Beginner',
        source: 'Official'
      }
    ]
  }));
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export function getCacheStats() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) {
      return { exists: false, projects: 0, age: 0 };
    }
    
    const { projects, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    const hoursOld = Math.round(age / (1000 * 60 * 60));
    const hoursRemaining = Math.round((CACHE_DURATION - age) / (1000 * 60 * 60));
    
    return {
      exists: true,
      projectCount: projects.length,
      hoursOld,
      hoursRemaining: Math.max(0, hoursRemaining),
      isExpired: age > CACHE_DURATION
    };
    
  } catch (error) {
    return { exists: false, projects: 0, age: 0, error: error.message };
  }
}
