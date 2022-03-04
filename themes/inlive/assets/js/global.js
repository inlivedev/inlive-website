const navOverlay = document.querySelector('#mobile-nav-overlay');
const mobileMenu = document.querySelector('#mobile-nav-menu');

const handleToggleNavMenu = () => {
  if (navOverlay) navOverlay.classList.toggle('hidden');
  if (mobileMenu) mobileMenu.classList.toggle('hidden');
}