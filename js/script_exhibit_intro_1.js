document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.exhibit-title-slider-track');
  if (!track) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  // 마우스 누를 때
  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('is-grabbing');

    const rect = track.getBoundingClientRect();
    startX = e.pageX - rect.left;
    scrollLeft = track.scrollLeft;
  });

  // 마우스 뗄 때 (어디에서 떼든지 잡아주기)
  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-grabbing');
  });

  // 마우스 움직일 때 (어디에서 움직이든)
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();

    const rect = track.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const walk = (x - startX) * 1.2; // 드래그 민감도
    track.scrollLeft = scrollLeft - walk;
  });

  // 이미지 자체 드래그(기본 drag&drop) 막기
  track.querySelectorAll('img').forEach((img) => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  });
});