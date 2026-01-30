import { getMarketTrends, calculateProjectRelevance } from './marketDataService';


const getResourcesForDomain = (domain, complexity) => {
  const resourceMap = {
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

  const urls = resourceMap[domain] || resourceMap['Web Development'];
  
  return [
    { type: 'Documentation', title: `${domain} Official Documentation`, url: urls.documentation, description: `Complete ${domain} documentation and guides`, level: 'All', source: 'Official' },
    { type: 'Video', title: `${domain} Video Tutorials`, url: urls.video, description: `Step-by-step ${domain} video tutorials`, level: complexity, source: 'YouTube' },
    { type: 'Article', title: `${domain} Articles & Blogs`, url: urls.article, description: `Latest ${domain} articles and best practices`, level: complexity, source: 'Community' },
    { type: 'GitHub', title: `${domain} Open Source Projects`, url: urls.github, description: `Explore ${domain} repositories and examples`, level: complexity, source: 'GitHub' }
  ];
};


export const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Career Assistant',
    description: 'Build an intelligent career guidance platform using Gemini AI to provide personalized job recommendations, skill gap analysis, and learning paths.',
    domain: 'AI/ML',
    complexity: 'Intermediate',
    tech_stack: ['React 19', 'Node.js', 'Gemini 2.0 API', 'PostgreSQL', 'TailwindCSS'],
    estimated_time: '3-4 weeks',
    use_cases: ['Career path recommendations', 'Skill assessment', 'Personalized learning roadmaps'],
    target_roles: ['Full Stack Developer', 'AI Engineer'],
    is_trending: true,
    likes: 245,
    trending_score: 95,
    created_date: '2026-01-20T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('AI/ML', 'Intermediate')
  },
  {
    id: '2',
    title: 'Real-time Collaborative Code Editor',
    description: 'Create a Monaco-based collaborative coding platform with WebSocket synchronization, perfect for pair programming and technical interviews.',
    domain: 'Web Development',
    complexity: 'Advanced',
    tech_stack: ['React', 'WebSockets', 'Monaco Editor', 'Redis', 'Node.js'],
    estimated_time: '4-6 weeks',
    use_cases: ['Pair programming', 'Code interviews', 'Team collaboration'],
    target_roles: ['Full Stack Developer', 'Frontend Engineer'],
    is_trending: true,
    likes: 189,
    trending_score: 92,
    created_date: '2026-01-19T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('Web Development', 'Advanced')
  },
  {
    id: '3',
    title: 'Decentralized Identity System',
    description: 'Build a blockchain-based digital identity solution using smart contracts for secure, self-sovereign identity management.',
    domain: 'Blockchain',
    complexity: 'Advanced',
    tech_stack: ['Solidity', 'React', 'Ethereum', 'Web3.js', 'IPFS'],
    estimated_time: '5-6 weeks',
    use_cases: ['Digital identity', 'KYC verification', 'Credential management'],
    target_roles: ['Blockchain Developer', 'Full Stack Developer'],
    is_trending: true,
    likes: 203,
    trending_score: 88,
    created_date: '2026-01-18T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('Blockchain', 'Advanced')
  },
  {
    id: '4',
    title: 'Smart Home IoT Dashboard',
    description: 'Control and monitor IoT devices with MQTT, featuring real-time data visualization and automated routines.',
    domain: 'IoT',
    complexity: 'Intermediate',
    tech_stack: ['React', 'MQTT', 'InfluxDB', 'Raspberry Pi', 'Node-RED'],
    estimated_time: '3-4 weeks',
    use_cases: ['Home automation', 'Energy monitoring', 'Security integration'],
    target_roles: ['IoT Developer', 'Full Stack Developer'],
    is_trending: false,
    likes: 156,
    trending_score: 75,
    created_date: '2026-01-17T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('IoT', 'Intermediate')
  },
  {
    id: '5',
    title: 'Cloud Cost Optimization Platform',
    description: 'Analyze and optimize multi-cloud infrastructure costs across AWS, Azure, and GCP with AI-powered recommendations.',
    domain: 'Cloud Computing',
    complexity: 'Advanced',
    tech_stack: ['Python', 'AWS SDK', 'Azure SDK', 'React', 'PostgreSQL'],
    estimated_time: '4-5 weeks',
    use_cases: ['Cost analysis', 'Resource optimization', 'Budget alerts'],
    target_roles: ['Cloud Engineer', 'DevOps Engineer'],
    is_trending: false,
    likes: 134,
    trending_score: 85,
    created_date: '2026-01-16T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('Cloud Computing', 'Advanced')
  },
  {
    id: '6',
    title: 'AR Furniture Placement App',
    description: 'Visualize furniture in your space using ARKit/ARCore, perfect for e-commerce and interior design applications.',
    domain: 'AR/VR',
    complexity: 'Intermediate',
    tech_stack: ['React Native', 'ARKit', 'ARCore', 'Three.js', 'Firebase'],
    estimated_time: '4-5 weeks',
    use_cases: ['Home decoration', 'E-commerce viz', 'Interior design'],
    target_roles: ['Mobile Developer', 'AR Developer'],
    is_trending: true,
    likes: 167,
    trending_score: 79,
    created_date: '2026-01-15T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('AR/VR', 'Intermediate')
  },
  {
    id: '7',
    title: 'AI Resume Builder with ATS Optimization',
    description: 'Create ATS-friendly resumes with AI-powered content suggestions using GPT-4 and intelligent keyword optimization.',
    domain: 'AI/ML',
    complexity: 'Beginner',
    tech_stack: ['React', 'Node.js', 'OpenAI API', 'PDF-lib', 'TailwindCSS'],
    estimated_time: '2-3 weeks',
    use_cases: ['Resume generation', 'ATS optimization', 'Content suggestions'],
    target_roles: ['Frontend Developer', 'Full Stack Developer'],
    is_trending: false,
    likes: 178,
    trending_score: 82,
    created_date: '2026-01-14T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('AI/ML', 'Beginner')
  },
  {
    id: '8',
    title: 'Microservices Monitoring Dashboard',
    description: 'Build a comprehensive monitoring solution for microservices with Prometheus, Grafana, and distributed tracing.',
    domain: 'DevOps',
    complexity: 'Advanced',
    tech_stack: ['Go', 'Prometheus', 'Grafana', 'Jaeger', 'Kubernetes'],
    estimated_time: '4-5 weeks',
    use_cases: ['Service monitoring', 'Performance tracking', 'Alerting'],
    target_roles: ['DevOps Engineer', 'SRE'],
    is_trending: false,
    likes: 145,
    trending_score: 78,
    created_date: '2026-01-13T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('DevOps', 'Advanced')
  },
  {
    id: '9',
    title: 'E-Commerce Platform with Next.js',
    description: 'Full-featured e-commerce platform with Next.js 14, Stripe payments, and real-time inventory management.',
    domain: 'Web Development',
    complexity: 'Intermediate',
    tech_stack: ['Next.js 14', 'Stripe', 'PostgreSQL', 'Redis', 'Vercel'],
    estimated_time: '5-6 weeks',
    use_cases: ['Online store', 'Payment processing', 'Order management'],
    target_roles: ['Full Stack Developer', 'Frontend Engineer'],
    is_trending: true,
    likes: 234,
    trending_score: 91,
    created_date: '2026-01-12T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('Web Development', 'Intermediate')
  },
  {
    id: '10',
    title: 'Cybersecurity Threat Detection System',
    description: 'ML-powered threat detection system that analyzes network traffic and identifies security anomalies in real-time.',
    domain: 'Cybersecurity',
    complexity: 'Advanced',
    tech_stack: ['Python', 'TensorFlow', 'Elasticsearch', 'Kibana', 'Docker'],
    estimated_time: '6-8 weeks',
    use_cases: ['Network monitoring', 'Threat detection', 'Incident response'],
    target_roles: ['Security Engineer', 'ML Engineer'],
    is_trending: true,
    likes: 198,
    trending_score: 87,
    created_date: '2026-01-11T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('Cybersecurity', 'Advanced')
  },
  {
    id: '11',
    title: 'Mobile Fitness Tracking App',
    description: 'Cross-platform fitness app with workout tracking, nutrition planning, and AI-powered personal trainer features.',
    domain: 'Mobile Development',
    complexity: 'Intermediate',
    tech_stack: ['ReactNative', 'Firebase', 'TensorFlow Lite', 'HealthKit', 'Google Fit'],
    estimated_time: '4-5 weeks',
    use_cases: ['Workout tracking', 'Nutrition planning', 'Progress analytics'],
    target_roles: ['Mobile Developer', 'Full Stack Developer'],
    is_trending: false,
    likes: 167,
    trending_score: 74,
    created_date: '2026-01-10T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('Mobile Development', 'Intermediate')
  },
  {
    id: '12',
    title: 'Data Science Portfolio Dashboard',
    description: 'Interactive data visualization dashboard showcasing ML models, data analysis, and insights using modern BI tools.',
    domain: 'Data Science',
    complexity: 'Intermediate',
    tech_stack: ['Python', 'Streamlit', 'Plotly', 'Pandas', 'Scikit-learn'],
    estimated_time: '3-4 weeks',
    use_cases: ['Data visualization', 'Portfolio showcase', 'Interactive reports'],
    target_roles: ['Data Scientist', 'Data Analyst'],
    is_trending: true,
    likes: 189,
    trending_score: 83,
    created_date: '2026-01-09T10:00:00Z',
    last_updated: new Date().toISOString(),
    resources: getResourcesForDomain('Data Science', 'Intermediate')
  }
];


export const updateTrendingProjects = (projects = mockProjects) => {
  const currentTrends = {
    'AI/ML': 1.5,
    'Cloud Computing': 1.4,
    'Web Development': 1.3,
    'Data Science': 1.3,
    'Blockchain': 1.2,
    'Cybersecurity': 1.2,
    'AR/VR': 1.1,
    'DevOps': 1.1,
    'Mobile Development': 1.0,
    'IoT': 0.9,
  };
  
  const currentDate = new Date();
  const hourOfDay = currentDate.getHours();
  
  projects.forEach(project => {
    const domainMultiplier = currentTrends[project.domain] || 1.0;
    const baseScore = project.trending_score || 50;
    
    const timeVariation = Math.sin(hourOfDay + baseScore) * 5;
    const randomBoost = Math.random() * 8;
    
    project.trending_score = (baseScore * domainMultiplier) + timeVariation + randomBoost;
    project.is_trending = project.trending_score > 80;
    project.last_updated = currentDate.toISOString();
  });
  
  projects.sort((a, b) => (b.trending_score || 0) - (a.trending_score || 0));
  
  return projects;
};


updateTrendingProjects();
