import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      savedProjects: [],
      userProfiles: [],
      generatedRoadmaps: {}, 
      
      
      setProjects: (projects) => set({ projects }),
      
      addProject: (project) => {
        const newProject = {
          ...project,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
          likes: 0,
          is_trending: false,
        };
        set({ projects: [newProject, ...get().projects] });
        return newProject;
      },
      
      getProjectById: (id) => {
        return get().projects.find(p => p.id === id);
      },
      
      
      saveProject: (projectId, userEmail) => {
        const existing = get().savedProjects.find(
          sp => sp.project_id === projectId && sp.user_email === userEmail
        );
        
        if (existing) {
          
          set({
            savedProjects: get().savedProjects.filter(sp => sp.id !== existing.id)
          });
        } else {
          
          const newSaved = {
            id: Date.now().toString(),
            project_id: projectId,
            user_email: userEmail,
            status: 'saved',
            progress: 0,
            notes: '',
            completed_milestones: [],
            created_date: new Date().toISOString(),
          };
          set({ savedProjects: [...get().savedProjects, newSaved] });
        }
      },
      
      getSavedProjects: (userEmail) => {
        return get().savedProjects.filter(sp => sp.user_email === userEmail);
      },
      
      updateSavedProject: (id, updates) => {
        set({
          savedProjects: get().savedProjects.map(sp =>
            sp.id === id ? { ...sp, ...updates } : sp
          )
        });
      },
      
      deleteSavedProject: (id) => {
        set({
          savedProjects: get().savedProjects.filter(sp => sp.id !== id)
        });
      },
      
      
      createUserProfile: (profile) => {
        const newProfile = {
          ...profile,
          id: Date.now().toString(),
          created_date: new Date().toISOString(),
        };
        set({ userProfiles: [...get().userProfiles, newProfile] });
        return newProfile;
      },
      
      getUserProfile: (userEmail) => {
        return get().userProfiles.find(p => p.user_email === userEmail);
      },
      
      updateUserProfile: (userEmail, updates) => {
        set({
          userProfiles: get().userProfiles.map(p =>
            p.user_email === userEmail ? { ...p, ...updates } : p
          )
        });
      },
      
      
      getOrGenerateRoadmap: async (project) => {
        
        if (project.roadmap && project.roadmap.phases && project.roadmap.phases.length > 0) {
          console.log('📋 Using existing roadmap for:', project.title);
          return project.roadmap;
        }
        
        
        const cached = get().generatedRoadmaps[project.id];
        if (cached) {
          console.log('💾 Using cached generated roadmap for:', project.title);
          return cached;
        }
        
        
        console.log('🤖 Generating new roadmap with AI for:', project.title);
        const { generateProjectRoadmap } = await import('@/services/geminiService');
        
        const roadmap = await generateProjectRoadmap(
          project.title,
          project.description,
          project.tech_stack,
          project.complexity,
          project.estimated_time
        );
        
        
        set({
          generatedRoadmaps: {
            ...get().generatedRoadmaps,
            [project.id]: roadmap
          }
        });
        
        return roadmap;
      },
      
      setGeneratedRoadmap: (projectId, roadmap) => {
        set({
          generatedRoadmaps: {
            ...get().generatedRoadmaps,
            [projectId]: roadmap
          }
        });
      },
      
      clearGeneratedRoadmap: (projectId) => {
        const roadmaps = { ...get().generatedRoadmaps };
        delete roadmaps[projectId];
        set({ generatedRoadmaps: roadmaps });
      },

    }),
    {
      name: 'project-storage',
    }
  )
);
