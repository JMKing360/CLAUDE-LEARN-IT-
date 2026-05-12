// House of Mastery - shared helpers
// Loaded before the inline assessment scripts on both index.html (KOORA
// UNFINISHED, served at /) and first-hour/index.html (The First Hour,
// served at /first-hour/). Contains the small,
// stable utility surface that the two instruments use identically.
//
// Voice-doctrine helpers live here so the personalize/escape contract is
// guaranteed to be the same across both instruments and across retakes.
// Keep this file ES5 - the parent files are ES5 by design (clinic-grade
// browser compatibility, no transpile step).

// Duration the "Progress saved" pill stays visible after autosave fires.
var SAVE_PILL_MS=1600;

// HTML escape via textContent. Used for any user-supplied string that
// gets injected into innerHTML.
function safe(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML}

// Friendly date format used on result-page sub-headers and PDF.
function formatDate(iso){var dt=new Date(iso);return dt.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}

// Whole-day delta between two ISO strings. Floors so partial days do not
// inflate the displayed count on retake comparisons.
function daysBetween(a,b){return Math.floor((new Date(b).getTime()-new Date(a).getTime())/86400000)}

// Minimal email gate. Used at form submission, not for validation theatre.
// The backend (GHL inbound webhook) does the authoritative check.
function isValidEmail(e){return e&&e.indexOf('@')>0&&e.indexOf('.')>0}

// Name placeholders in copy templates. With participantName set:
//   {name,} -> "Name, " (sentence-start direct address)
//   {,name} -> ", Name" (sentence-end direct address)
//   {name}  -> "Name"   (mid-sentence)
// Without participantName, all three drop cleanly and the first letter is
// re-capitalised so the sentence still reads. The {name} fallback becomes
// "you" so mid-sentence forms still parse.
function personalize(s){
  if(!s)return '';
  if(typeof participantName!=='undefined' && participantName){
    var nm=safe(participantName);
    return s.replace(/\{name,\}/g, nm+', ').replace(/\{,name\}/g, ', '+nm).replace(/\{name\}/g, nm);
  }
  var r=s.replace(/\{name,\}/g,'').replace(/\{,name\}/g,'').replace(/\{name\}/g,'you');
  return r.charAt(0).toUpperCase()+r.slice(1);
}

// --- Sticky chamber-progress nav-height observer ---
// The sticky #chamber-progress sits below the <nav> bar. On mobile + desktop
// the nav-height differs (44-60px) and the operator banner (non-prod) injects
// a 48px fixed bar that breaks any hard-coded offset. Measure the nav once on
// load and on every resize, write to --nav-h on documentElement so the CSS
// rule top:var(--nav-h,46px) follows the actual height. Idempotent: safe to
// call from both apps.
function homInstallNavHeightObserver(){
  try{
    var nav=document.querySelector('nav');
    if(!nav)return;
    function apply(){
      var h=nav.getBoundingClientRect().height;
      // Add the operator banner height if visible (banner is fixed-pos at top).
      var banner=document.getElementById('homOpsBanner');
      if(banner && banner.offsetParent!==null){h+=banner.getBoundingClientRect().height}
      document.documentElement.style.setProperty('--nav-h', Math.round(h)+'px');
    }
    apply();
    if(typeof ResizeObserver==='function'){
      var ro=new ResizeObserver(apply);
      ro.observe(nav);
      var b=document.getElementById('homOpsBanner');if(b)ro.observe(b);
    }
    window.addEventListener('resize', apply, {passive:true});
  }catch(_e){}
}
if(typeof window!=='undefined'){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', homInstallNavHeightObserver);
  }else{
    homInstallNavHeightObserver();
  }
}

// --- Auto-advance preference toggle ---
// Wires #qAutoadvanceToggle to localStorage. Default ON unless the user
// has explicitly turned it off OR the browser signals reduced-motion (in
// which case we still default the checkbox to OFF as the visible cue,
// even though selectOption gates separately on matchMedia).
function homInstallAutoAdvanceToggle(){
  try{
    var t=document.getElementById('qAutoadvanceToggle');
    if(!t)return;
    var pref='on';
    try{pref=localStorage.getItem('hom_auto_advance_pref')||''}catch(_e){}
    if(!pref){
      var reduce=false;try{reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(_e){}
      pref=reduce?'off':'on';
    }
    t.checked=(pref==='on');
    t.addEventListener('change', function(){
      try{localStorage.setItem('hom_auto_advance_pref', t.checked?'on':'off')}catch(_e){}
    });
  }catch(_e){}
}
if(typeof window!=='undefined'){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', homInstallAutoAdvanceToggle);
  }else{
    homInstallAutoAdvanceToggle();
  }
}

// --- Cross-subdomain attribution stitcher + outbound CTA tracker ---
// hom.mogire.com and the *.houseofmastery.co mirror subdomains live on
// different eTLD+1 zones, so _fbp/_fbc cookies don't share. On outbound
// clicks to those mirrors, we read the local _fbp/_fbc cookies and append
// them as URL params so the destination can re-seed Meta Advanced Matching.
// At the same time we fire HOM_TRACK('cta_clicked') so the same outbound
// click registers in our funnel analytics. Whitelist of destinations is
// kept small and explicit — bare `target` blanks an unknown link is a
// no-op so partner pages never get our cookies appended.
function homReadCookie(name){
  try{
    var rx=new RegExp('(?:^|; )'+name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'=([^;]*)');
    var m=document.cookie.match(rx);return m?decodeURIComponent(m[1]):'';
  }catch(_e){return ''}
}
function homInstallOutboundStitcher(){
  try{
    var STITCH_HOSTS={
      'kooraassess.houseofmastery.co':1,
      'firsthour.houseofmastery.co':1,
      'houseofmastery.co':1,
      'www.houseofmastery.co':1,
      'return90.com':1,
      'www.return90.com':1
    };
    document.addEventListener('click', function(e){
      var a=e.target&&e.target.closest&&e.target.closest('a[href]');
      if(!a)return;
      var href=a.getAttribute('href')||'';
      if(!href || href.charAt(0)==='#')return;
      var url;
      try{url=new URL(href, location.href)}catch(_e){return}
      // Only stitch http/https.
      if(url.protocol!=='https:' && url.protocol!=='http:')return;
      // Fire cta_clicked for any outbound link (different origin than current).
      if(url.origin!==location.origin){
        var instr=(location.pathname.indexOf('/first-hour')===0)?'first-hour':'koora';
        if(typeof HOM_TRACK==='function'){
          try{HOM_TRACK('cta_clicked',{instrument:instr,target:url.host+url.pathname})}catch(_e){}
        }
      }
      // Append _fbp/_fbc to whitelisted destinations only.
      if(STITCH_HOSTS[url.host]){
        var fbp=homReadCookie('_fbp');
        var fbc=homReadCookie('_fbc');
        if(fbp && !url.searchParams.has('_fbp')) url.searchParams.set('_fbp', fbp);
        if(fbc && !url.searchParams.has('_fbc')) url.searchParams.set('_fbc', fbc);
        if(fbp || fbc){
          a.setAttribute('href', url.toString());
        }
      }
    }, {capture:true});
    // On inbound: if URL carries _fbp/_fbc, persist them as cookies so the
    // destination's Pixel sees the originating identity. Cookies are scoped
    // to the destination's host + 90d (Meta default). This runs on every
    // page load on hom.mogire.com / mirrors — no-op when params absent.
    try{
      var u=new URL(location.href);
      var inFbp=u.searchParams.get('_fbp');
      var inFbc=u.searchParams.get('_fbc');
      if(inFbp && !homReadCookie('_fbp')){
        document.cookie='_fbp='+encodeURIComponent(inFbp)+'; max-age=7776000; path=/; SameSite=Lax';
      }
      if(inFbc && !homReadCookie('_fbc')){
        document.cookie='_fbc='+encodeURIComponent(inFbc)+'; max-age=7776000; path=/; SameSite=Lax';
      }
    }catch(_e){}
  }catch(_e){}
}
if(typeof window!=='undefined'){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', homInstallOutboundStitcher);
  }else{
    homInstallOutboundStitcher();
  }
}

