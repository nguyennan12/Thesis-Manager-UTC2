const fs = require('fs');
const { beEndpoints, feCalls } = JSON.parse(fs.readFileSync('scripts/endpoints-analysis.json', 'utf8'));

// Normalize paths for matching
function normalizePattern(url) {
  // replace ${...} or :id or [id] or UUIDs with :param
  return url
    .replace(/\$\{([^}]+)\}/g, ':param')
    .replace(/:[a-zA-Z0-9_]+/g, ':param')
    .replace(/[0-9a-fA-F-]{36}/g, ':param')
    .replace(/\/\d+/g, '/:param')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
    .trim();
}

console.log('--------------------------------------------------');
console.log('ANALYZING FRONTEND API CALLS AGAINST BACKEND');
console.log('--------------------------------------------------');

const feReport = [];

feCalls.forEach(fe => {
  // clean urlRaw
  let cleanUrl = fe.urlRaw;
  // If it contains query string, split it
  const [urlWithoutQuery, query] = cleanUrl.split('?');
  const normalizedFe = normalizePattern(urlWithoutQuery);

  // find matching be endpoints
  const matches = beEndpoints.filter(be => {
    const normalizedBe = normalizePattern(be.fullPath);
    return normalizedBe === normalizedFe;
  });

  const exactMethodMatch = matches.find(m => m.method === fe.method);
  const diffMethodMatch = matches.find(m => m.method !== fe.method);

  // also find fuzzy matches if no exact path match
  let fuzzyMatches = [];
  if (matches.length === 0) {
    fuzzyMatches = beEndpoints.filter(be => {
      const beNorm = normalizePattern(be.fullPath);
      // check similarity or partial match
      const beParts = beNorm.split('/').filter(Boolean);
      const feParts = normalizedFe.split('/').filter(Boolean);
      if (beParts.length > 0 && feParts.length > 0 && beParts[0] === feParts[0]) {
        return true;
      }
      return false;
    });
  }

  feReport.push({
    feCall: fe,
    normalizedFe,
    exactMethodMatch,
    diffMethodMatch,
    potentialMatches: matches.length === 0 ? fuzzyMatches : []
  });
});

console.log(JSON.stringify(feReport, null, 2));
