const { chromium } = require('playwright'); const fs = require('fs'); const { execFileSync } = require('child_process');
(async () => {
  const jobs = JSON.parse(process.argv[2]); const b = await chromium.launch();
  for (const j of jobs) {
    const p = await b.newPage({ viewport: { width: j.w, height: j.h } });
    await p.goto(`http://localhost:8777/engine.html?w=${j.w}&h=${j.h}&mode=${j.mode}&concept=${j.concept || 'uffici'}`); await p.evaluate(() => window.ready);
    const dur = await p.evaluate(() => duration()), n = Math.round(dur * 30), dir = `frames/${j.name}`;
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < n; i++) { await p.evaluate(t => draw(t), i / 30); await p.screenshot({ path: `${dir}/f${String(i).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 93 }); }
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '30', '-i', `${dir}/f%04d.jpg`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `out/${j.name}-muto.mp4`]);
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(j.name, n, 'fotogrammi'); await p.close();
  }
  await b.close();
})();
