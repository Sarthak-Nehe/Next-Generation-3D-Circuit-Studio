const fs = require('fs');
const path = require('path');

const COMPONENTS_FILE = path.join(__dirname, '../../data/components.json');
const PROJECTS_FILE = path.join(__dirname, '../../data/projects.json');

function loadJSON(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error loading JSON file ${filePath}:`, err);
    return [];
  }
}

function analyzeProject(projectName) {
  if (!projectName || typeof projectName !== 'string') {
    throw new Error('Valid project name string is required');
  }

  const normalized = projectName.trim().toLowerCase();
  const projects = loadJSON(PROJECTS_FILE);
  const allComponents = loadJSON(COMPONENTS_FILE);

  // 1. Check exact match or alias match in known projects database
  const matchedPreset = projects.find(p => {
    if (p.name.toLowerCase() === normalized) return true;
    if (p.aliases && p.aliases.some(a => a.toLowerCase() === normalized || normalized.includes(a.toLowerCase()))) {
      return true;
    }
    return false;
  });

  if (matchedPreset) {
    // Enrich preset components with full technical details from components.json
    const enrichedComponents = matchedPreset.recommendedComponents.map(item => {
      const fullDetails = allComponents.find(c => c.id === item.componentId);
      return {
        ...(fullDetails || {}),
        quantity: item.quantity || fullDetails.defaultQuantity || 1,
        status: item.status || 'Recommended'
      };
    });

    return {
      projectName: matchedPreset.name,
      description: matchedPreset.description,
      category: matchedPreset.category,
      matchType: 'preset',
      presetLayout: matchedPreset.presetLayout || null,
      components: enrichedComponents,
      summary: {
        totalComponents: enrichedComponents.reduce((acc, c) => acc + (c.quantity || 1), 0),
        uniqueTypes: enrichedComponents.length
      }
    };
  }

  // 2. Keyword-based AI-like Fallback Recommendation Engine for ANY custom project name
  const selectedComponentIds = new Set();
  const addComp = (id) => selectedComponentIds.add(id);

  // Microcontroller selection rule
  if (normalized.includes('wifi') || normalized.includes('iot') || normalized.includes('cloud') || normalized.includes('esp') || normalized.includes('app') || normalized.includes('smart') || normalized.includes('home') || normalized.includes('weather') || normalized.includes('irrigation')) {
    addComp('esp32-dev');
  } else {
    addComp('arduino-uno');
  }

  // Always include breadboard
  addComp('breadboard-830');

  // Sensor keyword rules
  if (normalized.includes('moisture') || normalized.includes('soil') || normalized.includes('water') || normalized.includes('irrigation') || normalized.includes('plant') || normalized.includes('farm')) {
    addComp('soil-moisture');
  }
  if (normalized.includes('distance') || normalized.includes('ultrasonic') || normalized.includes('range') || normalized.includes('obstacle') || normalized.includes('bin') || normalized.includes('dustbin') || normalized.includes('radar')) {
    addComp('ultrasonic-hcsr04');
  }
  if (normalized.includes('temp') || normalized.includes('temperature') || normalized.includes('humidity') || normalized.includes('climate') || normalized.includes('weather') || normalized.includes('dht')) {
    addComp('dht11-temp');
  }
  if (normalized.includes('motion') || normalized.includes('pir') || normalized.includes('security') || normalized.includes('alarm') || normalized.includes('intruder') || normalized.includes('presence')) {
    addComp('pir-motion');
  }
  if (normalized.includes('light') || normalized.includes('dark') || normalized.includes('ldr') || normalized.includes('sun') || normalized.includes('day') || normalized.includes('night')) {
    addComp('ldr-light-sensor');
  }
  if (normalized.includes('gyro') || normalized.includes('accelerometer') || normalized.includes('angle') || normalized.includes('balance') || normalized.includes('tilt') || normalized.includes('mpu')) {
    addComp('mpu6050-gyro');
  }

  // Actuator keyword rules
  if (normalized.includes('pump') || normalized.includes('water') || normalized.includes('irrigation') || normalized.includes('dispenser') || normalized.includes('flow')) {
    addComp('relay-5v-1ch');
    addComp('dc-water-pump');
    addComp('power-12v-adapter');
  }
  if (normalized.includes('relay') || normalized.includes('appliance') || normalized.includes('switch') || normalized.includes('high voltage') || normalized.includes('ac')) {
    addComp('relay-5v-1ch');
    addComp('power-12v-adapter');
  }
  if (normalized.includes('servo') || normalized.includes('arm') || normalized.includes('gate') || normalized.includes('door') || normalized.includes('lock') || normalized.includes('steer') || normalized.includes('bin')) {
    addComp('servo-sg90');
  }
  if (normalized.includes('alarm') || normalized.includes('buzzer') || normalized.includes('sound') || normalized.includes('alert') || normalized.includes('beep') || normalized.includes('security')) {
    addComp('buzzer-active');
  }

  // Display keyword rules
  if (normalized.includes('display') || normalized.includes('screen') || normalized.includes('oled') || normalized.includes('gui') || normalized.includes('monitor')) {
    addComp('oled-096-i2c');
  } else if (normalized.includes('lcd') || normalized.includes('text')) {
    addComp('lcd-1602-i2c');
  } else {
    // Default display for smart projects
    addComp('oled-096-i2c');
  }

  // Power & Passives
  if (normalized.includes('solar') || normalized.includes('green') || normalized.includes('clean energy')) {
    addComp('solar-panel-5v');
    addComp('lipo-battery-pack');
  } else if (normalized.includes('robot') || normalized.includes('mobile') || normalized.includes('car') || normalized.includes('portable')) {
    addComp('lipo-battery-pack');
  } else {
    addComp('power-12v-adapter');
  }

  // Resistors and LEDs
  addComp('resistors-pack');
  addComp('led-pack');

  // Convert IDs to full component objects
  const generatedComponents = Array.from(selectedComponentIds).map(id => {
    const found = allComponents.find(c => c.id === id);
    if (!found) return null;
    return {
      ...found,
      quantity: found.defaultQuantity || 1,
      status: 'Recommended'
    };
  }).filter(Boolean);

  // Generate suggested description
  const capitalizedTitle = projectName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    projectName: capitalizedTitle,
    description: `Intelligent circuit configuration auto-generated for "${capitalizedTitle}". Optimized for high reliability, low power consumption, and modular hardware expansion.`,
    category: 'Custom Electronic Design',
    matchType: 'keyword-generated',
    presetLayout: null,
    components: generatedComponents,
    summary: {
      totalComponents: generatedComponents.reduce((acc, c) => acc + (c.quantity || 1), 0),
      uniqueTypes: generatedComponents.length
    }
  };
}

function getAllComponents() {
  return loadJSON(COMPONENTS_FILE);
}

function getAllProjects() {
  return loadJSON(PROJECTS_FILE);
}

module.exports = {
  analyzeProject,
  getAllComponents,
  getAllProjects
};
