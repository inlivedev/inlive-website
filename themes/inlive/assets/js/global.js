const navOverlay = document.querySelector('#mobile-nav-overlay');
const mobileMenu = document.querySelector('#mobile-nav-menu');

const handleToggleNavMenu = () => {
  if (navOverlay) navOverlay.classList.toggle('hidden');
  if (mobileMenu) mobileMenu.classList.toggle('hidden');
}

window.addEventListener('load', () => {
  if (window.mixpanel) {
    const openLinkTrackers = document.querySelectorAll('[data-tracking-event="open-link"]');

    if (openLinkTrackers.length > 0) {
      openLinkTrackers.forEach((link) => {
        link.classList.add('tracking-event-open-link')
      })

      mixpanel.track_links('.tracking-event-open-link', 'Open link', (element) => {
        const data = {}
        const label = element.getAttribute('data-tracking-label')

        if (label) {
          data.label = label
        }

        return data
      });
    }
  }
})