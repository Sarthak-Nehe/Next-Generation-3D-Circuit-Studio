/**
 * API Service Client for 3D Circuit Studio
 * Seamlessly connects to Express Backend REST API, falling back to local client services if server is offline.
 */

window.AppAPI = {
  baseUrl: 'http://localhost:5000/api/projects',

  async analyzeProject(projectName) {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName })
      });
      if (!response.ok) throw new Error('API server returned error');
      const json = await response.json();
      if (json.success) return json.data;
      throw new Error(json.error || 'Analysis failed');
    } catch (err) {
      console.warn('Backend API unavailable, utilizing in-browser Analyzer Service:', err.message);
      return window.ClientAnalyzerService.analyze(projectName);
    }
  },

  async fetchComponents() {
    try {
      const response = await fetch(`${this.baseUrl}/components`);
      if (!response.ok) throw new Error('Failed to fetch components');
      const json = await response.json();
      return json.data;
    } catch (err) {
      return window.ClientAnalyzerService.componentsCatalog;
    }
  },

  async fetchPresets() {
    try {
      const response = await fetch(`${this.baseUrl}/presets`);
      if (!response.ok) throw new Error('Failed to fetch presets');
      const json = await response.json();
      return json.data;
    } catch (err) {
      return window.ClientAnalyzerService.projects;
    }
  },

  async saveProject(projectData) {
    try {
      const response = await fetch(`${this.baseUrl}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (response.ok) {
        const json = await response.json();
        return json;
      }
    } catch (err) {
      console.warn('Backend save API offline, storing project to browser LocalStorage');
    }

    // LocalStorage fallback
    const savedList = JSON.parse(localStorage.getItem('saved_circuit_projects') || '[]');
    const newProject = {
      ...projectData,
      id: projectData.id || `proj-${Date.now()}`,
      savedAt: new Date().toISOString()
    };
    const idx = savedList.findIndex(p => p.id === newProject.id);
    if (idx >= 0) savedList[idx] = newProject;
    else savedList.unshift(newProject);

    localStorage.setItem('saved_circuit_projects', JSON.stringify(savedList));
    return { success: true, message: 'Saved to browser storage', data: newProject };
  },

  async fetchSavedProjects() {
    try {
      const response = await fetch(`${this.baseUrl}/saved`);
      if (response.ok) {
        const json = await response.json();
        return json.data;
      }
    } catch (err) {
      // LocalStorage fallback
    }
    return JSON.parse(localStorage.getItem('saved_circuit_projects') || '[]');
  }
};
