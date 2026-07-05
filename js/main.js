/* ===================== THEME TOGGLE (dark navy <-> ivory white) ===================== */
(function(){
  const STORAGE_KEY = 'jsalpha-theme';
  const root = document.documentElement;

  function applyTheme(theme, announce){
    root.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn=>{
      btn.setAttribute('aria-checked', theme === 'light');
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to ivory white theme');
    });
    if(announce) window.dispatchEvent(new CustomEvent('themechange', {detail:{theme}}));
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved || 'dark';
  applyTheme(initial, false);

  document.querySelectorAll('.theme-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next, true);
    });
  });

  // let the 3D hero scene react once it's ready, even if it initializes after this runs
  window.__jsalphaTheme = () => root.getAttribute('data-theme') || 'dark';
})();

/* ===================== NAV SCROLL STATE ===================== */
const header = document.getElementById('siteHeader');
if(header){
  window.addEventListener('scroll', ()=>{
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}
const yr = document.getElementById('yr');
if(yr) yr.textContent = new Date().getFullYear();

/* ===================== CINEMATIC FLY-IN STAGGER ===================== */
/* Grid-style groups get per-child 3D fly-in animation instead of appearing as
   one flat block — alternating left/right/up entrances with a staggered delay
   so the content feels like it's flying into place rather than just fading in. */
(function(){
  const groups = document.querySelectorAll(
    '.svc-grid, .why-grid, .industry-grid, .value-grid, .engagement-grid, .chip-grid, .leader-grid, .process-flow'
  );
  groups.forEach(group=>{
    const children = Array.from(group.children);
    group.classList.remove('reveal');
    children.forEach((child, i)=>{
      child.classList.add('fly-in', i % 2 === 0 ? 'fly-left' : 'fly-right');
      child.style.transitionDelay = (i % 6) * 0.09 + 's';
    });
  });

  const miniSteps = document.querySelectorAll('.p-step-mini, .p-step, .svc-detail, .industry-card, .tl-row, .eng-card');
  miniSteps.forEach((el, i)=>{
    if(el.classList.contains('reveal')) el.classList.remove('reveal');
    el.classList.add('fly-in', 'fly-up');
    el.style.transitionDelay = (i % 5) * 0.08 + 's';
  });
})();

/* ===================== REVEAL ON SCROLL ===================== */
/* threshold near 0 means "as soon as any part enters view" — this matters for
   tall elements (long lists), where a percentage-based threshold may never be
   satisfiable within the viewport. No negative rootMargin, so elements at the
   very bottom of the page still trigger once they're on screen. */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:0.01});
document.querySelectorAll('.reveal, .fly-in').forEach(el=>io.observe(el));

/* ===================== COUNTER ===================== */
const statsRow = document.getElementById('statsRow');
if(statsRow){
  const statIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      e.target.querySelectorAll('[data-count]').forEach(el=>{
        const target = parseInt(el.dataset.count,10);
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = Math.max(1, Math.round(target/60));
        const t = setInterval(()=>{
          cur += step;
          if(cur >= target){ cur = target; clearInterval(t); }
          el.textContent = cur + suffix;
        },22);
      });
      statIO.unobserve(e.target);
    });
  },{threshold:0.4});
  statIO.observe(statsRow);
}

/* ===================== SERVICE / CARD SPOTLIGHT ===================== */
document.querySelectorAll('.svc-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX-r.left)+'px');
    card.style.setProperty('--my', (e.clientY-r.top)+'px');
  });
});

/* ===================== SVC CARD 3D TILT ===================== */
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - 0.5;
    const py = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${py*-6}deg) rotateY(${px*6}deg) translateZ(4px)`;
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
});

/* ===================== FLOATING CONTACT BUTTON ===================== */
(function(){
  /* ── configuration ── */
  const WA_NUMBER  = '+918800028867';   // WhatsApp number (country code + digits, no +)
  const WA_MESSAGE = encodeURIComponent('Hi! I visited JS AlphaSoft website and would like to discuss a project.');
  const CALL_NUMBER = 'tel:+918800028867';

  const fcb = document.createElement('div');
  fcb.className = 'fcb';
  fcb.innerHTML = `
    <div class="fcb-actions">
      <a class="fcb-pill wa" href="https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.122 1.532 5.857L.057 23.428a.5.5 0 0 0 .515.572l5.701-1.494A11.954 11.954 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.373l-.36-.213-3.724.976.997-3.634-.234-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
        Chat on WhatsApp
      </a>
      <a class="fcb-pill cb" href="${CALL_NUMBER}">
        <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.4 2.1L8 10.3a16 16 0 0 0 6 6l1.5-1.4a2 2 0 0 1 2.1-.4c1 .4 2 .6 3 .7a2 2 0 0 1 1.4 2.7z"/></svg>
        Request a Callback
      </a>
    </div>
    <button class="fcb-trigger" aria-label="Contact us" type="button">
      <span class="fcb-pulse"></span>
      <svg class="ico-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="ico-close" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round"/></svg>
    </button>`;

  document.body.appendChild(fcb);

  const trigger = fcb.querySelector('.fcb-trigger');
  trigger.addEventListener('click', () => fcb.classList.toggle('open'));

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!fcb.contains(e.target)) fcb.classList.remove('open');
  });

  // Stop pulse animation after first open (user has noticed)
  trigger.addEventListener('click', () => {
    fcb.querySelector('.fcb-pulse').style.animation = 'none';
  }, {once: true});
})();

/* ===================== MOBILE MENU ===================== */
const burgerBtn = document.getElementById('burgerBtn');
if(burgerBtn){
  burgerBtn.addEventListener('click', ()=>{
    const nav = document.querySelector('.navlinks');
    const open = nav.style.display === 'flex';
    nav.style.cssText = open ? '' : 'display:flex;flex-direction:column;position:fixed;top:66px;right:20px;left:20px;background:rgba(6,11,34,0.97);border:1px solid var(--line);border-radius:16px;padding:18px;gap:18px;z-index:99;backdrop-filter:blur(16px);';
  });
}
