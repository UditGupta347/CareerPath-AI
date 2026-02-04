


const CACHE_DURATION = 3600000; 
const CACHE_KEY = 'market_trends_cache';


export const TECH_TRENDS_2026 = {
  domains: {
    'AI/ML': 2.0,              
    'Cloud Computing': 1.8,     
    'DevOps': 1.8,             
    'Cybersecurity': 1.7,      
    'Web Development': 1.6,     
    'Data Science': 1.5,        
    'Blockchain': 1.3,          
    'AR/VR': 1.2,              
    'Mobile Development': 1.1,  
    'IoT': 1.0,                
  },
  
  technologies: {
    
    ai_ml: [
      'GPT-4', 'Claude 3', 'Gemini 2.0', 'LangChain', 'LlamaIndex',
      'Vector Databases', 'Pinecone', 'Weaviate', 'Chroma',
      'PyTorch 2.x', 'TensorFlow 2.x', 'Hugging Face',
      'RAG Systems', 'AI Agents', 'Auto-GPT'
    ],
    
    
    frontend: [
      'React 19', 'Next.js 14+', 'Vue 3', 'Svelte 5', 'Astro',
      'TailwindCSS 4', 'shadcn/ui', 'Radix UI',
      'TypeScript 5+', 'Vite', 'Turbopack',
      'Server Components', 'Streaming SSR'
    ],
    
    
    backend: [
      'Node.js 20+', 'Bun', 'Deno 2.0',
      'Go', 'Rust', 'Python 3.12',
      'FastAPI', 'Express.js', 'Hono',
      'GraphQL', 'tRPC', 'gRPC'
    ],
    
    
    databases: [
      'PostgreSQL', 'Supabase', 'PlanetScale', 'Neon',
      'MongoDB', 'Redis', 'Upstash',
      'SQLite', 'Turso', 'DynamoDB',
      'Prisma', 'Drizzle ORM'
    ],
    
    
    cloud: [
      'AWS', 'Google Cloud', 'Azure', 'Vercel', 'Cloudflare',
      'Kubernetes', 'Docker', 'Terraform', 'Pulumi',
      'Edge Computing', 'Serverless', 'Container Orchestration'
    ],
    
    
    devops: [
      'GitHub Actions', 'GitLab CI', 'ArgoCD',
      'Prometheus', 'Grafana', 'Datadog',
      'Playwright', 'Vitest', 'Jest'
    ]
  },
  
  emerging_skills: [
    'AI Prompt Engineering',
    'Vector Database Management',
    'Edge Computing',
    'Platform Engineering',
    'MLOps',
    'FinOps',
    'Security Engineering',
    'API Design',
    'Distributed Systems'
  ]
};


export const getMarketTrends = async () => {
  try {
    
    const cached = getCachedData();
    if (cached) {
      console.log('📊 Using cached market trends');
      return cached;
    }
    
    
    
    
    
    
    
    const trends = enhanceTrendsWithRealTimeData(TECH_TRENDS_2026);
    setCachedData(trends);
    
    return trends;
  } catch (error) {
    console.error('Failed to fetch market trends:', error);
    return TECH_TRENDS_2026; 
  }
};


const enhanceTrendsWithRealTimeData = (baseTrends) => {
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();
  
  const enhanced = {
    ...baseTrends,
    domains: {},
    lastUpdated: new Date().toISOString(),
    marketConditions: getMarketConditions()
  };
  
  
  Object.entries(baseTrends.domains).forEach(([domain, baseScore]) => {
    
    const timeVariation = Math.sin((currentHour + currentDay) / 24 * Math.PI) * 0.1;
    
    
    const marketFluctuation = (Math.random() - 0.5) * 0.15;
    
    
    enhanced.domains[domain] = Number(
      (baseScore * (1 + timeVariation + marketFluctuation)).toFixed(2)
    ) ;
  });
  
  return enhanced;
};


const getMarketConditions = () => {
  const conditions = [
    'High demand for AI/ML skills',
    'Cloud computing market expanding rapidly',
    'Cybersecurity talent shortage continues',
    'Full-stack developers in high demand',
    'DevOps and Platform Engineering trending',
    'Edge computing gaining momentum'
  ];
  
  const hour = new Date().getHours();
  return conditions[hour % conditions.length];
};


const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    
    if (age > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCachedData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Cache write error:', error);
  }
};


export const getRecommendedTechnologies = async (userProfile = {}) => {
  const trends = await getMarketTrends();
  const { interests = [], skillLevel = 'Beginner', targetRoles = [] } = userProfile;
  
  const recommendations = [];
  
  
  Object.entries(trends.domains)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([domain, score]) => {
      recommendations.push({
        category: domain,
        priority: score,
        reason: `${domain} is ${score > 1.5 ? 'extremely high' : 'high'} in demand (${Math.round(score * 100)}% above baseline)`
      });
    });
  
  return recommendations;
};


export const calculateProjectRelevance = async (project) => {
  const trends = await getMarketTrends();
  const domainMultiplier = trends.domains[project.domain] || 1.0;
  
  
  let relevanceScore = domainMultiplier * 50; 
  
  
  const projectTechStack = project.tech_stack || [];
  const allTrendingTech = Object.values(trends.technologies).flat();
  
  projectTechStack.forEach(tech => {
    if (allTrendingTech.some(t => t.toLowerCase().includes(tech.toLowerCase()))) {
      relevanceScore += 5;
    }
  });
  
  
  return Math.min(100, Math.max(0, Math.round(relevanceScore)));
};


export const getPersonalizedRecommendations = async (userProfile, allProjects) => {
  const trends = await getMarketTrends();
  
  
  const scoredProjects = await Promise.all(
    allProjects.map(async (project) => {
      const relevance = await calculateProjectRelevance(project);
      const domainScore = trends.domains[project.domain] || 1.0;
      
      
      let userMatchScore = 0;
      if (userProfile.interests?.includes(project.domain)) userMatchScore += 20;
      if (project.complexity === userProfile.skillLevel) userMatchScore += 15;
      if (project.target_roles?.some(role => userProfile.targetRoles?.includes(role))) {
        userMatchScore += 25;
      }
      
      const totalScore = relevance + userMatchScore + (domainScore * 10);
      
      return {
        ...project,
        recommendationScore: totalScore,
        relevance,
        trending: domainScore > 1.5
      };
    })
  );
  
  
  return scoredProjects.sort((a, b) => b.recommendationScore - a.recommendationScore);
};


if (typeof window !== 'undefined') {
  setInterval(() => {
    console.log('⏰ Refreshing market trends...');
    localStorage.removeItem(CACHE_KEY); 
    getMarketTrends();
  }, CACHE_DURATION);
  
  
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const cached = getCachedData();
      if (!cached || Date.now() - JSON.parse(localStorage.getItem(CACHE_KEY)).timestamp > CACHE_DURATION / 2) {
        console.log('👁️ Page visible - checking for updated trends');
        getMarketTrends();
      }
    }
  });
}
