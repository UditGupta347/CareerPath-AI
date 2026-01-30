


import { TECH_TRENDS_2026 } from './marketDataService';


const PROJECT_TEMPLATES = {
  'AI/ML': [
    {
      title: 'AI-Powered {interest} Platform',
      description: 'Build an intelligent {interest} solution using machine learning to {use_case}',
      tech_stack: {
        beginner: ['Python', 'Streamlit', 'Scikit-learn', 'Pandas', 'Matplotlib'],
        intermediate: ['Python', 'FastAPI', 'TensorFlow', 'PostgreSQL', 'Docker'],
        advanced: ['Python', 'PyTorch', 'Kubernetes', 'MLflow', 'Redis', 'Elasticsearch']
      },
      use_cases: ['Intelligent automation', 'Predictive analytics', 'Natural language processing'],
      time: { beginner: '3-4 weeks', intermediate: '4-6 weeks', advanced: '6-8 weeks' }
    },
    {
      title: '{role} AI Assistant',
      description: 'Create a specialized AI assistant for {interest} that provides intelligent recommendations and insights',
      tech_stack: {
        beginner: ['Python', 'OpenAI API', 'Streamlit', 'SQLite'],
        intermediate: ['Node.js', 'React', 'Gemini API', 'MongoDB', 'Redis'],
        advanced: ['Python', 'FastAPI', 'Vector DB', 'Kubernetes', 'Prometheus']
      },
      use_cases: ['Personalized recommendations', 'Automated research', 'Decision support'],
      time: { beginner: '2-3 weeks', intermediate: '3-5 weeks', advanced: '5-7 weeks' }
    }
  ],
  'Web Development': [
    {
      title: 'Modern {interest} Platform',
      description: 'Full-featured web platform for {interest} with real-time features and modern UI',
      tech_stack: {
        beginner: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express'],
        intermediate: ['React', 'Next.js 14', 'TailwindCSS', 'Supabase', 'Vercel'],
        advanced: ['Next.js 14', 'TypeScript', 'tRPC', 'Prisma', 'PostgreSQL', 'Redis']
      },
      use_cases: ['User management', 'Real-time collaboration', 'Data visualization'],
      time: { beginner: '3-4 weeks', intermediate: '4-6 weeks', advanced: '6-8 weeks' }
    },
    {
      title: '{interest} E-Commerce Platform',
      description: 'Complete online marketplace for {interest} with payments and analytics',
      tech_stack: {
        beginner: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        intermediate: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis', 'Cloudflare'],
        advanced: ['Next.js', 'Microservices', 'GraphQL', 'Kubernetes', 'Kafka']
      },
      use_cases: ['Product catalog', 'Payment processing', 'Order management'],
      time: { beginner: '4-5 weeks', intermediate: '5-7 weeks', advanced: '8-10 weeks' }
    }
  ],
  'Blockchain': [
    {
      title: 'Decentralized {interest} Platform',
      description: 'Blockchain-based solution for {interest} with smart contracts and transparency',
      tech_stack: {
        beginner: ['Solidity', 'Remix IDE', 'MetaMask', 'React'],
        intermediate: ['Solidity', 'Hardhat', 'React', 'Ethers.js', 'IPFS'],
        advanced: ['Solidity', 'Foundry', 'Next.js', 'The Graph', 'Chainlink']
      },
      use_cases: ['Transparent transactions', 'Decentralized governance', 'Token economics'],
      time: { beginner: '4-5 weeks', intermediate: '6-8 weeks', advanced: '8-12 weeks' }
    }
  ],
  'Mobile Development': [
    {
      title: '{interest} Mobile App',
      description: 'Cross-platform mobile application for {interest} with native performance',
      tech_stack: {
        beginner: ['React Native', 'Expo', 'Firebase'],
        intermediate: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
        advanced: ['React Native', 'Native Modules', 'GraphQL', 'AWS Amplify']
      },
      use_cases: ['Mobile-first experience', 'Offline functionality', 'Push notifications'],
      time: { beginner: '3-4 weeks', intermediate: '4-6 weeks', advanced: '6-8 weeks' }
    }
  ],
  'Cloud Computing': [
    {
      title: 'Scalable {interest} Infrastructure',
      description: 'Cloud-native solution for {interest} with auto-scaling and monitoring',
      tech_stack: {
        beginner: ['AWS', 'EC2', 'S3', 'RDS'],
        intermediate: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
        advanced: ['Multi-cloud', 'Service Mesh', 'GitOps', 'ArgoCD', 'Istio']
      },
      use_cases: ['Auto-scaling', 'Disaster recovery', 'Cost optimization'],
      time: { beginner: '3-4 weeks', intermediate: '5-6 weeks', advanced: '7-9 weeks' }
    }
  ],
  'IoT': [
    {
      title: 'Smart {interest} IoT System',
      description: 'IoT solution for {interest} with sensor integration and real-time monitoring',
      tech_stack: {
        beginner: ['Arduino', 'MQTT', 'Node.js', 'InfluxDB'],
        intermediate: ['Raspberry Pi', 'MQTT', 'React', 'InfluxDB', 'Grafana'],
        advanced: ['ESP32', 'Edge Computing', 'Kubernetes', 'Time Series DB', 'ML Models']
      },
      use_cases: ['Sensor monitoring', 'Automated control', 'Predictive maintenance'],
      time: { beginner: '3-4 weeks', intermediate: '4-6 weeks', advanced: '6-8 weeks' }
    }
  ],
  'Cybersecurity': [
    {
      title: '{interest} Security Monitoring System',
      description: 'Advanced security solution for {interest} with threat detection and response',
      tech_stack: {
        beginner: ['Python', 'Scapy', 'Wireshark', 'SQLite'],
        intermediate: ['Python', 'Elasticsearch', 'Kibana', 'Suricata', 'Docker'],
        advanced: ['Python', 'ML', 'SIEM', 'Threat Intelligence', 'Zero Trust']
      },
      use_cases: ['Threat detection', 'Incident response', 'Compliance monitoring'],
      time: { beginner: '4-5 weeks', intermediate: '6-7 weeks', advanced: '8-10 weeks' }
    }
  ],
  'DevOps': [
    {
      title: '{interest} CI/CD Pipeline',
      description: 'Automated deployment pipeline for {interest} with monitoring and rollback',
      tech_stack: {
        beginner: ['GitHub Actions', 'Docker', 'Heroku'],
        intermediate: ['Jenkins', 'Docker', 'Kubernetes', 'Helm', 'Prometheus'],
        advanced: ['GitOps', 'ArgoCD', 'Terraform', 'Service Mesh', 'Chaos Engineering']
      },
      use_cases: ['Continuous deployment', 'Infrastructure as code', 'Automated testing'],
      time: { beginner: '2-3 weeks', intermediate: '4-5 weeks', advanced: '6-8 weeks' }
    }
  ],
  'Data Science': [
    {
      title: '{interest} Analytics Dashboard',
      description: 'Interactive data analysis platform for {interest} with ML insights',
      tech_stack: {
        beginner: ['Python', 'Pandas', 'Matplotlib', 'Jupyter'],
        intermediate: ['Python', 'Streamlit', 'Plotly', 'PostgreSQL', 'MLflow'],
        advanced: ['Python', 'Apache Spark', 'Airflow', 'Kafka', 'Kubernetes']
      },
      use_cases: ['Data visualization', 'Predictive modeling', 'Business intelligence'],
      time: { beginner: '3-4 weeks', intermediate: '4-6 weeks', advanced: '6-8 weeks' }
    }
  ],
  'AR/VR': [
    {
      title: '{interest} AR Experience',
      description: 'Immersive AR application for {interest} with spatial computing features',
      tech_stack: {
        beginner: ['Unity', 'ARCore', 'C#'],
        intermediate: ['Unity', 'ARKit', 'ARCore', 'Photon', 'Firebase'],
        advanced: ['Unreal Engine', 'WebXR', 'Cloud Anchors', 'Multiplayer', 'AI']
      },
      use_cases: ['Spatial interaction', 'Virtual training', '3D visualization'],
      time: { beginner: '4-5 weeks', intermediate: '6-7 weeks', advanced: '8-10 weeks' }
    }
  ]
};


const DOMAIN_INTERESTS = {
  'AI/ML': ['healthcare', 'finance', 'e-commerce', 'education', 'content creation', 'customer service'],
  'Web Development': ['social media', 'project management', 'e-learning', 'booking', 'portfolio'],
  'Blockchain': ['supply chain', 'voting', 'identity', 'finance', 'NFT marketplace'],
  'Mobile Development': ['fitness', 'productivity', 'social', 'travel', 'food delivery'],
  'Cloud Computing': ['microservices', 'data pipelines', 'media processing', 'gaming'],
  'IoT': ['home automation', 'agriculture', 'healthcare', 'industrial', 'energy'],
  'Cybersecurity': ['network', 'application', 'cloud', 'endpoint', 'data'],
  'DevOps': ['web applications', 'microservices', 'mobile apps', 'machine learning'],
  'Data Science': ['sales', 'marketing', 'finance', 'healthcare', 'customer behavior'],
  'AR/VR': ['retail', 'education', 'real estate', 'gaming', 'training']
};


const ROLE_CUSTOMIZATIONS = {
  'Full Stack Developer': { focus: 'end-to-end development', emphasis: 'both frontend and backend' },
  'Frontend Developer': { focus: 'user interface', emphasis: 'responsive design and UX' },
  'Backend Developer': { focus: 'server architecture', emphasis: 'APIs and databases' },
  'Machine Learning Engineer': { focus: 'ML models', emphasis: 'training and deployment' },
  'Data Scientist': { focus: 'data analysis', emphasis: 'insights and visualization' },
  'DevOps Engineer': { focus: 'deployment automation', emphasis: 'CI/CD and infrastructure' },
  'Mobile Developer': { focus: 'mobile experience', emphasis: 'native performance' },
  'Cloud Engineer': { focus: 'cloud infrastructure', emphasis: 'scalability and reliability' },
  'Security Analyst': { focus: 'security measures', emphasis: 'threat prevention' },
  'Blockchain Developer': { focus: 'smart contracts', emphasis: 'decentralization' }
};


export function generateProject({ domain, complexity, targetRole, interests, existingSkills }) {
  
  const globalCount = getGlobalGenerationCount();
  const variationNum = globalCount + 1;
  
  
  updateGlobalGenerationCount();
  
  
  const templates = PROJECT_TEMPLATES[domain] || PROJECT_TEMPLATES['Web Development'];
  const randomOffset = Math.floor(Math.random() * templates.length);
  const templateIndex = (variationNum + randomOffset) % templates.length;
  const template = templates[templateIndex];
  
  
  const userInterest = interests || getRandomInterest(domain);
  const interest = userInterest || 'general purpose';
  
  
  const roleCustom = ROLE_CUSTOMIZATIONS[targetRole] || { focus: 'development', emphasis: 'implementation' };
  
  
  let title = template.title
    .replace('{interest}', interest)
    .replace('{role}', targetRole || 'Developer');
  
  
  const variations = [
    'Modern',
    'Advanced',
    'Professional',
    'Enterprise',
    'Next-Gen',
    'Smart',
    'Intelligent',
    'Complete',
    'Premium',
    'Enhanced'
  ];
  const variationPrefix = variations[variationNum % variations.length];
  title = `${variationPrefix} ${title}`;
  
  
  const useCaseIndex = (variationNum + Math.floor(Math.random() * template.use_cases.length)) % template.use_cases.length;
  const description = template.description
    .replace('{interest}', interest)
    .replace('{use_case}', template.use_cases[useCaseIndex].toLowerCase());
  
  
  const complexityLevel = complexity.toLowerCase();
  let tech_stack = [...(template.tech_stack[complexityLevel] || template.tech_stack.intermediate)];
  
  
  tech_stack = rotateTechStack(tech_stack, variationNum);
  
  
  const enhancedTech = enhanceTechStack(tech_stack, domain, variationNum);
  
  
  const roadmap = generateRoadmap(title, complexity, template.time[complexityLevel], variationNum);
  
  
  const resources = generateResources(domain, complexity);
  
  
  const projectId = `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  
  const project = {
    id: projectId,
    title,
    description: `${description}. Perfect for ${targetRole || 'developers'} focusing on ${roleCustom.focus} with ${roleCustom.emphasis}.`,
    domain,
    complexity,
    tech_stack: enhancedTech,
    estimated_time: template.time[complexityLevel],
    use_cases: template.use_cases,
    target_roles: [targetRole || 'Developer'],
    is_trending: true,
    likes: Math.floor(Math.random() * 150) + 50,
    trending_score: 85 + Math.floor(Math.random() * 15),
    roadmap,
    resources,
    github_structure: generateGithubStructure(domain, complexity),
    architecture: generateArchitecture(domain, enhancedTech),
    deployment_guide: generateDeploymentGuide(domain, complexity),
    created_date: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    generated_by: 'smart_generator',
    variation: variationNum
  };
  
  return project;
}


function getGlobalGenerationCount() {
  try {
    const count = localStorage.getItem('global_gen_count');
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}


function updateGlobalGenerationCount() {
  try {
    const currentCount = getGlobalGenerationCount();
    localStorage.setItem('global_gen_count', (currentCount + 1).toString());
  } catch (error) {
    console.error('Failed to update generation count:', error);
  }
}


function rotateTechStack(techStack, variation) {
  const rotated = [...techStack];
  
  const rotateBy = (variation + Math.floor(Math.random() * techStack.length)) % rotated.length;
  return [...rotated.slice(rotateBy), ...rotated.slice(0, rotateBy)];
}

function getRandomInterest(domain) {
  const interests = DOMAIN_INTERESTS[domain] || ['application'];
  return interests[Math.floor(Math.random() * interests.length)];
}

function enhanceTechStack(baseTech, domain, variation = 1) {
  const trends = TECH_TRENDS_2026.technologies;
  const modern2026Tech = {
    'AI/ML': ['Gemini 2.0', 'GPT-4', 'Vector DB', 'LangChain', 'PyTorch'],
    'Web Development': ['Next.js 14+', 'shadcn/ui', 'Server Components', 'Turbopack', 'Bun'],
    'Blockchain': ['Solidity', 'Hardhat', 'The Graph', 'Chainlink', 'Foundry'],
    'Cloud Computing': ['Kubernetes', 'Terraform', 'ArgoCD', 'Istio', 'Pulumi'],
    'Data Science': ['PyTorch 2.x', 'Streamlit', 'Plotly', 'DuckDB', 'Polars']
  };
  
  const enhanced = [...baseTech];
  const domainTech = modern2026Tech[domain] || [];
  
  
  const startIndex = (variation - 1) % domainTech.length;
  domainTech.slice(startIndex, startIndex + 2).forEach(tech => {
    if (!enhanced.includes(tech) && enhanced.length < 7) {
      enhanced.push(tech);
    }
  });
  
  return enhanced;
}

function generateRoadmap(title, complexity, duration, variation = 1) {
  const taskVariations = [
    { plan: 'Requirements analysis', dev: 'Backend development', deploy: 'Setup hosting' },
    { plan: 'System architecture', dev: 'API development', deploy: 'Configure infrastructure' },
    { plan: 'Technical design', dev: 'Core features', deploy: 'Production deployment' },
    { plan: 'Solution planning', dev: 'Feature implementation', deploy: 'Cloud deployment' }
  ];
  
  const variantIdx = (variation - 1) % taskVariations.length;
  const taskVariant = taskVariations[variantIdx];
  
  const phases = [
    {
      name: 'Planning & Design',
      duration: complexity === 'Beginner' ? '2-3 days' : complexity === 'Advanced' ? '1 week' : '3-5 days',
      tasks: [
        { id: 'plan-1', title: taskVariant.plan, description: 'Define project scope and requirements', duration: '1 day' },
        { id: 'plan-2', title: 'System design', description: 'Design architecture and data models', duration: '1-2 days' },
        { id: 'plan-3', title: 'UI/UX mockups', description: 'Create wireframes and user flows', duration: '1 day' }
      ]
    },
    {
      name: 'Development',
      duration: complexity === 'Beginner' ? '2 weeks' : complexity === 'Advanced' ? '4-5 weeks' : '3 weeks',
      tasks: [
        { id: 'dev-1', title: 'Environment setup', description: 'Initialize project and dependencies', duration: '1 day' },
        { id: 'dev-2', title: taskVariant.dev, description: 'Build APIs and business logic', duration: '1 week' },
        { id: 'dev-3', title: 'Frontend development', description: 'Create user interface components', duration: '1 week' },
        { id: 'dev-4', title: 'Integration', description: 'Connect frontend and backend', duration: '2-3 days' },
        { id: 'dev-5', title: 'Testing', description: 'Unit and integration tests', duration: '2-3 days' }
      ]
    },
    {
      name: 'Deployment',
      duration: complexity === 'Beginner' ? '2-3 days' : complexity === 'Advanced' ? '1 week' : '3-5 days',
      tasks: [
        { id: 'deploy-1', title: taskVariant.deploy, description: 'Configure production environment', duration: '1-2 days' },
        { id: 'deploy-2', title: 'Deploy application', description: 'Push to production', duration: '1 day' },
        { id: 'deploy-3', title: 'Monitoring setup', description: 'Configure logging and alerts', duration: '1 day' }
      ]
    }
  ];
  
  return { phases };
}

function generateResources(domain, complexity) {
  
  const domainResources = {
    'AI/ML': {
      documentation: 'https://www.tensorflow.org/tutorials',
      video: 'https://www.youtube.com/results?search_query=machine+learning+tutorial',
      article: 'https://towardsdatascience.com/',
      github: 'https://github.com/topics/machine-learning'
    },
    'Web Development': {
      documentation: 'https://developer.mozilla.org/en-US/docs/Web',
      video: 'https://www.youtube.com/results?search_query=web+development+tutorial',
      article: 'https://dev.to/t/webdev',
      github: 'https://github.com/topics/web-development'
    },
    'Blockchain': {
      documentation: 'https://docs.soliditylang.org/',
      video: 'https://www.youtube.com/results?search_query=blockchain+development',
      article: 'https://ethereum.org/en/developers/docs/',
      github: 'https://github.com/topics/blockchain'
    },
    'Mobile Development': {
      documentation: 'https://reactnative.dev/docs/getting-started',
      video: 'https://www.youtube.com/results?search_query=react+native+tutorial',
      article: 'https://medium.com/tag/mobile-development',
      github: 'https://github.com/topics/react-native'
    },
    'Cloud Computing': {
      documentation: 'https://docs.aws.amazon.com/',
      video: 'https://www.youtube.com/results?search_query=cloud+computing+aws',
      article: 'https://aws.amazon.com/blogs/',
      github: 'https://github.com/topics/cloud-computing'
    },
    'IoT': {
      documentation: 'https://www.arduino.cc/reference/en/',
      video: 'https://www.youtube.com/results?search_query=iot+tutorial',
      article: 'https://www.hackster.io/',
      github: 'https://github.com/topics/iot'
    },
    'Cybersecurity': {
      documentation: 'https://owasp.org/www-project-web-security-testing-guide/',
      video: 'https://www.youtube.com/results?search_query=cybersecurity+tutorial',
      article: 'https://www.csoonline.com/',
      github: 'https://github.com/topics/security'
    },
    'DevOps': {
      documentation: 'https://kubernetes.io/docs/home/',
      video: 'https://www.youtube.com/results?search_query=devops+tutorial',
      article: 'https://devops.com/',
      github: 'https://github.com/topics/devops'
    },
    'Data Science': {
      documentation: 'https://pandas.pydata.org/docs/',
      video: 'https://www.youtube.com/results?search_query=data+science+python',
      article: 'https://towardsdatascience.com/',
      github: 'https://github.com/topics/data-science'
    },
    'AR/VR': {
      documentation: 'https://developer.apple.com/arkit/',
      video: 'https://www.youtube.com/results?search_query=ar+vr+development',
      article: 'https://www.roadtovr.com/',
      github: 'https://github.com/topics/augmented-reality'
    }
  };

  const urls = domainResources[domain] || domainResources['Web Development'];
  
  const resources = [
    {
      type: 'Documentation',
      title: `${domain} Official Documentation`,
      url: urls.documentation,
      description: `Complete ${domain} documentation and guides`,
      level: 'All',
      source: 'Official'
    },
    {
      type: 'Video',
      title: `${domain} Video Tutorials`,
      url: urls.video,
      description: `Step-by-step ${domain} video tutorials`,
      level: complexity,
      source: 'YouTube'
    },
    {
      type: 'Article',
      title: `${domain} Articles & Blogs`,
      url: urls.article,
      description: `Latest ${domain} articles and best practices`,
      level: complexity,
      source: 'Community'
    },
    {
      type: 'GitHub',
      title: `${domain} Open Source Projects`,
      url: urls.github,
      description: `Explore ${domain} repositories and examples`,
      level: complexity,
      source: 'GitHub'
    }
  ];
  
  return resources;
}

function generateGithubStructure(domain, complexity) {
  const structures = {
    simple: `project/
├── src/
│   ├── components/
│   ├── utils/
│   └── main.js
├── tests/
├── README.md
└── package.json`,
    
    moderate: `project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── services/
│   └── package.json
├── tests/
└── README.md`,
    
    complex: `project/
├── apps/
│   ├── web/
│   ├── mobile/
│   └── api/
├── packages/
│   ├── ui/
│   ├── utils/
│   └── types/
├── infrastructure/
│   ├── docker/
│   ├── k8s/
│   └── terraform/
├── docs/
└── README.md`
  };
  
  return complexity === 'Beginner' ? structures.simple :
         complexity === 'Advanced' ? structures.complex : structures.moderate;
}

function generateArchitecture(domain, techStack) {
  return `Modern ${domain} architecture using ${techStack.slice(0, 3).join(', ')}. ` +
         `Follows industry best practices with scalable design, proper separation of concerns, ` +
         `and optimized performance. Built for 2026 standards with latest frameworks and tools.`;
}

function generateDeploymentGuide(domain, complexity) {
  if (complexity === 'Beginner') {
    return `1. Setup: Install dependencies with npm/pip
2. Build: Run build command
3. Deploy: Deploy to free tier platform (Vercel/Heroku/Netlify)
4. Monitor: Basic error tracking`;
  } else if (complexity === 'Advanced') {
    return `1. Infrastructure: Setup Kubernetes cluster
2. Containerization: Build Docker images
3. CI/CD: Configure GitHub Actions pipeline
4. Deployment: Deploy with GitOps (ArgoCD)
5. Monitoring: Setup Prometheus + Grafana
6. Scaling: Configure auto-scaling policies`;
  } else {
    return `1. Environment: Configure environment variables
2. Database: Setup managed database (Supabase/PlanetScale)
3. Deploy: Use platform-specific deployment (Vercel/Railway)
4. Monitoring: Enable application monitoring
5. Domain: Configure custom domain and SSL`;
  }
}
