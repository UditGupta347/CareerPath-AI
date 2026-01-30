


import { extractSkillsWithAI, analyzeSkillGap } from './geminiService';
import { getAllSkillsForRole, getRoleDetails, getRecommendedRoles } from './roleDatabase';
import { getDynamicProjects } from './dynamicProjectService';
import { cleanTextContent } from '../utils/fileParser';


export async function extractSkillsFromText(text, source = 'resume') {
  try {
    
    const cleanedText = cleanTextContent(text);
    
    if (!cleanedText || cleanedText.length < 50) {
      return {
        success: false,
        error: 'Text is too short. Please provide more detailed information.',
        skills: { languages: [], frameworks: [], tools: [], soft: [], other: [] }
      };
    }
    
    
    const extractedSkills = await extractSkillsWithAI(cleanedText, source);
    
    return {
      success: true,
      skills: extractedSkills,
      source
    };
    
  } catch (error) {
    console.error('Error extracting skills:', error);
    return {
      success: false,
      error: error.message || 'Failed to extract skills',
      skills: { languages: [], frameworks: [], tools: [], soft: [], other: [] }
    };
  }
}


export async function analyzeGitHubProfile(githubUrl) {
  try {
    
    let username = githubUrl;
    if (githubUrl.includes('github.com/')) {
      username = githubUrl.split('github.com/')[1].split('/')[0];
    }
    
    
    const profileResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!profileResponse.ok) {
      throw new Error('GitHub user not found');
    }
    const profileData = await profileResponse.json();
    
    
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`);
    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories');
    }
    const repos = await reposResponse.json();
    
    
    const languages = new Set();
    const topics = new Set();
    const repoDescriptions = [];
    
    repos.forEach(repo => {
      if (repo.language) languages.add(repo.language);
      if (repo.topics) repo.topics.forEach(topic => topics.add(topic));
      if (repo.description) repoDescriptions.push(repo.description);
    });
    
    
    const contextText = `
GitHub Profile: ${username}
Bio: ${profileData.bio || 'N/A'}
Public Repos: ${profileData.public_repos}

Programming Languages: ${Array.from(languages).join(', ')}
Topics/Tags: ${Array.from(topics).join(', ')}

Repository Descriptions:
${repoDescriptions.slice(0, 10).join('\n')}
    `.trim();
    
    
    const skillsResult = await extractSkillsFromText(contextText, 'github');
    
    return {
      success: true,
      profile: {
        username,
        name: profileData.name,
        bio: profileData.bio,
        repos: profileData.public_repos,
        followers: profileData.followers,
        avatar: profileData.avatar_url
      },
      languages: Array.from(languages),
      topics: Array.from(topics),
      skills: skillsResult.skills
    };
    
  } catch (error) {
    console.error('Error analyzing GitHub profile:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze GitHub profile',
      skills: { languages: [], frameworks: [], tools: [], soft: [], other: [] }
    };
  }
}


export async function compareWithRole(userSkills, targetRole) {
  try {
    const roleDetails = getRoleDetails(targetRole);
    if (!roleDetails) {
      return {
        success: false,
        error: 'Role not found'
      };
    }
    
    
    const { findSkillMatches } = await import('../utils/skillNormalizer');
    
    
    const userSkillsList = [
      ...(userSkills.languages || []),
      ...(userSkills.frameworks || []),
      ...(userSkills.tools || []),
      ...(userSkills.databases || []),
      ...(userSkills.cloud || []),
      ...(userSkills.soft || []),
      ...(userSkills.other || [])
    ];
    
    console.log('🔍 User skills for comparison:', userSkillsList);
    console.log('🎯 Target role:', targetRole);
    console.log('📋 Required skills:', roleDetails.required);
    
    
    const requiredResult = findSkillMatches(userSkillsList, roleDetails.required);
    console.log('✅ Required matches:', requiredResult.matches);
    console.log('❌ Required gaps:', requiredResult.gaps);
    
    
    const preferredResult = findSkillMatches(userSkillsList, roleDetails.preferred);
    console.log('✅ Preferred matches:', preferredResult.matches);
    console.log('❌ Preferred gaps:', preferredResult.gaps);
    
    
    const toolsResult = findSkillMatches(userSkillsList, roleDetails.tools);
    console.log('✅ Tools matches:', toolsResult.matches);
    console.log('❌ Tools gaps:', toolsResult.gaps);
    
    
    const totalRequired = roleDetails.required.length;
    const matchPercentage = totalRequired > 0 
      ? Math.round((requiredResult.matches.length / totalRequired) * 100)
      : 0;
    
    console.log(`📊 Match percentage: ${matchPercentage}% (${requiredResult.matches.length}/${totalRequired} required skills)`);
    
    
    const aiRecommendations = await analyzeSkillGap(userSkillsList, requiredResult.gaps);
    
    return {
      success: true,
      role: targetRole,
      roleDetails,
      matchPercentage,
      required: {
        total: totalRequired,
        matches: requiredResult.matches,
        gaps: requiredResult.gaps,
        matchCount: requiredResult.matches.length
      },
      preferred: {
        total: roleDetails.preferred.length,
        matches: preferredResult.matches,
        gaps: preferredResult.gaps,
        matchCount: preferredResult.matches.length
      },
      tools: {
        total: roleDetails.tools.length,
        matches: toolsResult.matches,
        gaps: toolsResult.gaps,
        matchCount: toolsResult.matches.length
      },
      aiRecommendations
    };
    
  } catch (error) {
    console.error('Error comparing with role:', error);
    return {
      success: false,
      error: error.message || 'Failed to compare skills'
    };
  }
}


export function generateLearningTimeline(missingSkills, userLevel = 'Intermediate') {
  try {
    
    const timeEstimates = {
      'Beginner': {
        'Programming Language': 8,
        'Framework': 6,
        'Tool': 2,
        'Concept': 4,
        'Default': 4
      },
      'Intermediate': {
        'Programming Language': 6,
        'Framework': 4,
        'Tool': 1,
        'Concept': 3,
        'Default': 3
      },
      'Advanced': {
        'Programming Language': 4,
        'Framework': 3,
        'Tool': 1,
        'Concept': 2,
        'Default': 2
      }
    };
    
    const estimates = timeEstimates[userLevel] || timeEstimates['Intermediate'];
    
    
    const skillsWithTime = missingSkills.map(skill => {
      let category = 'Default';
      let weeks = estimates['Default'];
      
      
      if (['JavaScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'TypeScript'].some(lang => 
        skill.toLowerCase().includes(lang.toLowerCase())
      )) {
        category = 'Programming Language';
        weeks = estimates['Programming Language'];
      } else if (['React', 'Angular', 'Vue', 'Django', 'Flask', 'Spring', 'Express', 'Next.js'].some(fw => 
        skill.toLowerCase().includes(fw.toLowerCase())
      )) {
        category = 'Framework';
        weeks = estimates['Framework'];
      } else if (['Docker', 'Git', 'VS Code', 'Postman', 'Jenkins'].some(tool => 
        skill.toLowerCase().includes(tool.toLowerCase())
      )) {
        category = 'Tool';
        weeks = estimates['Tool'];
      } else {
        category = 'Concept';
        weeks = estimates['Concept'];
      }
      
      return {
        skill,
        category,
        weeks,
        priority: category === 'Programming Language' || category === 'Concept' ? 'High' : 'Medium'
      };
    });
    
    
    const sortedSkills = skillsWithTime.sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') return -1;
      if (a.priority !== 'High' && b.priority === 'High') return 1;
      return b.weeks - a.weeks; 
    });
    
    
    const milestones = [];
    let currentWeek = 0;
    let currentPhase = 1;
    const skillsPerPhase = Math.ceil(sortedSkills.length / 4); 
    
    for (let i = 0; i < sortedSkills.length; i += skillsPerPhase) {
      const phaseSkills = sortedSkills.slice(i, i + skillsPerPhase);
      const phaseWeeks = Math.max(...phaseSkills.map(s => s.weeks));
      
      milestones.push({
        phase: currentPhase,
        name: `Phase ${currentPhase}: ${phaseSkills.map(s => s.skill).join(', ')}`,
        skills: phaseSkills,
        startWeek: currentWeek,
        endWeek: currentWeek + phaseWeeks,
        durationWeeks: phaseWeeks
      });
      
      currentWeek += phaseWeeks;
      currentPhase++;
    }
    
    const totalWeeks = currentWeek;
    const totalMonths = Math.ceil(totalWeeks / 4);
    
    return {
      success: true,
      totalWeeks,
      totalMonths,
      estimatedCompletion: `${totalMonths} months`,
      milestones,
      userLevel,
      totalSkills: missingSkills.length
    };
    
  } catch (error) {
    console.error('Error generating timeline:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate timeline'
    };
  }
}


export async function recommendProjects(missingSkills, preferredDomain = null) {
  try {
    
    const allProjects = await getDynamicProjects();
    
    
    const scoredProjects = allProjects.map(project => {
      let score = 0;
      const matchedSkills = [];
      
      const projectSkills = [
        ...(project.tech_stack || []),
        ...(project.skills_learned || []),
        project.domain
      ].map(s => s.toLowerCase());
      
      missingSkills.forEach(skill => {
        if (projectSkills.some(ps => ps.includes(skill.toLowerCase()) || skill.toLowerCase().includes(ps))) {
          score += 1;
          matchedSkills.push(skill);
        }
      });
      
      
      if (preferredDomain && project.domain === preferredDomain) {
        score += 2;
      }
      
      return {
        ...project,
        gapScore: score,
        matchedGapSkills: matchedSkills
      };
    });
    
    
    const topProjects = scoredProjects
      .filter(p => p.gapScore > 0)
      .sort((a, b) => b.gapScore - a.gapScore)
      .slice(0, 5);
    
    return {
      success: true,
      projects: topProjects,
      totalMatched: topProjects.length
    };
    
  } catch (error) {
    console.error('Error recommending projects:', error);
    return {
      success: false,
      error: error.message || 'Failed to recommend projects',
      projects: []
    };
  }
}


export function getRecommendedRolesForUser(userSkills, topN = 3) {
  try {
    
    const userSkillsList = [
      ...(userSkills.languages || []),
      ...(userSkills.frameworks || []),
      ...(userSkills.tools || []),
      ...(userSkills.other || [])
    ];
    
    return getRecommendedRoles(userSkillsList, topN);
    
  } catch (error) {
    console.error('Error getting recommended roles:', error);
    return [];
  }
}


export async function performCompleteAnalysis({ text, source, targetRole }) {
  try {
    
    const skillsResult = await extractSkillsFromText(text, source);
    if (!skillsResult.success) {
      return { success: false, error: skillsResult.error };
    }
    
    
    const gapAnalysis = await compareWithRole(skillsResult.skills, targetRole);
    if (!gapAnalysis.success) {
      return { success: false, error: gapAnalysis.error };
    }
    
    
    const timeline = generateLearningTimeline(gapAnalysis.required.gaps, 'Intermediate');
    
    
    const recommendations = await recommendProjects(
      gapAnalysis.required.gaps, 
      gapAnalysis.roleDetails.domains[0]
    );
    
    return {
      success: true,
      userSkills: skillsResult.skills,
      gapAnalysis,
      timeline,
      recommendations: recommendations.projects
    };
    
  } catch (error) {
    console.error('Error performing complete analysis:', error);
    return {
      success: false,
      error: error.message || 'Analysis failed'
    };
  }
}
