/* ============================================================
   RACINES v5 — Ferme Gaïa
   app.js — JavaScript partagé (navigation multi-pages)
   ============================================================ */

/** Naviguer vers une autre page HTML */
function go(page) {
  window.location.href = page + '.html';
}

/** Retour à la page précédente */
function goBack() {
  window.history.back();
}

/** Cocher/décocher une mission (page accueil) */
function checkMission(cid, mid) {
  document.getElementById(cid).classList.toggle('checked');
  document.getElementById(mid).classList.toggle('done');
}

/** Filtrer les catégories TrocVert */
function filterCat(el) {
  document.querySelectorAll('.troc-cat').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

/** Système de notation par étoiles */
const starLabels = ['😕 Pas génial', '😐 Correct', '🙂 Bien', '😊 Très bien', '🤩 Parfait !'];
function rateStar(n) {
  document.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('active', i < n));
  document.getElementById('star-label').textContent = starLabels[n - 1];
}

/** Notification toast */
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}

/** Onboarding : sauvegarde le profil et navigue */
const profil = JSON.parse(sessionStorage.getItem('profil') || '{}');
function selectOb(el, nextPage, key, val) {
  el.closest('.ob-options').querySelectorAll('.ob-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  profil[key] = val;
  sessionStorage.setItem('profil', JSON.stringify(profil));
  setTimeout(() => go(nextPage), 320);
}

/** Remplir le résumé onboarding (appelé sur ob-resume.html) */
function fillResume() {
  const p = JSON.parse(sessionStorage.getItem('profil') || '{}');
  const e = document.getElementById('res-espace');
  const r = document.getElementById('res-raison');
  const d = document.getElementById('res-debut');
  if (e) e.textContent = p['espace'] || '—';
  if (r) r.textContent = p['raison'] || '—';
  if (d) d.textContent = p['debut'] || '—';
}
