import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (userData) => {
        set({ 
          user: {
            ...userData,
            provider: userData.provider || 'email',
            avatar: userData.avatar || null
          }, 
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
        
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('project-storage');
      },
      
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },
      
      me: async () => {
        return get().user;
      },
      
      isAuth: () => {
        return get().isAuthenticated;
      },

      getProvider: () => {
        return get().user?.provider || null;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
