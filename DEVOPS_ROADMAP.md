# 🚀 The Definitive DevOps & Cloud-Native Learning Roadmap

Welcome to **DevOpsForge**! This curriculum is organized into **7 progressive milestones**, designed to transform you from beginner to an industry-ready DevOps / Site Reliability Engineer (SRE).

---

## 🗺️ The 7-Stage DevOps Mastery Path

```
  Stage 1: Linux & Git Foundations
            ↓
  Stage 2: Containerization (Docker)
            ↓
  Stage 3: Multi-Service Orchestration (Docker Compose)
            ↓
  Stage 4: Automated CI/CD Pipelines (GitHub Actions)
            ↓
  Stage 5: Cluster Orchestration (Kubernetes / K8s)
            ↓
  Stage 6: Observability & SRE (Prometheus & Golden Signals)
            ↓
  Stage 7: Infrastructure as Code (Terraform)
```

---

### 📍 Stage 1: Linux & Git Foundations
**Why it matters:** 95%+ of production cloud workloads run on Linux. Git is the foundation of GitOps.

* **Core Linux Skills:**
  * Navigating file trees (`ls -la`, `cd`, `pwd`, `find`, `grep`)
  * File permissions & ownership (`chmod 755`, `chown -R user:group`)
  * Process management (`ps aux`, `top`, `htop`, `kill -9`, `systemctl status/restart`)
  * Networking diagnostics (`curl -Iv`, `netstat -tulnp`, `ss -tulpn`, `traceroute`, `ping`)
* **Git Workflows:**
  * Trunk-based development vs GitFlow
  * Meaningful commit messages using Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`)
  * Pull requests, merge conflicts, rebasing, and branch protections

---

### 📍 Stage 2: Containerization with Docker
**Why it matters:** Containers guarantee that code runs identically across developer laptops, CI test runners, and production clusters ("Works on my machine" is solved).

* **Key Concepts in this project:**
  * **Multi-stage builds** (see [`Dockerfile`](file:///e:/doce/Dockerfile)):
    ```dockerfile
    FROM node:20-alpine AS builder
    ... install dependencies ...
    FROM node:20-alpine AS runner
    ... copy only production artifacts ...
    ```
    *Benefit:* Shrinks container size from ~1GB to ~100MB and eliminates compiler attack vectors.
  * **Non-root user:** Running as `USER node` instead of `root` prevents container escape attacks.
  * **Container Healthcheck:** Docker natively probes `/health/live` to detect hung processes.

---

### 📍 Stage 3: Multi-Container Apps (Docker Compose)
**Why it matters:** Real applications don't live in isolation. They require caching, databases, proxies, and monitoring agents.

* **Inspecting this project's stack ([`docker-compose.yml`](file:///e:/doce/docker-compose.yml)):**
  1. `app`: The Node.js DevOpsForge application
  2. `redis`: In-memory key-value cache
  3. `postgres`: Relational persistence database
  4. `prometheus`: Observability scraper
  5. `nginx`: Production reverse proxy routing incoming port 80 traffic
* **Commands to run:**
  ```bash
  # Spin up the entire multi-container stack in the background
  docker-compose up -d --build

  # View running containers and ports
  docker-compose ps

  # Stream logs from all services
  docker-compose logs -f
  ```

---

### 📍 Stage 4: CI/CD Pipelines (Continuous Delivery)
**Why it matters:** High-performing teams deploy multiple times a day with zero fear by automating all validation.

* **What our pipeline does ([`.github/workflows/ci-cd.yml`](file:///e:/doce/.github/workflows/ci-cd.yml)):**
  1. **Continuous Integration (CI):** Installs packages and runs unit/health tests.
  2. **Security & Vulnerability Scanning:** Builds Docker image and scans it with **Aqua Trivy** for CVE vulnerabilities.
  3. **Dry-Run Kubernetes Validation:** Validates that all YAML manifests in `k8s/` are syntactically valid before applying.

---

### 📍 Stage 5: Kubernetes (K8s) Production Architecture
**Why it matters:** When traffic surges or servers crash, Kubernetes automates scaling, self-healing, rolling updates, and traffic routing.

* **Manifests in [`k8s/`](file:///e:/doce/k8s/):**
  * `01-namespace.yaml`: Isolates our lab into `devops-lab`.
  * `02-configmap.yaml` & `03-secrets.yaml`: Twelve-Factor App configuration separation.
  * `04-deployment.yaml`:
    * Replicas: 3 pods running in parallel.
    * **Liveness Probe:** Hits `/health/live`. If it fails 3 times, K8s kills the dead pod and spawns a fresh one!
    * **Readiness Probe:** Hits `/health/ready`. If the database is disconnecting, K8s stops routing traffic until it recovers.
    * **Resource Requests & Limits:** Prevents noisy neighbor pod memory hogging.
  * `05-service.yaml`: Internal stable IP and load-balancing across pods.
  * `06-hpa.yaml`: Horizontal Pod Autoscaler scales pods from 2 up to 10 based on CPU & Memory load!
  * `07-ingress.yaml`: Routes external HTTP/HTTPS domain traffic into the cluster.

---

### 📍 Stage 6: Observability & SRE (Prometheus & Golden Signals)
**Why it matters:** "You cannot manage what you do not measure."

* **The 4 Golden Signals (Google SRE Book):**
  1. **Latency:** Time taken to service a request (measured via `http_request_duration_seconds`).
  2. **Traffic:** Demand placed on the system (measured via `http_requests_total`).
  3. **Errors:** Rate of requests that fail (HTTP 500s or chaos errors).
  4. **Saturation:** How full your service is (CPU, Memory, connection pool).
* **Live Scrape Endpoint:**
  Visit `http://localhost:3000/metrics` to see the live metrics Prometheus ingests!

---

### 📍 Stage 7: Infrastructure as Code (Terraform)
**Why it matters:** Never manually click around in AWS, Azure, or GCP consoles. Declare infrastructure as code that is versioned in Git.

* **Files in [`terraform/`](file:///e:/doce/terraform/):**
  * `main.tf`: VPC, Subnet, Internet Gateway, and Security Groups.
  * `variables.tf`: Customizable regions, CIDRs, and environments.
  * `outputs.tf`: Exports VPC and subnet IDs for downstream modules.

---

## 🎯 Recommended Next Steps

1. Start the local server:
   ```bash
   npm install
   npm start
   ```
2. Open your browser to `http://localhost:3000`.
3. Try the **Chaos Simulator**:
   - Toggle **Liveness Failure** and watch what happens to the probe indicator.
   - Adjust the **Latency Slider** to 1500ms and see your request response times slow down in real time.
   - Take the **DevOps Skill Quiz** in the quiz tab!
4. Try building the Docker container locally:
   ```bash
   docker build -t devops-forge:latest .
   docker run -p 3000:3000 devops-forge:latest
   ```

