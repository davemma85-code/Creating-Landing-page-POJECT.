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