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

/* ============================================================
   ========= FONCTIONS DE LA PAGE D'ACCUEIL / LOGIN =========
   Utilisées uniquement par index.html
   ============================================================ */

/** Changer de vue sur la page login (welcome / signup / login) */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.querySelectorAll('.field-error').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.field input').forEach(i => i.classList.remove('error'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Validation basique d'un courriel */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Afficher / cacher l'erreur d'un champ */
function setFieldError(inputId, errId, show) {
  document.getElementById(inputId).classList.toggle('error', show);
  document.getElementById(errId).classList.toggle('show', show);
}

/** Calculer la force d'un mot de passe et mettre à jour l'indicateur */
function updatePwdStrength() {
  const pwdInput = document.getElementById('signup-pwd');
  const box  = document.getElementById('pwd-strength');
  const fill = document.getElementById('pwd-bar-fill');
  const lbl  = document.getElementById('pwd-label');
  if (!pwdInput) return;
  const v = pwdInput.value;
  if (!v) { box.classList.remove('show'); return; }
  box.classList.add('show');

  let score = 0;
  if (v.length >= 8) score++;
  if (v.length >= 12) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;

  const widths = ['20%', '40%', '60%', '80%', '100%'];
  const colors = ['#c14a3b', '#e67e22', '#f1c40f', '#8fa066', '#6b7c4a'];
  const labels = ['Très faible', 'Faible', 'Correct', 'Bon', 'Excellent'];
  const idx = Math.min(score, 5) - 1;
  if (idx < 0) { fill.style.width = '0'; lbl.textContent = '—'; }
  else {
    fill.style.width = widths[idx];
    fill.style.background = colors[idx];
    lbl.textContent = labels[idx];
    lbl.style.color = colors[idx];
  }
}

/** Soumettre le formulaire d'inscription */
function handleSignup() {
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pwd   = document.getElementById('signup-pwd').value;
  const pwd2  = document.getElementById('signup-pwd2').value;

  setFieldError('signup-name',  'err-signup-name',  !name);
  setFieldError('signup-email', 'err-signup-email', !isValidEmail(email));
  setFieldError('signup-pwd',   'err-signup-pwd',   pwd.length < 8);
  setFieldError('signup-pwd2',  'err-signup-pwd2',  pwd !== pwd2 || !pwd2);

  if (!name || !isValidEmail(email) || pwd.length < 8 || pwd !== pwd2) {
    toast('Vérifie les champs en rouge');
    return;
  }

  const account = { name, email: email.toLowerCase(), pwd, createdAt: Date.now() };
  localStorage.setItem('racines_account', JSON.stringify(account));
  localStorage.setItem('racines_logged_in', '1');

  toast('Compte créé ! Bienvenue ' + name + ' 🌱');
  setTimeout(() => go('ob1'), 1100);
}

/** Soumettre le formulaire de connexion */
function handleLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pwd   = document.getElementById('login-pwd').value;

  if (!isValidEmail(email)) {
    setFieldError('login-email', 'err-login-email', true);
    return;
  }
  setFieldError('login-email', 'err-login-email', false);

  const saved = JSON.parse(localStorage.getItem('racines_account') || 'null');

  if (!saved || saved.email !== email || saved.pwd !== pwd) {
    setFieldError('login-pwd', 'err-login-pwd', true);
    toast('Courriel ou mot de passe incorrect');
    return;
  }

  setFieldError('login-pwd', 'err-login-pwd', false);
  localStorage.setItem('racines_logged_in', '1');
  toast('Bon retour ' + saved.name + ' 🌿');
  setTimeout(() => go('accueil'), 900);
}

/** Lien "mot de passe oublié" (simulation) */
function forgotPassword() {
  toast('Lien de réinitialisation envoyé (simulation)');
}

/** Initialiser la page login (touche Entrée + écouteur mot de passe) */
function initLoginPage() {
  const pwdInput = document.getElementById('signup-pwd');
  if (pwdInput) pwdInput.addEventListener('input', updatePwdStrength);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const active = document.querySelector('.view.active');
    if (!active) return;
    if (active.id === 'view-signup') handleSignup();
    else if (active.id === 'view-login') handleLogin();
  });
}

/* SVG des deux états de l'icône œil */
const eyeIconShow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const eyeIconHide = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

/** Afficher ou cacher le mot de passe d'un champ */
function togglePwd(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const shown = input.type === 'text';
  input.type = shown ? 'password' : 'text';
  btn.innerHTML = shown ? eyeIconShow : eyeIconHide;
  btn.setAttribute('aria-label', shown ? 'Afficher le mot de passe' : 'Masquer le mot de passe');
}
