const els = {
  titleText: document.getElementById('titleText'),
  subtitleText: document.getElementById('subtitleText'),
  hintText: document.getElementById('hintText'),
  yesBtn: document.getElementById('yesBtn'),
  noBtn: document.getElementById('noBtn'),
  hero: document.getElementById('hero'),
  letter: document.getElementById('letter'),
  letterTitle: document.getElementById('letterTitle'),
  letterBody: document.getElementById('letterBody'),
  letterFooter: document.getElementById('letterFooter'),
};

const content = {
  pageTitle: 'Will you be…',
  subtitle: '…my Valentine?',
  letterTitle: 'A little note for you…',
  letterHtml: `
    <p>[Write your love letter / proposal here.]</p>
  `,
  letterFooter: '— Yours, [Name]',

  // 5 steps total; after the 5th click, the "No" button disappears.
  noPhrases: ['Are you sure?', 'Pookie please', 'Babyyyy !!', 'Pretty please…', 'Last chance…'],
};

function hasMeaningfulContent(el) {
  if (!el) return false;
  return el.textContent && el.textContent.trim().length > 0;
}

if (els.titleText) els.titleText.textContent = content.pageTitle;
if (els.subtitleText) els.subtitleText.textContent = content.subtitle;
if (els.letterTitle && !hasMeaningfulContent(els.letterTitle)) els.letterTitle.textContent = content.letterTitle;
if (els.letterBody && !hasMeaningfulContent(els.letterBody)) els.letterBody.innerHTML = content.letterHtml;
if (els.letterFooter && !hasMeaningfulContent(els.letterFooter)) els.letterFooter.textContent = content.letterFooter;

let noClicks = 0;
let yesScale = 1;

function applyYesScale() {
  // Keep it sane on small screens.
  const clamped = Math.min(yesScale, 2.4);
  els.yesBtn.style.setProperty('--scale', String(clamped));
}

function onNoClick() {
  noClicks += 1;

  // Each "No" click makes "Yes" bigger.
  yesScale += 0.18;
  applyYesScale();

  const phraseIndex = Math.min(noClicks - 1, content.noPhrases.length - 1);
  els.noBtn.textContent = content.noPhrases[phraseIndex];

  // After 5 clicks, hide "No".
  if (noClicks >= 5) {
    els.noBtn.hidden = true;
    if (els.hintText) els.hintText.textContent = 'Okay… only one choice left.';
  }
}

function playFallbackTone() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const gain = ctx.createGain();
  gain.gain.value = 0.0001;
  gain.connect(ctx.destination);

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc1.type = 'sine';
  osc2.type = 'triangle';
  osc1.frequency.value = 220;
  osc2.frequency.value = 277.18;
  osc1.connect(gain);
  osc2.connect(gain);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 12);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 12.1);
  osc2.stop(now + 12.1);
}

function tryPlayMp3OrFallbackTone() {
  // You said you'll keep songs inside images/.
  const sourcesToTry = ['images/song.mp3', 'song.mp3'];
  const audio = new Audio();
  audio.loop = true;
  audio.volume = 0.6;

  const trySource = (index) => {
    if (index >= sourcesToTry.length) {
      playFallbackTone();
      return;
    }

    audio.src = sourcesToTry[index];

    // If the file is missing/unplayable, try the next one.
    const onError = () => {
      audio.removeEventListener('error', onError);
      trySource(index + 1);
    };
    audio.addEventListener('error', onError, { once: true });

    audio.play().catch(() => {
      audio.removeEventListener('error', onError);
      trySource(index + 1);
    });
  };

  trySource(0);
}

function onYesClick() {
  els.hero.hidden = true;
  els.letter.hidden = false;
  document.body.classList.add('isLetterOpen');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  tryPlayMp3OrFallbackTone();
}

els.noBtn.addEventListener('click', onNoClick);
els.yesBtn.addEventListener('click', onYesClick);

applyYesScale();
