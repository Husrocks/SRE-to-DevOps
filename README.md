# 🛠️ DevOpsForge: Interactive Hands-On DevOps Laboratory

Welcome to **DevOpsForge**! A complete, interactive learning platform and cloud-native project designed to teach you modern DevOps, Docker, Kubernetes, CI/CD, Prometheus observability, and Terraform.

![DevOpsForge Status](https://img.shields.io/badge/DevOps-Learning%20Lab-06b6d4?style=for-the-badge)
![Docker Ready](https://img.shields.io/badge/Docker-Multi--Stage-2496ED?style=for-the-badge&logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=for-the-badge&logo=kubernetes)
![Prometheus](https://img.shields.io/badge/Prometheus-Metrics-E6522C?style=for-the-badge&logo=prometheus)

---

## ⚡ Quick Start (Run in 10 seconds)

### Option 1: Native Node.js Run
```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start the application
npm start
```
Then open your browser to **[http://localhost:3000](http://localhost:3000)**.

---

### Option 2: Docker Container Run
```bash
# Build the optimized multi-stage production image
docker build -t devops-forge:latest .

# Run the container with port forwarding
docker run -d -p 3000:3000 --name devops-lab devops-forge:latest

# Check container health and logs
docker ps
docker logs devops-lab
```

---

### Option 3: Full Multi-Service Docker Compose Stack
Orchestrates the Web App, Redis Cache, PostgreSQL Database, Prometheus, and Nginx Reverse Proxy:
```bash
docker-compose up -d --build
```
- Web Application via Nginx: `http://localhost`
- Direct Web App: `http://localhost:3000`
- Prometheus Dashboard: `http://localhost:9090`

---

## 📂 Repository Layout

```
.
├── server.js               # Cloud-native Express app with Prometheus metrics & K8s probes
├── public/
│   └── index.html          # Interactive Mission Control, Chaos Lab, Quiz & Roadmaps
├── tests/
│   └── server.test.js      # Automated CI test suite (Node native test runner)
├── Dockerfile              # Production multi-stage Alpine build with non-root user
├── Dockerfile.dev          # Local dev build with hot reload
├── docker-compose.yml      # Orchestrates App, Redis, PostgreSQL, Prometheus & Nginx
├── nginx/
│   └── nginx.conf          # Reverse proxy, rate limiting, and security headers
├── prometheus/
│   └── prometheus.yml      # Observability scraping configuration
├── k8s/                    # Kubernetes production manifests
│   ├── 01-namespace.yaml
│   ├── 02-configmap.yaml
│   ├── 03-secrets.yaml
│   ├── 04-deployment.yaml  # Replicas, liveness/readiness probes, resource limits
│   ├── 05-service.yaml     # Internal cluster routing
│   ├── 06-hpa.yaml         # Horizontal Pod Autoscaler (2 to 10 replicas)
│   └── 07-ingress.yaml     # Ingress controller routing
├── terraform/              # Infrastructure as Code (IaC)
│   ├── main.tf             # AWS VPC, Subnets, and Security Groups
│   ├── variables.tf
│   └── outputs.tf
├── .github/workflows/
│   └── ci-cd.yml           # Automated CI/CD pipeline with Trivy security scans
└── DEVOPS_ROADMAP.md       # Complete 7-Stage Beginner-to-Pro Learning Guide
```

---

## 🔬 Interactive Features in the Web App
1. **Live Mission Control**: Real-time memory utilization, uptime, and request logging.
2. **Chaos Engineering & Fault Injection**:
   - Toggle **Kubernetes Liveness Probe failure** (`/health/live` returns 500).
   - Toggle **Kubernetes Readiness Probe failure** (`/health/ready` returns 503).
   - Inject artificial **latency delays** (0ms to 2500ms).
   - Trigger **CPU load spikes** and simulated 500 error traces.
3. **Architecture Visualizer**: Interactive flow diagram mapping requests from client to Nginx, K8s, pods, and Prometheus.
4. **Interactive DevOps Quiz**: Instant testing of core DevOps concepts.
5. **Cheat Sheets**: Ready-to-copy commands for Docker, Docker Compose, Kubernetes, and Terraform.

---

## 📖 Complete Study Guide
Read [`DEVOPS_ROADMAP.md`](file:///e:/doce/DEVOPS_ROADMAP.md) for detailed explanations of every stage.

