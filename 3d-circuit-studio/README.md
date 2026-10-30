# Next-Generation 3D Circuit Studio ⚡

A complete full-stack web application for automated electronic project analysis, equipment selection, and interactive Three.js 3D breadboard circuit design with real-time wire routing.

---

## 🌟 Key Features

1. **Project Analysis Engine**: Enter ANY electronics project name (e.g. *Smart Irrigation System, Home Automation, Weather Monitoring System, Line Following Robot, Solar Power Monitoring, IoT Security System, Smart Dustbin, Robotic Arm*). The backend analyzes key hardware requirements and recommends optimal components.
2. **Interactive Equipment Customizer**: Search components, filter by category (*Microcontrollers, Sensors, Actuators, Displays, Power, Passive*), adjust quantities, and inspect detailed technical pinouts & voltage parameters.
3. **Interactive 3D Three.js Workshop**:
   - Realistic 3D breadboards, microcontrollers (ESP32, Arduino Uno), sensors (Soil Moisture, HC-SR04, DHT11, PIR), relays, motors, pumps, displays, LEDs, and power adapters.
   - Drag & drop components in 3D along the workbench plane.
   - Rotate components (`R` key or toolbar buttons).
   - Draw 3D curved spline wires pin-to-pin with custom color coding (VCC Red, GND Black, Signal Yellow, I2C Blue/Green).
4. **Suggested Auto-Layouts**: Automatically places and pre-wires component layouts based on project type.
5. **Power Simulation Mode**: Animates motor pump rotation, pulsing status LEDs, and live sensor readings.
6. **Save & Export**: Save circuit schematics to local backend storage (`data/saved_projects.json`) or export formatted `.json` files.

---

## 📁 Project Structure

```
3d-circuit-studio/
├── index.html                    # Main HTML5 UI Entrypoint
├── README.md                     # Documentation & Instructions
├── data/
│   ├── components.json           # Catalog of 20+ electronic components with specs & pinouts
│   ├── projects.json             # Blueprint project presets and wire mappings
│   └── saved_projects.json       # User saved projects store
├── backend/
│   ├── server.js                 # Express REST API Server
│   ├── package.json              # Node.js backend manifest
│   ├── routes/
│   │   └── projectRoutes.js      # REST Endpoints: /api/projects/analyze, /api/components, etc.
│   └── services/
│       └── analyzerService.js    # Smart project recommendation engine
└── frontend/
    ├── css/
    │   └── styles.css            # Dark glassmorphism stylesheet
    └── js/
        ├── api.js                # Unified API client with automatic fallback
        ├── analyzerService.js    # Standalone client analyzer service
        ├── presetLayouts.js      # Preset layout & wiring coordinate generator
        ├── threeComponents.js    # Procedural 3D model generator for hardware
        ├── threeWires.js         # 3D spline wire generator & pin snap anchor system
        ├── threeInteractions.js # Raycasting 3D selection, drag/drop, rotation, wiring mode
        ├── threeApp.js           # Three.js viewport manager, scene, camera, lighting, render loop
        ├── ui.js                 # UI view router & modal dialog manager
        └── app.js                # Master application controller
```

---

## 🚀 Setup & Launch Instructions

### Option 1: Full-Stack Express Backend Server (Recommended)

1. Open shell terminal in `3d-circuit-studio/backend`:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

### Option 2: Standalone Browser Launch

If Node.js is not running, open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari). The frontend API client will automatically detect that the server port is offline and seamlessly utilize the embedded client-side analyzer engine & browser storage!

---

## 🎮 3D Workshop Controls & Keyboard Shortcuts

- **Left-Click Drag**: Orbit camera around workbench
- **Right-Click Drag**: Pan camera view
- **Scroll Wheel**: Zoom camera in / out
- **Left-Click Object**: Select 3D component and open inspector
- **Drag Selected Component**: Move component smoothly on workbench grid
- **[ R ] Key**: Rotate selected 3D component 45°
- **[ Delete ] / [ Backspace ] Key**: Remove selected 3D component
- **Add Wire Mode**: Click source pin -> click target pin to connect 3D spline wire
