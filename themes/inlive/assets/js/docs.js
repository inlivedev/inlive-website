const sideNavOverlay = document.querySelector('#side-nav-overlay');
const sideNavMenu = document.querySelector('#side-nav-menu');

const handleToggleSideNavMenu = () => {
  if (sideNavOverlay) sideNavOverlay.classList.toggle('hidden');
  if (sideNavMenu) sideNavMenu.classList.toggle('show');
}

const handleBackToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}