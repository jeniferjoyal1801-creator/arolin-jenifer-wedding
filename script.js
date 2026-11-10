// Edit the invitation details here. Dates use YYYY-MM-DD and 24-hour time.
const WEDDING = {
  groom: 'Arolin Amose',
  bride: 'Jenifer Joyal',
  date: '2026-12-14',
  startTime: '15:00',
  endTime: '16:00',
  timezoneOffset: '+05:30',
  venue: 'CSI Church Aralvaimozhi',
  groomParents: 'Amose and Benedit Mary',
  brideParents: 'Joyal Thambiraj and Reji Juliet',
  weddingMapUrl: 'https://share.google/bUIDdLxIayKKD1hfX',
  receptionMapUrl: 'https://maps.app.goo.gl/ugiqvyNjLM4W5XDHA',
};

const $ = (id) => document.getElementById(id);
const music = $('bgMusic');
const musicButton = $('musicToggle');
function showMusicState(isPlaying) {
  musicButton.classList.toggle('playing', isPlaying);
  $('musicLabel').textContent = isPlaying ? 'Pause music' : 'Play music';
  musicButton.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
}
// Try autoplay; mobile browsers may require the guest's first tap.
music.play().then(() => showMusicState(true)).catch(() => { $('musicLabel').textContent = 'Tap for music'; });
musicButton.addEventListener('click', async () => {
  if (music.paused) {
    try { await music.play(); showMusicState(true); }
    catch { $('musicLabel').textContent = 'Tap to play'; }
  } else { music.pause(); showMusicState(false); }
});

function openInvitation() {
  $('home').classList.add('opened');
  if (music.paused) music.play().then(() => showMusicState(true)).catch(() => { $('musicLabel').textContent = 'Tap for music'; });
  $('welcome').scrollIntoView({ behavior: 'smooth' });
}
$('openInvite').addEventListener('click', openInvitation);
$('scrollCue').addEventListener('click', openInvitation);

const dateParts = WEDDING.date.split('-').map(Number);
const timeParts = WEDDING.startTime.split(':').map(Number);
// The countdown follows the visitor's device local time.
const weddingMoment = new Date(`${WEDDING.date}T${WEDDING.startTime}:00${WEDDING.timezoneOffset}`);
const pad = (n) => String(n).padStart(2, '0');
function updateCountdown() {
  let remaining = Math.max(0, weddingMoment.getTime() - Date.now());
  const days = Math.floor(remaining / 86400000); remaining %= 86400000;
  const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
  const minutes = Math.floor(remaining / 60000); const seconds = Math.floor((remaining % 60000) / 1000);
  $('days').textContent = days; $('hours').textContent = pad(hours); $('minutes').textContent = pad(minutes); $('seconds').textContent = pad(seconds);
}
updateCountdown(); setInterval(updateCountdown, 1000);

const canvas = $('scratchCanvas'), ctx = canvas.getContext('2d', { willReadFrequently: true });
let drawing = false, revealed = false, scratchCount = 0;
function setupScratch() {
  const rect = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr); canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  g.addColorStop(0, '#8b6837'); g.addColorStop(.28, '#e7d3a7'); g.addColorStop(.52, '#b48e53'); g.addColorStop(.76, '#f2e2bd'); g.addColorStop(1, '#98733e');
  ctx.fillStyle = g; ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = 'rgba(255,255,255,.22)';
  for (let i = 0; i < 30; i++) { const x = Math.random() * rect.width, y = Math.random() * rect.height; ctx.beginPath(); ctx.arc(x, y, Math.random() * 1.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#fff9ec'; ctx.textAlign = 'center';
  ctx.font = '9px DM Sans, sans-serif'; ctx.letterSpacing = '2px'; ctx.fillText('✧  SCRATCH TO REVEAL  ✧', rect.width / 2, rect.height / 2 - 5);
  ctx.font = 'italic 13px Georgia, serif'; ctx.letterSpacing = '0px'; ctx.fillText('a little surprise awaits', rect.width / 2, rect.height / 2 + 19);
}
function point(e) { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
function erase(e) {
  if (!drawing || revealed) return;
  const p = point(e); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, Math.PI * 2); ctx.fill();
  if (++scratchCount % 7 === 0) checkReveal();
}
function checkReveal() {
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data; let transparent = 0;
  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] < 80) transparent++;
  if (transparent / (pixels.length / 4) > .42) {
    revealed = true; ctx.clearRect(0, 0, canvas.width, canvas.height); canvas.style.transition = 'opacity .6s'; canvas.style.opacity = '0';
    $('scratchHint').textContent = 'Our wedding day — we can’t wait to celebrate with you'; burstPetals(); setTimeout(() => canvas.remove(), 700);
  }
}
canvas.addEventListener('pointerdown', e => { if (revealed) return; drawing = true; canvas.setPointerCapture(e.pointerId); erase(e); });
canvas.addEventListener('pointermove', erase);
canvas.addEventListener('pointerup', () => { drawing = false; checkReveal(); });
canvas.addEventListener('pointercancel', () => drawing = false);
setupScratch(); window.addEventListener('resize', () => { if (!revealed) setupScratch(); });

function burstPetals() {
  const layer = $('petalLayer');
  for (let i = 0; i < 34; i++) { const petal = document.createElement('i'); petal.className = 'petal'; petal.style.left = `${Math.random() * 100}%`; petal.style.setProperty('--drift', `${Math.random() * 180 - 90}px`); petal.style.animationDelay = `${Math.random() * 1.5}s`; petal.style.animationDuration = `${2.7 + Math.random() * 1.8}s`; layer.appendChild(petal); setTimeout(() => petal.remove(), 5200); }
}

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(section => observer.observe(section));

// Keep visible invitation labels in sync with the editable details above.
document.querySelectorAll('.hero h1, .couple h2, .closing h2').forEach(el => { el.innerHTML = `${WEDDING.groom.split(' ')[0]} <em>&amp;</em>${el.closest('.hero') ? '<br class="mobile-break"> ' : '<br>'}${WEDDING.bride.split(' ')[0]}`; });
document.getElementById('weddingMap').href = WEDDING.weddingMapUrl;
document.getElementById('receptionMap').href = WEDDING.receptionMapUrl;
document.getElementById('familyNames').innerHTML = `<span>GROOM'S PARENTS</span><p>${WEDDING.groomParents}</p><span>BRIDE'S PARENTS</span><p>${WEDDING.brideParents}</p>`;
document.title = `${WEDDING.groom.split(' ')[0]} & ${WEDDING.bride.split(' ')[0]} — Wedding Invitation`;
document.querySelector('meta[property="og:title"]').content = document.title;
document.querySelector('meta[name="description"]').content = `With grateful hearts, ${WEDDING.groom} and ${WEDDING.bride} invite you to celebrate their wedding on ${WEDDING.date} at ${WEDDING.venue}.`;
document.querySelector('meta[property="og:description"]').content = `Together with our families, we joyfully invite you to celebrate our wedding. ${WEDDING.date} · ${WEDDING.venue}.`;
document.querySelector('.side-caption').textContent = `${WEDDING.groom} · ${WEDDING.bride}`;
const weddingDate = new Date(`${WEDDING.date}T12:00:00`);
const monthName = weddingDate.toLocaleDateString('en', { month: 'long' }).toUpperCase();
const weekday = weddingDate.toLocaleDateString('en', { weekday: 'long' }).toUpperCase();
$('dateTopline').textContent = `${weekday} · ${monthName}`;
$('dateDay').textContent = String(weddingDate.getDate());
$('dateYear').textContent = String(weddingDate.getFullYear());
const compactDate = `${String(weddingDate.getDate()).padStart(2, '0')} · ${String(weddingDate.getMonth() + 1).padStart(2, '0')} · ${weddingDate.getFullYear()}`;
document.querySelector('.hero-date').innerHTML = compactDate.replaceAll(' · ', ' <span>·</span> ');
document.querySelector('.closing-date').textContent = compactDate;
const formatTime = value => new Date(`2000-01-01T${value}:00`).toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' });
$('dateTime').textContent = `CEREMONY AT ${formatTime(WEDDING.startTime).toUpperCase()}`;
const townSuffix = /\s+(Aralvaimozhi)$/i;
document.querySelector('.venue-card h3').textContent = WEDDING.venue.replace(townSuffix, '');
document.querySelector('.venue-card p').textContent = (WEDDING.venue.match(townSuffix) || ['', ''])[1];
document.querySelector('.venue-time').innerHTML = `${weekday}, ${String(weddingDate.getDate()).padStart(2, '0')} ${monthName} ${weddingDate.getFullYear()}<br>${formatTime(WEDDING.startTime)} – ${formatTime(WEDDING.endTime)}`;
