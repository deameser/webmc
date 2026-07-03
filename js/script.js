document.addEventListener('DOMContentLoaded', function() {
    const selectLang = document.getElementById('langSelect');
    const selectLangIcon = document.getElementById('langSelectIcon');
    let langIcons = {
        ko: './Images/common/lang_text_kor.png',
        en: './Images/common/lang_text_eng.png',
        ja: './Images/common/lang_text_jpn.png'
    }; 
    if(selectLang)
    {
        const path = window.location.pathname;
        const isPage2 = path.includes('page_schedule');

        // let langIcons;
        // if (isPage2) {
        //     // directions 페이지에서만 다르게 쓰고 싶은 아이콘 경로
        //     langIcons = {
        //         ko: './Images/schedule/lang_text_kor.png',
        //         en: './Images/schedule/lang_text_eng.png',
        //         ja: './Images/schedule/lang_text_jpn.png',
        //     };
        // } else {
            // 그 외 페이지(혹시 추가되면)용 기본값
            langIcons = {
                ko: './Images/common/lang_text_kor.png',
                en: './Images/common/lang_text_eng.png',
                ja: './Images/common/lang_text_jpn.png',
            };
        // }

        const saved = localStorage.getItem("lang") || "ko";
        selectLang.value = saved;
        setLanguage(saved);
        updateLangIcon(saved);
        if (typeof updateAudioForLang === 'function') {
            updateAudioForLang(saved);
        }
        if (typeof updateScheduleImgForLang === 'function') {
            updateScheduleImgForLang(saved);
        }
        if (typeof updateTimeTableImgForLang === 'function') {
            updateTimeTableImgForLang(saved);
        }

        // 드롭다운이 바뀔 때마다 실행
        selectLang.addEventListener("change", function () {
            const lang = this.value;
            setLanguage(lang);
            localStorage.setItem("lang", lang);
            updateLangIcon(lang);
            if (typeof updateAudioForLang === 'function') {
                updateAudioForLang(lang);
            }
            if (typeof updateScheduleImgForLang === 'function') {
                updateScheduleImgForLang(lang);
            }
            if (typeof updateTimeTableImgForLang === 'function') {
                updateTimeTableImgForLang(lang);
            }
        });
    }
    function updateLangIcon(lang) {
        if (!selectLangIcon) return;
        selectLangIcon.src = langIcons[lang] || langIcons['ko'];
    }
    
    var btn = document.getElementById('goTopBtn');
    if (btn)
    {btn.addEventListener('click', function (e) {
        // 다른 핸들러가 막는 거부터 차단
        e.preventDefault();
        e.stopImmediatePropagation();

        // 스크롤할 가능성 있는 애들 전부 0으로
        var targets = [
            document.scrollingElement,
            document.documentElement,
            document.body,
            document.querySelector('.intro-container'),
            document.querySelector('.container'),
            document.querySelector('main')
        ];

        targets.forEach(function (el) {
            if (!el) return;
            // 부드럽게 되는 애는 이렇게
            try {
                el.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                // 안 되는 애는 그냥 강제로
                el.scrollTop = 0;
            }
        });

        // 브라우저 기본 스크롤도 한 번 더
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, true); // ← 여기 중요
    }
})

function setLanguage(lang)
{
    const current = translations[lang];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const text = current[key];
        if(text)
        {
            el.textContent = text;
        }
    });
}
function goBack()
{
  window.location.href = './index.html';
  /*
    if (window.history.length > 1) 
    {
        history.back();
        return;
    }
    */
}

function scrollToTop(e) {
    e.preventDefault();

    // 1) 진짜로 스크롤이 나는 요소를 찾는다
    const scrollTarget =
        document.querySelector('.intro-container') ||
        document.querySelector('.container') ||
        document.documentElement;

    scrollTarget.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}