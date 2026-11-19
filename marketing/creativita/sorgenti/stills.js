const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  // immagini con testo per social / Meta
  for (const [name, w, h] of [['quadrato-1080x1080', 1080, 1080], ['verticale-1080x1350', 1080, 1350], ['storia-1080x1920', 1080, 1920]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`http://localhost:8777/engine.html?w=${w}&h=${h}`); await p.evaluate(() => window.ready);
    for (const k of ['uffici', 'condomini', 'brand']) { await p.evaluate(k => still(k), k); await p.screenshot({ path: `out/immagini-social/${k}-${name}.jpg`, type: 'jpeg', quality: 92 }); }
    await p.close();
  }
  // loghi per Google Ads: quadrato 1200x1200 e orizzontale 4:1 1200x300
  const lp = await b.newPage({ viewport: { width: 1200, height: 1200 } });
  await lp.setContent(`<body style="margin:0;background:#F6F3EC;display:grid;place-items:center;width:1200px;height:1200px"><img src="http://localhost:8777/logo/simbolo.svg" style="width:900px"></body>`);
  await lp.waitForTimeout(300); await lp.screenshot({ path: 'out/immagini-google/logo-quadrato-1200x1200.png' });
  await lp.setViewportSize({ width: 1200, height: 300 });
  await lp.setContent(`<body style="margin:0;background:#F6F3EC;display:grid;place-items:center;width:1200px;height:300px"><img src="http://localhost:8777/logo/logo.svg" style="height:250px"></body>`);
  await lp.waitForTimeout(300); await lp.screenshot({ path: 'out/immagini-google/logo-orizzontale-1200x300.png' });
  await b.close(); console.log('ok');
})();
