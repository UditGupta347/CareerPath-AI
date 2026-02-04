/**
 * Groq API Service for Resume Builder
 * Uses Llama 3.3 70B (very fast, generous free tier)
 */

import Groq from 'groq-sdk';

/**
 * Generate resume content using Groq
 * @param {Object} project - Project data
 * @returns {Promise<Object>} - Structured resume content
 */
export async function generateResumeContent(project) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      '❌ Groq API key not configured.\n\n' +
      '📝 Get a FREE API key from: https://console.groq.com\n' +
      '🔧 Add it to your .env file as: VITE_GROQ_API_KEY=your_key_here'
    );
  }

  const prompt = `Generate professional resume content for this project in a structured format.

Project Details:
- Title: ${project.title}
- Description: ${project.description}
- Tech Stack: ${project.tech_stack?.join(', ') || 'Not specified'}
- Domain: ${project.domain || 'General'}
- Complexity: ${project.complexity || 'Medium'}

Please provide the following in your response:

1. BULLET POINTS (exactly 3 bullet points):
Each bullet point should use the XYZ formula: "Accomplished X by doing Y resulting in Z"
Make them specific, quantifiable, and impressive for a resume.

2. TECH STACK SUMMARY:
A single concise line summarizing the technical skills demonstrated (e.g., "Built with React, Node.js, MongoDB, and AWS")

3. IMPACT STATEMENT:
A single powerful sentence describing the project's value and impact.

4. README TEMPLATE:
A professional GitHub README structure with sections for: Title, Description, Features, Tech Stack, Installation, Usage.

Format your response clearly with headers for each section.`;

  const maxRetries = 2;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📡 Attempt ${attempt}/${maxRetries}: Calling Groq for resume generation...`);

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer and career advisor. Generate professional, ATS-optimized resume content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 1500
      });

      const text = chatCompletion.choices[0]?.message?.content;

      if (!text || text.trim() === '') {
        throw new Error('Empty response from Groq');
      }

      console.log('✅ Groq: Resume content generated successfully');

      // Parse the response
      return parseResumeContent(text, project);

    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      lastError = error;

      // Don't retry on auth errors
      if (error.message?.includes('API key') || error.message?.includes('Invalid') || error.message?.includes('401')) {
        throw new Error('Invalid Groq API key. Please check your .env file.');
      }

      if (attempt < maxRetries) {
        const waitTime = attempt * 1500;
        console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Failed to generate resume content after all retries');
}

/**
 * Parse AI response into structured resume content
 */
function parseResumeContent(text, project) {
  const bulletPoints = [];
  const lines = text.split('\n');
  let currentSection = '';
  let techStack = '';
  let impactStatement = '';
  let readmeTemplate = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.toLowerCase().includes('bullet') || line.toLowerCase().includes('xyz')) {
      currentSection = 'bullets';
    } else if (line.toLowerCase().includes('tech stack')) {
      currentSection = 'tech';
    } else if (line.toLowerCase().includes('impact')) {
      currentSection = 'impact';
    } else if (line.toLowerCase().includes('readme')) {
      currentSection = 'readme';
    } else if (line && currentSection === 'bullets' && (line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || line.match(/^\d+\./))) {
      const cleanedLine = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
      if (cleanedLine && bulletPoints.length < 3) {
        bulletPoints.push(cleanedLine);
      }
    } else if (line && currentSection === 'tech' && !line.toLowerCase().includes('tech stack')) {
      techStack += line + ' ';
    } else if (line && currentSection === 'impact' && !line.toLowerCase().includes('impact')) {
      impactStatement += line + ' ';
    } else if (line && currentSection === 'readme' && !line.toLowerCase().includes('readme')) {
      readmeTemplate += line + '\n';
    }
  }

  // Fallback values if parsing fails
  const finalBulletPoints = bulletPoints.length > 0 ? bulletPoints : [
    `Developed ${project.title} to solve ${project.domain || 'technical'} challenges using modern technologies`,
    `Implemented key features using ${project.tech_stack?.slice(0, 3).join(', ') || 'industry-standard tools'} resulting in improved functionality`,
    `Achieved ${project.complexity || 'medium'}-complexity project completion demonstrating strong technical skills`
  ];

  const finalTechStack = techStack.trim() || `Technologies: ${project.tech_stack?.join(', ') || 'Various modern frameworks and tools'}`;
  
  const finalImpact = impactStatement.trim() || `Successfully built ${project.title} demonstrating expertise in ${project.domain || 'software development'}`;
  
  const finalReadme = readmeTemplate.trim() || `# ${project.title}

${project.description}

## Features
- Core functionality implemented
- Modern tech stack
- Clean, maintainable code

## Tech Stack
${project.tech_stack?.join(', ') || 'Modern technologies'}

## Description
${project.description}`;

  return {
    bulletPoints: finalBulletPoints.slice(0, 3),
    techStack: finalTechStack,
    impactStatement: finalImpact,
    readmeTemplate: finalReadme
  };
}
