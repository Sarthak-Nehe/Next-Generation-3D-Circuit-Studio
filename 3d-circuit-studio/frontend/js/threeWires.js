/**
 * 3D Spline Wire Generator & Pin Connection Manager
 * Tinkercad Circuits Style Dupont Jumper Wires with terminal pin caps.
 */

window.ThreeWiresManager = {
  activeWires: [],
  activeWireColor: '#dc2626',
  pinAnchorMeshes: [],

  initWireManager(scene) {
    this.scene = scene;
    this.activeWires = [];
    this.pinAnchorMeshes = [];
  },

  setWireColor(colorHex) {
    this.activeWireColor = colorHex;
  },

  // Create Smooth Natural Curved Dupont Jumper Wire without 90-degree boxy bends
  createRegularWire(p1, p2, colorHex = '#dc2626', wireIndex = 0) {
    const wireGroup = new THREE.Group();

    const dist = p1.distanceTo(p2);
    // Smooth natural arch height
    const baseArch = Math.max(p1.y, p2.y) + Math.min(1.0, 0.25 + dist * 0.12);
    const tierOffset = (wireIndex % 5) * 0.08;
    const peakY = baseArch + tierOffset;

    // Smooth control points
    const ctrl1 = p1.clone();
    ctrl1.y += 0.3;

    const midX = p1.x + (p2.x - p1.x) * 0.5;
    const midZ = p1.z + (p2.z - p1.z) * 0.5;
    const midPoint = new THREE.Vector3(midX, peakY, midZ);

    const ctrl2 = p2.clone();
    ctrl2.y += 0.3;

    const curve = new THREE.CatmullRomCurve3([p1, ctrl1, midPoint, ctrl2, p2]);
    const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.055, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.1
    });

    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.castShadow = true;
    wireGroup.add(tubeMesh);

    // Black Dupont Connector Terminal Caps at wire ends
    const capGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 12);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });

    const cap1 = new THREE.Mesh(capGeo, capMat);
    cap1.position.copy(p1);
    wireGroup.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, capMat);
    cap2.position.copy(p2);
    wireGroup.add(cap2);

    this.scene.add(wireGroup);
    return wireGroup;
  },

  createOrthogonalWire(p1, p2, colorHex = '#dc2626', wireIndex = 0) {
    return this.createRegularWire(p1, p2, colorHex, wireIndex);
  },

  createSplineWire(p1, p2, colorHex = '#dc2626', wireIndex = 0) {
    return this.createRegularWire(p1, p2, colorHex, wireIndex);
  },

  // Add Wire to Manager
  addWireConnection(fromCompInstanceId, fromPinName, toCompInstanceId, toPinName, colorHex = null) {
    const color = colorHex || this.activeWireColor;

    this.removeWireConnection(fromCompInstanceId, fromPinName, toCompInstanceId, toPinName);

    const wireEntry = {
      fromComp: fromCompInstanceId,
      fromPin: fromPinName,
      toComp: toCompInstanceId,
      toPin: toPinName,
      color: color,
      wireMesh: null
    };

    this.activeWires.push(wireEntry);
    this.updateWiresPositions();
    if (window.ThreeApp && window.ThreeApp.updatePCBBoard) {
      window.ThreeApp.updatePCBBoard();
    }
    return wireEntry;
  },

  // Remove specific wire connection
  removeWireConnection(fromComp, fromPin, toComp, toPin) {
    this.activeWires = this.activeWires.filter(w => {
      const isMatch = (w.fromComp === fromComp && w.fromPin === fromPin && w.toComp === toComp && w.toPin === toPin) ||
                      (w.fromComp === toComp && w.fromPin === toPin && w.toComp === fromComp && w.toPin === fromPin);
      if (isMatch && w.wireMesh) {
        this.scene.remove(w.wireMesh);
      }
      return !isMatch;
    });
  },

  // Clear all wires
  clearAllWires() {
    this.activeWires.forEach(w => {
      if (w.wireMesh) {
        this.scene.remove(w.wireMesh);
      }
    });
    this.activeWires = [];
  },

  // Recalculate 3D wire curves during component drag and drop
  updateWiresPositions() {
    const resolvePinPos = (obj, pinName) => {
      if (!obj.userData || !obj.userData.pinsMap) return new THREE.Vector3(0, 0.4, 0);
      const map = obj.userData.pinsMap;
      if (map[pinName]) return map[pinName];
      
      // Alias lookups
      const aliases = {
        '3V3': ['3.3V', 'VCC', 'POWER'],
        '3.3V': ['3V3', 'VCC', 'POWER'],
        '5V': ['VCC_5V', 'VIN', 'VCC'],
        'VIN': ['5V', 'VCC5', 'DC+'],
        'GND': ['GND1', 'GND2', 'GND3', '0V', 'NEG', 'V-'],
        'GND1': ['GND', 'GND2', 'GND3', '0V'],
        'GND2': ['GND2', 'GND', 'GND1', 'GND3', '0V'],
        'GND3': ['GND3', 'GND', 'GND1', 'GND2', '0V'],
        'AO': ['AOUT', 'OUT', 'SIG'],
        'AOUT': ['AO', 'OUT'],
        'IN': ['IN1', 'SIG', 'PWM'],
        'IN1': ['IN', 'SIG'],
        'BAT+': ['DC+', 'VCC', 'V+', 'POS'],
        'BAT-': ['DC-', 'GND', 'V-', 'NEG'],
        'SOLAR+': ['DC+', 'VCC', 'V+'],
        'SOLAR-': ['DC-', 'GND', 'V-'],
        'DC+': ['BAT+', 'SOLAR+', 'VCC', 'COM'],
        'DC-': ['BAT-', 'SOLAR-', 'GND', 'V-'],
        'POS': ['ANODE', 'VCC', '+'],
        'NEG': ['CATHODE', 'GND', '-']
      };

      if (aliases[pinName]) {
        for (const alias of aliases[pinName]) {
          if (map[alias]) return map[alias];
        }
      }

      // Fuzzy match (case-insensitive)
      const keys = Object.keys(map);
      const lower = (pinName || '').toLowerCase();
      const foundKey = keys.find(k => k.toLowerCase() === lower || k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()));
      if (foundKey) return map[foundKey];

      // Fallback: return first available pin position if pinName isn't matched
      if (obj.userData.pinList && obj.userData.pinList.length > 0) {
        return obj.userData.pinList[0].localPos;
      }

      return new THREE.Vector3(0, 0.4, 0);
    };

    this.activeWires.forEach((wire, wireIdx) => {
      const fromObj = window.ThreeApp.placedComponentsMap[wire.fromComp];
      const toObj = window.ThreeApp.placedComponentsMap[wire.toComp];

      if (!fromObj || !toObj) return;

      fromObj.updateMatrixWorld(true);
      toObj.updateMatrixWorld(true);

      const fromLocalPin = resolvePinPos(fromObj, wire.fromPin);
      const toLocalPin = resolvePinPos(toObj, wire.toPin);

      const p1 = fromLocalPin.clone().applyMatrix4(fromObj.matrixWorld);
      const p2 = toLocalPin.clone().applyMatrix4(toObj.matrixWorld);

      if (wire.wireMesh) {
        this.scene.remove(wire.wireMesh);
      }

      wire.wireMesh = this.createOrthogonalWire(p1, p2, wire.color, wireIdx);
    });
  },

  // Render Pin Anchor Spheres for All Pins in Scene
  showPinAnchors() {
    this.hidePinAnchors();
    const anchorGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const anchorMat = new THREE.MeshStandardMaterial({
      color: 0x00979d,
      emissive: 0x00979d,
      emissiveIntensity: 0.5,
      roughness: 0.2
    });

    Object.values(window.ThreeApp.placedComponentsMap).forEach(compGroup => {
      compGroup.updateMatrixWorld(true);
      const pinList = compGroup.userData.pinList || [];
      pinList.forEach(pin => {
        const anchorMesh = new THREE.Mesh(anchorGeo, anchorMat.clone());
        const worldPos = pin.localPos.clone().applyMatrix4(compGroup.matrixWorld);
        anchorMesh.position.copy(worldPos);
        anchorMesh.userData = {
          isPinAnchor: true,
          compInstanceId: compGroup.userData.instanceId,
          pinName: pin.name
        };
        this.scene.add(anchorMesh);
        this.pinAnchorMeshes.push(anchorMesh);
      });
    });
  },

  hidePinAnchors() {
    this.pinAnchorMeshes.forEach(mesh => {
      this.scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.pinAnchorMeshes = [];
  }
};
