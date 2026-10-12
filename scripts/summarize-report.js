const fs = require('fs');

const { beEndpoints, feCalls } = JSON.parse(fs.readFileSync('scripts/endpoints-analysis.json', 'utf8'));

function normalizePattern(url) {
  return url
    .replace(/\$\{([^}]+)\}/g, ':param')
    .replace(/:[a-zA-Z0-9_]+/g, ':param')
    .replace(/[0-9a-fA-F-]{36}/g, ':param')
    .replace(/\/\d+/g, '/:param')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
    .trim();
}

console.log('===============================================================');
console.log('1. FRONTEND CALLS ANALYSIS');
console.log('===============================================================');

const matchedBE = new Set();
const feErrors = [];
const feSuccess = [];

feCalls.forEach(fe => {
  const [urlWithoutQuery] = fe.urlRaw.split('?');
  const normalizedFe = normalizePattern(urlWithoutQuery);

  const exactMatch = beEndpoints.find(be => {
    return normalizePattern(be.fullPath) === normalizedFe && be.method === fe.method;
  });

  if (exactMatch) {
    matchedBE.add(`${exactMatch.method} ${exactMatch.fullPath}`);
    feSuccess.push({
      feFile: fe.file,
      call: `${fe.method} ${fe.urlRaw}`,
      beEndpoint: `${exactMatch.method} ${exactMatch.fullPath}`,
      beFn: `${exactMatch.controller} -> ${exactMatch.fnName}()`
    });
  } else {
    // Check if path matches but method differs
    const wrongMethod = beEndpoints.filter(be => normalizePattern(be.fullPath) === normalizedFe);
    
    // Check if similar path exists
    const similar = beEndpoints.filter(be => {
      const p1 = normalizePattern(be.fullPath).split('/');
      const p2 = normalizedFe.split('/');
      return p1[1] === p2[1];
    });

    feErrors.push({
      feFile: fe.file,
      call: `${fe.method} ${fe.urlRaw}`,
      normalizedFe,
      wrongMethod: wrongMethod.map(m => `${m.method} ${m.fullPath}`),
      similar: similar.map(s => `${s.method} ${s.fullPath}`)
    });
  }
});

console.log(`\n✅ EXACT MATCHES (${feSuccess.length}/${feCalls.length}):`);
feSuccess.forEach(s => {
  console.log(`  - [${s.call}] in ${s.feFile} -> ${s.beEndpoint} (${s.beFn})`);
});

console.log(`\n❌ MISMATCHES / POTENTIAL 404s (${feErrors.length}):`);
feErrors.forEach(err => {
  console.log(`\n  🚨 FE Call: [${err.call}] in ${err.feFile}`);
  console.log(`     Normalized: ${err.normalizedFe}`);
  if (err.wrongMethod.length > 0) {
    console.log(`     ⚠️ Path exists in BE but with DIFFERENT HTTP METHOD(S): ${err.wrongMethod.join(', ')}`);
  } else {
    console.log(`     ⚠️ Path DOES NOT EXIST in BE!`);
    if (err.similar.length > 0) {
      console.log(`     💡 Candidate BE endpoints under same prefix:`);
      err.similar.slice(0, 5).forEach(sim => console.log(`        * ${sim}`));
    }
  }
});

console.log('\n===============================================================');
console.log('2. UNUSED / UNCALLED BACKEND ENDPOINTS');
console.log('===============================================================');

const uncalledBE = beEndpoints.filter(be => !matchedBE.has(`${be.method} ${be.fullPath}`));
console.log(`Total Backend Endpoints: ${beEndpoints.length}`);
console.log(`Called by FE: ${matchedBE.size}`);
console.log(`Uncalled by FE: ${uncalledBE.length}`);

// Group uncalled by controller
const byController = {};
uncalledBE.forEach(be => {
  if (!byController[be.controller]) byController[be.controller] = [];
  byController[be.controller].push(`${be.method} ${be.fullPath} (${be.fnName})`);
});

for (const [ctrl, endpoints] of Object.entries(byController)) {
  console.log(`\nController: ${ctrl} (${endpoints.length} uncalled)`);
  endpoints.forEach(e => console.log(`   - ${e}`));
}
