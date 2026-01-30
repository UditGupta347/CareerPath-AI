import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';


export const api = {
  auth: {
    isAuthenticated: async () => {
      return useAuthStore.getState().isAuthenticated;
    },
    
    me: async () => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    
    logout: () => {
      useAuthStore.getState().logout();
      console.log('User logged out');
    },
    
    redirectToLogin: (returnUrl) => {
      
      console.log('Login redirect requested');
    },
  },
  
  entities: {
    Project: {
      list: async (sortField = '-created_date', limit = 50) => {
        
        
        const { mockProjects } = await import('./mockData');
        const { enrichProjectWithStructure } = await import('./projectStructureGenerator');
        const store = useProjectStore.getState();
        
        console.log('🔍 API: mockProjects count:', mockProjects.length);
        
        
        
        if (store.projects.length === 0 || store.projects.length < 12) {
          console.log('📦 API: Store has', store.projects.length, 'projects, initializing with all', mockProjects.length);
          
          const enrichedProjects = mockProjects.map(p => enrichProjectWithStructure(p));
          console.log('✨ API: Enriched', enrichedProjects.length, 'projects with structure');
          store.setProjects(enrichedProjects);
        } else {
          console.log('✅ API: Store already has', store.projects.length, 'projects');
        }
        
        const projects = store.projects;
        
        
        const sorted = [...projects].sort((a, b) => {
          if (sortField === '-created_date') {
            return new Date(b.created_date) - new Date(a.created_date);
          }
          if (sortField === '-trending_score') {
            return (b.trending_score || 0) - (a.trending_score || 0);
          }
          return 0;
        });
        
        const result = sorted.slice(0, limit);
        console.log(`📤 API: Returning ${result.length} projects (limit: ${limit})`);
        return result;
      },
      
      get: async (id) => {
        const project = useProjectStore.getState().getProjectById(id);
        if (!project) throw new Error('Project not found');
        return project;
      },
      
      filter: async (filters) => {
        const projects = useProjectStore.getState().projects;
        
        const filtered = projects.filter(project => {
          for (const [key, value] of Object.entries(filters)) {
            if (project[key] !== value) return false;
          }
          return true;
        });
        
        
        const { enrichProjectWithStructure } = await import('./projectStructureGenerator');
        const enrichedProjects = filtered.map(project => enrichProjectWithStructure(project));
        
        return enrichedProjects;
      },
      
      create: async (data) => {
        return useProjectStore.getState().addProject(data);
      },
    },
    
    SavedProject: {
      filter: async (filters) => {
        const savedProjects = useProjectStore.getState().savedProjects;
        
        return savedProjects.filter(sp => {
          for (const [key, value] of Object.entries(filters)) {
            if (sp[key] !== value) return false;
          }
          return true;
        });
      },
      
      create: async (data) => {
        const store = useProjectStore.getState();
        store.saveProject(data.project_id, data.user_email);
        
        
        const saved = store.savedProjects.find(
          sp => sp.project_id === data.project_id && sp.user_email === data.user_email
        );
        return saved;
      },
      
      delete: async (id) => {
        useProjectStore.getState().deleteSavedProject(id);
      },
      
      update: async (id, updates) => {
        useProjectStore.getState().updateSavedProject(id, updates);
      },
    },
    
    UserProfile: {
      filter: async (filters) => {
        const profiles = useProjectStore.getState().userProfiles;
        
        return profiles.filter(profile => {
          for (const [key, value] of Object.entries(filters)) {
            if (profile[key] !== value) return false;
          }
          return true;
        });
      },
      
      create: async (data) => {
        return useProjectStore.getState().createUserProfile(data);
      },
      
      update: async (userEmail, updates) => {
        useProjectStore.getState().updateUserProfile(userEmail, updates);
      },
    },
  },
  
  agents: {
    listConversations: async (options) => {
      
      return [];
    },
    
    sendMessage: async (message, conversationId) => {
      
      return {
        role: 'assistant',
        content: 'This is a mock AI response. To use real AI features, integrate your own AI API (OpenAI, Gemini, etc.)',
      };
    },
  },
  
  integrations: {
    Core: {
      


      InvokeLLM_Gemini: async ({ prompt, file_urls = [], response_json_schema = null }) => {
        try {
          console.log('🔑 Resume Builder: Using Gemini 1.5 Flash directly...');
          
          const { GoogleGenerativeAI } = await import('@google/generative-ai');
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          
          if (!apiKey) {
            throw new Error(
              '❌ Gemini API key required for Resume Builder.\n\n' +
              '📝 Get an API key from: https://aistudio.google.com/app/apikey\n' +
              '🔧 Add it to your .env file as: VITE_GEMINI_API_KEY=your_key_here'
            );
          }
          
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
          });
          
          // Build the full prompt
          let fullPrompt = prompt;
          
          // Add file content if provided
          if (file_urls && file_urls.length > 0) {
            fullPrompt += '\n\nFile Content:\n';
            for (const fileData of file_urls) {
              const maxChars = 30000;
              let content = fileData;
              
              if (content.length > maxChars) {
                console.warn(`⚠️ File content too long (${content.length} chars), truncating to ${maxChars} chars`);
                content = content.substring(0, maxChars) + '\n\n[... content truncated due to length ...]';
              }
              
              fullPrompt += `${content}\n\n`;
            }
          }
          
          // Add JSON schema instruction if needed
          if (response_json_schema) {
            fullPrompt += `\n\nReturn your response as valid JSON matching this structure:\n${JSON.stringify(response_json_schema, null, 2)}\n\nIMPORTANT: Return ONLY the JSON object, no markdown, no code blocks, no extra text.`;
          }
          
          let text = null;
          const maxRetries = 3;
          
          // Retry logic with exponential backoff
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              console.log(`📡 Attempt ${attempt}/${maxRetries}: Calling Gemini...`);
              
              const result = await model.generateContent(fullPrompt);
              const response = await result.response;
              text = response.text();
              
              if (!text) {
                throw new Error('No content in response');
              }
              
              console.log('✅ Gemini response received - Length:', text?.length);
              break;
              
            } catch (genError) {
              console.error(`❌ Attempt ${attempt} failed:`, genError.message);
              
              if (attempt < maxRetries) {
                const waitTime = attempt * 2000;
                console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
              } else {
                throw genError;
              }
            }
          }
          
          if (!text) {
            throw new Error('Failed to get response after all retries');
          }
          
          // Parse JSON if schema was provided
          if (response_json_schema) {
            text = text.trim();
            text = text.replace(/```json\s*/g, '');
            text = text.replace(/```\s*/g, '');
            
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              text = jsonMatch[0];
            }
            
            try {
              return JSON.parse(text);
            } catch (parseError) {
              console.error('❌ Failed to parse JSON from Gemini:', parseError);
              console.log('Raw response:', text);
              throw new Error('Failed to parse JSON response from Gemini API. Please try again.');
            }
          }
          
          return { text };
          
        } catch (error) {
          console.error('❌ Resume Builder API error:', error);
          
          // Enhanced error handling with detailed messages
          if (error.message?.includes('API key')) {
            throw error; // Re-throw API key errors as-is
          } else if (error.message?.includes('quota') || error.message?.includes('429')) {
            throw new Error(
              '⚠️ API Quota Exceeded\n\n' +
              'You\'ve reached your Gemini API usage limit. This can happen with the free tier.\n\n' +
              'Solutions:\n' +
              '• Wait a few minutes and try again\n' +
              '• Check your quota at: https://console.cloud.google.com/\n' +
              '• Consider upgrading your Gemini API plan'
            );
          } else if (error.message?.includes('SAFETY') || error.message?.includes('safety filters')) {
            throw new Error(
              '🛡️ Content Blocked by Safety Filters\n\n' +
              'The AI flagged this content as potentially unsafe.\n\n' +
              'Try:\n' +
              '• Rephrasing your project description\n' +
              '• Removing any sensitive or controversial terms\n' +
              '• Simplifying the content'
            );
          } else if (error.message?.includes('503') || error.message?.includes('unavailable')) {
            throw new Error(
              '🔧 Service Temporarily Unavailable\n\n' +
              'The Gemini API service is experiencing issues.\n\n' +
              'Please try again in a few moments.'
            );
          } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
            throw new Error(
              '🌐 Network Connection Error\n\n' +
              'Unable to connect to the Gemini API.\n\n' +
              'Check your internet connection and try again.'
            );
          } else if (error.message?.includes('401') || error.message?.includes('403')) {
            throw new Error(
              '🔐 Authentication Failed\n\n' +
              'Your Gemini API key is invalid or expired.\n\n' +
              'Get a new key from: https://aistudio.google.com/app/apikey\n' +
              'Update your .env file with: VITE_GEMINI_API_KEY=your_new_key'
            );
          } else {
            throw new Error(
              `❌ Resume Generation Failed\n\n` +
              `${error.message}\n\n` +
              `If this persists, please check:\n` +
              `• Your API key is valid\n` +
              `• You have internet connectivity\n` +
              `• The Gemini API service status`
            );
          }
        }
      },
      
      


      UploadFile: async ({ file }) => {
        try {
          
          
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
              const content = e.target.result;
              
              
              if (file.type === 'application/pdf') {
                
                
                resolve({ 
                  file_url: content,
                  fileName: file.name,
                  fileType: file.type
                });
              } else if (file.type.includes('word') || file.type.includes('document')) {
                
                resolve({ 
                  file_url: content,
                  fileName: file.name,
                  fileType: file.type
                });
              } else {
                
                resolve({ 
                  file_url: content,
                  fileName: file.name,
                  fileType: file.type
                });
              }
            };
            
            reader.onerror = (error) => {
              reject(new Error('Failed to read file: ' + error));
            };
            
            
            if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document')) {
              reader.readAsDataURL(file);
            } else {
              reader.readAsText(file);
            }
          });
          
        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
      }
    }
  }
};
