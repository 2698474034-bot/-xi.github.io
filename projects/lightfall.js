// Lightfall effect - Canvas 2D particle animation
(function() {
  var container = document.querySelector('.fitness-jumbo .lightfall-bg');
  if (!container) return;
  
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'width:100%;height:100%;display:block;position:absolute;inset:0;';
  container.appendChild(canvas);
  
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  function hexToRgba(hex, a) {
    var c = hex.replace('#','');
    return 'rgba('+parseInt(c.slice(0,2),16)+','+parseInt(c.slice(2,4),16)+','+parseInt(c.slice(4,6),16)+','+a+')';
  }
  
  var colors = ['#38bdf8', '#0ea5e9', '#7dd3fc', '#0284c7', '#22d3ee'];
  var particles = [];
  for (var i = 0; i < 100; i++) {
    particles.push({
      x: Math.random(), y: Math.random(),
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.006 + 0.002,
      drift: (Math.random() - 0.5) * 0.003,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2
    });
  }
  
  function resize() {
    var rect = container.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  
  var time = 0;
  
  function loop() {
    requestAnimationFrame(loop);
    time += 0.016;
    
    var w = canvas.width / (window.devicePixelRatio || 1);
    var h = canvas.height / (window.devicePixelRatio || 1);
    
    ctx.fillStyle = '#07071a';
    ctx.fillRect(0, 0, w, h);
    
    for (var i = 0; i < 100; i++) {
      var p = particles[i];
      p.y += p.speed;
      p.x += p.drift;
      if (p.y > 1.1) { p.y = -0.05; p.x = Math.random(); }
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -0.05;
      
      var x = p.x * w;
      var y = p.y * h;
      var pulse = Math.sin(time * 0.8 + p.phase) * 0.3 + 0.7;
      var sz = p.size * pulse;
      
      // Outer glow
      var g = ctx.createRadialGradient(x, y, 0, x, y, sz * 12);
      g.addColorStop(0, hexToRgba(p.color, 0.12));
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, sz * 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner glow
      var g2 = ctx.createRadialGradient(x, y, 0, x, y, sz * 4);
      g2.addColorStop(0, hexToRgba(p.color, 0.3 * pulse));
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x, y, sz * 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Core dot
      ctx.beginPath();
      ctx.arc(x, y, sz, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(p.color, p.alpha * pulse);
      ctx.fill();
    }
  }
  requestAnimationFrame(loop);
})();
