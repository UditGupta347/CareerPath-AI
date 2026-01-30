


export const ROLE_SKILLS = {
  'Software Development Engineer (SDE)': {
    shortName: 'SDE',
    required: [
      'Data Structures',
      'Algorithms',
      'Object-Oriented Programming',
      'JavaScript',
      'Python',
      'Java',
      'SQL',
      'REST APIs',
      'Git',
      'Problem Solving'
    ],
    preferred: [
      'System Design',
      'Microservices',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'AWS',
      'Azure',
      'Design Patterns',
      'Testing',
      'Agile Methodologies'
    ],
    tools: [
      'VS Code',
      'IntelliJ IDEA',
      'Postman',
      'GitHub',
      'JIRA',
      'Docker Desktop',
      'Terminal/CLI'
    ],
    domains: ['Web Development', 'Cloud Computing', 'DevOps'],
    estimatedLearningTime: '6-12 months',
    salaryRange: '$80k-$150k',
    description: 'Build and maintain software applications using modern programming languages and frameworks.'
  },

  'ML Engineer': {
    shortName: 'ML Engineer',
    required: [
      'Python',
      'Machine Learning',
      'Deep Learning',
      'Statistics',
      'Linear Algebra',
      'NumPy',
      'Pandas',
      'TensorFlow',
      'PyTorch',
      'Scikit-learn',
      'Data Preprocessing'
    ],
    preferred: [
      'MLOps',
      'Docker',
      'Kubernetes',
      'AWS SageMaker',
      'Model Deployment',
      'Computer Vision',
      'NLP',
      'Reinforcement Learning',
      'Big Data',
      'Spark'
    ],
    tools: [
      'Jupyter Notebook',
      'Google Colab',
      'TensorBoard',
      'MLflow',
      'Weights & Biases',
      'GitHub',
      'DVC'
    ],
    domains: ['AI/ML', 'Data Science', 'Cloud Computing'],
    estimatedLearningTime: '8-18 months',
    salaryRange: '$100k-$180k',
    description: 'Design, build, and deploy machine learning models to solve real-world problems.'
  },

  'DevOps Engineer': {
    shortName: 'DevOps',
    required: [
      'Linux',
      'Docker',
      'Kubernetes',
      'CI/CD',
      'Git',
      'Bash Scripting',
      'Python',
      'Cloud Platforms',
      'Networking',
      'Infrastructure as Code'
    ],
    preferred: [
      'Terraform',
      'Ansible',
      'Jenkins',
      'GitHub Actions',
      'Monitoring',
      'Prometheus',
      'Grafana',
      'Security',
      'Microservices',
      'Service Mesh'
    ],
    tools: [
      'Docker Desktop',
      'kubectl',
      'Terraform',
      'Jenkins',
      'GitLab CI',
      'AWS CLI',
      'Azure CLI',
      'Helm'
    ],
    domains: ['DevOps', 'Cloud Computing', 'Cybersecurity'],
    estimatedLearningTime: '6-15 months',
    salaryRange: '$90k-$160k',
    description: 'Automate deployment pipelines, manage infrastructure, and ensure system reliability.'
  },

  'Frontend Developer': {
    shortName: 'Frontend',
    required: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'TypeScript',
      'Responsive Design',
      'Git',
      'REST APIs',
      'State Management',
      'Component Design'
    ],
    preferred: [
      'Next.js',
      'Vue.js',
      'Angular',
      'Tailwind CSS',
      'Webpack',
      'Testing Library',
      'Jest',
      'Accessibility',
      'Performance Optimization',
      'GraphQL'
    ],
    tools: [
      'VS Code',
      'Chrome DevTools',
      'Figma',
      'npm/yarn',
      'Git',
      'ESLint',
      'Prettier'
    ],
    domains: ['Web Development', 'Mobile Development'],
    estimatedLearningTime: '4-10 months',
    salaryRange: '$70k-$140k',
    description: 'Create beautiful, responsive, and interactive user interfaces for web applications.'
  },

  'Backend Developer': {
    shortName: 'Backend',
    required: [
      'Node.js',
      'Python',
      'Java',
      'SQL',
      'NoSQL',
      'REST APIs',
      'Authentication',
      'Database Design',
      'Git',
      'Server Management'
    ],
    preferred: [
      'GraphQL',
      'Microservices',
      'Redis',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'Message Queues',
      'WebSockets',
      'Caching',
      'System Design'
    ],
    tools: [
      'VS Code',
      'Postman',
      'MongoDB Compass',
      'pgAdmin',
      'Docker',
      'Git',
      'Redis CLI'
    ],
    domains: ['Web Development', 'Cloud Computing', 'Data Science'],
    estimatedLearningTime: '5-12 months',
    salaryRange: '$75k-$145k',
    description: 'Build robust server-side applications, APIs, and database systems.'
  },

  'Full Stack Developer': {
    shortName: 'Full Stack',
    required: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Node.js',
      'SQL',
      'REST APIs',
      'Git',
      'Responsive Design',
      'Database Design'
    ],
    preferred: [
      'TypeScript',
      'Next.js',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'Docker',
      'AWS',
      'CI/CD',
      'Testing',
      'System Design'
    ],
    tools: [
      'VS Code',
      'Chrome DevTools',
      'Postman',
      'Git',
      'Docker',
      'Figma',
      'npm/yarn'
    ],
    domains: ['Web Development', 'Cloud Computing', 'Mobile Development'],
    estimatedLearningTime: '8-16 months',
    salaryRange: '$80k-$150k',
    description: 'Handle both frontend and backend development to build complete web applications.'
  }
};


export function getAllRoles() {
  return Object.keys(ROLE_SKILLS);
}


export function getRoleDetails(roleName) {
  return ROLE_SKILLS[roleName] || null;
}


export function getAllSkillsForRole(roleName) {
  const role = ROLE_SKILLS[roleName];
  if (!role) return [];
  
  return {
    required: role.required,
    preferred: role.preferred,
    tools: role.tools,
    all: [...role.required, ...role.preferred, ...role.tools]
  };
}


export function searchRolesBySkill(skill) {
  const matchingRoles = [];
  
  for (const [roleName, roleData] of Object.entries(ROLE_SKILLS)) {
    const allSkills = [...roleData.required, ...roleData.preferred, ...roleData.tools];
    const skillLower = skill.toLowerCase();
    
    const matches = allSkills.filter(s => 
      s.toLowerCase().includes(skillLower)
    );
    
    if (matches.length > 0) {
      matchingRoles.push({
        role: roleName,
        matchCount: matches.length,
        matchedSkills: matches
      });
    }
  }
  
  
  return matchingRoles.sort((a, b) => b.matchCount - a.matchCount);
}


export function getRecommendedRoles(userSkills, topN = 3) {
  const roleScores = [];
  
  for (const [roleName, roleData] of Object.entries(ROLE_SKILLS)) {
    let score = 0;
    let requiredMatches = 0;
    let preferredMatches = 0;
    let toolMatches = 0;
    
    const userSkillsLower = userSkills.map(s => s.toLowerCase());
    
    
    roleData.required.forEach(skill => {
      if (userSkillsLower.includes(skill.toLowerCase())) {
        score += 3;
        requiredMatches++;
      }
    });
    
    
    roleData.preferred.forEach(skill => {
      if (userSkillsLower.includes(skill.toLowerCase())) {
        score += 2;
        preferredMatches++;
      }
    });
    
    
    roleData.tools.forEach(skill => {
      if (userSkillsLower.includes(skill.toLowerCase())) {
        score += 1;
        toolMatches++;
      }
    });
    
    const totalRequired = roleData.required.length;
    const matchPercentage = Math.round((requiredMatches / totalRequired) * 100);
    
    roleScores.push({
      role: roleName,
      score,
      matchPercentage,
      requiredMatches,
      preferredMatches,
      toolMatches,
      totalRequired,
      shortName: roleData.shortName
    });
  }
  
  
  return roleScores
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
