/**
 * AETHERIUM AI — QUANTUM INTELLIGENCE SYSTEM
 * Unified Multi-Page Controller & Interactive Engine
 * Three.js • GSAP • Lucide • High-Frequency Telemetry • FastAPI WebSocket Client
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. GLOBAL SYSTEM STATE
     ========================================================================== */
  const state = {
    telemetryMode: 'tokens', // 'tokens' | 'vram' | 'requests'
    timeRange: '24h',
    isStreamingLogs: true,
    activeAgentsCount: 842,
    baseTokensPerSec: 3842910,
    baseLatency: 14.2,
    baseClusterLoad: 86.4,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    wsConnected: false,
    wsRetryTimer: null
  };

  /* ==========================================================================
     2. NAVIGATION & ACTIVE ROUTING
     ========================================================================== */
  function initNavigationRouting() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
        link.classList.remove('text-slate-400');
        link.classList.add('text-slate-200');
      } else if (!href.startsWith('#')) {
        link.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     3. THREE.JS 3D WEBGL HERO CANVAS (Optional per page)
     ========================================================================== */
  let scene, camera, renderer, particleSystem, particleGeometry, particlePositions, particleVelocities;
  let connectionLines, connectionGeometry;
  let quantumPolyhedron, gyroRing1, gyroRing2;
  const canvas = document.getElementById('webgl-canvas');

  function initThreeWebGL() {
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.z = 450;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Swarm
    const maxParticles = 1800;
    particleGeometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(maxParticles * 3);
    particleVelocities = new Float32Array(maxParticles * 3);
    const particleColors = new Float32Array(maxParticles * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const purpleColor = new THREE.Color(0xa855f7);
    const whiteColor = new THREE.Color(0xffffff);

    for (let i = 0; i < maxParticles; i++) {
      const idx = i * 3;
      const radius = 240 + Math.random() * 420;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = radius * Math.cos(phi);

      particleVelocities[idx] = (Math.random() - 0.5) * 0.35;
      particleVelocities[idx + 1] = (Math.random() - 0.5) * 0.35;
      particleVelocities[idx + 2] = (Math.random() - 0.5) * 0.35;

      const rand = Math.random();
      let col = cyanColor;
      if (rand > 0.85) col = whiteColor;
      else if (rand > 0.55) col = purpleColor;

      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const pointMaterial = new THREE.PointsMaterial({
      size: 2.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particleSystem = new THREE.Points(particleGeometry, pointMaterial);
    scene.add(particleSystem);

    // Neural Synapse Connecting Lines
    const maxLines = 1400;
    const linePositions = new Float32Array(maxLines * 6);
    connectionGeometry = new THREE.BufferGeometry();
    connectionGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    connectionLines = new THREE.LineSegments(connectionGeometry, lineMaterial);
    scene.add(connectionLines);

    // Central 3D Quantum Polyhedron Hologram
    const coreGroup = new THREE.Group();
    const icosaGeo = new THREE.IcosahedronGeometry(45, 1);
    const icosaMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    quantumPolyhedron = new THREE.Mesh(icosaGeo, icosaMat);
    coreGroup.add(quantumPolyhedron);

    const ring1Geo = new THREE.TorusGeometry(68, 0.6, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    gyroRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    coreGroup.add(gyroRing1);

    const ring2Geo = new THREE.TorusGeometry(84, 0.6, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending
    });
    gyroRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    gyroRing2.rotation.x = Math.PI / 3;
    coreGroup.add(gyroRing2);

    coreGroup.position.set(240, 20, -50);
    scene.add(coreGroup);

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);

    animateThree();
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    state.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  function animateThree() {
    requestAnimationFrame(animateThree);

    state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.04;
    state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.04;

    camera.position.x = state.mouse.x * 55;
    camera.position.y = state.mouse.y * 35;
    camera.lookAt(scene.position);

    if (quantumPolyhedron) {
      quantumPolyhedron.rotation.x += 0.005;
      quantumPolyhedron.rotation.y += 0.008;
    }
    if (gyroRing1) {
      gyroRing1.rotation.x += 0.007;
      gyroRing1.rotation.y -= 0.009;
    }
    if (gyroRing2) {
      gyroRing2.rotation.y += 0.006;
      gyroRing2.rotation.z += 0.004;
    }

    if (particleSystem) {
      particleSystem.rotation.y += 0.0008;
      particleSystem.rotation.x += 0.0004;

      const positions = particleGeometry.attributes.position.array;
      const count = 1800;

      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        positions[idx] += particleVelocities[idx];
        positions[idx + 1] += particleVelocities[idx + 1];
        positions[idx + 2] += particleVelocities[idx + 2];

        const limit = 500;
        if (Math.abs(positions[idx]) > limit) particleVelocities[idx] *= -1;
        if (Math.abs(positions[idx + 1]) > limit) particleVelocities[idx + 1] *= -1;
        if (Math.abs(positions[idx + 2]) > limit) particleVelocities[idx + 2] *= -1;
      }

      particleGeometry.attributes.position.needsUpdate = true;
      updateSynapseConnections(positions, count);
    }

    renderer.render(scene, camera);
  }

  function updateSynapseConnections(positions, count) {
    if (!connectionLines) return;
    const linePos = connectionGeometry.attributes.position.array;
    let lineIdx = 0;
    const maxLines = 1400;
    const sampleStep = 12;
    const maxDist = 75;

    for (let i = 0; i < count; i += sampleStep) {
      for (let j = i + sampleStep; j < count; j += sampleStep) {
        if (lineIdx >= maxLines * 6) break;

        const i3 = i * 3;
        const j3 = j * 3;
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < maxDist * maxDist) {
          linePos[lineIdx++] = positions[i3];
          linePos[lineIdx++] = positions[i3 + 1];
          linePos[lineIdx++] = positions[i3 + 2];
          linePos[lineIdx++] = positions[j3];
          linePos[lineIdx++] = positions[j3 + 1];
          linePos[lineIdx++] = positions[j3 + 2];
        }
      }
      if (lineIdx >= maxLines * 6) break;
    }

    connectionGeometry.setDrawRange(0, lineIdx / 3);
    connectionGeometry.attributes.position.needsUpdate = true;
  }

  /* ==========================================================================
     4. GSAP ENTRANCES, SPOTLIGHT & STAT COUNTERS
     ========================================================================== */
  function initGSAPAnimations() {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('header', {
        y: -25,
        opacity: 0,
        duration: 0.6
      })
      .from('h1', {
        y: 20,
        opacity: 0,
        duration: 0.7
      }, '-=0.4')
      .from('.glass-panel', {
        y: 25,
        opacity: 0,
        stagger: 0.08,
        duration: 0.75
      }, '-=0.5');

      animateNumberCounter('stat-tokens', 0, state.baseTokensPerSec, 2.0, (v) => Math.round(v).toLocaleString());
      animateNumberCounter('stat-latency', 0, state.baseLatency, 1.6, (v) => v.toFixed(1));
      animateNumberCounter('stat-load', 0, state.baseClusterLoad, 1.8, (v) => v.toFixed(1));
      animateNumberCounter('stat-agents', 0, state.activeAgentsCount, 1.5, (v) => Math.round(v).toString());
    }

    document.querySelectorAll('.glass-panel').forEach((panel) => {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        panel.style.setProperty('--mouse-x', `${x}px`);
        panel.style.setProperty('--mouse-y', `${y}px`);
      });
      panel.addEventListener('mouseleave', () => {
        panel.style.setProperty('--mouse-x', `-500px`);
        panel.style.setProperty('--mouse-y', `-500px`);
      });
    });
  }

  function animateNumberCounter(id, start, end, duration, formatter) {
    const el = document.getElementById(id);
    if (!el || typeof gsap === 'undefined') return;
    const obj = { val: start };
    gsap.to(obj, {
      val: end,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.innerText = formatter(obj.val);
      }
    });
  }

  /* ==========================================================================
     5. TELEMETRY CANVAS CHART (DASHBOARD)
     ========================================================================== */
  const telemetryCanvas = document.getElementById('telemetry-canvas');
  let tCtx, tWidth, tHeight;
  const historyPoints = 48;
  let telemetryData = [];

  function initTelemetryChart() {
    if (!telemetryCanvas) return;
    tCtx = telemetryCanvas.getContext('2d');

    for (let i = 0; i < historyPoints; i++) {
      telemetryData.push(generateSampleMetric(state.telemetryMode));
    }

    resizeTelemetryCanvas();
    window.addEventListener('resize', resizeTelemetryCanvas);

    // Fallback simulation timer (used if WebSocket is offline)
    setInterval(() => {
      if (!state.wsConnected) {
        streamTelemetryTick();
      }
    }, 200);

    renderTelemetryChart();

    telemetryCanvas.addEventListener('mousemove', onChartHover);
    telemetryCanvas.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('chart-tooltip');
      if (tooltip) tooltip.classList.add('hidden');
    });
  }

  function resizeTelemetryCanvas() {
    if (!telemetryCanvas) return;
    const rect = telemetryCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    tWidth = rect.width;
    tHeight = rect.height;
    telemetryCanvas.width = tWidth * dpr;
    telemetryCanvas.height = tHeight * dpr;
    tCtx.scale(dpr, dpr);
  }

  function generateSampleMetric(mode) {
    const variance = (Math.random() - 0.5);
    if (mode === 'tokens') {
      return state.baseTokensPerSec * (1 + variance * 0.16);
    } else if (mode === 'vram') {
      return 5.12 + variance * 0.42;
    } else {
      return 1420 + variance * 260;
    }
  }

  function streamTelemetryTick() {
    telemetryData.shift();
    telemetryData.push(generateSampleMetric(state.telemetryMode));
  }

  function renderTelemetryChart() {
    requestAnimationFrame(renderTelemetryChart);
    if (!tCtx || !tWidth || !tHeight) return;

    tCtx.clearRect(0, 0, tWidth, tHeight);

    // Grid lines
    tCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    tCtx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 1; i < gridLines; i++) {
      const y = (tHeight / gridLines) * i;
      tCtx.beginPath();
      tCtx.moveTo(0, y);
      tCtx.lineTo(tWidth, y);
      tCtx.stroke();
    }

    const minVal = Math.min(...telemetryData) * 0.92;
    const maxVal = Math.max(...telemetryData) * 1.08;
    const range = maxVal - minVal || 1;

    const points = [];
    const stepX = tWidth / (historyPoints - 1);
    for (let i = 0; i < historyPoints; i++) {
      const x = i * stepX;
      const normalized = (telemetryData[i] - minVal) / range;
      const y = tHeight - normalized * (tHeight * 0.78) - 15;
      points.push({ x, y });
    }

    // Gradient fill
    const grad = tCtx.createLinearGradient(0, 0, 0, tHeight);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    grad.addColorStop(0.6, 'rgba(168, 85, 247, 0.1)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');

    tCtx.beginPath();
    tCtx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      tCtx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    tCtx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    tCtx.lineTo(tWidth, tHeight);
    tCtx.lineTo(0, tHeight);
    tCtx.closePath();
    tCtx.fillStyle = grad;
    tCtx.fill();

    // Glowing Stroke
    tCtx.beginPath();
    tCtx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      tCtx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    tCtx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    tCtx.strokeStyle = '#00f0ff';
    tCtx.lineWidth = 2.4;
    tCtx.shadowColor = '#00f0ff';
    tCtx.shadowBlur = 10;
    tCtx.stroke();
    tCtx.shadowBlur = 0;

    // Pulse dot
    const latest = points[points.length - 1];
    tCtx.beginPath();
    tCtx.arc(latest.x - 2, latest.y, 4, 0, Math.PI * 2);
    tCtx.fillStyle = '#ffffff';
    tCtx.shadowColor = '#00f0ff';
    tCtx.shadowBlur = 12;
    tCtx.fill();
    tCtx.shadowBlur = 0;
  }

  function onChartHover(e) {
    const tooltip = document.getElementById('chart-tooltip');
    if (!tooltip || !telemetryCanvas) return;

    const rect = telemetryCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const stepX = tWidth / (historyPoints - 1);
    const index = Math.min(Math.max(0, Math.round(mouseX / stepX)), historyPoints - 1);
    const val = telemetryData[index];

    tooltip.classList.remove('hidden');
    tooltip.style.left = `${Math.min(mouseX + 12, rect.width - 160)}px`;
    tooltip.style.top = `24px`;

    const now = new Date();
    const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`;
    
    document.getElementById('tooltip-time').innerText = timeStr;
    const valEl = document.getElementById('tooltip-value');

    if (state.telemetryMode === 'tokens') {
      valEl.innerText = `${Math.round(val).toLocaleString()} tokens/s`;
      valEl.className = 'text-brand-cyan font-bold text-sm';
    } else if (state.telemetryMode === 'vram') {
      valEl.innerText = `${val.toFixed(2)} TB Allocated`;
      valEl.className = 'text-brand-purple font-bold text-sm';
    } else {
      valEl.innerText = `${Math.round(val).toLocaleString()} req/sec`;
      valEl.className = 'text-brand-emerald font-bold text-sm';
    }
  }

  /* ==========================================================================
     6. FASTAPI WEBSOCKET TELEMETRY CLIENT (/ws/telemetry)
     ========================================================================== */
  let socket = null;

  function initTelemetryWebSocket() {
    // Only connect on dashboard or index pages where telemetry is active
    if (!document.getElementById('stat-tokens') && !document.getElementById('telemetry-canvas')) {
      return;
    }

    const wsUrl = 'ws://localhost:8000/ws/telemetry';

    try {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        state.wsConnected = true;
        console.log('[Aetherium AI] Connected to live WebSocket telemetry stream at', wsUrl);
        
        const statusText = document.getElementById('cluster-status-text');
        const pulseDot = document.getElementById('cluster-pulse-dot');
        if (statusText) statusText.innerText = 'WS Live (Port 8000)';
        if (pulseDot) pulseDot.className = 'w-2 h-2 rounded-full bg-brand-cyan animate-ping';

        showToast('WebSocket Live Link', 'Streaming 1Hz harmonic telemetry from FastAPI backend.');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleLiveTelemetryUpdate(data);
        } catch (err) {
          console.warn('[Aetherium WS] Failed to parse telemetry packet:', err);
        }
      };

      socket.onerror = () => {
        state.wsConnected = false;
      };

      socket.onclose = () => {
        state.wsConnected = false;
        const statusText = document.getElementById('cluster-status-text');
        const pulseDot = document.getElementById('cluster-pulse-dot');
        if (statusText) statusText.innerText = 'US-East-1 Nominal';
        if (pulseDot) pulseDot.className = 'w-2 h-2 rounded-full bg-brand-emerald animate-pulse';

        // Schedule clean auto-reconnection attempt
        clearTimeout(state.wsRetryTimer);
        state.wsRetryTimer = setTimeout(initTelemetryWebSocket, 4000);
      };
    } catch (e) {
      state.wsConnected = false;
      clearTimeout(state.wsRetryTimer);
      state.wsRetryTimer = setTimeout(initTelemetryWebSocket, 5000);
    }
  }

  function handleLiveTelemetryUpdate(data) {
    // 1. Update Token Throughput
    if (data.token_throughput !== undefined) {
      state.baseTokensPerSec = data.token_throughput;
      const tokenEl = document.getElementById('stat-tokens');
      if (tokenEl) {
        tokenEl.innerText = Math.round(data.token_throughput).toLocaleString();
      }
    }

    // 2. Update Latency
    if (data.latency_ms !== undefined) {
      state.baseLatency = data.latency_ms;
      const latEl = document.getElementById('stat-latency');
      if (latEl) latEl.innerText = data.latency_ms.toFixed(1);

      const headerLat = document.getElementById('header-latency');
      if (headerLat) headerLat.innerText = `${data.latency_ms.toFixed(1)} ms`;
    }

    // 3. Update Compute Load
    if (data.compute_load !== undefined) {
      state.baseClusterLoad = data.compute_load;
      const loadEl = document.getElementById('stat-load');
      if (loadEl) loadEl.innerText = data.compute_load.toFixed(1);
    }

    // 4. Update Active Swarms
    if (data.active_swarms !== undefined) {
      state.activeAgentsCount = data.active_swarms;
      const agentsEl = document.getElementById('stat-agents');
      if (agentsEl) agentsEl.innerText = data.active_swarms.toString();
    }

    // 5. Update Waveform Chart Data
    if (telemetryData.length >= historyPoints) {
      telemetryData.shift();
      if (state.telemetryMode === 'tokens') {
        telemetryData.push(data.token_throughput);
      } else if (state.telemetryMode === 'vram') {
        const vramVal = 5.12 + (data.sine_wave_point * 0.4);
        telemetryData.push(vramVal);
      } else {
        const reqVal = 1420 + Math.round(data.sine_wave_point * 260);
        telemetryData.push(reqVal);
      }
    }

    // 6. Update GPU Nodes
    if (data.gpu_nodes && Array.isArray(data.gpu_nodes)) {
      updateGpuTelemetryFromBackend(data.gpu_nodes);
    }
  }

  function updateGpuTelemetryFromBackend(nodes) {
    const container = document.getElementById('gpu-grid');
    if (!container) return;

    nodes.forEach((node, idx) => {
      if (gpus[idx]) {
        gpus[idx].temp = Math.round(node.temp);
        gpus[idx].util = Math.round(node.util);
        gpus[idx].vram = node.vram_gb;
        gpus[idx].watts = node.watts;
      }
    });

    renderGpuMatrix();
  }

  /* ==========================================================================
     7. HARDWARE RACK TELEMETRY (DASHBOARD)
     ========================================================================== */
  const gpus = [
    { id: 0, name: 'H100-0', vram: 74.2, temp: 47, util: 92, watts: 410 },
    { id: 1, name: 'H100-1', vram: 68.8, temp: 49, util: 88, watts: 395 },
    { id: 2, name: 'H100-2', vram: 76.4, temp: 52, util: 96, watts: 435 },
    { id: 3, name: 'H100-3', vram: 71.0, temp: 46, util: 84, watts: 380 },
    { id: 4, name: 'H100-4', vram: 69.5, temp: 48, util: 87, watts: 390 },
    { id: 5, name: 'H100-5', vram: 75.8, temp: 51, util: 94, watts: 425 },
    { id: 6, name: 'H100-6', vram: 73.1, temp: 50, util: 91, watts: 415 },
    { id: 7, name: 'H100-7', vram: 67.4, temp: 45, util: 82, watts: 370 }
  ];

  function renderGpuMatrix() {
    const container = document.getElementById('gpu-grid');
    if (!container) return;
    container.innerHTML = '';

    gpus.forEach((gpu) => {
      const vramPercent = ((gpu.vram / 80) * 100).toFixed(0);
      const card = document.createElement('div');
      card.className = 'p-3 rounded-xl bg-brand-dark border border-brand-border text-xs font-mono flex flex-col justify-between hover:border-brand-emerald/40 transition';
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-200">${gpu.name}</span>
          <span class="text-[10px] text-brand-emerald font-semibold">${gpu.temp}°C</span>
        </div>
        <div class="my-2.5">
          <div class="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>VRAM</span>
            <span class="text-slate-300">${gpu.vram} / 80GB</span>
          </div>
          <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div class="progress-fill h-full rounded-full bg-gradient-to-r from-brand-cyan to-brand-emerald" style="width: ${vramPercent}%"></div>
          </div>
        </div>
        <div class="flex items-center justify-between text-[10px] text-slate-400">
          <span>${gpu.watts}W</span>
          <span class="text-brand-cyan font-semibold">${gpu.util}% LOAD</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ==========================================================================
     8. EVENT LOG BUS (DASHBOARD)
     ========================================================================== */
  const eventTemplates = [
    { tag: 'ROUTER', color: 'text-brand-cyan', msg: 'Speculative decoding batch #8921 synchronized across 4 nodes (18.2ms TTFT)' },
    { tag: 'SWARM', color: 'text-brand-purple', msg: 'Swarm-Nexus-44 completed zero-day fuzzing on contract #9042 with 0 anomalies' },
    { tag: 'CUDA', color: 'text-brand-emerald', msg: 'NVLink 900 GB/s cross-chassis mesh rebalance complete with zero packet drop' },
    { tag: 'QUANTUM', color: 'text-brand-cyan', msg: 'KV-Cache dynamic sparsity pruned 38.4% redundant attention heads' },
    { tag: 'INFER', color: 'text-amber-400', msg: 'High-throughput stream request burst handled: +420k t/s spike absorbed' },
    { tag: 'SECURITY', color: 'text-slate-300', msg: 'mTLS handshake renewed for tenant sovereign: cluster-alpha-virginia' }
  ];

  function initTerminalLogs() {
    const terminal = document.getElementById('terminal-body');
    if (!terminal) return;

    for (let i = 0; i < 6; i++) {
      appendTerminalLog(eventTemplates[i % eventTemplates.length], false);
    }

    setInterval(() => {
      if (!state.isStreamingLogs) return;
      const ev = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
      appendTerminalLog(ev, true);
    }, 2400);
  }

  function appendTerminalLog(ev, autoScroll) {
    const terminal = document.getElementById('terminal-body');
    if (!terminal) return;

    const now = new Date();
    const time = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}.${String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0')}`;

    const logRow = document.createElement('div');
    logRow.className = 'flex items-start gap-2 leading-relaxed';
    logRow.innerHTML = `
      <span class="text-slate-500 shrink-0 select-none">${time}</span>
      <span class="font-bold ${ev.color} shrink-0">[${ev.tag}]</span>
      <span class="text-slate-300">${ev.msg}</span>
    `;

    terminal.appendChild(logRow);

    if (terminal.children.length > 60) {
      terminal.removeChild(terminal.children[0]);
    }

    if (autoScroll) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }

  /* ==========================================================================
     9. AGENT SWARMS WORKFLOW MATRIX & FASTAPI REST INTEGRATION (/api/agent/run)
     ========================================================================== */
  const initialSwarms = [
    {
      id: 'atlas',
      name: 'Swarm-Atlas-09',
      task: 'MoE Multimodal Embeddings Synthesis & Tensor Alignment',
      model: 'Aether-Omni-Ultra',
      status: 'running',
      progress: 78,
      threads: 16,
      vram: '40 GB'
    },
    {
      id: 'nexus',
      name: 'Swarm-Nexus-44',
      task: 'Autonomous Zero-Day Fuzzing & Static Analysis Matrix',
      model: 'Aether-Coder-MoE',
      status: 'completed',
      progress: 100,
      threads: 32,
      vram: '64 GB'
    },
    {
      id: 'vortex',
      name: 'Swarm-Vortex-12',
      task: 'Dynamic LoRA Adapter Optimization on 70B MoE',
      model: 'Aether-Quantum-70B',
      status: 'running',
      progress: 46,
      threads: 24,
      vram: '48 GB'
    },
    {
      id: 'chronos',
      name: 'Swarm-Chronos-01',
      task: 'KV-Cache Predictive Eviction & Speculative Trees',
      model: 'Aether-Omni-Ultra',
      status: 'running',
      progress: 92,
      threads: 12,
      vram: '32 GB'
    },
    {
      id: 'aegis',
      name: 'Swarm-Aegis-19',
      task: 'Formal Verification of Distributed Smart Contracts',
      model: 'Aether-Coder-MoE',
      status: 'completed',
      progress: 100,
      threads: 16,
      vram: '24 GB'
    },
    {
      id: 'solaris',
      name: 'Swarm-Solaris-33',
      task: 'Autonomous Hardware Thermal Rebalance & P-State Lock',
      model: 'Aether-Quantum-70B',
      status: 'running',
      progress: 64,
      threads: 8,
      vram: '16 GB'
    }
  ];

  let swarmsData = [...initialSwarms];
  let currentFilter = 'all';
  let searchQuery = '';

  function renderSwarmsGrid() {
    const container = document.getElementById('swarms-grid');
    if (!container) return;

    container.innerHTML = '';

    const filtered = swarmsData.filter((swarm) => {
      const matchesFilter = currentFilter === 'all' || swarm.status === currentFilter;
      const matchesSearch = searchQuery === '' || 
        swarm.name.toLowerCase().includes(searchQuery) || 
        swarm.task.toLowerCase().includes(searchQuery) ||
        swarm.model.toLowerCase().includes(searchQuery);
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center text-slate-400 font-mono text-xs">
          No agent swarms matching criteria. Try clearing search filters or create a new swarm.
        </div>
      `;
      return;
    }

    filtered.forEach((swarm) => {
      const isComplete = swarm.status === 'completed';
      const statusColor = isComplete ? 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30' : 'text-brand-purple bg-brand-purple/10 border-brand-purple/30';
      const statusText = isComplete ? 'COMPLETED' : 'RUNNING';
      const barColor = isComplete ? 'bg-brand-emerald' : 'bg-gradient-to-r from-brand-purple to-brand-cyan';

      const card = document.createElement('div');
      card.className = 'glass-panel p-6 flex flex-col justify-between hover:border-brand-purple/50 transition';
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="font-bold text-sm text-white font-mono flex items-center gap-2">
              <span class="w-2 h-2 rounded-full ${isComplete ? 'bg-brand-emerald' : 'bg-brand-purple animate-pulse'}"></span>
              ${swarm.name}
            </span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded border ${statusColor} font-semibold">
              ${statusText}
            </span>
          </div>
          
          <p class="text-xs text-slate-300 leading-relaxed min-h-[36px]">${swarm.task}</p>
          
          <div class="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Model:</span>
            <span class="text-white">${swarm.model}</span>
          </div>

          <!-- Progress Bar -->
          <div class="my-4">
            <div class="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
              <span>Execution Progress</span>
              <span class="text-white font-bold">${swarm.progress}%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div class="progress-fill h-full rounded-full ${barColor}" style="width: ${swarm.progress}%"></div>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-brand-border flex items-center justify-between text-xs font-mono">
          <span class="text-slate-400">${swarm.threads} Threads • ${swarm.vram}</span>
          <button class="inspect-btn text-brand-cyan hover:underline font-semibold" data-id="${swarm.id}" data-name="${swarm.name}">
            Inspect →
          </button>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.inspect-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const titleEl = document.getElementById('inspector-swarm-title');
        const name = btn.getAttribute('data-name');
        if (titleEl) titleEl.innerText = name;
        showToast('Inspector Focused', `Viewing real-time DAG telemetry for ${name}.`);
      });
    });

    if (window.lucide) lucide.createIcons({ root: container });
  }

  /* Async call to FastAPI /api/agent/run */
  async function dispatchAgentToBackend(newSwarm) {
    const stream = document.getElementById('inspector-stream');
    const apiUrl = 'http://localhost:8000/api/agent/run';

    if (stream) {
      const p = document.createElement('p');
      p.className = 'text-brand-cyan font-bold';
      p.innerText = `[${new Date().toLocaleTimeString()}] Submitting swarm to FastAPI backend (${apiUrl})...`;
      stream.appendChild(p);
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: newSwarm.task,
          model: newSwarm.model,
          threads: newSwarm.threads,
          swarm_name: newSwarm.name
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Output each step in inspector terminal
        if (stream && result.steps) {
          result.steps.forEach((step) => {
            const row = document.createElement('p');
            row.className = 'text-slate-300';
            row.innerHTML = `<span class="text-brand-purple font-semibold">[${step.stage}]</span> ${step.message} <span class="text-slate-500 font-mono">(${step.duration_ms}ms)</span>`;
            stream.appendChild(row);
          });

          const summary = document.createElement('p');
          summary.className = 'text-brand-emerald font-bold';
          summary.innerText = `[RESULT] ${result.consensus_summary} (${result.tokens_generated} tokens @ ${result.throughput_tokens_per_sec} t/s)`;
          stream.appendChild(summary);
          stream.scrollTop = stream.scrollHeight;
        }

        // Complete the swarm card
        newSwarm.progress = 100;
        newSwarm.status = 'completed';
        renderSwarmsGrid();
        showToast('Swarm Execution Complete', `Backend verified consensus in ${result.execution_time_ms}ms.`);
      } else {
        fallbackLocalSwarmSimulation(newSwarm);
      }
    } catch (error) {
      // Backend offline fallback
      fallbackLocalSwarmSimulation(newSwarm);
    }
  }

  function fallbackLocalSwarmSimulation(newSwarm) {
    let prog = newSwarm.progress;
    const interval = setInterval(() => {
      prog += Math.floor(Math.random() * 15) + 5;
      if (prog >= 100) {
        prog = 100;
        newSwarm.progress = 100;
        newSwarm.status = 'completed';
        clearInterval(interval);
        renderSwarmsGrid();
        showToast('Swarm Execution Complete', `${newSwarm.name} achieved formal verification.`);
      } else {
        newSwarm.progress = prog;
        renderSwarmsGrid();
      }
    }, 600);
  }

  /* ==========================================================================
     10. TOAST NOTIFICATIONS & MODALS
     ========================================================================== */
  function showToast(title, description) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto p-4 rounded-xl bg-brand-dark/95 border border-brand-cyan/40 shadow-2xl backdrop-blur-xl text-xs font-mono text-white flex items-start gap-3 w-80 transform translate-y-6 opacity-0 transition-all duration-300';
    toast.innerHTML = `
      <div class="p-1.5 rounded-lg bg-brand-cyan/15 text-brand-cyan shrink-0">
        <i data-lucide="info" class="w-4 h-4"></i>
      </div>
      <div class="flex-1">
        <p class="font-bold text-white text-xs">${title}</p>
        <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${description}</p>
      </div>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons({ root: toast });

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-6', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  }

  function initAgentsModal() {
    const openBtn = document.getElementById('open-create-swarm-btn');
    const closeBtn = document.getElementById('close-swarm-modal-btn');
    const cancelBtn = document.getElementById('cancel-swarm-btn');
    const confirmBtn = document.getElementById('deploy-swarm-confirm-btn');
    const modal = document.getElementById('create-swarm-modal');
    const slider = document.getElementById('worker-slider');
    const sliderVal = document.getElementById('worker-count-val');

    if (slider && sliderVal) {
      slider.addEventListener('input', (e) => {
        sliderVal.innerText = `${e.target.value} Threads`;
      });
    }

    function openModal() {
      if (!modal) return;
      modal.classList.remove('hidden');
      setTimeout(() => modal.classList.remove('opacity-0'), 10);
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.add('opacity-0');
      setTimeout(() => modal.classList.add('hidden'), 200);
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const nameInput = document.getElementById('new-swarm-name');
        const objInput = document.getElementById('new-swarm-objective');
        const modelSelect = document.getElementById('new-swarm-model');

        const newSwarm = {
          id: `swarm-${Date.now()}`,
          name: nameInput.value || 'Swarm-Titan-01',
          task: objInput.value || 'Speculative distributed reasoning on multimodal graphs.',
          model: modelSelect.value || 'Aether-Omni-Ultra',
          status: 'running',
          progress: 10,
          threads: slider ? parseInt(slider.value) : 16,
          vram: '32 GB'
        };

        swarmsData.unshift(newSwarm);
        state.activeAgentsCount++;
        const totalCountEl = document.getElementById('swarm-total-count');
        if (totalCountEl) totalCountEl.innerText = state.activeAgentsCount;

        renderSwarmsGrid();
        closeModal();
        showToast('Swarm Initializing', `${newSwarm.name} dispatched to cluster.`);

        // Dispatch to FastAPI backend
        dispatchAgentToBackend(newSwarm);
      });
    }

    // Step Advancement Demo
    const advanceStepBtn = document.getElementById('trigger-pipeline-step-btn');
    if (advanceStepBtn) {
      advanceStepBtn.addEventListener('click', () => {
        const stream = document.getElementById('inspector-stream');
        if (stream) {
          const now = new Date();
          const time = `${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
          const p = document.createElement('p');
          p.className = 'text-brand-emerald';
          p.innerText = `[${time}.82] Formal verification passed. Zero state divergence across all ranks.`;
          stream.appendChild(p);
          stream.scrollTop = stream.scrollHeight;
          showToast('Stage Advanced', 'Multi-agent consensus verified formal proof.');
        }
      });
    }
  }

  /* ==========================================================================
     11. DASHBOARD CONTROLS & EVENT LISTENERS
     ========================================================================== */
  function setupDashboardListeners() {
    // Mode toggles
    document.querySelectorAll('.telemetry-mode-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.telemetry-mode-btn').forEach((b) => {
          b.classList.remove('active', 'bg-brand-cyan/20', 'text-brand-cyan', 'border', 'border-brand-cyan/30', 'font-semibold');
          b.classList.add('text-slate-400');
        });
        btn.classList.add('active', 'bg-brand-cyan/20', 'text-brand-cyan', 'border', 'border-brand-cyan/30', 'font-semibold');
        btn.classList.remove('text-slate-400');

        state.telemetryMode = btn.getAttribute('data-mode');
        telemetryData = [];
        for (let i = 0; i < historyPoints; i++) {
          telemetryData.push(generateSampleMetric(state.telemetryMode));
        }
      });
    });

    // Time range toggles
    document.querySelectorAll('.time-range-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-range-btn').forEach((b) => {
          b.classList.remove('active', 'bg-brand-cyan/20', 'text-brand-cyan', 'font-semibold', 'border', 'border-brand-cyan/40');
          b.classList.add('text-slate-400');
        });
        btn.classList.add('active', 'bg-brand-cyan/20', 'text-brand-cyan', 'font-semibold', 'border', 'border-brand-cyan/40');
        btn.classList.remove('text-slate-400');

        state.timeRange = btn.getAttribute('data-range');
        showToast('Window Filter Applied', `Showing telemetry metrics for ${state.timeRange.toUpperCase()}.`);
      });
    });

    // Quick refresh
    const refreshBtn = document.getElementById('quick-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(refreshBtn.querySelector('i'), {
            rotation: '+=360',
            duration: 0.6,
            ease: 'power2.inOut'
          });
        }
        showToast('Stream Resynchronized', 'Fetched latest telemetry packets from 64 H100 nodes.');
      });
    }

    // Toggle stream pause
    const toggleStreamBtn = document.getElementById('toggle-stream-btn');
    if (toggleStreamBtn) {
      toggleStreamBtn.addEventListener('click', () => {
        state.isStreamingLogs = !state.isStreamingLogs;
        toggleStreamBtn.innerText = state.isStreamingLogs ? 'Pause' : 'Resume';
      });
    }

    // Clear logs
    const clearLogsBtn = document.getElementById('clear-logs-btn');
    if (clearLogsBtn) {
      clearLogsBtn.addEventListener('click', () => {
        const terminal = document.getElementById('terminal-body');
        if (terminal) {
          terminal.innerHTML = '<div class="text-slate-500 font-mono text-xs italic">Log stream cleared by administrator.</div>';
          showToast('Logs Purged', 'Event bus buffer successfully cleared.');
        }
      });
    }

    // Swarm Search & Filter (Agents Page)
    const searchInput = document.getElementById('swarm-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderSwarmsGrid();
      });
    }

    document.querySelectorAll('.swarm-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.swarm-filter-btn').forEach((b) => {
          b.classList.remove('active', 'bg-brand-purple/20', 'text-brand-purple', 'border', 'border-brand-purple/40', 'font-semibold');
          b.classList.add('text-slate-400');
        });
        btn.classList.add('active', 'bg-brand-purple/20', 'text-brand-purple', 'border', 'border-brand-purple/40', 'font-semibold');
        btn.classList.remove('text-slate-400');

        currentFilter = btn.getAttribute('data-status');
        renderSwarmsGrid();
      });
    });
  }

  /* ==========================================================================
     12. INTERACTIVE SWARM PROMPT TERMINAL (AGENTS PAGE)
     ========================================================================== */
  function initSwarmPromptTerminal() {
    const dispatchBtn = document.getElementById('dispatch-prompt-btn');
    const promptInput = document.getElementById('terminal-prompt-input');
    const swarmSelect = document.getElementById('terminal-swarm-select');
    const modelSelect = document.getElementById('terminal-model-select');
    const threadsSelect = document.getElementById('terminal-threads-select');
    const consoleStream = document.getElementById('prompt-console-stream');
    const consoleLatency = document.getElementById('console-latency');
    const consoleTokens = document.getElementById('console-tokens');
    const clearConsoleBtn = document.getElementById('clear-console-btn');

    // Clear console output
    if (clearConsoleBtn && consoleStream) {
      clearConsoleBtn.addEventListener('click', () => {
        consoleStream.innerHTML = '<div class="text-slate-500 italic">Console output purged by operator. Ready for next prompt.</div>';
        if (consoleLatency) consoleLatency.innerText = 'Duration: 0.0ms';
        if (consoleTokens) consoleTokens.innerText = '0 Tokens';
      });
    }

    // Preset prompt chips
    document.querySelectorAll('.terminal-preset-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const p = chip.getAttribute('data-prompt');
        if (promptInput && p) {
          promptInput.value = p;
          promptInput.focus();
        }
      });
    });

    if (!dispatchBtn) return;

    dispatchBtn.addEventListener('click', async () => {
      const promptText = (promptInput && promptInput.value.trim()) || 'Execute Byzantine fault-tolerant consensus across 100k nodes';
      const swarmName = (swarmSelect && swarmSelect.value) || 'Swarm-Atlas-09';
      const model = (modelSelect && modelSelect.value) || 'Aether-Omni-Ultra';
      const threads = (threadsSelect && parseInt(threadsSelect.value)) || 16;

      if (!consoleStream) return;

      // Reset Console view
      consoleStream.innerHTML = '';
      const startMsg = document.createElement('div');
      startMsg.className = 'text-brand-cyan flex items-center gap-2 font-bold mb-2';
      startMsg.innerHTML = `<span class="w-2 h-2 rounded-full bg-brand-cyan animate-ping"></span> [POST http://localhost:8000/api/agent/run] Dispatched task to ${swarmName}...`;
      consoleStream.appendChild(startMsg);

      dispatchBtn.disabled = true;
      dispatchBtn.classList.add('opacity-50', 'pointer-events-none');

      const startTime = performance.now();

      try {
        const response = await fetch('http://localhost:8000/api/agent/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: promptText,
            model: model,
            threads: threads,
            swarm_name: swarmName
          })
        });

        if (response.ok) {
          const result = await response.json();

          // Stream lines dynamically with staged delays
          let delay = 100;
          result.steps.forEach((step, idx) => {
            setTimeout(() => {
              const line = document.createElement('div');
              line.className = 'log-step-enter flex items-start gap-2 text-slate-300';
              line.innerHTML = `
                <span class="text-slate-500 shrink-0">[${idx + 1}/5]</span>
                <span class="text-brand-purple font-semibold shrink-0">[${step.stage}]</span>
                <span class="flex-1">${step.message}</span>
                <span class="text-slate-500 font-mono text-[10px] shrink-0">+${step.duration_ms}ms</span>
              `;
              consoleStream.appendChild(line);
              consoleStream.scrollTop = consoleStream.scrollHeight;
            }, delay);
            delay += 160;
          });

          // Final summary block
          setTimeout(() => {
            const resLine = document.createElement('div');
            resLine.className = 'log-step-enter mt-3 p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-bold';
            resLine.innerHTML = `
              <div class="flex items-center justify-between text-xs">
                <span>STATUS: ${result.status.toUpperCase()}</span>
                <span>Tokens: ${result.tokens_generated} @ ${result.throughput_tokens_per_sec} t/s</span>
              </div>
              <p class="text-white text-xs mt-1 font-sans font-normal">${result.consensus_summary}</p>
            `;
            consoleStream.appendChild(resLine);
            consoleStream.scrollTop = consoleStream.scrollHeight;

            if (consoleLatency) consoleLatency.innerText = `Duration: ${result.execution_time_ms}ms`;
            if (consoleTokens) consoleTokens.innerText = `${result.tokens_generated} Tokens`;

            showToast('Swarm Execution Verified', `${swarmName} completed reasoning in ${result.execution_time_ms}ms.`);
            dispatchBtn.disabled = false;
            dispatchBtn.classList.remove('opacity-50', 'pointer-events-none');
          }, delay + 100);

        } else {
          throw new Error('Backend returned non-200');
        }
      } catch (err) {
        // Fallback simulation if backend offline
        const steps = [
          { stage: "Stage 01: Initializing Swarm", message: `Allocating 32GB KV-cache across ${threads} worker ranks on Hopper nodes.`, ms: 2.4 },
          { stage: "Stage 02: Prompt Decomposition", message: `MoE gate router partitioned prompt into 4 sub-tasks for model ${model}.`, ms: 4.8 },
          { stage: "Stage 03: Speculative Decoding", message: "FlashAttention-3 draft tree expanded to depth 6. Hit ratio: 95.8%.", ms: 12.6 },
          { stage: "Stage 04: Byzantine Consensus", message: "Multi-agent debate quorum achieved consensus. State divergence: 0.0009.", ms: 6.8 },
          { stage: "Stage 05: Formal Verification", message: "Zero-day security scan & mathematical proof validation passed.", ms: 4.6 }
        ];

        let delay = 100;
        steps.forEach((step, idx) => {
          setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'log-step-enter flex items-start gap-2 text-slate-300';
            line.innerHTML = `
              <span class="text-slate-500 shrink-0">[${idx + 1}/5]</span>
              <span class="text-brand-purple font-semibold shrink-0">[${step.stage}]</span>
              <span class="flex-1">${step.message}</span>
              <span class="text-slate-500 font-mono text-[10px] shrink-0">+${step.ms}ms</span>
            `;
            consoleStream.appendChild(line);
            consoleStream.scrollTop = consoleStream.scrollHeight;
          }, delay);
          delay += 160;
        });

        setTimeout(() => {
          const totalDuration = (performance.now() - startTime).toFixed(1);
          const resLine = document.createElement('div');
          resLine.className = 'log-step-enter mt-3 p-3 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald font-bold';
          resLine.innerHTML = `
            <div class="flex items-center justify-between text-xs">
              <span>STATUS: COMPLETED (LOCAL CLIENT SIMULATION)</span>
              <span>Tokens: 248 @ 182.4 t/s</span>
            </div>
            <p class="text-white text-xs mt-1 font-sans font-normal">Synthesized verified output with 99.4% confidence across ${threads} ranks.</p>
          `;
          consoleStream.appendChild(resLine);
          consoleStream.scrollTop = consoleStream.scrollHeight;

          if (consoleLatency) consoleLatency.innerText = `Duration: ${totalDuration}ms`;
          if (consoleTokens) consoleTokens.innerText = `248 Tokens`;

          showToast('Swarm Execution Verified', `${swarmName} completed reasoning task.`);
          dispatchBtn.disabled = false;
          dispatchBtn.classList.remove('opacity-50', 'pointer-events-none');
        }, delay + 100);
      }
    });
  }

  /* ==========================================================================
     13. ARCHITECTURE INTERACTIVE NODE INSPECTOR
     ========================================================================== */
  function initArchitectureInspector() {
    const nodes = document.querySelectorAll('.arch-node');
    if (nodes.length === 0) return;

    const nodeData = {
      client: {
        title: "Client Edge Application (Node 01)",
        subtitle: "Web UI, Python SDK, and gRPC Ingress Endpoints",
        tag: "HTTP/2 • MTLS 1.3",
        desc: "Client interfaces initiate agent swarms, stream live telemetry over WebSockets, and invoke speculative generation APIs. Requests authenticate through mutual TLS with zero-knowledge token proofs.",
        specs: [
          "WebSocket 1.0 Hz bidirectional telemetry packet ingestion",
          "Protobuf gRPC and REST JSON asynchronous multiplexing",
          "Sub-millisecond connection keep-alive with client-side connection pooling"
        ],
        metrics: {
          "Ingress Concurrency": "128k active connections",
          "Auth Latency": "< 0.4 ms verify",
          "TLS Handshake": "TLS 1.3 0-RTT"
        },
        icon: "laptop"
      },
      gateway: {
        title: "FastAPI Sovereign Gateway (Node 02)",
        subtitle: "Asynchronous ASGI Ingress & Mixture-of-Experts Router",
        tag: "UVICORN ASGI • EPOLL",
        desc: "High-performance Python FastAPI server mounted on Uvicorn ASGI workers. Decomposes high-level natural language prompts into parallel sub-tasks and directs specialized expert attention heads across the Hopper GPU fabric.",
        specs: [
          "Dynamic token-bucket rate limiting and Byzantine quorum arbitration",
          "Zero-copy serialization with Pydantic V2 Rust core models",
          "Non-blocking asynchronous event loop with Kafka partition dispatch"
        ],
        metrics: {
          "Internal Overhead": "< 0.8 ms Gateway",
          "Throughput Capacity": "45,000 req/sec",
          "Memory Footprint": "240 MB per worker"
        },
        icon: "network"
      },
      websocket: {
        title: "WebSocket Telemetry Engine (Node 03)",
        subtitle: "High-Frequency Harmonic Event Stream & Observability",
        tag: "1.0 HZ HARMONIC BROADCAST",
        desc: "Dedicated real-time telemetry broadcaster broadcasting physical sensor readings, token velocity waveforms, cluster temperatures, and swarm task percentages to connected dashboard clients at 1Hz.",
        specs: [
          "Harmonic mathematical sine-wave synthesis with Gaussian jitter",
          "Live 8-GPU Hopper SXM5 hardware matrix tracking",
          "Auto-reconnecting client circuit breaker with graceful fallback"
        ],
        metrics: {
          "Broadcast Cadence": "1.0 Hz Phase Lock",
          "Jitter Margin": "< 0.2 ms",
          "Active Sockets": "842 clients online"
        },
        icon: "activity"
      },
      hopper: {
        title: "Hopper SXM5 GPU Swarm (Node 04)",
        subtitle: "Physical Tensor Silicon & Distributed Inference Fabric",
        tag: "NVLINK 900 GB/S MESH",
        desc: "8x NVIDIA H100 SXM5 Hopper 80GB tensor accelerators clustered via bidirectional NVLink cross-chassis mesh. Executes FlashAttention-3 kernels with speculative decoding trees, achieving up to 3.84 million tokens/sec aggregate throughput.",
        specs: [
          "CUDA 12.4 with cuDNN 9.1 Speculative Kernel extensions",
          "FP8 E4M3 & E5M2 Mixed-Precision GEMM Tensor Cores",
          "NVLink 4th-Gen 900 GB/s bidirectional cross-GPU bandwidth"
        ],
        metrics: {
          "P99 TTFT": "14.2 ms",
          "Total Compute TDP": "3,240 W / 5,600 W",
          "Thermals": "48°C Closed-Loop Liquid"
        },
        icon: "cpu"
      },
      kvcache: {
        title: "Speculative KV-Cache Store (Node 05)",
        subtitle: "Page-Locked Unified Tensor Store & Superposition Memory",
        tag: "4.8X SPECULATIVE COMPRESSION",
        desc: "Eliminates memory bandwidth saturation through Page-Locked KV attention memory management. Speculative drafting algorithms verify multiple candidate tokens concurrently, reducing effective context footprint by 4.8x across 128k contexts.",
        specs: [
          "Dynamic attention sparsity pruning redundant query heads",
          "PagedAttention kernel allocation with zero memory fragmentation",
          "Unified HBM3 memory bandwidth: 3.35 TB/s per accelerator"
        ],
        metrics: {
          "Total Allocation": "5.12 TB / 6.0 TB RAM",
          "Compression Ratio": "4.8x Speculative",
          "Cache Hit Ratio": "95.8% Hot KV Pointers"
        },
        icon: "layers"
      }
    };

    const defaultNode = document.querySelector('.arch-node[data-node="hopper"]') || nodes[0];
    if (defaultNode) defaultNode.classList.add('active-node');

    nodes.forEach((node) => {
      node.addEventListener('click', () => {
        nodes.forEach((n) => n.classList.remove('active-node'));
        node.classList.add('active-node');

        const key = node.getAttribute('data-node');
        const data = nodeData[key];
        if (!data) return;

        const titleEl = document.getElementById('inspector-node-title');
        const subtitleEl = document.getElementById('inspector-node-subtitle');
        const tagEl = document.getElementById('inspector-node-tag');
        const descEl = document.getElementById('inspector-node-desc');
        const specsEl = document.getElementById('inspector-node-specs');
        const metricsEl = document.getElementById('inspector-node-metrics');
        const iconEl = document.getElementById('inspector-node-icon');

        if (titleEl) titleEl.innerText = data.title;
        if (subtitleEl) subtitleEl.innerText = data.subtitle;
        if (tagEl) tagEl.innerText = data.tag;
        if (descEl) descEl.innerText = data.desc;
        if (iconEl) iconEl.innerHTML = `<i data-lucide="${data.icon}" class="w-5 h-5"></i>`;

        if (specsEl) {
          specsEl.innerHTML = '';
          data.specs.forEach((s) => {
            const li = document.createElement('li');
            li.className = 'flex items-center gap-2';
            li.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-brand-cyan"></i> <span>${s}</span>`;
            specsEl.appendChild(li);
          });
        }

        if (metricsEl) {
          metricsEl.innerHTML = '';
          Object.entries(data.metrics).forEach(([k, v]) => {
            const row = document.createElement('div');
            row.className = 'flex justify-between';
            row.innerHTML = `<span class="text-slate-400">${k}:</span> <span class="text-brand-cyan font-bold">${v}</span>`;
            metricsEl.appendChild(row);
          });
        }

        if (window.lucide) lucide.createIcons();
        showToast('Architecture Inspector', `Focused on ${data.title.split('(')[0].trim()}.`);
      });
    });
  }

  /* ==========================================================================
     14. APPLICATION BOOTSTRAP
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
      lucide.createIcons();
    }

    initNavigationRouting();
    initThreeWebGL();
    initGSAPAnimations();

    initTelemetryChart();
    renderGpuMatrix();
    initTerminalLogs();

    renderSwarmsGrid();
    initAgentsModal();
    initSwarmPromptTerminal();
    initArchitectureInspector();

    setupDashboardListeners();

    // Initialize FastAPI Live WebSocket Connection
    initTelemetryWebSocket();
  });

})();
