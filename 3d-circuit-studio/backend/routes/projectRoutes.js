const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const analyzerService = require('../services/analyzerService');

const SAVED_PROJECTS_FILE = path.join(__dirname, '../../data/saved_projects.json');

function getSavedProjects() {
  try {
    if (!fs.existsSync(SAVED_PROJECTS_FILE)) {
      fs.writeFileSync(SAVED_PROJECTS_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(SAVED_PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading saved projects:', err);
    return [];
  }
}

function saveProjectsList(projectsList) {
  try {
    fs.writeFileSync(SAVED_PROJECTS_FILE, JSON.stringify(projectsList, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing saved projects:', err);
    return false;
  }
}

// POST /api/projects/analyze - Analyze any project name
router.post('/analyze', (req, res) => {
  try {
    const { projectName } = req.body;
    if (!projectName) {
      return res.status(400).json({ success: false, error: 'Project name is required' });
    }

    const result = analyzerService.analyzeProject(projectName);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Analysis API Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error during analysis' });
  }
});

// GET /api/components - Get full components catalog
router.get('/components', (req, res) => {
  try {
    const components = analyzerService.getAllComponents();
    return res.json({ success: true, count: components.length, data: components });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve components' });
  }
});

// GET /api/projects/presets - Get pre-configured project blueprints
router.get('/presets', (req, res) => {
  try {
    const projects = analyzerService.getAllProjects();
    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve project presets' });
  }
});

// POST /api/projects/save - Save user 3D project
router.post('/save', (req, res) => {
  try {
    const { projectName, selectedComponents, positions, rotations, wires, id } = req.body;
    if (!projectName) {
      return res.status(400).json({ success: false, error: 'Project name is required for saving' });
    }

    const saved = getSavedProjects();
    const projectId = id || `project-${Date.now()}`;
    const newProjectEntry = {
      id: projectId,
      name: projectName,
      savedAt: new Date().toISOString(),
      components: selectedComponents || [],
      positions: positions || [],
      rotations: rotations || [],
      wires: wires || []
    };

    const existingIndex = saved.findIndex(p => p.id === projectId);
    if (existingIndex >= 0) {
      saved[existingIndex] = newProjectEntry;
    } else {
      saved.unshift(newProjectEntry);
    }

    saveProjectsList(saved);
    return res.json({ success: true, message: 'Project saved successfully', projectId, data: newProjectEntry });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to save project' });
  }
});

// GET /api/projects/saved - Get all user saved projects
router.get('/saved', (req, res) => {
  try {
    const saved = getSavedProjects();
    return res.json({ success: true, count: saved.length, data: saved });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch saved projects' });
  }
});

module.exports = router;
