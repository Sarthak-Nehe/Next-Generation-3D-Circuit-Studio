/**
 * Master Three.js Scene & Viewport Manager
 * Autodesk Fusion 360 & Cirkit Designer 3D Circuit Studio Engine
 */

window.ThreeApp = {
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  placedComponentsMap: {}, // instanceId -> THREE.Group
  activeWiresList: [],     // Store active wire connections schema
  workspaceMode: 'pcb', // 'pcb' (default) | 'breadboard'
  simulationActive: false,
  simTime: 0,
  
  // Layer Groups
  layersMap: {
    components: true,
    wires: true,
    pins: true,
    grid: true,
    axis: true
  },

  // ViewCube Elements
  viewCubeEl: null,
  cadGridHelper: null,
  cadAxisGroup: null,
  pcbBoardGroup: null,
  measureLineMesh: null,

  init(canvasContainer) {
    this.container = canvasContainer;
    this.placedComponentsMap = {};
    this.activeWiresList = [];

    // 1. Create Scene with Obsidian Dark background (#070a12)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070a12);
    this.scene.fog = new THREE.FogExp2(0x070a12, 0.012);

    // 2. Camera Setup
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || (window.innerHeight - 60);
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 12, 16);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls Setup
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 60;

    // 5. High-Precision Studio Lighting Setup
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(12, 22, 15);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    dirLight1.shadow.bias = -0.0001;
    this.scene.add(dirLight1);

    const cyanFillLight = new THREE.DirectionalLight(0x00f0ff, 0.4);
    cyanFillLight.position.set(-15, 12, -15);
    this.scene.add(cyanFillLight);

    // 6. Ground Workbench Plane (Dark Obsidian Metallic Surface)
    const planeGeo = new THREE.PlaneGeometry(80, 80);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.7, metalness: 0.2 });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.02;
    plane.receiveShadow = true;
    this.scene.add(plane);

    // 7. Initialize Wire Manager & Interactions
    window.ThreeWiresManager.initWireManager(this.scene);
    window.ThreeInteractions.initInteractions(this.camera, this.scene, this.renderer.domElement);

    // Render PCB Board Substrate by default
    this.updatePCBBoard();

    // Window Resize Listener
    window.addEventListener('resize', () => this.onWindowResize());

    // Start Render Loop
    this.animate();
  },

  zoomCamera(delta) {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.camera.position.addScaledVector(dir, delta);
    this.controls.update();

    const zoomPct = Math.round((18 / this.camera.position.distanceTo(this.controls.target)) * 98);
    const badge = document.getElementById('zoom-level-val');
    if (badge) badge.textContent = `${Math.min(150, Math.max(30, zoomPct))}%`;
  },

  fitCameraToScene() {
    this.controls.target.set(0, 0, 0);
    this.camera.position.set(0, 12, 16);
    this.controls.update();
    const badge = document.getElementById('zoom-level-val');
    if (badge) badge.textContent = `98%`;
  },

  reloadCanvas() {
    this.fitCameraToScene();
    this.updatePCBBoard();
    window.UI.showToast("Canvas & PCB Board Reloaded");
  },

  togglePinLabels(visible) {
    if (visible) window.ThreeWiresManager.showPinAnchors();
    else window.ThreeWiresManager.hidePinAnchors();
  },

  // Live Screen Texture Update for TFT Screen (Mascot & Moisture Level)
  updateTFTScreenTexture(moisture) {
    Object.values(this.placedComponentsMap).forEach(comp => {
      if (comp.userData.screenMesh) {
        const newTex = window.ThreeComponentsFactory.generatePlantPalScreenTexture(moisture);
        comp.userData.screenMesh.material.map = newTex;
        comp.userData.screenMesh.material.emissiveMap = newTex;
        comp.userData.screenMesh.material.needsUpdate = true;
      }
    });
  },

  // CAD Precision Grid Helper
  buildCADGrid() {
    if (this.cadGridHelper) this.scene.remove(this.cadGridHelper);
    this.cadGridHelper = new THREE.GridHelper(50, 50, 0x00f0ff, 0x1e293b);
    this.cadGridHelper.position.y = -0.01;
    this.scene.add(this.cadGridHelper);
  },

  // 3D RGB Origin Axis Vector Triad (Autodesk Fusion Style)
  buildOriginRGBTriad() {
    this.cadAxisGroup = new THREE.Group();
    this.cadAxisGroup.name = "origin-rgb-triad";

    const arrowLength = 2.0;
    const headLength = 0.4;
    const headWidth = 0.2;

    // X Axis (Red)
    const xAxis = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0.02, 0), arrowLength, 0xdc2626, headLength, headWidth);
    // Y Axis (Green)
    const yAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.02, 0), arrowLength, 0x16a34a, headLength, headWidth);
    // Z Axis (Blue)
    const zAxis = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0.02, 0), arrowLength, 0x0284c7, headLength, headWidth);

    this.cadAxisGroup.add(xAxis);
    this.cadAxisGroup.add(yAxis);
    this.cadAxisGroup.add(zAxis);
    this.scene.add(this.cadAxisGroup);
  },

  // Procedural PCB Board Surface & Trace Update
  updatePCBBoard() {
    if (this.pcbBoardGroup) {
      this.scene.remove(this.pcbBoardGroup);
      this.pcbBoardGroup = null;
    }

    if (this.workspaceMode === 'pcb') {
      // Hide solderless breadboard if present
      Object.values(this.placedComponentsMap).forEach(compGroup => {
        if (compGroup.userData && compGroup.userData.componentId === 'breadboard-830') {
          compGroup.visible = false;
        } else {
          compGroup.visible = true;
        }
      });

      const wires = window.ThreeWiresManager ? window.ThreeWiresManager.activeWires : this.activeWiresList;
      this.pcbBoardGroup = window.ThreeComponentsFactory.buildProceduralPCBBoard(this.placedComponentsMap, wires);
      this.scene.add(this.pcbBoardGroup);
    } else {
      Object.values(this.placedComponentsMap).forEach(compGroup => {
        compGroup.visible = true;
      });
    }
  },

  toggleWorkspaceMode() {
    const nextMode = this.workspaceMode === 'pcb' ? 'breadboard' : 'pcb';
    this.setWorkspaceViewMode(nextMode);
  },

  // Viewport View Mode Switcher (Breadboard 3D vs PCB Board 3D)
  setWorkspaceViewMode(mode) {
    this.workspaceMode = mode;
    this.updatePCBBoard();

    if (mode === 'pcb') {
      window.UI.showToast("⚡ Switched to 3D Custom PCB Board View (Autodesk Fusion FR4)");
    } else {
      window.UI.showToast("🔌 Switched to 3D Breadboard View Mode");
    }
  },

  // Layer Visibility Controls
  toggleLayer(layerName, isVisible) {
    this.layersMap[layerName] = isVisible;

    if (layerName === 'grid' && this.cadGridHelper) {
      this.cadGridHelper.visible = isVisible;
    } else if (layerName === 'axis' && this.cadAxisGroup) {
      this.cadAxisGroup.visible = isVisible;
    } else if (layerName === 'wires') {
      window.ThreeWiresManager.wiresGroup.visible = isVisible;
    } else if (layerName === 'components') {
      Object.values(this.placedComponentsMap).forEach(group => {
        if (group.userData.componentId !== 'breadboard-830') group.visible = isVisible;
      });
    }
  },

  // Autodesk Fusion 360 Camera Snap (TOP, FRONT, RIGHT, ISO, etc.)
  snapCameraToFace(faceName) {
    const target = this.controls.target.clone();
    let dist = 22;

    switch (faceName) {
      case 'TOP':
        this.camera.position.set(target.x, target.y + dist, target.z + 0.01);
        break;
      case 'BOTTOM':
        this.camera.position.set(target.x, target.y - dist, target.z + 0.01);
        break;
      case 'FRONT':
        this.camera.position.set(target.x, target.y + 1, target.z + dist);
        break;
      case 'BACK':
        this.camera.position.set(target.x, target.y + 1, target.z - dist);
        break;
      case 'LEFT':
        this.camera.position.set(target.x - dist, target.y + 1, target.z);
        break;
      case 'RIGHT':
        this.camera.position.set(target.x + dist, target.y + 1, target.z);
        break;
      case 'ISO':
      default:
        this.camera.position.set(target.x + 14, target.y + 14, target.z + 18);
        break;
    }

    this.controls.update();
    window.UI.showToast(`🎥 Camera snapped to ${faceName} View`);
  },

  // 3D Measurement Caliper Line Renderer
  renderMeasurementCaliper(p1, p2) {
    if (this.measureLineMesh) this.scene.remove(this.measureLineMesh);
    if (!p1 || !p2) return;

    const distanceMm = p1.distanceTo(p2) * 10; // 1 unit = 10mm scale

    const linePath = new THREE.LineCurve3(p1, p2);
    const tubeGeo = new THREE.TubeGeometry(linePath, 1, 0.06, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.6 });
    this.measureLineMesh = new THREE.Mesh(tubeGeo, tubeMat);

    // Add End Point Spheres
    const sphereGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const s1 = new THREE.Mesh(sphereGeo, tubeMat);
    s1.position.copy(p1);
    const s2 = new THREE.Mesh(sphereGeo, tubeMat);
    s2.position.copy(p2);

    this.measureLineMesh.add(s1);
    this.measureLineMesh.add(s2);
    this.scene.add(this.measureLineMesh);

    return distanceMm.toFixed(1);
  },

  clearMeasurementCaliper() {
    if (this.measureLineMesh) {
      this.scene.remove(this.measureLineMesh);
      this.measureLineMesh = null;
    }
  },

  loadLayout(layoutData) {
    this.clearWorkspace();

    if (!layoutData || !layoutData.components) return;

    layoutData.components.forEach(compData => {
      const group = window.ThreeComponentsFactory.createComponent3D(compData.id, compData.instanceId);
      group.position.set(compData.x || 0, compData.y || 0.4, compData.z || 0);
      group.rotation.y = compData.rotation || 0;

      this.scene.add(group);
      this.placedComponentsMap[compData.instanceId] = group;
    });

    if (layoutData.wires && Array.isArray(layoutData.wires)) {
      this.activeWiresList = layoutData.wires;
      layoutData.wires.forEach(w => {
        window.ThreeWiresManager.addWireConnection(w.fromComp, w.fromPin, w.toComp, w.toPin, w.color);
      });
    }

    // Auto-generate 3D PCB Board substrate and copper traces
    this.updatePCBBoard();

    // Reset Camera Focus
    this.controls.target.set(0, 0, 0);
    this.camera.position.set(0, 14, 18);
    this.controls.update();
  },

  clearWorkspace() {
    Object.values(this.placedComponentsMap).forEach(group => {
      this.scene.remove(group);
    });
    this.placedComponentsMap = {};
    this.activeWiresList = [];
    if (this.pcbBoardGroup) {
      this.scene.remove(this.pcbBoardGroup);
      this.pcbBoardGroup = null;
    }
    this.clearMeasurementCaliper();
    window.ThreeWiresManager.clearAllWires();
  },

  onWindowResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || (window.innerHeight - 60);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  },

  toggleSimulation(active) {
    this.simulationActive = active !== undefined ? active : !this.simulationActive;
    window.UI.showToast(this.simulationActive ? "⚡ Power Simulation Running!" : "⏸️ Simulation Stopped");
  },

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.update();

    // Sync Autodesk Fusion 3D ViewCube orientation with Three.js Camera
    if (this.viewCubeEl) {
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir);
      
      const pitch = Math.asin(dir.y);
      const yaw = Math.atan2(dir.x, dir.z);

      const rotX = Math.round((pitch * 180) / Math.PI);
      const rotY = Math.round((yaw * 180) / Math.PI);

      this.viewCubeEl.style.transform = `rotateX(${rotX}deg) rotateY(${-rotY}deg)`;
    }

    if (this.simulationActive) {
      this.simTime += 0.05;

      Object.values(this.placedComponentsMap).forEach(comp => {
        if (comp.userData.componentId === 'led-pack') {
          const light = comp.children.find(c => c.isPointLight);
          if (light) light.intensity = 1.8 + Math.sin(this.simTime * 5) * 0.8;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
};
