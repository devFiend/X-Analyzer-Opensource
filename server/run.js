try { require('ts-node/register'); require('./index.ts'); } catch (e) { require('fs').writeFileSync('true_error.log', e.stack || e.message); }
