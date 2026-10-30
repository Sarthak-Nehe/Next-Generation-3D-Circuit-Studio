/**
 * Preset Layouts & Pre-wired Suggested Configurations
 */

window.PresetLayouts = {
  getSuggestedLayout(projectName, selectedComponents) {

    // Default grid position calculator if no specific preset exists
    const resultLayout = {
      components: [],
      wires: []
    };

    // Layout positions mapping for clean custom 3D PCB board design

    // Positions mapping for clean straight-line component alignment
    const placementMap = {
      'esp32-dev': { x: -1.0, y: 0.4, z: 0, rotation: 0 },
      'arduino-uno': { x: -1.0, y: 0.4, z: 0, rotation: 0 },
      'soil-moisture': { x: -6.5, y: 0.4, z: 2.0, rotation: 0 },
      'dht11-temp': { x: -6.5, y: 0.4, z: 0.7, rotation: 0 },
      'ultrasonic-hcsr04': { x: -6.5, y: 0.4, z: -0.7, rotation: 0 },
      'pir-motion': { x: -6.5, y: 0.4, z: -2.0, rotation: 0 },
      'ldr-light-sensor': { x: -6.5, y: 0.4, z: -3.3, rotation: 0 },
      'mpu6050-gyro': { x: -6.5, y: 0.4, z: 3.3, rotation: 0 },
      'relay-5v-1ch': { x: 5.2, y: 0.4, z: -1.2, rotation: 0 },
      'dc-water-pump': { x: 8.2, y: 0.4, z: -1.2, rotation: 0 },
      'servo-sg90': { x: 5.2, y: 0.4, z: 1.2, rotation: 0 },
      'buzzer-active': { x: 2.5, y: 0.4, z: -2.2, rotation: 0 },
      'oled-096-i2c': { x: 2.5, y: 0.4, z: 1.2, rotation: 0 },
      'lcd-1602-i2c': { x: 4.8, y: 0.4, z: 0, rotation: 0 },
      'power-12v-adapter': { x: 8.2, y: 0.4, z: -3.8, rotation: 0 },
      'lipo-battery-pack': { x: -1.0, y: 0.4, z: -3.8, rotation: 0 },
      'solar-panel-5v': { x: -6.5, y: 0.4, z: -4.5, rotation: 0 },
      'resistors-pack': { x: -1.0, y: 0.3, z: 0.8, rotation: 0 },
      'capacitors-pack': { x: 0.8, y: 0.3, z: 0.8, rotation: 0 },
      'inductor-coil': { x: 2.2, y: 0.3, z: 0.8, rotation: 0 },
      'led-pack': { x: 0.5, y: 0.3, z: -0.8, rotation: 0 },
      'antigravity-core': { x: -4.5, y: 0.4, z: 3.6, rotation: 0 },
      'flux-stabilizer': { x: -1.0, y: 0.4, z: 3.6, rotation: 0 },
      'quantum-levitator': { x: 3.5, y: 0.4, z: 3.6, rotation: 0 },
      'toggle-switch-spst': { x: -3.5, y: 0.4, z: -3.8, rotation: 0 }
    };

    let flexOffsetX = -6;
    let flexOffsetZ = 4;

    selectedComponents.forEach((comp, idx) => {
      if (comp.id === 'breadboard-830') return; // already placed

      const qty = comp.quantity || 1;
      for (let i = 0; i < qty; i++) {
        const instanceId = `${comp.id}-${i + 1}`;
        const basePlacement = placementMap[comp.id];

        let posX = flexOffsetX;
        let posZ = flexOffsetZ;

        if (basePlacement) {
          posX = basePlacement.x + (i * 2.5);
          posZ = basePlacement.z;
        } else {
          flexOffsetX += 2.5;
          if (flexOffsetX > 7) {
            flexOffsetX = -6;
            flexOffsetZ += 2.5;
          }
        }

        resultLayout.components.push({
          id: comp.id,
          instanceId: instanceId,
          x: posX,
          y: basePlacement ? basePlacement.y : 0.4,
          z: posZ,
          rotation: basePlacement ? basePlacement.rotation : 0
        });
      }
    });

    // ==================================================================
    // Auto-wiring generator — connects EVERY placed component to the
    // microcontroller using its real pin names, instead of only handling
    // a few hardcoded project keywords. This is what previously left
    // Buzzer, LED, LDR and (in most presets) Relay completely unwired.
    // ==================================================================
    // ==================================================================
    // Auto-wiring generator — connects EVERY placed component to the
    // microcontroller using distinct pin distribution and real power supplies
    // (Battery, Power Adapter, Solar Panel, Relays, Sensors, Displays, etc.)
    // ==================================================================
    const placedIds = resultLayout.components.map(c => c.instanceId);
    const has = (baseId) => placedIds.find(id => id.startsWith(baseId + '-'));
    const getAll = (baseId) => placedIds.filter(id => id.startsWith(baseId + '-'));

    const mcuBaseId = has('esp32-dev') ? 'esp32-dev' : (has('arduino-uno') ? 'arduino-uno' : null);
    const mcuInstanceId = mcuBaseId ? has(mcuBaseId) : null;

    if (mcuInstanceId) {
      const isESP32 = mcuBaseId === 'esp32-dev';

      // Multi-point Ground & Power pin allocation pools to prevent wire stacking at a single pin
      const gndPool = isESP32 ? ['GND1', 'GND2', 'GND3'] : ['GND1', 'GND2', 'GND3'];
      const vcc3Pool = isESP32 ? ['3V3', '3V3'] : ['3.3V', '3.3V'];
      const vcc5Pool = isESP32 ? ['VIN', 'VIN'] : ['5V', 'VIN', '5V'];

      let gndIdx = 0;
      let vcc3Idx = 0;
      let vcc5Idx = 0;

      const getGND = () => {
        const pin = gndPool[gndIdx % gndPool.length];
        gndIdx++;
        return pin;
      };

      const getVCC3 = () => {
        const pin = vcc3Pool[vcc3Idx % vcc3Pool.length];
        vcc3Idx++;
        return pin;
      };

      const getVCC5 = () => {
        const pin = vcc5Pool[vcc5Idx % vcc5Pool.length];
        vcc5Idx++;
        return pin;
      };

      const i2c = isESP32 ? { sda: 'D21', scl: 'D22' } : { sda: 'A4', scl: 'A5' };

      const digitalPool = isESP32
        ? ['D26', 'D27', 'D14', 'D12', 'D13', 'D25', 'D33', 'D32', 'D23', 'D19', 'D18', 'D5', 'D17', 'D16', 'D4', 'D2', 'D15']
        : ['D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'];

      const analogPool = isESP32 ? ['D34', 'D35', 'D32', 'D33'] : ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];

      const nextDigital = () => digitalPool.shift() || 'D13';
      const nextAnalog = () => analogPool.shift() || nextDigital();

      const colors = { power: '#ef4444', ground: '#1e293b', signal: '#00f0ff', i2c1: '#3b82f6', i2c2: '#f59e0b', highVoltage: '#eab308' };

      const addWire = (fromComp, fromPin, toComp, toPin, color) => {
        const exists = resultLayout.wires.some(w => 
          (w.fromComp === fromComp && w.fromPin === fromPin && w.toComp === toComp && w.toPin === toPin) ||
          (w.fromComp === toComp && w.fromPin === toPin && w.toComp === fromComp && w.toPin === fromPin)
        );
        if (!exists) {
          resultLayout.wires.push({ fromComp, fromPin, toComp, toPin, color: color || colors.signal });
        }
      };

      const handled = new Set([mcuInstanceId]);

      // 1. POWER SUPPLIES, BATTERIES, ON/OFF SWITCHES & SOLAR PANELS
      const adapterId = has('power-12v-adapter');
      const lipoId = has('lipo-battery-pack');
      const solarId = has('solar-panel-5v');
      const switchId = has('toggle-switch-spst');

      if (lipoId) {
        if (switchId) {
          addWire(lipoId, 'BAT+', switchId, 'SW_IN', colors.power);
          addWire(switchId, 'SW_OUT', mcuInstanceId, 'VIN', colors.power);
          handled.add(switchId);
        } else {
          addWire(lipoId, 'BAT+', mcuInstanceId, 'VIN', colors.power);
        }
        addWire(lipoId, 'BAT-', mcuInstanceId, getGND(), colors.ground);
        handled.add(lipoId);
      } else if (switchId) {
        addWire(mcuInstanceId, '5V', switchId, 'SW_IN', colors.power);
        handled.add(switchId);
      }

      if (solarId) {
        if (lipoId) {
          addWire(solarId, 'SOLAR+', lipoId, 'BAT+', colors.power);
          addWire(solarId, 'SOLAR-', lipoId, 'BAT-', colors.ground);
        } else {
          addWire(solarId, 'SOLAR+', mcuInstanceId, 'VIN', colors.power);
          addWire(solarId, 'SOLAR-', mcuInstanceId, getGND(), colors.ground);
        }
        handled.add(solarId);
      }

      // 2. RELAY + PUMP + 12V ADAPTER
      const relayIds = getAll('relay-5v-1ch');
      const pumpId = has('dc-water-pump');

      if (relayIds.length > 0) {
        relayIds.forEach((relayId, idx) => {
          addWire(mcuInstanceId, getVCC5(), relayId, 'VCC', colors.power);
          addWire(mcuInstanceId, getGND(), relayId, 'GND', colors.ground);
          addWire(mcuInstanceId, nextDigital(), relayId, 'IN', colors.signal);
          handled.add(relayId);

          if (idx === 0 && adapterId) {
            addWire(adapterId, 'DC+', relayId, 'COM', colors.highVoltage);
            handled.add(adapterId);
          }
        });

        if (pumpId) {
          const mainRelay = relayIds[0];
          addWire(mainRelay, 'NO', pumpId, 'V+', colors.highVoltage);
          if (adapterId) {
            addWire(adapterId, 'DC-', pumpId, 'V-', colors.ground);
          } else {
            addWire(mcuInstanceId, getGND(), pumpId, 'V-', colors.ground);
          }
          handled.add(pumpId);
        }
      } else if (pumpId) {
        if (adapterId) {
          addWire(adapterId, 'DC+', pumpId, 'V+', colors.highVoltage);
          addWire(adapterId, 'DC-', pumpId, 'V-', colors.ground);
          handled.add(adapterId);
        } else {
          addWire(mcuInstanceId, getVCC5(), pumpId, 'V+', colors.power);
          addWire(mcuInstanceId, getGND(), pumpId, 'V-', colors.ground);
        }
        handled.add(pumpId);
      } else if (adapterId) {
        addWire(adapterId, 'DC+', mcuInstanceId, 'VIN', colors.power);
        addWire(adapterId, 'DC-', mcuInstanceId, 'GND2', colors.ground);
        handled.add(adapterId);
      }

      // 3. ALL OTHER SENSORS, DISPLAYS & ACTUATORS
      resultLayout.components.forEach(comp => {
        if (handled.has(comp.instanceId)) return;
        const id = comp.instanceId;
        const base = comp.id;

        switch (base) {
          case 'soil-moisture':
            addWire(mcuInstanceId, getVCC3(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(id, 'AOUT', mcuInstanceId, nextAnalog(), colors.signal);
            break;

          case 'ultrasonic-hcsr04':
            addWire(mcuInstanceId, getVCC5(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(mcuInstanceId, nextDigital(), id, 'TRIG', colors.i2c1);
            addWire(id, 'ECHO', mcuInstanceId, nextDigital(), '#10b981');
            break;

          case 'dht11-temp':
            addWire(mcuInstanceId, getVCC3(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(id, 'DATA', mcuInstanceId, nextDigital(), '#f59e0b');
            break;

          case 'pir-motion':
            addWire(mcuInstanceId, getVCC5(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(id, 'OUT', mcuInstanceId, nextDigital(), '#8b5cf6');
            break;

          case 'ldr-light-sensor':
            addWire(mcuInstanceId, getVCC3(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(id, 'AO', mcuInstanceId, nextAnalog(), colors.signal);
            break;

          case 'servo-sg90':
            addWire(mcuInstanceId, getVCC5(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(mcuInstanceId, nextDigital(), id, 'PWM', colors.signal);
            break;

          case 'buzzer-active':
            addWire(mcuInstanceId, nextDigital(), id, 'POS', colors.signal);
            addWire(id, 'NEG', mcuInstanceId, getGND(), colors.ground);
            break;

          case 'led-pack':
            const sigPin = nextDigital();
            addWire(mcuInstanceId, sigPin, id, 'ANODE', colors.signal);
            addWire(id, 'CATHODE', mcuInstanceId, getGND(), colors.ground);
            break;

          case 'oled-096-i2c':
          case 'lcd-1602-i2c':
            addWire(mcuInstanceId, base === 'lcd-1602-i2c' ? getVCC5() : getVCC3(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(mcuInstanceId, i2c.sda, id, 'SDA', colors.i2c1);
            addWire(mcuInstanceId, i2c.scl, id, 'SCL', colors.i2c2);
            break;

          case 'resistors-pack':
            addWire(mcuInstanceId, nextDigital(), id, 'PIN1', colors.signal);
            addWire(id, 'PIN2', mcuInstanceId, getGND(), colors.ground);
            break;

          case 'capacitors-pack':
            addWire(mcuInstanceId, getVCC5(), id, 'CAP+', colors.power);
            addWire(id, 'CAP-', mcuInstanceId, getGND(), colors.ground);
            break;

          case 'inductor-coil':
            addWire(mcuInstanceId, getVCC5(), id, 'IND1', colors.power);
            addWire(id, 'IND2', mcuInstanceId, getVCC3(), colors.signal);
            break;

          case 'antigravity-core':
            addWire(mcuInstanceId, getVCC5(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            const fluxStabId = has('flux-stabilizer');
            if (fluxStabId) {
              addWire(id, 'FLUX_OUT', fluxStabId, 'FLUX_IN', '#00f0ff');
            } else {
              addWire(id, 'FLUX_OUT', mcuInstanceId, nextDigital(), '#00f0ff');
            }
            addWire(id, 'STAB_IN', mcuInstanceId, nextDigital(), '#a855f7');
            break;

          case 'flux-stabilizer':
            addWire(mcuInstanceId, getVCC3(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(id, 'CTRL_OUT', mcuInstanceId, nextDigital(), '#a855f7');
            break;

          case 'quantum-levitator':
            addWire(mcuInstanceId, getVCC5(), id, 'VIN', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            addWire(id, 'LEV_SIG', mcuInstanceId, nextDigital(), '#00f0ff');
            addWire(id, 'SENSE', mcuInstanceId, nextAnalog(), '#38bdf8');
            break;

          default:
            addWire(mcuInstanceId, getVCC3(), id, 'VCC', colors.power);
            addWire(mcuInstanceId, getGND(), id, 'GND', colors.ground);
            break;
        }
      });
    }

    return resultLayout;
  }
};
