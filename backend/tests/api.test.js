import http from 'http';
import app from '../server.js';

let server;
const PORT = 5099;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

const runRequest = (path, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    let postData = null;
    if (data) {
      postData = JSON.stringify(data);
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: reqHeaders,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
};

const runAllTests = async () => {
  console.log('🧪 ========================================================');
  console.log('🧪 STARTING COMPREHENSIVE FULL-STACK API TEST SUITE');
  console.log('🧪 ========================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title} - ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await runRequest('/health');
    assert(health.status === 200 && health.data.status === 'ok', 'Health Check Endpoint (/api/health)');

    // 2. Demo User Login
    const demoLogin = await runRequest('/auth/login', 'POST', {
      email: 'demo@taskflow.dev',
      password: 'password123',
    });
    assert(demoLogin.status === 200 && demoLogin.data.token, 'Demo User Login (demo@taskflow.dev)');
    const demoToken = demoLogin.data.token;
    const authHeaders = { Authorization: `Bearer ${demoToken}` };

    // 3. User Me Profile
    const meRes = await runRequest('/auth/me', 'GET', null, authHeaders);
    assert(meRes.status === 200 && meRes.data.user.email === 'demo@taskflow.dev', 'Get Current User Profile (/api/auth/me)');

    // 4. Update Profile
    const updateProf = await runRequest('/auth/profile', 'PUT', { bio: 'Automated test suite certified' }, authHeaders);
    assert(updateProf.status === 200 && updateProf.data.user.bio.includes('Automated test'), 'Update User Profile (/api/auth/profile)');

    // 5. Register New Unique User
    const uniqueEmail = `tester_${Date.now()}@taskflow.dev`;
    const regRes = await runRequest('/auth/register', 'POST', {
      name: 'Test Engineer',
      email: uniqueEmail,
      password: 'securePassword123',
      confirmPassword: 'securePassword123',
    });
    assert(regRes.status === 201 && regRes.data.user.email === uniqueEmail, 'Register New User (/api/auth/register)');
    const newTesterToken = regRes.data.token;
    const testerHeaders = { Authorization: `Bearer ${newTesterToken}` };

    // 6. Prevent Duplicate Registration
    const dupRes = await runRequest('/auth/register', 'POST', {
      name: 'Duplicate Engineer',
      email: uniqueEmail,
      password: 'securePassword123',
    });
    assert(dupRes.status === 400, 'Prevent Duplicate Email Registration');

    // 7. Todo CRUD: Create Todo
    const createTodoRes = await runRequest('/todos', 'POST', {
      title: 'Automated Test Task 1',
      description: 'Verifying end-to-end task creation',
      category: 'Work',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
    }, testerHeaders);
    assert(createTodoRes.status === 201 && createTodoRes.data.todo.title === 'Automated Test Task 1', 'Create New Todo (/api/todos)');
    const createdTodoId = createTodoRes.data.todo._id;

    // 8. Fetch Todos
    const getTodosRes = await runRequest('/todos', 'GET', null, testerHeaders);
    assert(getTodosRes.status === 200 && getTodosRes.data.count >= 1, 'Fetch All User Todos (/api/todos)');

    // 9. Fetch Single Todo by ID
    const getSingleRes = await runRequest(`/todos/${createdTodoId}`, 'GET', null, testerHeaders);
    assert(getSingleRes.status === 200 && getSingleRes.data.todo._id === createdTodoId, 'Fetch Single Todo by ID (/api/todos/:id)');

    // 10. Update Todo
    const updateTodoRes = await runRequest(`/todos/${createdTodoId}`, 'PUT', {
      title: 'Updated Test Task Title',
      priority: 'Medium',
    }, testerHeaders);
    assert(updateTodoRes.status === 200 && updateTodoRes.data.todo.title === 'Updated Test Task Title', 'Update Todo Details (/api/todos/:id)');

    // 11. Patch Status to Completed
    const patchStatusRes = await runRequest(`/todos/${createdTodoId}/status`, 'PATCH', { status: 'Completed' }, testerHeaders);
    assert(patchStatusRes.status === 200 && patchStatusRes.data.todo.status === 'Completed', 'Toggle / Patch Status to Completed (/api/todos/:id/status)');

    // 12. Dashboard Stats
    const statsRes = await runRequest('/todos/stats', 'GET', null, testerHeaders);
    assert(statsRes.status === 200 && statsRes.data.stats.total >= 1 && statsRes.data.stats.completed >= 1, 'Get Dashboard Statistics (/api/todos/stats)');

    // 13. Data Isolation Check (User A cannot access User B todo)
    const unauthorizedAccess = await runRequest(`/todos/${createdTodoId}`, 'GET', null, authHeaders);
    assert(unauthorizedAccess.status === 403, 'Data Isolation Enforced: User A cannot access User B tasks');

    // 14. Delete Todo
    const deleteTodoRes = await runRequest(`/todos/${createdTodoId}`, 'DELETE', null, testerHeaders);
    assert(deleteTodoRes.status === 200, 'Delete Todo (/api/todos/:id)');

    // 15. Verify Deleted
    const verifyDeleted = await runRequest(`/todos/${createdTodoId}`, 'GET', null, testerHeaders);
    assert(verifyDeleted.status === 404, 'Verify Todo Successfully Deleted (returns 404)');

    // 16. Logout
    const logoutRes = await runRequest('/auth/logout', 'POST');
    assert(logoutRes.status === 200, 'User Logout (/api/auth/logout)');

    console.log('\n========================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

// Start test server on port 5099
server = app.listen(PORT, async () => {
  console.log(`Test API running on port ${PORT}...`);
  await runAllTests();
});
