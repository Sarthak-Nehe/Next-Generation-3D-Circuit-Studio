/**
 * Main Full-Stack Application Controller & Orchestrator
 */

window.AppController = {
  currentProject: null,

  init() {
    console.log("🚀 Initializing Next-Generation 3D Circuit Studio Application");

    // Initialize UI
    window.UI.initUI();

    // Bind Workshop Header & Toolbar Buttons
    this.bindWorkshopActions();

    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();
  },

  async handleProjectAnalyze(projectName) {
    window.UI.showToast(`Analyzing "${projectName}"...`, 'info');

    try {
      const resultData = await window.AppAPI.analyzeProject(projectName);
      this.currentProject = resultData;

      // Render equipment selection screen
      window.UI.renderEquipmentSelection(resultData);
      window.UI.switchView('selection');
      window.UI.showToast(`Found ${resultData.summary.uniqueTypes} optimal components for ${resultData.projectName}!`);
    } catch (err) {
      console.error('Project analysis error:', err);
      window.UI.showToast('Failed to analyze project: ' + err.message, 'error');
    }
  },

  launch3DWorkshop() {
    const activeComponents = window.UI.selectedComponentsList.filter(c => c.quantity > 0);
    if (activeComponents.length === 0) {
      window.UI.showToast('Please select at least 1 component to enter 3D workshop', 'warning');
      return;
    }

    // Switch view to 3D workshop
    window.UI.switchView('workshop');

    // Generate suggested 3D component layout & wiring
    const layout = window.PresetLayouts.getSuggestedLayout(
      this.currentProject ? this.currentProject.projectName : 'Smart Electronics Project',
      activeComponents
    );

    // Load layout into Three.js scene
    setTimeout(() => {
      window.ThreeApp.loadLayout(layout);
      window.UI.showToast('3D Workshop initialized with suggested component layout & pre-wiring!', 'info');
    }, 200);
  },

  bindWorkshopActions() {
    // 1. Launch 3D Workshop button from selection screen
    document.getElementById('btn-launch-workshop')?.addEventListener('click', () => {
      this.launch3DWorkshop();
    });

    // 2. Toolbar Actions inside 3D Workshop
    document.getElementById('tool-add-wire')?.addEventListener('click', (e) => {
      window.ThreeInteractions.toggleWiringMode();
      e.target.closest('.tool-btn').classList.toggle('active', window.ThreeInteractions.wiringMode);
    });

    document.getElementById('tool-rotate-left')?.addEventListener('click', () => {
      window.ThreeInteractions.rotateSelectedComponent(-45);
    });

    document.getElementById('tool-rotate-right')?.addEventListener('click', () => {
      window.ThreeInteractions.rotateSelectedComponent(45);
    });

    document.getElementById('tool-delete')?.addEventListener('click', () => {
      window.ThreeInteractions.deleteSelectedComponent();
    });

    document.getElementById('tool-simulation')?.addEventListener('click', (e) => {
      window.ThreeApp.toggleSimulation();
      e.target.closest('.tool-btn').classList.toggle('active', window.ThreeApp.simulationActive);
    });

    document.getElementById('tool-reset')?.addEventListener('click', () => {
      if (confirm('Reset workspace and clear components?')) {
        window.ThreeApp.clearWorkspace();
        window.UI.showToast('Workspace reset');
      }
    });

    document.getElementById('tool-save')?.addEventListener('click', () => {
      this.saveCurrentProject();
    });

    document.getElementById('tool-export-json')?.addEventListener('click', () => {
      this.exportProjectJSON();
    });

    // Wire Color Dots
    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const color = dot.dataset.color;
        window.ThreeWiresManager.setWireColor(color);
        window.UI.showToast(`Wire color set to ${color}`);
      });
    });
  },

  async saveCurrentProject() {
    if (!this.currentProject) {
      window.UI.showToast('No active project to save', 'warning');
      return;
    }

    // Collect 3D positions and rotations from scene
    const placedPositions = [];
    const placedRotations = [];

    Object.entries(window.ThreeApp.placedComponentsMap).forEach(([instanceId, group]) => {
      placedPositions.push({
        instanceId,
        componentId: group.userData.componentId,
        x: group.position.x,
        y: group.position.y,
        z: group.position.z
      });
      placedRotations.push({
        instanceId,
        rotationY: group.rotation.y
      });
    });

    const wiresData = window.ThreeWiresManager.activeWires.map(w => ({
      fromComp: w.fromComp,
      fromPin: w.fromPin,
      toComp: w.toComp,
      toPin: w.toPin,
      color: w.color
    }));

    const projectPayload = {
      projectName: this.currentProject.projectName,
      selectedComponents: window.UI.selectedComponentsList.filter(c => c.quantity > 0),
      positions: placedPositions,
      rotations: placedRotations,
      wires: wiresData
    };

    const res = await window.AppAPI.saveProject(projectPayload);
    window.UI.showToast(`Saved project "${this.currentProject.projectName}" successfully!`);
  },

  exportProjectJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      project: this.currentProject,
      selectedComponents: window.UI.selectedComponentsList,
      wires: window.ThreeWiresManager.activeWires.map(w => ({
        fromComp: w.fromComp, fromPin: w.fromPin, toComp: w.toComp, toPin: w.toPin, color: w.color
      }))
    }, null, 2));

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(this.currentProject?.projectName || 'circuit').toLowerCase().replace(/\s+/g, '-')}-schematic.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    window.UI.showToast("Exported project JSON schematic!");
  }
};

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.AppController.init();
});
