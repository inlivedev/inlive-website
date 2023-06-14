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

document.addEventListener('DOMContentLoaded', () => {
  const waitlistCTAs = document.querySelectorAll('.waitlist-cta');
  /** @type {HTMLDialogElement} */
  const waitlistFormDialog = document.querySelector('dialog[data-dialog="waitlist-form"]')
  const closeWaitListForm = document.querySelector('[data-dialog-close="waitlist-form"]')

  if (waitlistCTAs || waitlistCTAs.length > 0) {
    waitlistCTAs.forEach((cta) => {
      cta.addEventListener('click', () => {
        waitlistFormDialog.showModal()
      })
    })
  }

  if (waitlistFormDialog) {
    waitlistFormDialog.addEventListener('click', (event) => {
      if (event.target.nodeName === 'DIALOG') {
        waitlistFormDialog.close();
      }
    })
  }

  if (closeWaitListForm) {
    closeWaitListForm.addEventListener('click', (event) => {
      if (event.target.nodeName === 'BUTTON') {
        waitlistFormDialog.close();
      }
    })
  }
})