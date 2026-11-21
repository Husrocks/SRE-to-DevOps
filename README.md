# 🚀 DevOpsForge: Interactive DevOps Learning Lab

An interactive web application designed to help you learn DevOps, Kubernetes probes, Prometheus metrics, and Chaos Engineering directly in your browser, deployed 100% on **GitHub Pages**!

---

## ⚡ How to Deploy to GitHub (3 Simple Steps)

### Step 1: Create a New Repository on GitHub
1. Open [GitHub.com](https://github.com) and click **"New"** to create a repository (e.g. `devopsforge`).
2. Make it **Public** (required for free GitHub Pages).

### Step 2: Push This Project to GitHub
In your terminal, run:
```bash
git add .
git commit -m "feat: setup clean github deployment"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub.
2. Click **Settings** (tab at the top) → **Pages** (in the left sidebar).
3. Under **Build and deployment** → **Source**, select:
   👉 **GitHub Actions**
4. That's it! GitHub Actions will automatically run the workflow in `.github/workflows/deploy.yml` and give you your live URL:
   `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## 🧪 What You Can Learn & Experiment With in This App

* **Live Telemetry & Golden Signals**: View live uptime, simulated memory utilization, and real-time HTTP traces.
* **Chaos Engineering Simulator**:
  * **Fail Liveness Probe**: Simulates a 500 crash on `/health/live` (how Kubernetes detects dead containers).
  * **Fail Readiness Probe**: Simulates a 503 drain on `/health/ready` (how load balancers stop sending traffic).
  * **Inject Latency**: Drag the slider from 0ms to 2500ms to see request latency spikes.
  * **Spike CPU**: Simulate high load to see resource saturation.
* **Prometheus Metrics**: Click the **`/metrics`** button in the header to view live Prometheus telemetry format.
* **DevOps Roadmap**: 7 structured milestones covering Linux, Git, Docker, CI/CD, Kubernetes, Observability, and Terraform.
* **Cheat Sheets**: Essential copy-and-paste commands for Docker, Kubernetes, and Git.
* **DevOps Quiz**: Test your knowledge with instant scoring.

---

## 📁 Repository Structure

```
.
├── index.html                  # Single-file interactive DevOps lab & learning website
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Actions deployment workflow
├── DEVOPS_ROADMAP.md           # Master 7-stage learning guide
└── README.md                   # Deployment instructions
```
