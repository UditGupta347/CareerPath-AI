


export const SKILL_SYNONYMS = {
  
  'javascript': ['js', 'javascript', 'ecmascript', 'es6', 'es2015', 'es2020', 'es2022'],
  'typescript': ['ts', 'typescript'],
  'python': ['python', 'py', 'python3', 'python 3'],
  'java': ['java', 'java se', 'java ee'],
  'c++': ['c++', 'cpp', 'c plus plus'],
  'c#': ['c#', 'csharp', 'c sharp'],
  'go': ['go', 'golang'],
  'rust': ['rust', 'rustlang'],
  'php': ['php', 'php7', 'php8'],
  'ruby': ['ruby', 'rb'],
  'swift': ['swift', 'swiftui'],
  'kotlin': ['kotlin', 'kt'],
  
  
  'react': ['react', 'reactjs', 'react.js', 'react js'],
  'vue': ['vue', 'vuejs', 'vue.js', 'vue js'],
  'angular': ['angular', 'angularjs', 'angular.js'],
  'svelte': ['svelte', 'sveltejs'],
  'next.js': ['next', 'nextjs', 'next.js', 'next js'],
  'nuxt': ['nuxt', 'nuxtjs', 'nuxt.js'],
  
  
  'node.js': ['node', 'nodejs', 'node.js', 'node js'],
  'express': ['express', 'expressjs', 'express.js'],
  'nest.js': ['nest', 'nestjs', 'nest.js'],
  'django': ['django', 'python django'],
  'flask': ['flask', 'python flask'],
  'spring': ['spring', 'spring boot', 'spring framework'],
  'laravel': ['laravel', 'php laravel'],
  'fastapi': ['fastapi', 'fast api'],
  
  
  'mongodb': ['mongodb', 'mongo', 'mongo db'],
  'postgresql': ['postgresql', 'postgres', 'psql', 'pg'],
  'mysql': ['mysql', 'my sql'],
  'redis': ['redis', 'redis cache'],
  'sqlite': ['sqlite', 'sqlite3'],
  
  
  'docker': ['docker', 'dockerfile', 'docker compose'],
  'kubernetes': ['kubernetes', 'k8s', 'kube'],
  'aws': ['aws', 'amazon web services'],
  'azure': ['azure', 'microsoft azure'],
  'gcp': ['gcp', 'google cloud', 'google cloud platform'],
  
  
  'git': ['git', 'github', 'gitlab', 'version control'],
  'ci/cd': ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
  'rest api': ['rest', 'rest api', 'restful', 'restful api'],
  'graphql': ['graphql', 'graph ql'],
  'websocket': ['websocket', 'websockets', 'web socket'],
  
  
  'machine learning': ['ml', 'machine learning', 'machinelearning'],
  'deep learning': ['dl', 'deep learning', 'deeplearning'],
  'artificial intelligence': ['ai', 'artificial intelligence'],
  'tensorflow': ['tensorflow', 'tf', 'tensor flow'],
  'pytorch': ['pytorch', 'torch'],
  'scikit-learn': ['scikit-learn', 'sklearn', 'scikit learn'],
  'numpy': ['numpy', 'np'],
  'pandas': ['pandas', 'pd'],
  
  
  'object-oriented programming': ['oop', 'object oriented', 'object-oriented programming'],
  'functional programming': ['fp', 'functional programming'],
  'data structures': ['dsa', 'data structures', 'data structures and algorithms'],
  'algorithms': ['algorithms', 'algo', 'dsa'],
  'system design': ['system design', 'systems design', 'architecture'],
  'microservices': ['microservices', 'microservice', 'micro services'],
  'testing': ['testing', 'unit testing', 'integration testing', 'test'],
  
  
  'problem solving': ['problem solving', 'problem-solving', 'analytical'],
  'communication': ['communication', 'verbal communication', 'written communication'],
  'teamwork': ['teamwork', 'team work', 'collaboration'],
  'leadership': ['leadership', 'team leadership', 'lead'],
  'agile': ['agile', 'agile methodologies', 'scrum', 'kanban']
};


const REVERSE_SYNONYM_MAP = {};
for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
  synonyms.forEach(synonym => {
    REVERSE_SYNONYM_MAP[synonym.toLowerCase()] = canonical;
  });
}


export function normalizeSkill(skill) {
  if (!skill) return '';
  
  const skillLower = skill.trim().toLowerCase();
  
  
  if (REVERSE_SYNONYM_MAP[skillLower]) {
    return REVERSE_SYNONYM_MAP[skillLower];
  }
  
  
  return skill.trim();
}


export function skillsMatch(skill1, skill2) {
  if (!skill1 || !skill2) return false;
  
  const normalized1 = normalizeSkill(skill1);
  const normalized2 = normalizeSkill(skill2);
  
  
  if (normalized1.toLowerCase() === normalized2.toLowerCase()) {
    return true;
  }
  
  
  const synonyms1 = SKILL_SYNONYMS[normalized1.toLowerCase()] || [normalized1.toLowerCase()];
  const synonyms2 = SKILL_SYNONYMS[normalized2.toLowerCase()] || [normalized2.toLowerCase()];
  
  
  return synonyms1.some(s1 => synonyms2.some(s2 => s1 === s2));
}


export function fuzzySkillMatch(userSkill, requiredSkill) {
  if (!userSkill || !requiredSkill) return false;
  
  
  if (skillsMatch(userSkill, requiredSkill)) {
    return true;
  }
  
  const user = userSkill.toLowerCase().trim();
  const required = requiredSkill.toLowerCase().trim();
  
  
  
  if (user.includes(required) || required.includes(user)) {
    
    if ((user === 'java' && required.includes('javascript')) ||
        (required === 'java' && user.includes('javascript'))) {
      return false;
    }
    return true;
  }
  
  
  const userNormalized = user.replace(/[.\-_\s]/g, '');
  const requiredNormalized = required.replace(/[.\-_\s]/g, '');
  
  if (userNormalized === requiredNormalized) {
    return true;
  }
  
  return false;
}


export function findSkillMatches(userSkills, requiredSkills) {
  const matches = [];
  const gaps = [];
  const matchedUserSkills = new Set();
  
  requiredSkills.forEach(requiredSkill => {
    let found = false;
    
    for (const userSkill of userSkills) {
      if (fuzzySkillMatch(userSkill, requiredSkill)) {
        matches.push(requiredSkill);
        matchedUserSkills.add(userSkill);
        found = true;
        break;
      }
    }
    
    if (!found) {
      gaps.push(requiredSkill);
    }
  });
  
  return {
    matches,
    gaps,
    matchedUserSkills: Array.from(matchedUserSkills)
  };
}


export function normalizeSkillArray(skills) {
  if (!Array.isArray(skills)) return [];
  
  const normalized = new Set();
  
  skills.forEach(skill => {
    if (skill && typeof skill === 'string') {
      const norm = normalizeSkill(skill);
      if (norm) {
        normalized.add(norm);
      }
    }
  });
  
  return Array.from(normalized);
}


export function skillSimilarity(skill1, skill2) {
  if (skillsMatch(skill1, skill2)) return 100;
  if (fuzzySkillMatch(skill1, skill2)) return 80;
  
  const s1 = skill1.toLowerCase();
  const s2 = skill2.toLowerCase();
  
  
  if (s1.includes(s2) || s2.includes(s1)) return 60;
  
  return 0;
}
