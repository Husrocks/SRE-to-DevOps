const test = require('node:test');
const assert = require('node:assert');
const { EventEmitter } = require('node:events');
const server = require('../server');

// Mock request / response helper that tests HTTP logic in-memory without TCP sockets
function testRequest(options) {
  return new Promise((resolve) => {
    const req = new EventEmitter();
    req.method = options.method || 'GET';
    req.url = options.url || '/';
    req.headers = options.headers || {};

    let responseData = '';
    let responseStatus = 200;
    let responseHeaders = {};

    const res = {
      writeHead(status, headers) {
        responseStatus = status;
        responseHeaders = headers || {};
      },
      end(data) {
        responseData = data || '';
        let body;
        try {
          body = JSON.parse(responseData);
        } catch {
          body = null;
        }
        resolve({
          status: responseStatus,
          headers: responseHeaders,
          raw: responseData,
          body
        });
      }
    };

    server.emit('request', req, res);

    if (options.body) {
      req.emit('data', JSON.stringify(options.body));
    }
    req.emit('end');
  });
}

test('1. Kubernetes Liveness Probe returns 200 UP', async () => {
  const res = await testRequest({ method: 'GET', url: '/health/live' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'UP');
  assert.strictEqual(res.body.check, 'liveness');
});

test('2. Kubernetes Readiness Probe returns 200 READY', async () => {
  const res = await testRequest({ method: 'GET', url: '/health/ready' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'READY');
});

test('3. Prometheus /metrics endpoint outputs standard Prometheus metrics', async () => {
  const res = await testRequest({ method: 'GET', url: '/metrics' });
  assert.strictEqual(res.status, 200);
  assert.ok(res.raw.includes('devops_http_requests_total'));
  assert.ok(res.raw.includes('devops_kubernetes_liveness_status'));
});

test('4. System status API returns CPU and memory metrics', async () => {
  const res = await testRequest({ method: 'GET', url: '/api/system' });
  assert.strictEqual(res.status, 200);
  assert.ok(res.body.system.memoryTotalMB > 0);
  assert.strictEqual(res.body.app.isHealthy, true);
});

test('5. Curriculum API returns all 7 learning stages', async () => {
  const res = await testRequest({ method: 'GET', url: '/api/curriculum' });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.stages.length, 7);
});

test('6. Chaos endpoint updates health and metrics', async () => {
  const chaosRes = await testRequest({
    method: 'POST',
    url: '/api/chaos',
    body: { action: 'toggle_health' }
  });
  assert.strictEqual(chaosRes.status, 200);
  assert.strictEqual(chaosRes.body.isHealthy, false);

  // Probe should now fail
  const probeRes = await testRequest({ method: 'GET', url: '/health/live' });
  assert.strictEqual(probeRes.status, 500);
  assert.strictEqual(probeRes.body.status, 'FAIL');

  // Restore health
  await testRequest({
    method: 'POST',
    url: '/api/chaos',
    body: { action: 'toggle_health' }
  });
});
