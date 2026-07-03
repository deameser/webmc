
/* Audio */
const audio = document.getElementById('info-sound-audio');
const playBtn = document.getElementById('playBtn');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const playIcon = document.getElementById('playIcon');
const seekBar = document.getElementById('seekBar');
const time = document.getElementById('time');
const tCur  = document.getElementById('timeCurrent');
const tAll  = document.getElementById('timeTotal');

const PLAY_SRC  = playIcon?.dataset.play  || './Images/common/sound_button_play.png';
const PAUSE_SRC = playIcon?.dataset.pause || './Images/common/sound_button_pause.png';

audio.addEventListener('loadedmetadata', () => {
  seekBar.max = audio.duration;
  const p = (audio.currentTime / audio.duration) || 0;
  gaugeWrap.style.setProperty('--p', p);
  updateGauge();
  onMeta();
});
audio.addEventListener('loadeddata', () => {
  onMeta();
});


audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100 || 0;
  gaugeWrap.style.setProperty('--fill', percent + '%');

  const p = (audio.currentTime / audio.duration) || 0;
  gaugeWrap.style.setProperty('--p', p);

  seekBar.value = audio.currentTime;
  /*time.textContent = formatTime(audio.currentTime);*/
  tCur.textContent = fmtTime(audio.currentTime || 0);
  seekBar.value = audio.currentTime || 0;
  syncFillPx();
});

audio.addEventListener('input', () => {
  seekBar.max = audio.duration;
  const p = (audio.currentTime / audio.duration) || 0;
  gaugeWrap.style.setProperty('--p', p);
  updateGauge();
});

/* 상태에 맞춰 버튼 갱신*/
audio.addEventListener('play',     syncPlayUI);
audio.addEventListener('playing',  syncPlayUI);
audio.addEventListener('pause',    syncPlayUI);
audio.addEventListener('ended',    syncPlayUI);
document.addEventListener('DOMContentLoaded', () => {
  syncPlayUI();
});
window.addEventListener('load', () => {
  if (audio.autoplay && audio.paused) {
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(syncPlayUI).catch(() => setPlayUI(false));
    }
  }
});

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playIcon.src = './Images/common/sound_button_pause.png';
    playIcon.alt = 'pause';
    /*playBtn.textContent = '⏸';*/
  } else {
    audio.pause();    
    playIcon.src = './Images/common/button_next.png';
    playIcon.alt = 'pause';
    /*playBtn.textContent = '▶︎';*/
  }
});

backBtn.addEventListener('click', () => {
    let targetTime = audio.currentTime - 10;
    if (targetTime < 0) {
      targetTime = 0;
    }

    if (!isNaN(audio.duration) && targetTime > audio.duration) {
      targetTime = audio.duration;
    }

    audio.currentTime = targetTime;
});

forwardBtn.addEventListener('click', () => {
    let targetTime = audio.currentTime + 10;
    if (targetTime < 0) {
      targetTime = 0;
    }

    if (!isNaN(audio.duration) && targetTime > audio.duration) {
      targetTime = audio.duration;
    }

    audio.currentTime = targetTime;
});

seekBar.addEventListener('input', () => {
  audio.currentTime = seekBar.value;
  
  const percent = (seekBar.value / seekBar.max) * 100 || 0;
  gaugeWrap.style.setProperty('--fill', percent + '%');

  const p = (seekBar.value / seekBar.max) || 0;
  gaugeWrap.style.setProperty('--p', p);
  
  const preview = parseFloat(seekBar.value) || 0;
  tCur.textContent = fmtTime(preview);
  syncFillPx();

  updateGauge();
});
seekBar.addEventListener('change', syncFillPx);
onMeta();


function updateGauge() {
  if (!audio.duration) return;

  // range 실제 값도 바꾼다
  seekBar.value = audio.currentTime;

  // 커스텀 게이지라면 채워진 비율도 바꾼다
  const percent = (audio.currentTime / audio.duration) * 100;
  if (gaugeWrap) {
    gaugeWrap.style.setProperty('--fill', percent + '%');
  }
  
  // 추가
  const p = (audio.currentTime / audio.duration) || 0;
  gaugeWrap.style.setProperty('--p', p);
}

function setPlayUI(isPlaying){
  if (!playIcon) return;
  playIcon.src = isPlaying ? PAUSE_SRC : PLAY_SRC;
  playIcon.alt = isPlaying ? 'pause' : 'play';
  playBtn?.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
}
function syncPlayUI(){ setPlayUI(!audio.paused && !audio.ended); }

function fmtTime(sec){
  if (!isFinite(sec) || sec < 0) return "00:00";
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2,'0') + ":" + String(s).padStart(2,'0');
}

function syncFillPx(){
  const rect  = seekBar.getBoundingClientRect();
  const styles= getComputedStyle(seekBar);
  const thumb = parseFloat(styles.getPropertyValue('--thumb')) || 18;

  const min = parseFloat(seekBar.min) || 0;
  const max = parseFloat(seekBar.max) || 100;
  const val = parseFloat(seekBar.value) || 0;
  const p   = (val - min) / (max - min);

  const fillPx = Math.round(p * (rect.width - thumb) + thumb / 2);
  seekBar.style.setProperty('--fill', fillPx + 'px');
}

function onMeta(){
  if (!audio || !isFinite(audio.duration)) return;
  seekBar.max = audio.duration;
  tAll.textContent = fmtTime(audio.duration);
  tCur.textContent = fmtTime(audio.currentTime || 0);
  seekBar.value = audio.currentTime || 0;
  syncFillPx();
}
function updateAudioForLang(lang) {
  const audio = document.getElementById('info-sound-audio');
  if (!audio) return;

  // data-src-ko, data-src-en 이런 식으로 읽기
  const attrName = 'data-src-' + lang;   // ex) data-src-ko
  const newSrc = audio.getAttribute(attrName);

  if (!newSrc) {
    // 해당 언어 파일 없으면 그냥 현재 src 유지
    return;
  }

  const wasPlaying  = !audio.paused && !audio.ended;
  const currentTime = audio.currentTime || 0;

  // 같은 파일이면 굳이 바꿀 필요 없음
  if (audio.src.endsWith(encodeURI(newSrc))) {
    return;
  }

  audio.src = newSrc;
  audio.load();

  // 플레이어 UI / 게이지는 기존 이벤트들(loadedmetadata, timeupdate)이 알아서 갱신
  if (wasPlaying) {
    audio.currentTime = currentTime; // 필요 없으면 이 줄 빼도 됨
    audio.play().catch(() => {});
  }
}
function updateScheduleImgForLang(lang) {
  const img = document.querySelector('.schedule-info-image-img');
  if (!img) return;

  const attrName = 'data-src-' + lang;   // 예: data-src-ko, data-src-en
  const newSrc = img.getAttribute(attrName);
  if (!newSrc) return;

  // 같은 이미지면 굳이 다시 안 바꿔도 됨 (옵션)
  if (img.src.includes(newSrc)) return;

  img.src = newSrc;
}
function updateTimeTableImgForLang(lang) {
  const img = document.querySelector('.art-explain-time-table-img');
  if (!img) return;

  const attrName = 'data-src-' + lang;   // 예: data-src-ko, data-src-en
  const newSrc = img.getAttribute(attrName);
  if (!newSrc) return;

  // 같은 이미지면 굳이 다시 안 바꿔도 됨 (옵션)
  if (img.src.includes(newSrc)) return;

  img.src = newSrc;
}