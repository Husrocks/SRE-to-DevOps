const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

test('1. [Quality Gate] index.html exists and has valid DOCTYPE declaration', () => {
  assert.ok(fs.existsSync(htmlPath), 'index.html should exist');
  assert.ok(htmlContent.startsWith('<!DOCTYPE html>'), 'File should start with <!DOCTYPE html>');
});

test('2. [Quality Gate] Essential UI telemetry elements exist', () => {
  assert.ok(htmlContent.includes('id="stat-uptime"'), 'Uptime stat must exist');
  assert.ok(htmlContent.includes('id="stat-latency"'), 'Latency stat must exist');
  assert.ok(htmlContent.includes('id="live-indicator-dot"'), 'Liveness probe dot must exist');
  assert.ok(htmlContent.includes('id="ready-indicator-dot"'), 'Readiness probe dot must exist');
});

test('3. [Quality Gate] Chaos Engineering simulation controls exist', () => {
  assert.ok(htmlContent.includes('toggleLiveness()'), 'Liveness toggle function must exist');
  assert.ok(htmlContent.includes('toggleReadiness()'), 'Readiness toggle function must exist');
  assert.ok(htmlContent.includes('setLatency'), 'Latency slider handler must exist');
  assert.ok(htmlContent.includes('simulate500Error()'), '500 error simulator must exist');
});

test('4. [Quality Gate] Prometheus /metrics telemetry output is present', () => {
  assert.ok(htmlContent.includes('viewPrometheusMetrics()'), 'Prometheus modal function must exist');
  assert.ok(htmlContent.includes('# HELP devops_http_requests_total'), 'Prometheus metrics standard format must exist');
});

test('5. [Security Gate] No accidental hardcoded secrets or API tokens exist', () => {
  const secretPatterns = [
    /AKIA[0-9A-Z]{16}/, // AWS Access Key
    /ghp_[a-zA-Z0-9]{36}/, // GitHub Personal Access Token
    /-----BEGIN PRIVATE KEY-----/ // Private Key
  ];

  secretPatterns.forEach(pattern => {
    assert.strictEqual(pattern.test(htmlContent), false, `Hardcoded secret detected matching pattern: ${pattern}`);
  });
});

test('6. [Accessibility & CDN Gate] All external script links use HTTPS', () => {
  const cdnLinks = htmlContent.match(/src="http:\/\/[^"]+"/g);
  assert.strictEqual(cdnLinks, null, 'All script CDNs must use secure HTTPS, no plaintext HTTP allowed');
});

