const fs = require('fs');
const path = require('path');

function getFiles(dir, match) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, match));
    } else if (match.test(file)) {
      results.push(fullPath);
    }
  });
  return results;
}

// 1. Scan Backend Controllers
const backendControllers = getFiles(path.resolve('apps/backend/src'), /controller\.ts$/);
const beEndpoints = [];

backendControllers.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Match @Controller('xxx') or @Controller()
  const controllerMatch = content.match(/@Controller\((?:['"]([^'"]*)['"])?\)/);
  const prefix = controllerMatch ? (controllerMatch[1] || '') : '';

  // Match methods: @Get('xxx'), @Post('xxx'), etc.
  const routeRegex = /@(Get|Post|Put|Patch|Delete)\((?:['"]([^'"]*)['"])?\)\s*(?:[\s\S]*?)?(?:async\s+)?([a-zA-Z0-9_]+)\s*\(/g;
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const subPath = match[2] !== undefined ? match[2] : '';
    const fnName = match[3];

    // Combine prefix and subPath
    let fullPath = '/' + [prefix, subPath].filter(Boolean).join('/').replace(/\/+/g, '/').replace(/^\//, '');
    if (fullPath === '/') fullPath = ''; // or '/'

    beEndpoints.push({
      controller: path.basename(file),
      file: path.relative(process.cwd(), file),
      method,
      subPath,
      fnName,
      fullPath: fullPath.startsWith('/') ? fullPath : '/' + fullPath
    });
  }
});

// 2. Scan Frontend Services & Client Calls
const frontendFiles = getFiles(path.resolve('apps/frontend/src'), /\.(ts|tsx)$/);
const feCalls = [];

// Look for apiClient.get, apiClient.post, apiClient.put, apiClient.patch, apiClient.delete
// or axios.get, fetch, etc.
frontendFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const apiCallRegex = /(apiClient|axios)\.(get|post|put|patch|delete)(?:<[^>]+>)?\s*\(\s*([`'"][^`'"]*[`'"])/g;
  let match;
  while ((match = apiCallRegex.exec(content)) !== null) {
    const caller = match[1];
    const method = match[2].toUpperCase();
    let urlRaw = match[3].slice(1, -1); // strip quotes

    feCalls.push({
      file: path.relative(process.cwd(), file),
      caller,
      method,
      urlRaw
    });
  }
});

console.log('=== TOTAL BACKEND CONTROLLERS FOUND ===', backendControllers.length);
console.log('=== TOTAL BACKEND ENDPOINTS FOUND ===', beEndpoints.length);
console.log('=== TOTAL FRONTEND API CALLS FOUND ===', feCalls.length);

fs.writeFileSync('scripts/endpoints-analysis.json', JSON.stringify({ beEndpoints, feCalls }, null, 2), 'utf8');
console.log('Wrote scripts/endpoints-analysis.json');
