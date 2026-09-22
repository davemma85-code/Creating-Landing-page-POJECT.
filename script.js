const mobileMenu = document.querySelector('.mobilecontainer');
const closeBtn = document.querySelector('.fa-close');
const hamburgerBtn = document.querySelector('.fa-bars');
const backdrop = document.querySelector('.menu-backdrop');

function openMenu() {
  mobileMenu.classList.add('active');
  backdrop.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock scroll
}

function closeMenu() {
  mobileMenu.classList.remove('active');
  backdrop.classList.remove('active');
  document.body.style.overflow = 'auto'; // Unlock scroll
}

// Open when you click hamburger
hamburgerBtn.addEventListener('click', openMenu);

// Close when you click X
closeBtn.addEventListener('click', closeMenu);

// Close when you click the dark background
backdrop.addEventListener('click', closeMenu);

// Close when you click a link
document.querySelectorAll('.mobilecontainer a').forEach(link => {
  link.addEventListener('click', closeMenu);
});



// Na the Transitions be this
const hidElements = document.querySelectorAll('.yo');


const observer = new IntersectionObserver((entries) => {
    entries.forEach((el)=>{
        if(el.isIntersecting){
            el.target.classList.add('show');
        }
        else{
            el.target.classList.remove('show');
        }
    });
});

hidElements.forEach((el) =>{
    observer.observe(el)
});












// ============== PORTFOLIO - SMOOTH CONTINUOUS INFINITE ==============
function initPortfolio() {
  const wrapper = document.getElementById('portfolioWrapper');
  if (!wrapper) return;
  const originals = [...wrapper.children];
  if (!originals.length) return;

  // Clone 3 times for revolving gate
  wrapper.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    originals.forEach(card => wrapper.appendChild(card.cloneNode(true)));
  }

  requestAnimationFrame(() => {
    const singleSetWidth = wrapper.scrollWidth / 3;
    wrapper.scrollLeft = singleSetWidth;

    let speed = 1.1; // Portfolio speed: 0.6 = slow, 1.1 = normal, 1.8 = fast
    let isPaused = false;
    let resumeTimer;

    function loop() {
      if (!isPaused) {
        wrapper.scrollLeft += speed;

        // revolving gate - seamless
        if (wrapper.scrollLeft >= singleSetWidth * 2 - 10) {
          wrapper.scrollLeft = singleSetWidth + (wrapper.scrollLeft - singleSetWidth * 2);
        }
        if (wrapper.scrollLeft <= 10) {
          wrapper.scrollLeft = singleSetWidth + wrapper.scrollLeft;
        }
      }
      requestAnimationFrame(loop);
    }
    loop();

    const pause = () => {
      isPaused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => isPaused = false, 3000);
    };

    wrapper.addEventListener('touchstart', pause, {passive:true});
    wrapper.addEventListener('wheel', pause, {passive:true});
    wrapper.addEventListener('mousedown', pause);
  });
}

// ============== TESTIMONIAL - CARD BY CARD NO PAGE JUMP ==============
function initTestimonial() {
  const wrapper = document.getElementById('testimonialWrapper');
  if (!wrapper) return;
  const originals = [...wrapper.children];
  if (!originals.length) return;

  // Clone 3 times
  wrapper.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    originals.forEach(card => wrapper.appendChild(card.cloneNode(true)));
  }

  requestAnimationFrame(() => {
    const cards = [...wrapper.children];
    const singleSet = originals.length;
    let currentIndex = singleSet; // start in middle set

    // This calculates center WITHOUT moving the page
    function getScrollLeftForCard(index) {
      const card = cards[index];
      if (!card) return 0;
      return card.offsetLeft - (wrapper.clientWidth / 2) + (card.offsetWidth / 2);
    }

    function goTo(index, smooth = true) {
      const totalCards = cards.length;

      // If about to go out of bounds, jump to middle first - so it never stops
      if (index >= totalCards - 1) {
        currentIndex = singleSet + (index % singleSet);
        wrapper.scrollTo({ left: getScrollLeftForCard(currentIndex), behavior: 'auto' });
        index = currentIndex + 1;
      }
      if (index < 0) {
        currentIndex = singleSet - 1;
        wrapper.scrollTo({ left: getScrollLeftForCard(currentIndex), behavior: 'auto' });
        index = currentIndex - 1;
      }

      wrapper.scrollTo({
        left: getScrollLeftForCard(index),
        behavior: smooth? 'smooth' : 'auto'
      });
      currentIndex = index;

      // After animation, silently reset to middle set for infinite loop
      setTimeout(() => {
        if (currentIndex >= singleSet * 2) {
          currentIndex = currentIndex - singleSet;
          wrapper.scrollTo({ left: getScrollLeftForCard(currentIndex), behavior: 'auto' });
        }
        if (currentIndex < singleSet * 0.5) {
          currentIndex = currentIndex + singleSet;
          wrapper.scrollTo({ left: getScrollLeftForCard(currentIndex), behavior: 'auto' });
        }
      }, 650);
    }

    // initial position
    goTo(currentIndex, false);

    let autoTimer;
    let isUserScrolling = false;
    let resumeTimer;

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isUserScrolling) goTo(currentIndex + 1, true);
      }, 5000); // <-- HOW LONG IT STAYS ON ONE CARD: 5000 = 5 seconds
    }
    function stopAuto() { clearInterval(autoTimer); }

    startAuto();

    // Detect manual scroll
    let scrollTimeout;
    wrapper.addEventListener('scroll', () => {
      if (!isUserScrolling) return; // ignore auto scroll
      stopAuto();
      clearTimeout(scrollTimeout);
      clearTimeout(resumeTimer);
      scrollTimeout = setTimeout(() => {
        let closest = currentIndex, minDist = Infinity;
        const currentLeft = wrapper.scrollLeft;
        cards.forEach((c, i) => {
          const target = getScrollLeftForCard(i);
          const dist = Math.abs(target - currentLeft);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        goTo(closest, true);
        isUserScrolling = false;
        resumeTimer = setTimeout(() => startAuto(), 3000);
      }, 150);
    }, {passive: true});

    wrapper.addEventListener('touchstart', () => { isUserScrolling = true; stopAuto(); }, {passive:true});
    wrapper.addEventListener('mousedown', () => { isUserScrolling = true; stopAuto(); });
  });
}

initPortfolio();
initTestimonial();
