/**
 * Procedural 3D Electronics Component Generator (Three.js)
 * Highly realistic real-world 3D electronic components featuring DIP ICs, Resistor color bands,
 * Electrolytic & Ceramic Capacitors, Toroidal Inductors, Transistors, Diodes, and Breadboard pin grids.
 */

window.ThreeComponentsFactory = {
  // Real-world accurate electronics materials
  materials: {
    pcbBlue: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35, metalness: 0.15 }),
    pcbGreen: new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.35, metalness: 0.15 }),
    pcbPurple: new THREE.MeshStandardMaterial({ color: 0x7e22ce, roughness: 0.35, metalness: 0.15 }),
    pcbDark: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.2 }),
    icBlackEpoxy: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.1 }),
    metalSilver: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.2, metalness: 0.85 }),
    metalGold: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.85 }),
    copperWire: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.25, metalness: 0.8 }),
    plasticWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4, metalness: 0.05 }),
    plasticBlack: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.05 }),
    plasticRed: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.1 }),
    plasticBlueRelay: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.1 }),
    glassScreen: new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.1, metalness: 0.8 }),
    breadboardPlastic: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4, metalness: 0.05 }),
    resistorBody: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5, metalness: 0.05 }), // Tan/beige 1/4W body
    capElectrolyticBlue: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.2 }),
    capCeramicOrange: new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4, metalness: 0.1 }),
    ferriteCoreDark: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.3 }),
    plasmaCyan: new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8, roughness: 0.2 }),
    fluxPurple: new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.7, roughness: 0.2 }),
    superconductorSky: new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.7 })
  },

  // Main entrypoint: Create 3D Object Group by component ID
  createComponent3D(componentId, instanceId) {
    const group = new THREE.Group();
    group.userData = { componentId, instanceId, pinsMap: {} };

    let modelMesh = null;
    let pinList = [];

    switch (componentId) {
      case 'breadboard-830':
        modelMesh = this.buildBreadboard(group, pinList);
        break;
      case 'esp32-dev':
        modelMesh = this.buildESP32(group, pinList);
        break;
      case 'arduino-uno':
        modelMesh = this.buildArduinoUno(group, pinList);
        break;
      case 'soil-moisture':
        modelMesh = this.buildSoilMoisture(group, pinList);
        break;
      case 'ultrasonic-hcsr04':
        modelMesh = this.buildUltrasonic(group, pinList);
        break;
      case 'dht11-temp':
        modelMesh = this.buildDHT11(group, pinList);
        break;
      case 'pir-motion':
        modelMesh = this.buildPIRMotion(group, pinList);
        break;
      case 'ldr-light-sensor':
        modelMesh = this.buildLDRSensor(group, pinList);
        break;
      case 'relay-5v-1ch':
        modelMesh = this.buildRelay(group, pinList);
        break;
      case 'dc-water-pump':
        modelMesh = this.buildWaterPump(group, pinList);
        break;
      case 'servo-sg90':
        modelMesh = this.buildServoSG90(group, pinList);
        break;
      case 'buzzer-active':
        modelMesh = this.buildBuzzer(group, pinList);
        break;
      case 'oled-096-i2c':
        modelMesh = this.buildOLEDDisplay(group, pinList);
        break;
      case 'lcd-1602-i2c':
        modelMesh = this.buildLCD1602(group, pinList);
        break;
      case 'power-12v-adapter':
        modelMesh = this.buildPowerAdapter(group, pinList);
        break;
      case 'lipo-battery-pack':
        modelMesh = this.buildLipoBattery(group, pinList);
        break;
      case 'solar-panel-5v':
        modelMesh = this.buildSolarPanel(group, pinList);
        break;
      case 'resistors-pack':
        modelMesh = this.buildResistorPack(group, pinList);
        break;
      case 'capacitors-pack':
        modelMesh = this.buildCapacitorsPack(group, pinList);
        break;
      case 'inductor-coil':
        modelMesh = this.buildInductorCoil(group, pinList);
        break;
      case 'led-pack':
        modelMesh = this.buildLED(group, pinList);
        break;
      case 'antigravity-core':
        modelMesh = this.buildAntigravityCore(group, pinList);
        break;
      case 'flux-stabilizer':
        modelMesh = this.buildFluxStabilizer(group, pinList);
        break;
      case 'quantum-levitator':
        modelMesh = this.buildQuantumLevitator(group, pinList);
        break;
      case 'toggle-switch-spst':
        modelMesh = this.buildToggleSwitch(group, pinList);
        break;
      default:
        modelMesh = this.buildGenericBox(group, componentId, pinList);
        break;
    }

    // Attach pins registry to group userData for wire snapping
    group.userData.pinList = pinList;
    pinList.forEach(pin => {
      group.userData.pinsMap[pin.name] = pin.localPos;
    });

    return group;
  },

  // Helper: Create Pin Mesh & Anchor with clean metal definition
  createPinHeader(parentGroup, pinName, x, y, z, pinList, color = 0xd97706) {
    const pinGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.28, 12);
    const pinMat = new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.25 });
    const pinMesh = new THREE.Mesh(pinGeo, pinMat);
    pinMesh.position.set(x, y, z);
    parentGroup.add(pinMesh);

    const localPos = new THREE.Vector3(x, y + 0.14, z);
    pinList.push({ name: pinName, localPos: localPos });
  },

  // Helper: Create Realistic Dual-In-Line (DIP) IC Chip (e.g. ATmega328P DIP-28 / LM393 DIP-8)
  buildDIPChip(parentGroup, length, width, height, pinCount, labelText = "IC") {
    const chipGeo = new THREE.BoxGeometry(length, height, width);
    const chip = new THREE.Mesh(chipGeo, this.materials.icBlackEpoxy);
    chip.castShadow = true;

    // Pin 1 Notch Indicator
    const notchGeo = new THREE.CylinderGeometry(width * 0.15, width * 0.15, height * 1.1, 16, 1, false, 0, Math.PI);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    notch.rotation.y = Math.PI / 2;
    notch.position.set(-length / 2 + 0.1, 0, 0);
    chip.add(notch);

    // DIP Metal Pin Legs (2 rows)
    const pinsPerRow = Math.floor(pinCount / 2);
    const pinSpacing = (length - 0.4) / (pinsPerRow - 1);
    
    const legGeo = new THREE.BoxGeometry(0.06, height * 1.4, 0.12);
    for (let i = 0; i < pinsPerRow; i++) {
      const posX = -length / 2 + 0.2 + (i * pinSpacing);
      const legLeft = new THREE.Mesh(legGeo, this.materials.metalSilver);
      legLeft.position.set(posX, -height * 0.2, -width / 2 - 0.05);
      chip.add(legLeft);

      const legRight = new THREE.Mesh(legGeo, this.materials.metalSilver);
      legRight.position.set(posX, -height * 0.2, width / 2 + 0.05);
      chip.add(legRight);
    }

    return chip;
  },

  // ================= BREADBOARD 830 =================
  buildBreadboard(group, pinList) {
    const bodyGeo = new THREE.BoxGeometry(16.5, 0.4, 5.5);
    const body = new THREE.Mesh(bodyGeo, this.materials.breadboardPlastic);
    body.position.y = 0.2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Center divider slot
    const slotGeo = new THREE.BoxGeometry(16.3, 0.1, 0.2);
    const slotMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1 });
    const slot = new THREE.Mesh(slotGeo, slotMat);
    slot.position.set(0, 0.41, 0);
    group.add(slot);

    // Power Rails (Crisp Red and Blue stripes)
    const redMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
    const blueMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    
    const stripeGeo = new THREE.BoxGeometry(16.0, 0.02, 0.06);
    const redTop = new THREE.Mesh(stripeGeo, redMat); redTop.position.set(0, 0.41, -2.4); group.add(redTop);
    const blueTop = new THREE.Mesh(stripeGeo, blueMat); blueTop.position.set(0, 0.41, -2.1); group.add(blueTop);
    const blueBot = new THREE.Mesh(stripeGeo, blueMat); blueBot.position.set(0, 0.41, 2.1); group.add(blueBot);
    const redBot = new THREE.Mesh(stripeGeo, redMat); redBot.position.set(0, 0.41, 2.4); group.add(redBot);

    // Power rail pins
    this.createPinHeader(group, "RAIL_VCC1", -7.5, 0.45, -2.4, pinList, 0xdc2626);
    this.createPinHeader(group, "RAIL_GND1", -7.5, 0.45, -2.1, pinList, 0x0284c7);
    this.createPinHeader(group, "RAIL_GND2", -7.5, 0.45, 2.1, pinList, 0x0284c7);
    this.createPinHeader(group, "RAIL_VCC2", -7.5, 0.45, 2.4, pinList, 0xdc2626);

    return body;
  },

  // ================= ESP32 DEV BOARD =================
  buildESP32(group, pinList) {
    const pcbGeo = new THREE.BoxGeometry(5.2, 0.1, 2.8);
    const pcb = new THREE.Mesh(pcbGeo, this.materials.pcbDark);
    pcb.position.y = 0.05;
    pcb.castShadow = true;
    group.add(pcb);

    // ESP-WROOM-32 Metal Shield Module with Printed PCB Antenna
    const shieldGeo = new THREE.BoxGeometry(1.8, 0.22, 1.8);
    const shield = new THREE.Mesh(shieldGeo, this.materials.metalSilver);
    shield.position.set(-0.5, 0.16, 0);
    group.add(shield);

    // Meandering Meander Antenna Gold Trace
    const antGeo = new THREE.BoxGeometry(0.4, 0.05, 1.6);
    const ant = new THREE.Mesh(antGeo, this.materials.metalGold);
    ant.position.set(0.6, 0.12, 0);
    group.add(ant);

    // USB Port
    const usbGeo = new THREE.BoxGeometry(0.8, 0.2, 0.6);
    const usb = new THREE.Mesh(usbGeo, this.materials.metalSilver);
    usb.position.set(-2.4, 0.15, 0);
    group.add(usb);

    // CP2102 USB-to-UART Bridge IC Chip
    const uartIC = this.buildDIPChip(group, 0.6, 0.6, 0.1, 16, "CP2102");
    uartIC.position.set(-1.4, 0.12, 0);

    // Tactile Buttons (EN & BOOT)
    const btnGeo = new THREE.BoxGeometry(0.3, 0.2, 0.3);
    const btnEN = new THREE.Mesh(btnGeo, this.materials.metalSilver); btnEN.position.set(-2.2, 0.15, -1.0); group.add(btnEN);
    const btnBOOT = new THREE.Mesh(btnGeo, this.materials.metalSilver); btnBOOT.position.set(-2.2, 0.15, 1.0); group.add(btnBOOT);

    // Power & Status LEDs
    const ledMatRed = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const ledMatBlue = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const ledRed = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), ledMatRed); ledRed.position.set(-1.8, 0.15, 0.8); group.add(ledRed);
    const ledBlue = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), ledMatBlue); ledBlue.position.set(-1.8, 0.15, -0.8); group.add(ledBlue);

    // 30 Pin Headers
    const pinsLeft = ["3V3", "GND1", "EN", "VP", "VN", "D34", "D35", "D32", "D33", "D25", "D26", "D27", "D14", "D12", "D13"];
    const pinsRight = ["VIN", "GND3", "D23", "D22", "TX0", "RX0", "D21", "D19", "D18", "D5", "D17", "D16", "D4", "D2", "GND2"];

    pinsLeft.forEach((name, i) => {
      this.createPinHeader(group, name, -2.1 + (i * 0.3), 0.15, -1.25, pinList);
    });
    pinsRight.forEach((name, i) => {
      this.createPinHeader(group, name, -2.1 + (i * 0.3), 0.15, 1.25, pinList);
    });

    return pcb;
  },

  // ================= ARDUINO UNO WITH ATmega328P DIP IC =================
  buildArduinoUno(group, pinList) {
    const pcbGeo = new THREE.BoxGeometry(6.8, 0.1, 5.3);
    const pcb = new THREE.Mesh(pcbGeo, this.materials.pcbBlue);
    pcb.position.y = 0.05;
    pcb.castShadow = true;
    group.add(pcb);

    // Real ATmega328P 28-Pin DIP IC Chip with Pin Legs
    const atmegaIC = this.buildDIPChip(group, 3.2, 0.7, 0.25, 28, "ATmega328P");
    atmegaIC.position.set(0.5, 0.2, 0);

    // 16MHz Crystal Oscillator Oval Metal Can
    const xtalGeo = new THREE.BoxGeometry(0.8, 0.3, 0.4);
    const xtal = new THREE.Mesh(xtalGeo, this.materials.metalSilver);
    xtal.position.set(-0.8, 0.2, -1.2);
    group.add(xtal);

    // 5V Voltage Regulator with Metal Heat Sink Tab
    const regGeo = new THREE.BoxGeometry(0.8, 0.3, 0.8);
    const reg = new THREE.Mesh(regGeo, this.materials.plasticBlack);
    reg.position.set(-1.8, 0.2, 1.6);
    group.add(reg);

    // USB Type-B Connector
    const usbGeo = new THREE.BoxGeometry(1.2, 1.0, 1.2);
    const usb = new THREE.Mesh(usbGeo, this.materials.metalSilver);
    usb.position.set(-2.7, 0.55, -1.8);
    group.add(usb);

    // DC Barrel Jack
    const jackGeo = new THREE.BoxGeometry(1.4, 0.9, 0.9);
    const jack = new THREE.Mesh(jackGeo, this.materials.plasticBlack);
    jack.position.set(-2.6, 0.5, 1.8);
    group.add(jack);

    // Power & Analog Header Pins (+Z side)
    const powerPins = ["NC", "IOREF", "RESET", "3.3V", "5V", "GND1", "GND2", "VIN"];
    const analogPins = ["A0", "A1", "A2", "A3", "A4", "A5"];

    powerPins.forEach((name, i) => {
      this.createPinHeader(group, name, -2.5 + (i * 0.35), 0.2, 2.4, pinList);
    });
    analogPins.forEach((name, i) => {
      this.createPinHeader(group, name, 0.7 + (i * 0.35), 0.2, 2.4, pinList);
    });

    // Digital Header Pins (-Z side)
    const digitalLow = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"];
    const digitalHigh = ["D8", "D9", "D10", "D11", "D12", "D13", "GND3", "AREF", "SDA", "SCL"];

    digitalLow.forEach((name, i) => {
      this.createPinHeader(group, name, -2.5 + (i * 0.35), 0.2, -2.4, pinList);
    });
    digitalHigh.forEach((name, i) => {
      this.createPinHeader(group, name, 0.6 + (i * 0.35), 0.2, -2.4, pinList);
    });

    return pcb;
  },

  // ================= SOIL MOISTURE SENSOR WITH LM393 IC =================
  buildSoilMoisture(group, pinList) {
    const probeGeo = new THREE.BoxGeometry(4.5, 0.08, 1.8);
    const probe = new THREE.Mesh(probeGeo, this.materials.pcbGreen);
    probe.position.y = 0.04;
    group.add(probe);

    // Probe Cutout Slots
    const slotGeo = new THREE.BoxGeometry(3.0, 0.1, 0.4);
    const slot = new THREE.Mesh(slotGeo, new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    slot.position.set(-0.5, 0.04, 0);
    group.add(slot);

    // Onboard LM393 Dual Comparator DIP-8 IC Chip
    const lm393IC = this.buildDIPChip(group, 0.9, 0.5, 0.2, 8, "LM393");
    lm393IC.position.set(1.4, 0.2, 0);

    // Sensitivity Potentiometer Dial
    const potGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16);
    const pot = new THREE.Mesh(potGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
    pot.position.set(1.4, 0.25, 0.6);
    group.add(pot);

    this.createPinHeader(group, "VCC", 2.0, 0.3, -0.5, pinList, 0xdc2626);
    this.createPinHeader(group, "GND", 2.0, 0.3, 0.0, pinList, 0x0284c7);
    this.createPinHeader(group, "AOUT", 2.0, 0.3, 0.5, pinList, 0x16a34a);

    return probe;
  },

  // ================= ULTRASONIC SENSOR HC-SR04 =================
  buildUltrasonic(group, pinList) {
    const pcbGeo = new THREE.BoxGeometry(4.5, 0.1, 2.0);
    const pcb = new THREE.Mesh(pcbGeo, this.materials.pcbBlue);
    pcb.position.y = 0.05;
    group.add(pcb);

    // Twin Metallic Acoustic Transducers ("T" & "R")
    const cylGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.2, 24);
    const tx = new THREE.Mesh(cylGeo, this.materials.metalSilver);
    tx.rotation.x = Math.PI / 2;
    tx.position.set(-1.2, 0.75, 0);
    group.add(tx);

    const rx = new THREE.Mesh(cylGeo, this.materials.metalSilver);
    rx.rotation.x = Math.PI / 2;
    rx.position.set(1.2, 0.75, 0);
    group.add(rx);

    // Onboard MAX232 / LM324 Processing IC
    const procIC = this.buildDIPChip(group, 1.2, 0.5, 0.18, 14, "MAX232");
    procIC.position.set(0, 0.15, -0.6);

    this.createPinHeader(group, "VCC", -0.9, 0.2, 0.8, pinList, 0xdc2626);
    this.createPinHeader(group, "TRIG", -0.3, 0.2, 0.8, pinList, 0x0284c7);
    this.createPinHeader(group, "ECHO", 0.3, 0.2, 0.8, pinList, 0x16a34a);
    this.createPinHeader(group, "GND", 0.9, 0.2, 0.8, pinList, 0x0284c7);

    return pcb;
  },

  // ================= DHT11 CLIMATE SENSOR =================
  buildDHT11(group, pinList) {
    const bodyGeo = new THREE.BoxGeometry(1.6, 2.0, 0.8);
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
    body.position.y = 1.0;
    group.add(body);

    this.createPinHeader(group, "VCC", -0.4, 0.1, 0, pinList, 0xdc2626);
    this.createPinHeader(group, "DATA", 0.0, 0.1, 0, pinList, 0xd97706);
    this.createPinHeader(group, "NC", 0.2, 0.1, 0, pinList, 0x94a3b8);
    this.createPinHeader(group, "GND", 0.4, 0.1, 0, pinList, 0x0284c7);

    return body;
  },

  // ================= PIR MOTION DETECTOR WITH BISS0001 IC =================
  buildPIRMotion(group, pinList) {
    const pcbGeo = new THREE.BoxGeometry(3.2, 0.1, 2.4);
    const pcb = new THREE.Mesh(pcbGeo, this.materials.pcbGreen);
    pcb.position.y = 0.05;
    group.add(pcb);

    // Fresnel Lens Dome
    const domeGeo = new THREE.SphereGeometry(1.0, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, this.materials.plasticWhite);
    dome.position.set(0, 0.1, 0);
    group.add(dome);

    // BISS0001 Micro Power PIR Processing IC Chip
    const bissIC = this.buildDIPChip(group, 1.4, 0.5, 0.18, 16, "BISS0001");
    bissIC.position.set(0, 0.15, -0.8);

    this.createPinHeader(group, "VCC", -0.6, 0.2, 1.0, pinList, 0xdc2626);
    this.createPinHeader(group, "OUT", 0.0, 0.2, 1.0, pinList, 0x7e22ce);
    this.createPinHeader(group, "GND", 0.6, 0.2, 1.0, pinList, 0x0284c7);

    return pcb;
  },

  // ================= LDR LIGHT SENSOR =================
  buildLDRSensor(group, pinList) {
    const pcbGeo = new THREE.BoxGeometry(3.0, 0.1, 1.5);
    const pcb = new THREE.Mesh(pcbGeo, this.materials.pcbBlue);
    pcb.position.y = 0.05;
    group.add(pcb);

    const ldrGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const ldr = new THREE.Mesh(ldrGeo, new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 }));
    ldr.position.set(-0.8, 0.25, 0);
    group.add(ldr);

    this.createPinHeader(group, "VCC", 0.4, 0.2, -0.4, pinList, 0xdc2626);
    this.createPinHeader(group, "GND", 0.4, 0.2, -0.1, pinList, 0x0284c7);
    this.createPinHeader(group, "DO", 0.4, 0.2, 0.2, pinList, 0x16a34a);
    this.createPinHeader(group, "AO", 0.4, 0.2, 0.5, pinList, 0xd97706);

    return pcb;
  },

  // ================= 1-CHANNEL RELAY WITH OPTOCOUPLER IC & FLYBACK DIODE =================
  buildRelay(group, pinList) {
    const pcbGeo = new THREE.BoxGeometry(4.2, 0.1, 2.6);
    const pcb = new THREE.Mesh(pcbGeo, this.materials.pcbBlue);
    pcb.position.y = 0.05;
    group.add(pcb);

    // Blue Songle Relay Cube
    const relayGeo = new THREE.BoxGeometry(1.8, 1.4, 1.5);
    const relay = new THREE.Mesh(relayGeo, this.materials.plasticBlueRelay);
    relay.position.set(-0.8, 0.75, 0);
    group.add(relay);

    // 817C Optocoupler Isolation IC Chip
    const optoIC = this.buildDIPChip(group, 0.5, 0.4, 0.18, 4, "PC817");
    optoIC.position.set(0.4, 0.15, 0.6);

    // 1N4007 Flyback Diode with Silver Ring Band
    const diodeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12);
    const diodeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const diode = new THREE.Mesh(diodeGeo, diodeMat);
    diode.rotation.z = Math.PI / 2;
    diode.position.set(0.4, 0.15, -0.6);
    group.add(diode);

    // High Voltage Terminal Block
    const termGeo = new THREE.BoxGeometry(1.0, 1.0, 2.0);
    const term = new THREE.Mesh(termGeo, new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 }));
    term.position.set(1.4, 0.55, 0);
    group.add(term);

    this.createPinHeader(group, "VCC", -1.6, 0.2, 1.0, pinList, 0xdc2626);
    this.createPinHeader(group, "GND", -1.0, 0.2, 1.0, pinList, 0x0284c7);
    this.createPinHeader(group, "IN", -0.4, 0.2, 1.0, pinList, 0x0284c7);

    this.createPinHeader(group, "NO", 1.4, 1.1, -0.6, pinList, 0xd97706);
    this.createPinHeader(group, "COM", 1.4, 1.1, 0.0, pinList, 0xd97706);
    this.createPinHeader(group, "NC", 1.4, 1.1, 0.6, pinList, 0xd97706);

    return pcb;
  },

  // ================= 12V WATER PUMP =================
  buildWaterPump(group, pinList) {
    const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.5, 24);
    const motor = new THREE.Mesh(cylGeo, this.materials.metalSilver);
    motor.rotation.z = Math.PI / 2;
    motor.position.y = 1.2;
    group.add(motor);

    const nozzleGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.0, 16);
    const n1 = new THREE.Mesh(nozzleGeo, new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 }));
    n1.position.set(-1.8, 1.2, 0.8);
    group.add(n1);

    this.createPinHeader(group, "V+", -1.0, 2.5, -0.3, pinList, 0xdc2626);
    this.createPinHeader(group, "V-", -1.0, 2.5, 0.3, pinList, 0x0284c7);

    return motor;
  },

  // ================= SERVO SG90 =================
  buildServoSG90(group, pinList) {
    const bodyGeo = new THREE.BoxGeometry(2.3, 2.4, 1.2);
    const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0x1d4ed8, transparent: true, opacity: 0.95 }));
    body.position.y = 1.2;
    group.add(body);

    const hornGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 24);
    const horn = new THREE.Mesh(hornGeo, this.materials.plasticWhite);
    horn.position.set(0.6, 2.5, 0);
    group.add(horn);

    this.createPinHeader(group, "GND", -0.6, 0.1, 0, pinList, 0x0284c7);
    this.createPinHeader(group, "VCC", 0.0, 0.1, 0, pinList, 0xdc2626);
    this.createPinHeader(group, "PWM", 0.6, 0.1, 0, pinList, 0xd97706);

    return body;
  },

  // ================= ACTIVE BUZZER =================
  buildBuzzer(group, pinList) {
    const cylGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.0, 24);
    const buzzer = new THREE.Mesh(cylGeo, this.materials.plasticBlack);
    buzzer.position.y = 0.5;
    group.add(buzzer);

    this.createPinHeader(group, "POS", -0.3, 0.1, 0, pinList, 0xdc2626);
    this.createPinHeader(group, "NEG", 0.3, 0.1, 0, pinList, 0x0284c7);

    return buzzer;
  },

  // Dynamic Canvas Screen Texture Generator for "PLANT PAL" (Cirkit Designer Screen Match)
  generatePlantPalScreenTexture(moisture = 96) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // Background: Dark Forest Green
    ctx.fillStyle = '#143823';
    ctx.fillRect(0, 0, 256, 320);

    // Header Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PLANT PAL', 128, 36);

    // Mascot Face Circle (Green)
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(128, 110, 48, 0, Math.PI * 2);
    ctx.fill();

    // Plant Leaves at top
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(128, 56, 12, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes & Smile
    ctx.fillStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(112, 104, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(144, 104, 6, 0, Math.PI * 2); ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath(); ctx.arc(128, 114, 12, 0, Math.PI); ctx.stroke();

    // Moisture Label & %
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('MOISTURE', 128, 184);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(`${moisture}%`, 128, 210);

    // Progress Bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(28, 222, 200, 14);

    const barWidth = Math.min(200, Math.max(10, (moisture / 100) * 200));
    ctx.fillStyle = moisture > 80 ? '#3b82f6' : (moisture > 30 ? '#22c55e' : '#ef4444');
    ctx.fillRect(28, 222, barWidth, 14);

    // Status Pill Badge
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(28, 252, 200, 38, 18);
    else ctx.rect(28, 252, 200, 38);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    const statusMsg = moisture > 80 ? 'Too much H2O!' : (moisture > 30 ? 'Happy Plant! 🌱' : 'Need Water! 🏜️');
    ctx.fillText(statusMsg, 128, 276);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  },

  // ================= 1.8" COLOR TFT SCREEN (RED BEZEL UPRIGHT DISPLAY) =================
  buildOLEDDisplay(group, pinList) {
    // Red PCB Bezel Plate standing vertically (matching image)
    const pcbGeo = new THREE.BoxGeometry(3.2, 4.2, 0.12);
    const pcb = new THREE.Mesh(pcbGeo, new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 }));
    pcb.position.y = 2.1;
    pcb.castShadow = true;
    group.add(pcb);

    // TFT Screen Display Glass with CanvasTexture
    const screenGeo = new THREE.PlaneGeometry(2.6, 3.4);
    const screenTex = this.generatePlantPalScreenTexture(96);
    const screenMat = new THREE.MeshStandardMaterial({ map: screenTex, roughness: 0.15, emissive: 0xffffff, emissiveMap: screenTex, emissiveIntensity: 0.4 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.2, 0.07);
    group.add(screen);

    // Save screen mesh reference on group for live animation updates
    group.userData.screenMesh = screen;

    // Header Pins at Bottom Edge
    const pinNames = ["GND", "VCC", "SCL", "SDA", "RES", "DC", "CS"];
    pinNames.forEach((name, i) => {
      this.createPinHeader(group, name, -1.2 + (i * 0.4), 0.15, 0, pinList);
    });

    return pcb;
  },

  // ================= LCD 1602 DISPLAY =================
  buildLCD1602(group, pinList) {
    const pcbGeo = new THREE.BoxGeometry(8.0, 0.1, 3.6);
    const pcb = new THREE.Mesh(pcbGeo, this.materials.pcbGreen);
    pcb.position.y = 0.05;
    group.add(pcb);

    const screenGeo = new THREE.BoxGeometry(7.0, 0.3, 2.4);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x15803d, emissive: 0x16a34a, emissiveIntensity: 0.3 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.2, 0);
    group.add(screen);

    this.createPinHeader(group, "GND", -3.2, 0.2, 1.5, pinList, 0x0284c7);
    this.createPinHeader(group, "VCC", -2.6, 0.2, 1.5, pinList, 0xdc2626);
    this.createPinHeader(group, "SDA", -2.0, 0.2, 1.5, pinList, 0x0284c7);
    this.createPinHeader(group, "SCL", -1.4, 0.2, 1.5, pinList, 0xd97706);

    return pcb;
  },

  // ================= POWER 12V ADAPTER =================
  buildPowerAdapter(group, pinList) {
    const boxGeo = new THREE.BoxGeometry(3.5, 2.0, 2.5);
    const box = new THREE.Mesh(boxGeo, this.materials.plasticBlack);
    box.position.y = 1.0;
    group.add(box);

    this.createPinHeader(group, "DC+", -0.8, 2.1, 0, pinList, 0xd97706);
    this.createPinHeader(group, "DC-", 0.8, 2.1, 0, pinList, 0x0284c7);

    return box;
  },

  // ================= RECHARGEABLE 3.7V / 7.4V LiPo BATTERY PACK =================
  buildLipoBattery(group, pinList) {
    // Metallic Blue/Black Foil Pouch Cell Body
    const bodyGeo = new THREE.BoxGeometry(4.2, 0.45, 2.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.22;
    body.castShadow = true;
    group.add(body);

    // Yellow Kapton Tape Top Seal Header
    const tapeGeo = new THREE.BoxGeometry(4.3, 0.48, 0.5);
    const tapeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const tape = new THREE.Mesh(tapeGeo, tapeMat);
    tape.position.set(0, 0.22, 1.1);
    group.add(tape);

    // Red (+5V / VCC) and Black (GND) Terminal Cables
    this.createPinHeader(group, "BAT+", -1.0, 0.5, 1.2, pinList, 0xdc2626);
    this.createPinHeader(group, "BAT-", 1.0, 0.5, 1.2, pinList, 0x0284c7);

    return body;
  },

  // ================= 5V PHOTOVOLTAIC SOLAR PANEL =================
  buildSolarPanel(group, pinList) {
    // Dark Blue Photovoltaic Substrate Board
    const panelGeo = new THREE.BoxGeometry(5.6, 0.15, 4.0);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.1, metalness: 0.8 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.y = 0.08;
    panel.castShadow = true;
    group.add(panel);

    // Aluminum Silver Edge Frame
    const frameGeo = new THREE.BoxGeometry(5.7, 0.18, 4.1);
    const frameEdges = new THREE.EdgesGeometry(frameGeo);
    const frameMat = new THREE.LineBasicMaterial({ color: 0xcbd5e1, linewidth: 2 });
    const frame = new THREE.LineSegments(frameEdges, frameMat);
    frame.position.y = 0.08;
    group.add(frame);

    // Grid Cell Lines
    const gridGeo = new THREE.PlaneGeometry(5.4, 3.8, 6, 4);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, wireframe: true });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = 0.16;
    group.add(grid);

    // Rear Connection Terminal Box
    this.createPinHeader(group, "SOLAR+", -1.2, 0.25, -1.8, pinList, 0xdc2626);
    this.createPinHeader(group, "SOLAR-", 1.2, 0.25, -1.8, pinList, 0x0284c7);

    return panel;
  },

  // ================= REALISTIC 1/4W AXIAL RESISTOR PACK WITH COLOR BANDS =================
  buildResistorPack(group, pinList) {
    // 1/4W Ceramic Resistor Cylinder Body
    const bodyGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.4, 20);
    const body = new THREE.Mesh(bodyGeo, this.materials.resistorBody);
    body.rotation.z = Math.PI / 2;
    body.position.y = 0.35;
    group.add(body);

    // 4 Color Code Bands (Brown-Black-Orange-Gold = 10kΩ)
    const bandGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.1, 20);
    
    const band1 = new THREE.Mesh(bandGeo, new THREE.MeshBasicMaterial({ color: 0x78350f })); band1.rotation.z = Math.PI / 2; band1.position.set(-0.4, 0.35, 0); group.add(band1);
    const band2 = new THREE.Mesh(bandGeo, new THREE.MeshBasicMaterial({ color: 0x0f172a })); band2.rotation.z = Math.PI / 2; band2.position.set(-0.15, 0.35, 0); group.add(band2);
    const band3 = new THREE.Mesh(bandGeo, new THREE.MeshBasicMaterial({ color: 0xeab308 })); band3.rotation.z = Math.PI / 2; band3.position.set(0.1, 0.35, 0); group.add(band3);
    const band4 = new THREE.Mesh(bandGeo, new THREE.MeshBasicMaterial({ color: 0xd97706 })); band4.rotation.z = Math.PI / 2; band4.position.set(0.35, 0.35, 0); group.add(band4);

    // Bended Wire Leads Plugging Down into Breadboard
    this.createPinHeader(group, "PIN1", -0.9, 0.35, 0, pinList, 0xcbd5e1);
    this.createPinHeader(group, "PIN2", 0.9, 0.35, 0, pinList, 0xcbd5e1);

    return body;
  },

  // ================= REALISTIC ELECTROLYTIC & CERAMIC CAPACITORS =================
  buildCapacitorsPack(group, pinList) {
    // 1. Electrolytic Aluminum Can Cylinder (Dark Blue Body with Silver Scored Top Vent & Polarity Stripe)
    const canGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 24);
    const can = new THREE.Mesh(canGeo, this.materials.capElectrolyticBlue);
    can.position.set(-0.6, 0.6, 0);
    group.add(can);

    // Silver Top Vent Score Disc
    const topGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.05, 24);
    const topVent = new THREE.Mesh(topGeo, this.materials.metalSilver);
    topVent.position.set(-0.6, 1.22, 0);
    group.add(topVent);

    // Negative Polarity Stripe Stripe (-)
    const stripeGeo = new THREE.BoxGeometry(0.1, 1.15, 0.42);
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(-0.6, 0.6, 0.2);
    group.add(stripe);

    // 2. Ceramic Disc Capacitor (Tan Disc with Code 104)
    const discGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 20);
    const disc = new THREE.Mesh(discGeo, this.materials.capCeramicOrange);
    disc.rotation.x = Math.PI / 2;
    disc.position.set(0.6, 0.5, 0);
    group.add(disc);

    this.createPinHeader(group, "CAP+", -0.6, 0.1, 0, pinList, 0xdc2626);
    this.createPinHeader(group, "CAP-", 0.6, 0.1, 0, pinList, 0x0284c7);

    return can;
  },

  // ================= REALISTIC TOROIDAL INDUCTOR COIL =================
  buildInductorCoil(group, pinList) {
    // Toroidal Ferrite Ring Core
    const ringGeo = new THREE.TorusGeometry(0.7, 0.25, 16, 32);
    const ring = new THREE.Mesh(ringGeo, this.materials.ferriteCoreDark);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.5;
    group.add(ring);

    // Enameled Copper Magnet Wire Coils Wound Around Core
    const coilCount = 14;
    for (let i = 0; i < coilCount; i++) {
      const angle = (i / coilCount) * Math.PI * 2;
      const turnGeo = new THREE.TorusGeometry(0.28, 0.05, 8, 16);
      const turn = new THREE.Mesh(turnGeo, this.materials.copperWire);
      turn.position.set(Math.cos(angle) * 0.7, 0.5, Math.sin(angle) * 0.7);
      turn.rotation.y = angle;
      group.add(turn);
    }

    this.createPinHeader(group, "IND1", -0.7, 0.1, 0, pinList, 0xb45309);
    this.createPinHeader(group, "IND2", 0.7, 0.1, 0, pinList, 0xb45309);

    return ring;
  },

  // ================= LED BULB =================
  buildLED(group, pinList) {
    const domeGeo = new THREE.SphereGeometry(0.38, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, transparent: true, opacity: 0.9, emissive: 0xdc2626, emissiveIntensity: 0.5 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.8;
    group.add(dome);

    const light = new THREE.PointLight(0xdc2626, 1.8, 4);
    light.position.y = 0.8;
    group.add(light);

    this.createPinHeader(group, "ANODE", -0.15, 0.1, 0, pinList, 0xdc2626);
    this.createPinHeader(group, "CATHODE", 0.15, 0.1, 0, pinList, 0x0284c7);

    return dome;
  },

  // Fallback Box
  buildGenericBox(group, title, pinList) {
    const boxGeo = new THREE.BoxGeometry(2.5, 1.0, 2.5);
    const box = new THREE.Mesh(boxGeo, this.materials.pcbBlue);
    box.position.y = 0.5;
    group.add(box);

    this.createPinHeader(group, "VCC", -0.8, 1.1, 0, pinList, 0xdc2626);
    this.createPinHeader(group, "GND", 0.8, 1.1, 0, pinList, 0x0284c7);

    return box;
  },

  // ================= 3D PCB BOARD PROCEDURAL GENERATOR (AUTODESK FUSION & CIRKIT DESIGNER) =================
  buildProceduralPCBBoard(placedMap, wiresList) {
    const pcbGroup = new THREE.Group();
    pcbGroup.name = "procedural-pcb-board";

    // Calculate dynamic bounding box of all placed components
    let minX = -10, maxX = 10, minZ = -7, maxZ = 7;
    const entries = Object.entries(placedMap || {});
    
    entries.forEach(([id, group]) => {
      if (group.userData && group.userData.componentId === 'breadboard-830') return;
      const pos = group.position;
      if (pos.x - 4 < minX) minX = pos.x - 4;
      if (pos.x + 4 > maxX) maxX = pos.x + 4;
      if (pos.z - 4 < minZ) minZ = pos.z - 4;
      if (pos.z + 4 > maxZ) maxZ = pos.z + 4;
    });

    const pcbWidth = Math.max(26, Math.ceil((maxX - minX) + 4));
    const pcbDepth = Math.max(18, Math.ceil((maxZ - minZ) + 4));
    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;

    // 1. High-Gloss FR4 Soldermask Green Substrate
    const pcbGeo = new THREE.BoxGeometry(pcbWidth, 0.16, pcbDepth);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x047857, // Deep Emerald FR4 Soldermask
      roughness: 0.25,
      metalness: 0.2
    });
    const pcbBase = new THREE.Mesh(pcbGeo, pcbMat);
    pcbBase.position.set(centerX, -0.08, centerZ);
    pcbBase.receiveShadow = true;
    pcbGroup.add(pcbBase);

    // 2. Copper Ground Pour Hatching Layer
    const hatchGeo = new THREE.PlaneGeometry(pcbWidth - 1.2, pcbDepth - 1.2, 32, 24);
    const hatchMat = new THREE.MeshStandardMaterial({
      color: 0x065f46,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const hatchMesh = new THREE.Mesh(hatchGeo, hatchMat);
    hatchMesh.rotation.x = -Math.PI / 2;
    hatchMesh.position.set(centerX, 0.005, centerZ);
    pcbGroup.add(hatchMesh);

    // 3. White Silkscreen Perimeter Border & Mounting Holes
    const borderGeo = new THREE.BoxGeometry(pcbWidth - 0.6, 0.02, pcbDepth - 0.6);
    const borderEdges = new THREE.EdgesGeometry(borderGeo);
    const borderMat = new THREE.LineBasicMaterial({ color: 0xf8fafc, linewidth: 2 });
    const silkBorder = new THREE.LineSegments(borderEdges, borderMat);
    silkBorder.position.set(centerX, 0.01, centerZ);
    pcbGroup.add(silkBorder);

    // 4 Corner Gold Mounting Holes
    const holeGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const holeRingMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.15 });
    const innerHoleGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.22, 16);
    const innerHoleMat = new THREE.MeshBasicMaterial({ color: 0x070a12 });

    const corners = [
      [centerX - pcbWidth/2 + 1.0, centerZ - pcbDepth/2 + 1.0],
      [centerX + pcbWidth/2 - 1.0, centerZ - pcbDepth/2 + 1.0],
      [centerX - pcbWidth/2 + 1.0, centerZ + pcbDepth/2 - 1.0],
      [centerX + pcbWidth/2 - 1.0, centerZ + pcbDepth/2 - 1.0]
    ];

    corners.forEach(([x, z]) => {
      const ring = new THREE.Mesh(holeGeo, holeRingMat);
      ring.position.set(x, 0, z);
      const inner = new THREE.Mesh(innerHoleGeo, innerHoleMat);
      inner.position.set(x, 0, z);
      pcbGroup.add(ring);
      pcbGroup.add(inner);
    });

    // 4. White Silkscreen Outlines under each Component Footprint
    entries.forEach(([instanceId, compGroup]) => {
      if (compGroup.userData && compGroup.userData.componentId === 'breadboard-830') return;

      const pos = compGroup.position;
      const compId = compGroup.userData ? compGroup.userData.componentId : '';

      const fpGeo = new THREE.BoxGeometry(2.4, 0.01, 2.0);
      const fpEdges = new THREE.EdgesGeometry(fpGeo);
      const fpMat = new THREE.LineBasicMaterial({ color: 0xffffff });
      const silkLine = new THREE.LineSegments(fpEdges, fpMat);
      silkLine.position.set(pos.x, 0.012, pos.z);
      silkLine.rotation.y = compGroup.rotation.y;
      pcbGroup.add(silkLine);
    });

    // 5. Silver Solder Pads under Component Pins
    if (wiresList && Array.isArray(wiresList)) {
      const solderPadMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.1, metalness: 0.95 });
      const padGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16);

      wiresList.forEach((w) => {
        const fromCompGroup = placedMap[w.fromComp];
        const toCompGroup = placedMap[w.toComp];
        if (!fromCompGroup || !toCompGroup) return;

        fromCompGroup.updateMatrixWorld(true);
        toCompGroup.updateMatrixWorld(true);

        const fromPosLocal = fromCompGroup.userData.pinsMap ? fromCompGroup.userData.pinsMap[w.fromPin] : null;
        const toPosLocal = toCompGroup.userData.pinsMap ? toCompGroup.userData.pinsMap[w.toPin] : null;

        let p1, p2;
        if (fromPosLocal && toPosLocal) {
          p1 = fromPosLocal.clone().applyMatrix4(fromCompGroup.matrixWorld);
          p2 = toPosLocal.clone().applyMatrix4(toCompGroup.matrixWorld);
        } else {
          p1 = fromCompGroup.position.clone();
          p2 = toCompGroup.position.clone();
        }

        // Add Silver Solder Pads at pin terminals on PCB board
        const pad1 = new THREE.Mesh(padGeo, solderPadMat);
        pad1.position.set(p1.x, 0.02, p1.z);
        pcbGroup.add(pad1);

        const pad2 = new THREE.Mesh(padGeo, solderPadMat);
        pad2.position.set(p2.x, 0.02, p2.z);
        pcbGroup.add(pad2);
      });
    }

    return pcbGroup;
  },

  buildAntigravityCore(group, pinList) {
    const coreGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.15, 8);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.pcbDark);
    baseMesh.position.y = 0.075;
    coreGroup.add(baseMesh);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const torusGeo = new THREE.TorusGeometry(0.3, 0.08, 12, 24);
      const torusMesh = new THREE.Mesh(torusGeo, this.materials.copperWire);
      torusMesh.rotation.x = Math.PI / 2;
      torusMesh.position.set(Math.cos(angle) * 0.9, 0.25, Math.sin(angle) * 0.9);
      coreGroup.add(torusMesh);
    }

    const sphereGeo = new THREE.SphereGeometry(0.45, 24, 24);
    const sphereMesh = new THREE.Mesh(sphereGeo, this.materials.plasmaCyan);
    sphereMesh.position.y = 0.45;
    coreGroup.add(sphereMesh);

    const ringGeo1 = new THREE.TorusGeometry(0.7, 0.03, 16, 32);
    const ringMesh1 = new THREE.Mesh(ringGeo1, this.materials.plasmaCyan);
    ringMesh1.position.y = 0.45;
    ringMesh1.rotation.x = Math.PI / 4;
    coreGroup.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo1, this.materials.fluxPurple);
    ringMesh2.position.y = 0.45;
    ringMesh2.rotation.x = -Math.PI / 4;
    coreGroup.add(ringMesh2);

    const pinNames = ['VCC', 'GND', 'FLUX_OUT', 'STAB_IN'];
    const startX = -0.45;
    pinNames.forEach((pName, idx) => {
      const px = startX + idx * 0.3;
      const pz = 1.1;
      const pinHeader = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), this.materials.metalSilver);
      pinHeader.position.set(px, 0.25, pz);
      coreGroup.add(pinHeader);

      pinList.push({ name: pName, localPos: new THREE.Vector3(px, 0.4, pz) });
    });

    group.add(coreGroup);
    return coreGroup;
  },

  buildFluxStabilizer(group, pinList) {
    const stabGroup = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 6);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.pcbPurple);
    baseMesh.position.y = 0.075;
    stabGroup.add(baseMesh);

    for (let i = 0; i < 5; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.4, 0.8), this.materials.metalSilver);
      fin.position.set(-0.4 + i * 0.2, 0.3, 0);
      stabGroup.add(fin);
    }

    const crystalGeo = new THREE.OctahedronGeometry(0.35);
    const crystalMesh = new THREE.Mesh(crystalGeo, this.materials.fluxPurple);
    crystalMesh.position.set(0, 0.5, 0);
    stabGroup.add(crystalMesh);

    const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), this.materials.plasmaCyan);
    led1.position.set(-0.7, 0.2, -0.6);
    stabGroup.add(led1);

    const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), this.materials.plasmaCyan);
    led2.position.set(0.7, 0.2, -0.6);
    stabGroup.add(led2);

    const pinNames = ['VCC', 'GND', 'FLUX_IN', 'CTRL_OUT'];
    const startX = -0.45;
    pinNames.forEach((pName, idx) => {
      const px = startX + idx * 0.3;
      const pz = 0.9;
      const pinHeader = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), this.materials.metalSilver);
      pinHeader.position.set(px, 0.25, pz);
      stabGroup.add(pinHeader);

      pinList.push({ name: pName, localPos: new THREE.Vector3(px, 0.4, pz) });
    });

    group.add(stabGroup);
    return stabGroup;
  },

  buildQuantumLevitator(group, pinList) {
    const levGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(2.4, 0.15, 1.8);
    const baseMesh = new THREE.Mesh(baseGeo, this.materials.metalSilver);
    baseMesh.position.y = 0.075;
    levGroup.add(baseMesh);

    const ceramicGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 32);
    const ceramicMesh = new THREE.Mesh(ceramicGeo, this.materials.ferriteCoreDark);
    ceramicMesh.position.set(0, 0.18, 0);
    levGroup.add(ceramicMesh);

    const fluxRingGeo = new THREE.TorusGeometry(0.5, 0.06, 16, 32);
    const fluxRingMesh = new THREE.Mesh(fluxRingGeo, this.materials.superconductorSky);
    fluxRingMesh.rotation.x = Math.PI / 2;
    fluxRingMesh.position.set(0, 0.25, 0);
    levGroup.add(fluxRingMesh);

    [[-1, -0.7], [1, -0.7], [-1, 0.7], [1, 0.7]].forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 12), this.materials.metalGold);
      pillar.position.set(px, 0.2, pz);
      levGroup.add(pillar);
    });

    const pinNames = ['VIN', 'GND', 'LEV_SIG', 'SENSE'];
    const startX = -0.45;
    pinNames.forEach((pName, idx) => {
      const px = startX + idx * 0.3;
      const pz = 0.75;
      const pinHeader = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), this.materials.metalSilver);
      pinHeader.position.set(px, 0.25, pz);
      levGroup.add(pinHeader);

      pinList.push({ name: pName, localPos: new THREE.Vector3(px, 0.4, pz) });
    });

    group.add(levGroup);
    return levGroup;
  },

  buildToggleSwitch(group, pinList) {
    const swGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.6, 0.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.plasticBlack);
    bodyMesh.position.y = 0.3;
    swGroup.add(bodyMesh);

    const leverGeo = new THREE.BoxGeometry(0.8, 0.25, 0.6);
    const leverMesh = new THREE.Mesh(leverGeo, this.materials.plasticRed);
    leverMesh.rotation.z = -0.2;
    leverMesh.position.set(0, 0.65, 0);
    swGroup.add(leverMesh);

    const pinNames = ['SW_IN', 'SW_OUT'];
    [-0.3, 0.3].forEach((px, idx) => {
      const pinHeader = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), this.materials.metalSilver);
      pinHeader.position.set(px, 0.25, 0.5);
      swGroup.add(pinHeader);

      pinList.push({ name: pinNames[idx], localPos: new THREE.Vector3(px, 0.4, 0.5) });
    });

    group.add(swGroup);
    return swGroup;
  },

  // Helper: Detailed Pin Metadata Dictionary (Cirkit Designer Hover Tooltips)
  getPinMetadata(compID, pinName) {
    const metaMap = {
      'esp32-dev': {
        'VCC_5V': '5V Power Rail (Vin DC Input)',
        'GND': 'Ground 0V Common Reference',
        '3V3': '3.3V Regulated Output Rail',
        'GPIO21_SDA': 'I2C Data Line (GPIO 21 / SDA)',
        'GPIO22_SCL': 'I2C Clock Line (GPIO 22 / SCL)',
        'GPIO34_ADC': 'Analog Input ADC (Soil Moisture / LDR)',
        'GPIO4_IN1': 'PWM Digital Trigger (Relay IN1 Control)'
      },
      'arduino-uno': {
        '5V': '5V Power Rail Supply',
        'GND': 'Ground Reference 0V',
        'A0': 'Analog Pin A0 (0-5V ADC Input)',
        'D2': 'Digital IO Pin 2 (Interrupt capable)',
        'D3_PWM': 'Digital IO Pin 3 (PWM Output)',
        'SCL': 'I2C Clock Line (A5 / SCL)',
        'SDA': 'I2C Data Line (A4 / SDA)'
      },
      'relay-5v-1ch': {
        'VCC': '5V Operating Power VCC',
        'GND': 'Ground 0V',
        'IN1': 'Optocoupler Input Signal Trigger',
        'NO': 'Normally Open Load Terminal (12V High Side)',
        'COM': 'Common High-Power Switch Terminal'
      },
      'oled-096-i2c': {
        'VCC': 'Display 3.3V/5V Power Input',
        'GND': 'Ground 0V',
        'SCL': 'I2C Clock Signal Input',
        'SDA': 'I2C Serial Data Line Input'
      }
    };

    if (metaMap[compID] && metaMap[compID][pinName]) {
      return metaMap[compID][pinName];
    }
    return `${pinName} Terminal | Signal Pin`;
  }
};

