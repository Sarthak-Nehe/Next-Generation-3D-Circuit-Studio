/**
 * UI View Router & Interaction State Manager
 * Autodesk Fusion 360 & Cirkit Designer 3D Circuit Studio Engine
 */

window.UI = {
  currentView: 'landing', // 'landing', 'selection', 'workshop'
  currentProjectData: null,
  selectedComponentsList: [],
  gridSnapStep: 0.2,
  currentCircuitImgIdx: 0,

  initUI() {
    this.bindEvents();
    this.renderCategoryPills();
  },

  switchView(viewName) {
    this.currentView = viewName;

    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.step-item').forEach(step => {
      step.classList.remove('active');
      step.classList.remove('completed');
    });

    const targetView = document.getElementById(`${viewName}-view`);
    if (targetView) targetView.classList.add('active');

    if (viewName === 'landing') {
      document.getElementById('step-1')?.classList.add('active');
    } else if (viewName === 'selection') {
      document.getElementById('step-1')?.classList.add('completed');
      document.getElementById('step-2')?.classList.add('active');
    } else if (viewName === 'workshop') {
      document.getElementById('step-1')?.classList.add('completed');
      document.getElementById('step-2')?.classList.add('completed');
      document.getElementById('step-3')?.classList.add('active');

      // Initialize Three.js viewport if not already initialized
      setTimeout(() => {
        const container = document.getElementById('three-canvas-container');
        if (container) {
          if (!window.ThreeApp.scene) {
            window.ThreeApp.init(container);
          } else {
            window.ThreeApp.onWindowResize();
          }
        }
      }, 100);
    }
  },

  bindEvents() {
    // Quick preset project chips click
    document.querySelectorAll('.preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.project;
        const input = document.getElementById('project-input');
        if (input) input.value = name;
        window.AppController.handleProjectAnalyze(name);
      });
    });

    // Form search analyze button
    document.getElementById('btn-analyze-submit')?.addEventListener('click', () => {
      const input = document.getElementById('project-input');
      const name = input ? input.value : '';
      if (!name) {
        this.showToast('Please enter a project name', 'warning');
        return;
      }
      window.AppController.handleProjectAnalyze(name);
    });

    // Search filter input in equipment selection
    document.getElementById('comp-search-filter')?.addEventListener('input', (e) => {
      this.filterComponentsGrid(e.target.value);
    });
  },

  renderCategoryPills() {
    const categories = ["All", "Microcontrollers", "Sensors", "Actuators", "Displays", "Power", "Passive"];
    const container = document.getElementById('category-pills-container');
    if (!container) return;

    container.innerHTML = categories.map(cat => `
      <button class="cat-pill ${cat === 'All' ? 'active' : ''}" onclick="window.UI.handleCategoryClick('${cat}', this)">
        ${cat}
      </button>
    `).join('');
  },

  handleCategoryClick(category, btnElem) {
    document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
    this.filterComponentsGrid('', category);
  },

  renderEquipmentSelection(projectData) {
    this.currentProjectData = projectData;
    this.selectedComponentsList = JSON.parse(JSON.stringify(projectData.components));

    const titleEl = document.getElementById('project-display-title');
    const descEl = document.getElementById('project-display-desc');
    if (titleEl) titleEl.textContent = projectData.projectName;
    if (descEl) descEl.textContent = projectData.description;

    this.renderComponentsGrid(this.selectedComponentsList);
    this.updateSummaryBar();
  },

  renderComponentsGrid(components) {
    const grid = document.getElementById('components-cards-grid');
    if (!grid) return;

    grid.innerHTML = components.map(comp => {
      const isSelected = comp.quantity > 0;
      return `
        <div class="comp-card ${isSelected ? 'selected' : ''}" id="card-${comp.id}">
          <div class="comp-card-top">
            <div class="comp-icon-box" style="background:${comp.color || '#3b82f6'}22; color:${comp.color || '#00f0ff'};">
              <i data-lucide="${comp.icon || 'cpu'}"></i>
            </div>
            <div class="comp-checkbox" onclick="window.UI.toggleComponentSelection('${comp.id}')">
              ${isSelected ? '✓' : ''}
            </div>
          </div>
          <div class="comp-title">${comp.name}</div>
          <span class="comp-category-badge">${comp.category}</span>
          <div class="comp-desc">${comp.description}</div>
          <div class="comp-actions-row">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="window.UI.changeQuantity('${comp.id}', -1)">-</button>
              <span class="qty-val" id="qty-${comp.id}">${comp.quantity || 0}</span>
              <button class="qty-btn" onclick="window.UI.changeQuantity('${comp.id}', 1)">+</button>
            </div>
            <button class="btn-specs" onclick="window.UI.openSpecsModal('${comp.id}')">
              Specs & Pinouts →
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) lucide.createIcons();
  },

  toggleComponentSelection(compId) {
    const comp = this.selectedComponentsList.find(c => c.id === compId);
    if (!comp) return;

    if (comp.quantity > 0) {
      comp.quantity = 0;
    } else {
      comp.quantity = comp.defaultQuantity || 1;
    }

    const card = document.getElementById(`card-${compId}`);
    const qtySpan = document.getElementById(`qty-${compId}`);
    if (card) {
      card.classList.toggle('selected', comp.quantity > 0);
      const checkbox = card.querySelector('.comp-checkbox');
      if (checkbox) checkbox.textContent = comp.quantity > 0 ? '✓' : '';
    }
    if (qtySpan) qtySpan.textContent = comp.quantity;

    this.updateSummaryBar();
  },

  changeQuantity(compId, delta) {
    const comp = this.selectedComponentsList.find(c => c.id === compId);
    if (!comp) return;

    comp.quantity = Math.max(0, (comp.quantity || 0) + delta);

    const card = document.getElementById(`card-${compId}`);
    const qtySpan = document.getElementById(`qty-${compId}`);
    if (card) {
      card.classList.toggle('selected', comp.quantity > 0);
      const checkbox = card.querySelector('.comp-checkbox');
      if (checkbox) checkbox.textContent = comp.quantity > 0 ? '✓' : '';
    }
    if (qtySpan) qtySpan.textContent = comp.quantity;

    this.updateSummaryBar();
  },

  filterComponentsGrid(searchTerm = '', category = 'All') {
    const term = searchTerm.toLowerCase();
    const filtered = this.selectedComponentsList.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(term) || c.description.toLowerCase().includes(term);
      const matchesCat = category === 'All' || c.category === category;
      return matchesSearch && matchesCat;
    });
    this.renderComponentsGrid(filtered);
  },

  updateSummaryBar() {
    const activeComps = this.selectedComponentsList.filter(c => c.quantity > 0);
    const totalCount = activeComps.reduce((acc, c) => acc + c.quantity, 0);

    const totalEl = document.getElementById('summary-total-count');
    const typesEl = document.getElementById('summary-types-count');
    if (totalEl) totalEl.textContent = totalCount;
    if (typesEl) typesEl.textContent = activeComps.length;
  },

  openSpecsModal(compId) {
    const comp = this.selectedComponentsList.find(c => c.id === compId);
    if (!comp) return;

    const modal = document.getElementById('specs-modal');
    const title = document.getElementById('modal-specs-title');
    const body = document.getElementById('modal-specs-body');
    if (!modal || !body) return;

    if (title) title.textContent = `${comp.name} - Technical Specs`;

    let specsHTML = `
      <p style="color:var(--text-muted); margin-bottom:16px;">${comp.description}</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px; background:rgba(7,10,18,0.6); padding:16px; border-radius:12px;">
    `;

    if (comp.specs) {
      Object.entries(comp.specs).forEach(([k, v]) => {
        specsHTML += `<div><strong style="color:var(--primary-cyan);">${k}:</strong> <span style="color:#fff;">${v}</span></div>`;
      });
    }

    specsHTML += `</div><h4 style="color:#fff; margin-bottom:10px;">Available Pins (${comp.pins ? comp.pins.length : 0})</h4><div style="display:flex; flex-wrap:wrap; gap:6px;">`;
    if (comp.pins) {
      comp.pins.forEach(pin => {
        specsHTML += `<span style="font-family:var(--font-mono); font-size:0.75rem; background:rgba(0,240,255,0.15); color:var(--primary-cyan); padding:4px 8px; border-radius:6px; border:1px solid rgba(0,240,255,0.3);">${pin}</span>`;
      });
    }
    specsHTML += `</div>`;

    body.innerHTML = specsHTML;
    modal.classList.add('active');
  },

  closeSpecsModal() {
    document.getElementById('specs-modal')?.classList.remove('active');
  },

  openRealCircuitModal() {
    const modal = document.getElementById('real-circuit-modal');
    if (modal) modal.classList.add('active');
  },

  closeRealCircuitModal() {
    const modal = document.getElementById('real-circuit-modal');
    if (modal) modal.classList.remove('active');
  },

  toggleRealCircuitImage() {
    const imgEl = document.getElementById('real-circuit-img');
    const captionEl = document.getElementById('real-circuit-caption');
    if (!imgEl) return;

    const images = [
      { src: 'frontend/images/smart_irrigation_circuit.jpg', caption: 'Smart Irrigation System 3D Hardware Blueprint - ESP32 + Moisture Sensor + OLED Display + Relay Module' },
      { src: 'frontend/images/home_automation_circuit_1788886799526.jpg', caption: 'Home Automation System Hardware Reference - ESP32 + 4-Channel Relay + PIR Motion + LDR Sensor' }
    ];

    this.currentCircuitImgIdx = (this.currentCircuitImgIdx + 1) % images.length;
    imgEl.src = images[this.currentCircuitImgIdx].src;
    if (captionEl) captionEl.textContent = images[this.currentCircuitImgIdx].caption;
    this.showToast(`Switched hardware reference photo!`);
  },

  spawnPaletteComponent(compId) {
    const container = document.getElementById('three-canvas-container');
    if (container && (!window.ThreeApp.scene || !window.ThreeApp.renderer)) {
      window.ThreeApp.init(container);
    }

    const count = Object.keys(window.ThreeApp.placedComponentsMap || {}).filter(k => k.startsWith(compId)).length + 1;
    const instanceId = `${compId}-${count}`;

    // Calculate spawn position in front of camera
    const posX = (Math.random() - 0.5) * 5;
    const posZ = (Math.random() - 0.5) * 3;

    const group = window.ThreeComponentsFactory.createComponent3D(compId, instanceId);
    group.position.set(posX, 0.4, posZ);

    window.ThreeApp.scene.add(group);
    window.ThreeApp.placedComponentsMap[instanceId] = group;

    if (window.ThreeApp.updatePCBBoard) {
      window.ThreeApp.updatePCBBoard();
    }

    if (window.ThreeInteractions) {
      window.ThreeInteractions.selectComponent(group);
    }

    this.showToast(`⚡ Spawned ${compId} into 3D Workspace!`);
  },

  spawnComponentFromPalette(compId) {
    this.spawnPaletteComponent(compId);
  },

  togglePaletteCat(headerElem) {
    const catGroup = headerElem.parentElement;
    if (catGroup) {
      catGroup.classList.toggle('active');
      const icon = headerElem.querySelector('i');
      if (icon) {
        icon.style.transform = catGroup.classList.contains('active') ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    }
  },

  filterPaletteComponents(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('.palette-item-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? 'flex' : 'none';
    });
  },

  // HTML5 Drag and Drop Handlers (Sidebar -> 3D Canvas)
  handlePaletteDragStart(e, compId) {
    window.draggedComponentId = compId;
    try {
      e.dataTransfer.setData('text/plain', compId);
      e.dataTransfer.effectAllowed = 'copy';
    } catch (err) {}
  },

  handleCanvasDrop(e) {
    e.preventDefault();
    let compId = '';
    try {
      compId = e.dataTransfer.getData('text/plain');
    } catch (err) {}
    if (!compId) compId = window.draggedComponentId;
    if (!compId) return;

    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    if (!window.ThreeApp.scene || !window.ThreeApp.camera) {
      window.ThreeApp.init(container);
    }

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), window.ThreeApp.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const dropPos = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, dropPos);

    const instanceId = `${compId}-${Date.now().toString().slice(-4)}`;
    const group = window.ThreeComponentsFactory.createComponent3D(compId, instanceId);

    const snapX = dropPos ? Math.round(dropPos.x * 5) / 5 : (Math.random() - 0.5) * 4;
    const snapZ = dropPos ? Math.round(dropPos.z * 5) / 5 : (Math.random() - 0.5) * 4;
    group.position.set(snapX, 0.4, snapZ);

    window.ThreeApp.scene.add(group);
    window.ThreeApp.placedComponentsMap[instanceId] = group;

    if (window.ThreeApp.updatePCBBoard) {
      window.ThreeApp.updatePCBBoard();
    }

    // Select the dropped component
    if (window.ThreeInteractions) {
      window.ThreeInteractions.selectComponent(group);
    }

    this.showToast(`⚡ Dragged & Dropped ${compId} into 3D Workspace!`);
    window.draggedComponentId = null;
  },

  // Toast Notifications Engine
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    else if (type === 'warning') iconName = 'alert-triangle';
    else if (type === 'error') iconName = 'x-circle';

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Component Inspector Sidebar Updates
  openInspectorDrawer(userData) {
    if (!userData) return;
    const titleEl = document.getElementById('inspector-title');
    const tableBody = document.getElementById('pins-table-body');

    if (titleEl) {
      titleEl.textContent = userData.instanceId || userData.componentId || 'Component';
    }

    if (tableBody) {
      const pins = userData.pinList || [];
      if (pins.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="color:var(--text-muted); text-align:center; padding:12px;">No active pins</td></tr>`;
      } else {
        tableBody.innerHTML = pins.map(pin => {
          const pinName = pin.name || pin.pinName || pin;
          const conn = window.ThreeWiresManager ? window.ThreeWiresManager.activeWires.find(w => 
            (w.fromComp === userData.instanceId && w.fromPin === pinName) || 
            (w.toComp === userData.instanceId && w.toPin === pinName)
          ) : null;

          const connText = conn ? `→ ${conn.fromComp === userData.instanceId ? conn.toComp + ':' + conn.toPin : conn.fromComp + ':' + conn.fromPin}` : '--';
          const netText = conn ? `net_${pinName}` : '--';

          return `
            <tr>
              <td class="pin-id-cell">${pinName}</td>
              <td><span class="conn-arrow">${conn ? '⚡' : ''}</span> ${connText}</td>
              <td>${conn ? 'HIGH' : 'FLOAT'}</td>
              <td class="net-cell">${netText}</td>
            </tr>
          `;
        }).join('');
      }
    }
  },

  // Simulation Slider & Live Serial Console Logging
  handleMoistureSliderChange(val) {
    const moisture = parseInt(val, 10);
    const valBadge = document.getElementById('sim-moisture-val');
    const adcBadge = document.getElementById('sim-adc-val');

    if (valBadge) valBadge.textContent = `${moisture}%`;

    // ADC voltage calculation (0-100% -> 0.0V - 3.3V)
    const adcVolt = ((100 - moisture) / 100 * 3.3).toFixed(2);
    if (adcBadge) adcBadge.textContent = `${adcVolt} V`;

    // Update TFT screen display texture in 3D scene
    if (window.ThreeApp && window.ThreeApp.updateTFTScreenTexture) {
      window.ThreeApp.updateTFTScreenTexture(moisture);
    }

    // Stream log to serial monitor console
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const msg = moisture > 80 ? 'CRITICAL: High moisture level detected! Turning off pump.' :
                (moisture < 30 ? 'WARNING: Low soil moisture! Actuating Relay Channel 1 -> PUMP ON' : 'NORMAL: Soil moisture optimal.');
    
    this.appendSerialLog(`[${timestamp}] [ADC:${adcVolt}V] [SOIL:${moisture}%] ${msg}`);
  },

  toggleSerialMonitor() {
    const panel = document.getElementById('serial-monitor-panel');
    const icon = document.getElementById('sm-toggle-icon');
    if (panel) {
      panel.classList.toggle('collapsed');
      if (icon) {
        icon.style.transform = panel.classList.contains('collapsed') ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }
  },

  clearSerialMonitor() {
    const consoleEl = document.getElementById('serial-monitor-console');
    if (consoleEl) consoleEl.innerHTML = '<div class="sm-log-line muted">[System] Serial monitor logs cleared.</div>';
  },

  appendSerialLog(text) {
    const consoleEl = document.getElementById('serial-monitor-console');
    if (!consoleEl) return;

    const line = document.createElement('div');
    line.className = 'sm-log-line';
    line.textContent = text;
    consoleEl.appendChild(line);

    const chk = document.getElementById('sm-autoscroll-chk');
    if (chk && chk.checked) {
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  }
};
