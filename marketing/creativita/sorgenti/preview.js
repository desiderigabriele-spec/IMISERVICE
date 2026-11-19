const { chromium } = require('playwright');
(async () => {
  const [mode, w, h, times, out] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5].split(',').map(Number), process.argv[6]];
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`http://localhost:8777/engine.html?w=${w}&h=${h}&mode=${mode}`); await p.evaluate(() => window.ready);
  for (const t of times) { await p.evaluate(t => draw(t), t); await p.screenshot({ path: `${out}-${t}.png` }); }
  console.log('durata', await p.evaluate(() => duration()), errs.join(' | ') || 'ok'); await b.close();
})();
