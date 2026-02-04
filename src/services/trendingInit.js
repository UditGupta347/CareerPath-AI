


import { mockProjects, updateTrendingProjects } from './mockData';


(async () => {
  try {
    await updateTrendingProjects();
    console.log('✅ Initial trending update complete');
  } catch (error) {
    console.error('Failed to initialize trending:', error);
  }
})();

export { mockProjects };
