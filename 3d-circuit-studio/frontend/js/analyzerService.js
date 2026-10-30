/**
 * Client-side Analyzer Engine & Dataset Store
 * Provides fallback functionality when Express backend is running standalone in browser.
 */

window.ClientAnalyzerService = {
  // Pre-configured projects fallback database
  projects: [
    {
      id: "smart-irrigation-system",
      name: "Smart Irrigation System",
      aliases: ["smart irrigation", "irrigation", "auto watering", "plant watering", "soil moisture monitoring"],
      description: "An automated agricultural IoT system that reads soil moisture levels via a capacitive sensor and controls a 12V water pump using a relay module connected to an ESP32 microcontroller.",
      category: "IoT & Agriculture",
      recommendedComponents: [
        { componentId: "esp32-dev", quantity: 1, status: "Recommended" },
        { componentId: "soil-moisture", quantity: 1, status: "Recommended" },
        { componentId: "relay-5v-1ch", quantity: 1, status: "Recommended" },
        { componentId: "dc-water-pump", quantity: 1, status: "Recommended" },
        { componentId: "power-12v-adapter", quantity: 1, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" },
        { componentId: "resistors-pack", quantity: 2, status: "Recommended" },
        { componentId: "capacitors-pack", quantity: 1, status: "Recommended" },
        { componentId: "led-pack", quantity: 2, status: "Recommended" }
      ]
    },
    {
      id: "home-automation",
      name: "Home Automation",
      aliases: ["home automation", "smart home", "iot home", "home control", "appliance control"],
      description: "Smart home hub using ESP32 with multi-channel relay output for light & appliance switching, PIR motion sensor security, and ambient light detection.",
      category: "Smart Home",
      recommendedComponents: [
        { componentId: "esp32-dev", quantity: 1, status: "Recommended" },
        { componentId: "relay-5v-1ch", quantity: 2, status: "Recommended" },
        { componentId: "pir-motion", quantity: 1, status: "Recommended" },
        { componentId: "ldr-light-sensor", quantity: 1, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Recommended" },
        { componentId: "buzzer-active", quantity: 1, status: "Optional" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" },
        { componentId: "led-pack", quantity: 2, status: "Recommended" }
      ]
    },
    {
      id: "weather-monitoring-system",
      name: "Weather Monitoring System",
      aliases: ["weather monitoring", "weather station", "temp humidity monitoring", "climate monitor"],
      description: "Compact IoT meteorological station measuring temperature, humidity, ambient light, and rain status, publishing live data to LCD screen.",
      category: "Environmental",
      recommendedComponents: [
        { componentId: "esp32-dev", quantity: 1, status: "Recommended" },
        { componentId: "dht11-temp", quantity: 1, status: "Recommended" },
        { componentId: "ldr-light-sensor", quantity: 1, status: "Recommended" },
        { componentId: "lcd-1602-i2c", quantity: 1, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Optional" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "line-following-robot",
      name: "Line Following Robot",
      aliases: ["line following robot", "line follower", "autonomous robot", "robot car"],
      description: "Autonomous mobile robot powered by Arduino Uno, dual DC gear motors, IR sensor array, and LiPo battery pack.",
      category: "Robotics",
      recommendedComponents: [
        { componentId: "arduino-uno", quantity: 1, status: "Recommended" },
        { componentId: "ldr-light-sensor", quantity: 2, status: "Recommended" },
        { componentId: "servo-sg90", quantity: 1, status: "Optional" },
        { componentId: "lipo-battery-pack", quantity: 1, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" },
        { componentId: "buzzer-active", quantity: 1, status: "Optional" }
      ]
    },
    {
      id: "solar-power-monitoring",
      name: "Solar Power Monitoring",
      aliases: ["solar power monitoring", "solar monitor", "solar tracker", "renewable energy monitor"],
      description: "Smart solar energy monitoring system tracking voltage, output power, and ambient irradiance with automatic load management.",
      category: "Energy & Power",
      recommendedComponents: [
        { componentId: "esp32-dev", quantity: 1, status: "Recommended" },
        { componentId: "solar-panel-5v", quantity: 1, status: "Recommended" },
        { componentId: "lipo-battery-pack", quantity: 1, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Recommended" },
        { componentId: "relay-5v-1ch", quantity: 1, status: "Optional" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "iot-security-system",
      name: "IoT Security System",
      aliases: ["iot security system", "security system", "alarm system", "smart alarm", "intrusion detector"],
      description: "Comprehensive security system with PIR motion sensing, ultrasonic barrier detection, piezo buzzer alarm, and real-time OLED alert status.",
      category: "Security",
      recommendedComponents: [
        { componentId: "esp32-dev", quantity: 1, status: "Recommended" },
        { componentId: "pir-motion", quantity: 1, status: "Recommended" },
        { componentId: "ultrasonic-hcsr04", quantity: 1, status: "Recommended" },
        { componentId: "buzzer-active", quantity: 1, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Recommended" },
        { componentId: "led-pack", quantity: 2, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "smart-dustbin",
      name: "Smart Dustbin",
      aliases: ["smart dustbin", "touchless trash can", "automatic bin", "smart bin"],
      description: "Touchless automatic waste bin opening lid via SG90 servo motor when ultrasonic proximity sensor detects hand approach within 20cm.",
      category: "Automation",
      recommendedComponents: [
        { componentId: "arduino-uno", quantity: 1, status: "Recommended" },
        { componentId: "ultrasonic-hcsr04", quantity: 1, status: "Recommended" },
        { componentId: "servo-sg90", quantity: 1, status: "Recommended" },
        { componentId: "buzzer-active", quantity: 1, status: "Optional" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" },
        { componentId: "led-pack", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "robotic-arm",
      name: "Robotic Arm",
      aliases: ["robotic arm", "arm controller", "servo arm", "robot arm"],
      description: "Multi-axis articulated robotic arm driven by SG90 servo motors, controlled via potentiometers or Arduino serial commands.",
      category: "Robotics",
      recommendedComponents: [
        { componentId: "arduino-uno", quantity: 1, status: "Recommended" },
        { componentId: "servo-sg90", quantity: 4, "status": "Recommended" },
        { componentId: "power-12v-adapter", quantity: 1, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Optional" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "antigravity-levitation-rig",
      name: "Antigravity Levitation Rig",
      aliases: ["antigravity", "anti gravity", "antigravity levitation", "levitation rig", "quantum levitator", "flux stabilizer"],
      description: "Advanced physics levitation apparatus powered by Antigravity Core, Flux Stabilizer, and Quantum Levitator plate with real-time plasma flux feedback.",
      category: "Antigravity & Physics",
      recommendedComponents: [
        { componentId: "arduino-uno", quantity: 1, status: "Recommended" },
        { componentId: "antigravity-core", quantity: 1, status: "Recommended" },
        { componentId: "flux-stabilizer", quantity: 1, status: "Recommended" },
        { componentId: "quantum-levitator", quantity: 1, status: "Recommended" },
        { componentId: "lipo-battery-pack", quantity: 1, status: "Recommended" },
        { componentId: "toggle-switch-spst", quantity: 1, status: "Recommended" },
        { componentId: "solar-panel-5v", quantity: 1, status: "Optional" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "smart-fan-speed-controller",
      name: "Smart DC Motor Fan Controller",
      aliases: ["smart fan", "fan controller", "motor fan", "temp fan", "automatic fan speed", "cooling fan"],
      description: "Automated temperature-controlled DC motor cooling fan system using DHT11 sensor, Arduino Uno, OLED status screen, and battery ON/OFF switch.",
      category: "Automation & Thermal",
      recommendedComponents: [
        { componentId: "arduino-uno", quantity: 1, status: "Recommended" },
        { componentId: "dht11-temp", quantity: 1, status: "Recommended" },
        { componentId: "relay-5v-1ch", quantity: 1, status: "Recommended" },
        { componentId: "dc-water-pump", quantity: 1, status: "Recommended" },
        { componentId: "toggle-switch-spst", quantity: 1, status: "Recommended" },
        { componentId: "lipo-battery-pack", quantity: 1, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "water-level-indicator",
      name: "Automatic Water Level Controller",
      aliases: ["water level indicator", "water level controller", "overhead tank monitor", "water tank pump"],
      description: "Automatic tank water level sensing and pump control system with capacitive level sensor, 5V relay, warning buzzer, and main power switch.",
      category: "IoT & Utilities",
      recommendedComponents: [
        { componentId: "esp32-dev", quantity: 1, status: "Recommended" },
        { componentId: "soil-moisture", quantity: 1, status: "Recommended" },
        { componentId: "relay-5v-1ch", quantity: 1, status: "Recommended" },
        { componentId: "dc-water-pump", quantity: 1, status: "Recommended" },
        { componentId: "buzzer-active", quantity: 1, status: "Recommended" },
        { componentId: "toggle-switch-spst", quantity: 1, status: "Recommended" },
        { componentId: "lipo-battery-pack", quantity: 1, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "rfid-door-lock",
      name: "RFID Smart Door Access System",
      aliases: ["rfid door lock", "rfid lock", "smart door lock", "keyless access", "door security"],
      description: "Keyless door lock system driven by SG90 servo motor latch, piezo buzzer alarm, indicator LEDs, and ON/OFF safety switch.",
      category: "Security",
      recommendedComponents: [
        { componentId: "arduino-uno", quantity: 1, status: "Recommended" },
        { componentId: "servo-sg90", quantity: 1, status: "Recommended" },
        { componentId: "buzzer-active", quantity: 1, status: "Recommended" },
        { componentId: "led-pack", quantity: 2, status: "Recommended" },
        { componentId: "oled-096-i2c", quantity: 1, status: "Recommended" },
        { componentId: "toggle-switch-spst", quantity: 1, status: "Recommended" },
        { componentId: "lipo-battery-pack", quantity: 1, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    },
    {
      id: "bluetooth-rc-car",
      name: "Bluetooth RC Motor Vehicle",
      aliases: ["bluetooth rc car", "rc car", "robot car", "motor vehicle", "bluetooth car"],
      description: "Wireless RC motor vehicle powered by LiPo battery pack with ON/OFF rocker switch, dual motor drivers, and steering servo.",
      category: "Robotics",
      recommendedComponents: [
        { componentId: "arduino-uno", quantity: 1, status: "Recommended" },
        { componentId: "servo-sg90", quantity: 1, status: "Recommended" },
        { componentId: "relay-5v-1ch", quantity: 2, status: "Recommended" },
        { componentId: "toggle-switch-spst", quantity: 1, status: "Recommended" },
        { componentId: "lipo-battery-pack", quantity: 1, status: "Recommended" },
        { componentId: "led-pack", quantity: 2, status: "Recommended" },
        { componentId: "breadboard-830", quantity: 1, status: "Recommended" }
      ]
    }
  ],

  // Fallback Full Components Catalog
  componentsCatalog: [
    {
      id: "esp32-dev",
      name: "ESP32 Development Board",
      category: "Microcontrollers",
      description: "32-bit Dual-Core Wi-Fi & Bluetooth microcontroller board with 30 GPIO pins, capacitive touch, ADC, DAC, and PWM.",
      specs: { "Operating Voltage": "3.3V", "Input Voltage": "5V via USB / Vin", "Clock Speed": "240 MHz", "Connectivity": "Wi-Fi & BLE" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "cpu",
      color: "#3b82f6",
      pins: ["3V3", "GND", "EN", "VP", "VN", "D34", "D35", "D32", "D33", "D25", "D26", "D27", "D14", "D12", "D13", "VIN", "D23", "D22", "TX0", "RX0", "D21", "D19", "D18", "D5", "D17", "D16", "D4", "D2", "D15", "GND2"]
    },
    {
      id: "arduino-uno",
      name: "Arduino Uno R3",
      category: "Microcontrollers",
      description: "Industry-standard ATmega328P microcontroller board featuring 14 digital I/O pins and 6 analog inputs.",
      specs: { "Operating Voltage": "5V", "Input Voltage": "7-12V", "Clock Speed": "16 MHz", "Digital I/O": "14 pins" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "cpu",
      color: "#00f0ff",
      pins: ["5V", "3.3V", "GND", "VIN", "A0", "A1", "A2", "A3", "A4", "A5", "D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13"]
    },
    {
      id: "soil-moisture",
      name: "Capacitive Soil Moisture Sensor",
      category: "Sensors",
      description: "Corrosion-resistant capacitive soil moisture sensor module providing real-time analog voltage output proportional to soil humidity.",
      specs: { "Operating Voltage": "3.3V - 5.5V", "Output": "Analog Output (AO)", "Dimensions": "98 x 23 mm" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "droplet",
      color: "#10b981",
      pins: ["VCC", "GND", "AOUT"]
    },
    {
      id: "ultrasonic-hcsr04",
      name: "HC-SR04 Ultrasonic Distance Sensor",
      category: "Sensors",
      description: "Non-contact ultrasonic range finder measuring distance from 2cm to 400cm with high accuracy and stable readings.",
      specs: { "Operating Voltage": "5V DC", "Measuring Angle": "15 deg", "Range": "2cm - 400cm" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "radio",
      color: "#8b5cf6",
      pins: ["VCC", "TRIG", "ECHO", "GND"]
    },
    {
      id: "dht11-temp",
      name: "DHT11 Temperature & Humidity Sensor",
      category: "Sensors",
      description: "Calibrated digital composite sensor outputting temperature (°C) and relative humidity (%) over a single wire protocol.",
      specs: { "Operating Voltage": "3.5V - 5.5V", "Humidity Range": "20-90%", "Temperature Range": "0-50°C" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "thermometer",
      color: "#f59e0b",
      pins: ["VCC", "DATA", "NC", "GND"]
    },
    {
      id: "pir-motion",
      name: "PIR Motion Sensor (HC-SR501)",
      category: "Sensors",
      description: "Pyroelectric infrared motion detector with adjustable delay time and sensitivity controls for human body detection.",
      specs: { "Operating Voltage": "4.5V - 20V", "Output Signal": "High 3.3V / Low 0V", "Range": "3-7 meters" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "eye",
      color: "#ef4444",
      pins: ["VCC", "OUT", "GND"]
    },
    {
      id: "ldr-light-sensor",
      name: "LDR Light Sensor Module",
      category: "Sensors",
      description: "Photoresistor light detection module with LM393 comparator for ambient light intensity monitoring.",
      specs: { "Operating Voltage": "3.3V - 5V", "Outputs": "Analog & Digital" },
      defaultQuantity: 1,
      status: "Optional",
      icon: "sun",
      color: "#facc15",
      pins: ["VCC", "GND", "DO", "AO"]
    },
    {
      id: "mpu6050-gyro",
      name: "MPU6050 6-DOF Gyro & Accelerometer",
      category: "Sensors",
      description: "Triple-axis MEMS accelerometer and gyro module with Digital Motion Processor (DMP) and I2C communications.",
      specs: { "Operating Voltage": "3.0-5.0V", "Gyro": "±2000 °/s", "Accel": "±16g", "Protocol": "I2C" },
      defaultQuantity: 1,
      status: "Optional",
      icon: "compass",
      color: "#ec4899",
      pins: ["VCC", "GND", "SCL", "SDA", "XDA", "XCL", "AD0", "INT"]
    },
    {
      id: "relay-5v-1ch",
      name: "5V 1-Channel Relay Module",
      category: "Actuators",
      description: "Optocoupler isolated relay module capable of controlling high voltage AC/DC appliances (up to 250VAC/10A) using low voltage digital logic.",
      specs: { "Trigger Voltage": "5V DC", "Max Switch": "250VAC / 30VDC", "Max Current": "10A" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "toggle-right",
      color: "#3b82f6",
      pins: ["VCC", "GND", "IN", "NO", "COM", "NC"]
    },
    {
      id: "dc-water-pump",
      name: "12V Micro Submersible DC Water Pump",
      category: "Actuators",
      description: "Compact brushless DC water pump for automated irrigation, liquid dispensing, and hydroponic circulation systems.",
      specs: { "Operating Voltage": "12V DC", "Power": "4.2W", "Max Flow": "240 L/H", "Lift": "3 meters" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "wind",
      color: "#06b6d4",
      pins: ["V+", "V-"]
    },
    {
      id: "servo-sg90",
      name: "SG90 Micro Servo Motor 9g",
      category: "Actuators",
      description: "High-torque lightweight 180-degree micro servo motor for robotic arms, steering mechanisms, and automated gates.",
      specs: { "Operating Voltage": "4.8-6.0V", "Torque": "1.8 kg-cm", "Angle": "180 deg" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "activity",
      color: "#6366f1",
      pins: ["GND", "VCC", "PWM"]
    },
    {
      id: "buzzer-active",
      name: "5V Active Piezo Electric Buzzer",
      category: "Actuators",
      description: "Audio alert buzzer with internal oscillation circuit that sounds continuous tone when driven HIGH.",
      specs: { "Operating Voltage": "3.5-5.5V", "Sound Output": "≥85dB" },
      defaultQuantity: 1,
      status: "Optional",
      icon: "volume-2",
      color: "#f43f5e",
      pins: ["POS", "NEG"]
    },
    {
      id: "oled-096-i2c",
      name: "0.96 inch I2C OLED Display (128x64)",
      category: "Displays",
      description: "Ultra-bright crisp monochrome OLED graphic display module controlled over I2C bus with low power draw.",
      specs: { "Operating Voltage": "3.3V - 5V", "Resolution": "128x64", "Driver": "SSD1306", "Protocol": "I2C" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "monitor",
      color: "#00f0ff",
      pins: ["GND", "VCC", "SCL", "SDA"]
    },
    {
      id: "lcd-1602-i2c",
      name: "16x2 Character LCD with I2C Module",
      category: "Displays",
      description: "16 column x 2 line character LCD display with integrated PCF8574 I2C adapter backpack and backlight control.",
      specs: { "Operating Voltage": "5V DC", "Display": "16x2 Characters", "Backlight": "Blue/White" },
      defaultQuantity: 1,
      status: "Optional",
      icon: "tv",
      color: "#22c55e",
      pins: ["GND", "VCC", "SDA", "SCL"]
    },
    {
      id: "power-12v-adapter",
      name: "12V 2A DC Power Adapter & Terminal",
      category: "Power",
      description: "Regulated 12V 2000mA wall power supply with screw terminal adapter block for high-load relays, pumps, and motors.",
      specs: { "Input": "100-240VAC", "Output": "12V DC 2A" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "zap",
      color: "#eab308",
      pins: ["DC+", "DC-"]
    },
    {
      id: "lipo-battery-pack",
      name: "7.4V 2200mAh LiPo Battery Pack",
      category: "Power",
      description: "High-discharge 2-Cell Lithium Polymer battery pack for mobile robots and untethered outdoor IoT nodes.",
      specs: { "Voltage": "7.4V (2S)", "Capacity": "2200 mAh" },
      defaultQuantity: 1,
      status: "Optional",
      icon: "battery-charging",
      color: "#a855f7",
      pins: ["BAT+", "BAT-"]
    },
    {
      id: "solar-panel-5v",
      name: "5V 2W Solar Panel Module",
      category: "Power",
      description: "Polycrystalline solar cell panel with USB/wire voltage regulator output for eco-friendly solar charging setups.",
      specs: { "Voltage": "5V DC", "Power": "2 Watts", "Current": "400 mA" },
      defaultQuantity: 1,
      status: "Optional",
      icon: "sun",
      color: "#eab308",
      pins: ["SOL+", "SOL-"]
    },
    {
      id: "breadboard-830",
      name: "Solderless Breadboard (830 Points)",
      category: "Passive",
      description: "Full-size solderless breadboard with dual power rails, DIP IC centerline divider, and sticky backing.",
      specs: { "Points": "830 Tie Points", "Material": "ABS Plastic" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "grid",
      color: "#64748b",
      pins: ["RAIL_VCC1", "RAIL_GND1", "RAIL_VCC2", "RAIL_GND2"]
    },
    {
      id: "resistors-pack",
      name: "Resistor Assortment Pack (220Ω / 1kΩ / 10kΩ)",
      category: "Passive",
      description: "Precision 1/4W carbon film resistors for current limiting LEDs and pull-up / pull-down sensor configurations.",
      specs: { "Values": "220Ω, 1kΩ, 10kΩ", "Power": "0.25W" },
      defaultQuantity: 5,
      status: "Recommended",
      icon: "sliders",
      color: "#94a3b8",
      pins: ["PIN1", "PIN2"]
    },
    {
      id: "led-pack",
      name: "5mm Diffused LEDs (Red, Green, Blue, Yellow)",
      category: "Passive",
      description: "Ultra-bright 5mm diffused LED indicator lamps with long anode (+) and short cathode (-) leads.",
      specs: { "Forward Voltage": "1.8-3.2V", "Current": "20mA" },
      defaultQuantity: 3,
      status: "Recommended",
      icon: "sun",
      color: "#ef4444",
      pins: ["ANODE", "CATHODE"]
    },
    {
      id: "antigravity-core",
      name: "Antigravity Field Core",
      category: "Antigravity & Physics",
      description: "Primary gravity cancellation core featuring dual counter-rotating plasma rings and quantum flux emitters.",
      specs: { "Field Strength": "1.21 Tesla", "Frequency": "432.8 MHz", "Input Voltage": "5V - 12V" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "aperture",
      color: "#00f0ff",
      pins: ["VCC", "GND", "FLUX_OUT", "STAB_IN"]
    },
    {
      id: "flux-stabilizer",
      name: "Flux Matrix Stabilizer",
      category: "Antigravity & Physics",
      description: "Hexagonal flux dampener for smoothing harmonic oscillations in high-intensity gravimetric fields.",
      specs: { "Damping Factor": "99.8%", "Control Voltage": "3.3V / 5V" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "shield",
      color: "#a855f7",
      pins: ["VCC", "GND", "FLUX_IN", "CTRL_OUT"]
    },
    {
      id: "quantum-levitator",
      name: "Quantum Levitator Plate",
      category: "Antigravity & Physics",
      description: "High-temperature YBCO superconductor plate generating Meissner Effect magnetic flux pinning.",
      specs: { "Levitation Force": "45.0 N", "Operating Temp": "77 K (-196°C)" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "disc",
      color: "#38bdf8",
      pins: ["VIN", "GND", "LEV_SIG", "SENSE"]
    },
    {
      id: "toggle-switch-spst",
      name: "ON/OFF Rocker Power Switch (SPST)",
      category: "Power",
      description: "SPST ON/OFF power toggle rocker switch module for safely turning battery power supply on or off.",
      specs: { "Max Rating": "250V / 6A", "Type": "SPST Latching Switch" },
      defaultQuantity: 1,
      status: "Recommended",
      icon: "power",
      color: "#ef4444",
      pins: ["SW_IN", "SW_OUT"]
    }
  ],

  // Analyze function
  analyze: function(projectName) {
    if (!projectName) throw new Error('Project name required');
    const normalized = projectName.trim().toLowerCase();

    // 1. Exact preset match
    const presetMatch = this.projects.find(p => 
      p.name.toLowerCase() === normalized ||
      (p.aliases && p.aliases.some(a => a.toLowerCase() === normalized || normalized.includes(a.toLowerCase())))
    );

    if (presetMatch) {
      const enriched = presetMatch.recommendedComponents.map(item => {
        const full = this.componentsCatalog.find(c => c.id === item.componentId);
        return {
          ...(full || {}),
          quantity: item.quantity || full.defaultQuantity || 1,
          status: item.status || 'Recommended'
        };
      });

      return {
        projectName: presetMatch.name,
        description: presetMatch.description,
        category: presetMatch.category,
        matchType: 'preset',
        presetLayout: null,
        components: enriched,
        summary: { totalComponents: enriched.reduce((a, b) => a + b.quantity, 0), uniqueTypes: enriched.length }
      };
    }

    // 2. Smart Keyword Engine Fallback
    const compIds = new Set();
    if (normalized.includes('wifi') || normalized.includes('iot') || normalized.includes('cloud') || normalized.includes('esp') || normalized.includes('smart') || normalized.includes('home') || normalized.includes('weather') || normalized.includes('irrigation')) {
      compIds.add('esp32-dev');
    } else {
      compIds.add('arduino-uno');
    }

    compIds.add('breadboard-830');

    if (normalized.includes('moisture') || normalized.includes('soil') || normalized.includes('water') || normalized.includes('irrigation') || normalized.includes('plant') || normalized.includes('farm')) compIds.add('soil-moisture');
    if (normalized.includes('distance') || normalized.includes('ultrasonic') || normalized.includes('range') || normalized.includes('obstacle') || normalized.includes('bin') || normalized.includes('dustbin')) compIds.add('ultrasonic-hcsr04');
    if (normalized.includes('temp') || normalized.includes('temperature') || normalized.includes('humidity') || normalized.includes('weather')) compIds.add('dht11-temp');
    if (normalized.includes('motion') || normalized.includes('pir') || normalized.includes('security') || normalized.includes('alarm')) compIds.add('pir-motion');
    if (normalized.includes('light') || normalized.includes('ldr') || normalized.includes('sun')) compIds.add('ldr-light-sensor');
    if (normalized.includes('gyro') || normalized.includes('angle') || normalized.includes('balance') || normalized.includes('mpu')) compIds.add('mpu6050-gyro');

    if (normalized.includes('pump') || normalized.includes('water') || normalized.includes('irrigation')) {
      compIds.add('relay-5v-1ch');
      compIds.add('dc-water-pump');
      compIds.add('power-12v-adapter');
    }
    if (normalized.includes('servo') || normalized.includes('arm') || normalized.includes('gate') || normalized.includes('door') || normalized.includes('bin')) compIds.add('servo-sg90');
    if (normalized.includes('alarm') || normalized.includes('buzzer') || normalized.includes('sound') || normalized.includes('alert')) compIds.add('buzzer-active');

    if (normalized.includes('display') || normalized.includes('oled') || normalized.includes('screen')) compIds.add('oled-096-i2c');
    else compIds.add('oled-096-i2c');

    if (normalized.includes('solar')) { compIds.add('solar-panel-5v'); compIds.add('lipo-battery-pack'); }
    else if (normalized.includes('robot') || normalized.includes('car')) compIds.add('lipo-battery-pack');
    else compIds.add('power-12v-adapter');

    compIds.add('resistors-pack');
    compIds.add('led-pack');

    const generated = Array.from(compIds).map(id => {
      const found = this.componentsCatalog.find(c => c.id === id);
      return found ? { ...found, quantity: found.defaultQuantity || 1, status: 'Recommended' } : null;
    }).filter(Boolean);

    const title = projectName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      projectName: title,
      description: `Intelligent circuit architecture auto-generated for "${title}". Optimized for performance, low noise, and clean power distribution.`,
      category: 'Custom Electronic Design',
      matchType: 'keyword-generated',
      presetLayout: null,
      components: generated,
      summary: { totalComponents: generated.reduce((a, b) => a + b.quantity, 0), uniqueTypes: generated.length }
    };
  }
};
