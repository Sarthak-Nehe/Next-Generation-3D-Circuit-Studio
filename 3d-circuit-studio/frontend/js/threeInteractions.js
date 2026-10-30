/**
 * 3D Interaction & Raycasting Manager
 * Autodesk Fusion 360 & Cirkit Designer 3D Circuit Studio Engine
 */

window.ThreeInteractions = {
  selectedObject: null,
  isDragging: false,
  wiringMode: false,
  wireStartPin: null, // { compInstanceId, pinName, mesh }
  
  // Measurement Caliper Mode
  measureMode: false,
  measureStartPin: null,

  initInteractions(camera, scene, domElement) {
    this.camera = camera;
    this.scene = scene;
    this.domElement = domElement;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.tooltipHud = document.getElementById('pin-tooltip-hud');
    this.tooltipTitle = document.getElementById('pin-hud-name');
    this.tooltipMeta = document.getElementById('pin-hud-meta');

    this.bindEvents();
  },

  bindEvents() {
    const canvas = this.domElement;

    canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
    canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        this.rotateSelectedComponent(45);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        this.deleteSelectedComponent();
      }
    });
  },

  updateMouseCoords(e) {
    const rect = this.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    return { clientX: e.clientX, clientY: e.clientY };
  },

  onPointerDown(e) {
    if (e.button !== 0) return; // Left click only

    this.updateMouseCoords(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Measurement Caliper Mode
    if (this.measureMode) {
      const pinHits = this.raycaster.intersectObjects(window.ThreeWiresManager.pinAnchorMeshes);
      if (pinHits.length > 0) {
        const anchor = pinHits[0].object;
        const pinPos = anchor.getWorldPosition(new THREE.Vector3());

        if (!this.measureStartPin) {
          this.measureStartPin = pinPos;
          window.UI.showToast("Caliper: 1st pin set. Now click 2nd pin.");
        } else {
          const distMm = window.ThreeApp.renderMeasurementCaliper(this.measureStartPin, pinPos);
          document.getElementById('measure-result-val').textContent = `${distMm} mm`;
          window.UI.showToast(`📏 Distance Measured: ${distMm} mm`);
          this.measureStartPin = null;
        }
        return;
      }
    }

    // 2. Wiring Mode Pin Anchor Click
    if (this.wiringMode) {
      const pinHits = this.raycaster.intersectObjects(window.ThreeWiresManager.pinAnchorMeshes);
      if (pinHits.length > 0) {
        const anchor = pinHits[0].object;
        const pinData = anchor.userData;

        if (!this.wireStartPin) {
          // First Pin Selected
          this.wireStartPin = pinData;
          anchor.material.color.setHex(0xff0055);
          anchor.scale.set(1.6, 1.6, 1.6);
          window.UI.showToast(`Selected Pin: ${pinData.compInstanceId} -> ${pinData.pinName}. Click target pin.`);
        } else {
          // Second Pin Selected -> Connect Wire!
          if (this.wireStartPin.compInstanceId === pinData.compInstanceId && this.wireStartPin.pinName === pinData.pinName) {
            window.UI.showToast("Cannot connect pin to itself", "warning");
            return;
          }

          window.ThreeWiresManager.addWireConnection(
            this.wireStartPin.compInstanceId,
            this.wireStartPin.pinName,
            pinData.compInstanceId,
            pinData.pinName
          );

          window.UI.showToast(`Connected ${this.wireStartPin.pinName} ⚡ ${pinData.pinName}`);
          this.wireStartPin = null;
          window.ThreeWiresManager.showPinAnchors();
        }
        return;
      }
    }

    // 3. Select Component for Drag / Inspection
    const allCompGroups = Object.values(window.ThreeApp.placedComponentsMap);
    const intersects = this.raycaster.intersectObjects(allCompGroups, true);

    if (intersects.length > 0) {
      let rootGroup = intersects[0].object;
      while (rootGroup.parent && rootGroup.parent !== this.scene) {
        rootGroup = rootGroup.parent;
      }

      this.selectComponent(rootGroup);
      this.isDragging = true;
      window.ThreeApp.controls.enabled = false; // Disable orbit camera during drag
    } else {
      this.deselectComponent();
    }
  },

  onPointerMove(e) {
    const coords = this.updateMouseCoords(e);
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 1. Hover Pin Tooltip HUD (Cirkit Designer Style)
    if (this.tooltipHud) {
      const pinHits = this.raycaster.intersectObjects(window.ThreeWiresManager.pinAnchorMeshes);
      if (pinHits.length > 0) {
        const anchor = pinHits[0].object;
        const pinData = anchor.userData;
        const compGroup = window.ThreeApp.placedComponentsMap[pinData.compInstanceId];
        const compId = compGroup ? compGroup.userData.componentId : '';

        const metaText = window.ThreeComponentsFactory.getPinMetadata(compId, pinData.pinName);

        this.tooltipTitle.textContent = `${pinData.compInstanceId.toUpperCase()} • ${pinData.pinName}`;
        this.tooltipMeta.textContent = metaText;

        this.tooltipHud.style.left = `${coords.clientX + 16}px`;
        this.tooltipHud.style.top = `${coords.clientY + 16}px`;
        this.tooltipHud.classList.add('active');
      } else {
        this.tooltipHud.classList.remove('active');
      }
    }

    // 2. Object Dragging & Breadboard Snap
    if (this.isDragging && this.selectedObject) {
      const intersectionPoint = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(this.plane, intersectionPoint);

      if (intersectionPoint) {
        // Snap movement to grid resolution (2.54mm breadboard pitch or free float)
        const snapStep = window.UI ? window.UI.gridSnapStep || 0.2 : 0.2;
        const snapX = Math.round(intersectionPoint.x / snapStep) * snapStep;
        const snapZ = Math.round(intersectionPoint.z / snapStep) * snapStep;

        this.selectedObject.position.x = snapX;
        this.selectedObject.position.z = snapZ;

        // Update connected 3D wires in real-time
        window.ThreeWiresManager.updateWiresPositions();
        if (this.selectionBoxHelper) this.selectionBoxHelper.update();
      }
    }
  },

  onPointerUp(e) {
    if (this.isDragging) {
      this.isDragging = false;
      window.ThreeApp.updatePCBBoard();
    }
    window.ThreeApp.controls.enabled = true; // Re-enable orbit camera
  },

  selectionBoxHelper: null,

  selectComponent(group) {
    this.deselectComponent();
    this.selectedObject = group;
    group.userData.isSelected = true;

    // Render Translucent Orange Wireframe Bounding Box (matching reference image)
    this.selectionBoxHelper = new THREE.BoxHelper(group, 0xff9900);
    this.selectionBoxHelper.material.linewidth = 2;
    this.scene.add(this.selectionBoxHelper);

    // Update Right Inspector Sidebar UI
    window.UI.openInspectorDrawer(group.userData);
  },

  deselectComponent() {
    if (this.selectionBoxHelper) {
      this.scene.remove(this.selectionBoxHelper);
      this.selectionBoxHelper = null;
    }

    if (this.selectedObject) {
      this.selectedObject.userData.isSelected = false;
      this.selectedObject = null;
    }
  },

  rotateSelectedComponent(deg = 45) {
    if (!this.selectedObject) {
      window.UI.showToast("Select a component in 3D to rotate", "warning");
      return;
    }
    const rad = (deg * Math.PI) / 180;
    this.selectedObject.rotation.y += rad;
    window.ThreeWiresManager.updateWiresPositions();
    window.ThreeApp.updatePCBBoard();
    window.UI.showToast(`Rotated ${deg}°`);
  },

  deleteSelectedComponent() {
    if (!this.selectedObject) return;

    const instanceId = this.selectedObject.userData.instanceId;
    this.scene.remove(this.selectedObject);

    delete window.ThreeApp.placedComponentsMap[instanceId];
    this.selectedObject = null;
    this.deselectComponent();

    // Clean up wires connected to deleted component
    window.ThreeWiresManager.activeWires = window.ThreeWiresManager.activeWires.filter(w => {
      if (w.fromComp === instanceId || w.toComp === instanceId) {
        if (w.wireMesh) {
          this.scene.remove(w.wireMesh);
          w.wireMesh.geometry.dispose();
          w.wireMesh.material.dispose();
        }
        return false;
      }
      return true;
    });

    window.ThreeApp.updatePCBBoard();
    window.UI.showToast("Component deleted");
  },

  toggleWiringMode(enable) {
    this.wiringMode = enable !== undefined ? enable : !this.wiringMode;
    this.wireStartPin = null;

    if (this.wiringMode) {
      window.ThreeWiresManager.showPinAnchors();
      window.UI.showToast("Wiring Mode Active: Click source pin then target pin", "info");
    } else {
      window.ThreeWiresManager.hidePinAnchors();
      window.UI.showToast("Wiring Mode Disabled", "info");
    }
  },

  toggleMeasureMode(enable) {
    this.measureMode = enable !== undefined ? enable : !this.measureMode;
    this.measureStartPin = null;

    if (this.measureMode) {
      window.ThreeWiresManager.showPinAnchors();
      document.getElementById('measure-caliper-hud').classList.add('active');
      window.UI.showToast("📏 Caliper Tool Active: Click two pins to measure distance");
    } else {
      document.getElementById('measure-caliper-hud').classList.remove('active');
      window.ThreeApp.clearMeasurementCaliper();
      window.ThreeWiresManager.hidePinAnchors();
    }
  }
};
