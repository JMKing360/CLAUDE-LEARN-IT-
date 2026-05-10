// House of Mastery - shared helpers
// Loaded before the inline assessment scripts on both index.html (KOORA
// UNFINISHED) and first-hour.html (The First Hour). Contains the small,
// stable utility surface that the two instruments use identically.
//
// Voice-doctrine helpers live here so the personalize/escape contract is
// guaranteed to be the same across both instruments and across retakes.
// Keep this file ES5 - the parent files are ES5 by design (clinic-grade
// browser compatibility, no transpile step).

// HTML escape via textContent. Used for any user-supplied string that
// gets injected into innerHTML.
function safe(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML}

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
