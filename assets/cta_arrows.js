/* Inject triple chevrons INSIDE the CTA (no wrap, no reflow). */
(function(){
  'use strict';
  const CANDIDATES = 'a.cta, button.cta, [data-cta], .btn.cta, a.btn, .btn, [class*=cta]';

  function score(el){
    const r = el.getBoundingClientRect();
    let pts = Math.max(1, r.width*r.height);
    const txt = (el.textContent||'').toLowerCase();
    if(/игра|play|start|старт|main|начать|запуск|скач|заказ|куп/.test(txt)) pts*=1.6;
    if(el.hasAttribute('data-cta') || (el.className||'').toLowerCase().includes('cta')) pts*=2.0;
    if(getComputedStyle(el).position!=='static') pts*=1.3;
    return pts;
  }

  function pick(){
    const nodes = Array.from(document.querySelectorAll(CANDIDATES))
      .filter(el=>el.offsetParent!==null);
    if(!nodes.length) return null;
    nodes.sort((a,b)=>score(b)-score(a));
    return nodes[0];
  }

  function addArrowsInside(el){
    if(!el || el.querySelector('.cta-arrows')) return;
    const box = document.createElement('span');
    box.className = 'cta-arrows';

    ['left','top','right'].forEach(side=>{
      const group = document.createElement('span');
      group.className = 'cta-arrow ' + side;
      for(let i=0;i<3;i++){
        const ch = document.createElement('span');
        ch.className = 'chevron';
        ch.setAttribute('aria-hidden','true');
        group.appendChild(ch);
      }
      box.appendChild(group);
    });

    el.appendChild(box);

    // Ensure it can show outside bounds
    const cs = getComputedStyle(el);
    if(cs.position === 'static') el.style.position = 'relative';
    el.style.overflow = 'visible';
    el.style.setProperty('--chev-color', '#ff2d55');
  }

  function run(){
    const target = pick();
    if(target) addArrowsInside(target);
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, {once:true});
  } else {
    run();
  }
  window.addEventListener('load', run, {once:true});

  // SPA dynamics
  const mo = new MutationObserver(()=>{
    if(document.querySelector('.cta .cta-arrows')) { mo.disconnect(); return; }
    run();
  });
  mo.observe(document.documentElement, {childList:true, subtree:true});
})();