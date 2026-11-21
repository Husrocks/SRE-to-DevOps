const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const url = require('url');

const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || '1.0.0';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

// -------------------------------------------------------------
// State & Simulated Chaos Variables
// -------------------------------------------------------------
let isHealthy = true;
let isReady = true;
let latencyDelayMs = 0;
let requestCount = 0;
let chaosErrorCount = 0;
const startTime = Date.now();
const requestHistory = [];

// -------------------------------------------------------------
// Standard Prometheus Metrics Generator (Prom-Format Compatible)
// -------------------------------------------------------------
function generatePrometheusMetrics() {
  const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
  const mem = process.memoryUsage();

  return `# HELP devops_http_requests_total Total number of HTTP requests
# TYPE devops_http_requests_total counter
devops_http_requests_total{app="devopsforge",version="${APP_VERSION}"} ${requestCount}

# HELP devops_chaos_errors_total Total simulated chaos errors triggered
# TYPE devops_chaos_errors_total counter
devops_chaos_errors_total{app="devopsforge"} ${chaosErrorCount}

# HELP devops_process_uptime_seconds Process uptime in seconds
# TYPE devops_process_uptime_seconds gauge
devops_process_uptime_seconds ${uptimeSec}

# HELP devops_process_resident_memory_bytes Resident memory size in bytes
# TYPE devops_process_resident_memory_bytes gauge
devops_process_resident_memory_bytes ${mem.rss}

# HELP devops_process_heap_used_bytes Process heap memory used
# TYPE devops_process_heap_used_bytes gauge
devops_process_heap_used_bytes ${mem.heapUsed}

# HELP devops_kubernetes_liveness_status 1 if alive and healthy, 0 if failing
# TYPE devops_kubernetes_liveness_status gauge
devops_kubernetes_liveness_status ${isHealthy ? 1 : 0}

# HELP devops_kubernetes_readiness_status 1 if ready to take traffic, 0 if unready
# TYPE devops_kubernetes_readiness_status gauge
devops_kubernetes_readiness_status ${isReady ? 1 : 0}
`;
}

// -------------------------------------------------------------
// Curriculum Data
// -------------------------------------------------------------
const curriculum = {
  stages: [
    {
      id: 'linux-git',
      title: 'Stage 1: Linux & Git Foundation',
      tag: 'Fundamentals',
      description: 'Understand the terminal, file permissions, shell scripts, and Git branching workflows used by SREs and DevOps engineers.',
      keyConcepts: ['SSH & Permissions (chmod, chown)', 'Process Management (ps, top, systemctl)', 'Git Flow vs Trunk-Based Development', 'SemVer Versioning']
    },
    {
      id: 'docker',
      title: 'Stage 2: Containerization (Docker)',
      tag: 'Core Skill',
      description: 'Package applications into portable, immutable container images with multi-stage builds, non-root users, and minimal layers.',
      keyConcepts: ['Multi-Stage Dockerfiles', 'Docker Cache Optimization', 'Container Networking & Volumes', '.dockerignore best practices']
    },
    {
      id: 'compose',
      title: 'Stage 3: Multi-Container Apps (Docker Compose)',
      tag: 'Local Orchestration',
      description: 'Orchestrate microservices, reverse proxies (Nginx), and databases locally with declarative YAML configs.',
      keyConcepts: ['Service dependencies (depends_on)', 'Named volumes & data persistence', 'Port forwarding vs internal networks', 'Environment file injection']
    },
    {
      id: 'cicd',
      title: 'Stage 4: CI/CD Pipelines (Automation)',
      tag: 'Continuous Delivery',
      description: 'Automate testing, linting, security scans, Docker builds, and deployment previews with GitHub Actions.',
      keyConcepts: ['Continuous Integration (CI) test gates', 'Docker Buildx & Multi-Arch images', 'Trivy vulnerability scanning', 'Continuous Deployment (CD) workflows']
    },
    {
      id: 'kubernetes',
      title: 'Stage 5: Container Orchestration (Kubernetes)',
      tag: 'Industry Standard',
      description: 'Deploy, scale, and manage containerized workloads across a distributed cluster with self-healing and zero downtime.',
      keyConcepts: ['Pods, Deployments & ReplicaSets', 'Services (ClusterIP, NodePort, LoadBalancer)', 'Liveness & Readiness Probes', 'ConfigMaps & Secrets', 'HPA (Horizontal Pod Autoscaler)']
    },
    {
      id: 'observability',
      title: 'Stage 6: Observability & Monitoring',
      tag: 'Reliability',
      description: 'Track the 4 Golden Signals (Latency, Traffic, Errors, Saturation) with Prometheus metrics and Grafana dashboards.',
      keyConcepts: ['Metrics vs Logs vs Traces', 'Prometheus pull-model scraping', 'Setting alerts with Alertmanager', 'SLIs, SLOs, and SLAs']
    },
    {
      id: 'iac',
      title: 'Stage 7: Infrastructure as Code (Terraform)',
      tag: 'Cloud Provisioning',
      description: 'Provision cloud infrastructure (AWS/Azure/GCP) declaratively with state files, variables, and reusable modules.',
      keyConcepts: ['Declarative vs Imperative', 'Terraform State & State Locking', 'Plan, Apply, and Destroy cycle', 'Infrastructure drift detection']
    }
  ]
};

// -------------------------------------------------------------
// Request Handler
// -------------------------------------------------------------
function handleRequest(req, res) {
  const reqStart = Date.now();
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  function finish(status, data, contentType = 'application/json') {
    const durationMs = Date.now() - reqStart;
    requestCount++;

    // Track request log
    requestHistory.unshift({
      timestamp: new Date().toLocaleTimeString(),
      method: req.method,
      path: pathname,
      status: status,
      durationMs: durationMs
    });
    if (requestHistory.length > 20) requestHistory.pop();

    res.writeHead(status, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });

    if (typeof data === 'object' && contentType === 'application/json') {
      res.end(JSON.stringify(data));
    } else {
      res.end(data);
    }
  }

  // Pre-flight OPTIONS
  if (req.method === 'OPTIONS') {
    return finish(204, '');
  }

  // Handle Artificial Latency Simulation
  const executeRouting = () => {
    // 1. Kubernetes Liveness Probe
    if (pathname === '/health/live' && req.method === 'GET') {
      if (!isHealthy) {
        return finish(500, { status: 'FAIL', reason: 'Liveness check failed (Simulated crash)' });
      }
      return finish(200, {
        status: 'UP',
        check: 'liveness',
        version: APP_VERSION,
        uptime: Math.floor((Date.now() - startTime) / 1000)
      });
    }

    // 2. Kubernetes Readiness Probe
    if (pathname === '/health/ready' && req.method === 'GET') {
      if (!isReady) {
        return finish(503, { status: 'FAIL', reason: 'Readiness check failed (Simulated draining)' });
      }
      return finish(200, {
        status: 'READY',
        check: 'readiness',
        environment: ENVIRONMENT
      });
    }

    // 3. Prometheus /metrics Endpoint
    if (pathname === '/metrics' && req.method === 'GET') {
      return finish(200, generatePrometheusMetrics(), 'text/plain; version=0.0.4; charset=utf-8');
    }

    // 4. System Telemetry Endpoint
    if (pathname === '/api/system' && req.method === 'GET') {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memUsagePercent = Math.round((usedMem / totalMem) * 100);

      return finish(200, {
        app: {
          name: 'DevOpsForge Learning Lab',
          version: APP_VERSION,
          environment: ENVIRONMENT,
          isHealthy,
          isReady,
          latencyDelayMs,
          uptimeSeconds: Math.floor((Date.now() - startTime) / 1000)
        },
        system: {
          hostname: os.hostname(),
          platform: os.platform(),
          cpus: os.cpus().length,
          memoryTotalMB: Math.round(totalMem / (1024 * 1024)),
          memoryUsedMB: Math.round(usedMem / (1024 * 1024)),
          memoryPercent: memUsagePercent,
          nodeVersion: process.version
        },
        recentRequests: requestHistory
      });
    }

    // 5. Curriculum Endpoint
    if (pathname === '/api/curriculum' && req.method === 'GET') {
      return finish(200, curriculum);
    }

    // 6. Chaos Simulator Endpoint
    if (pathname === '/api/chaos' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const payload = body ? JSON.parse(body) : {};
          const { action, value } = payload;

          switch (action) {
            case 'toggle_health':
              isHealthy = !isHealthy;
              chaosErrorCount++;
              return finish(200, { message: `Liveness health set to: ${isHealthy ? 'HEALTHY (200)' : 'UNHEALTHY (500)'}`, isHealthy });

            case 'toggle_ready':
              isReady = !isReady;
              chaosErrorCount++;
              return finish(200, { message: `Readiness state set to: ${isReady ? 'READY (200)' : 'NOT READY (503)'}`, isReady });

            case 'set_latency':
              latencyDelayMs = parseInt(value, 10) || 0;
              return finish(200, { message: `Artificial latency set to: ${latencyDelayMs}ms`, latencyDelayMs });

            case 'simulate_error':
              chaosErrorCount++;
              return finish(500, { error: 'Simulated 500 Internal Server Error for Monitoring & Alerts!' });

            case 'cpu_spike':
              const start = Date.now();
              while (Date.now() - start < 600) {
                Math.sqrt(Math.random() * 100000);
              }
              return finish(200, { message: 'Simulated CPU load burst completed.' });

            default:
              return finish(400, { error: 'Unknown chaos action' });
          }
        } catch (err) {
          return finish(400, { error: 'Invalid JSON body' });
        }
      });
      return;
    }

    // 7. Static HTML Frontend Serving
    if (pathname === '/' || pathname === '/index.html') {
      const filePath = path.join(__dirname, 'public', 'index.html');
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          return finish(500, 'Error loading UI');
        }
        return finish(200, content, 'text/html; charset=utf-8');
      });
      return;
    }

    return finish(404, { error: 'Not Found' });
  };

  if (latencyDelayMs > 0 && pathname !== '/api/chaos') {
    setTimeout(executeRouting, latencyDelayMs);
  } else {
    executeRouting();
  }
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 DevOpsForge Server running on http://localhost:${PORT}`);
    console.log(`📊 Prometheus Metrics available at http://localhost:${PORT}/metrics`);
    console.log(`💓 Liveness probe at http://localhost:${PORT}/health/live`);
    console.log(`🛡️ Readiness probe at http://localhost:${PORT}/health/ready`);
  });
}

module.exports = server;
