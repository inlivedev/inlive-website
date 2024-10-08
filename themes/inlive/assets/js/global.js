const mobileMenu = document.querySelector('#mobile-nav-menu');

const handleToggleNavMenu = () => {
  if (mobileMenu) mobileMenu.classList.toggle('hidden');
  document.body.classList.toggle('overflow-hidden');
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
  /** @type {HTMLButtonElement} */
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

  if (window.mixpanel) {
    /** @type {HTMLFormElement} */
    const waitlistForm = document.querySelector('dialog[data-dialog="waitlist-form"] form');

    if (waitlistForm) {
      waitlistForm.addEventListener('submit', (event) => {
        const form = event.target;
        const checkedCheckbox = form.querySelector('.waitlist-group:checked')
        const waitlist = checkedCheckbox ? checkedCheckbox.getAttribute('data-label') : null;

        window.mixpanel.track('Submit waitlist form', {
          waitlist: waitlist
        });
      })
    }
  }
});

/* Products navigation dropdown */
document.addEventListener('DOMContentLoaded', () => {
  const productsDropdown = document.querySelector('#products-nav-dropdown');
  const dropdownBody = productsDropdown.children['products-nav-dropdown-body'];

  const showDropdown = (dropdownToggler, dropdownBody) => {
    dropdownToggler.setAttribute('aria-expanded', true);
    dropdownBody.setAttribute('aria-hidden', false);
    dropdownBody.style.visibility = 'visible';
    dropdownBody.style.opacity = 1;
  }

  const hideDropdown = (dropdownToggler, dropdownBody) => {
    dropdownToggler.setAttribute('aria-expanded', false);
    dropdownBody.setAttribute('aria-hidden', true);
    dropdownBody.style.visibility = 'hidden';
    dropdownBody.style.opacity = 0;
  }

  if (productsDropdown instanceof HTMLElement) {
    productsDropdown.addEventListener('mouseenter', (event) => {
      event.stopPropagation();
      showDropdown(event.target, dropdownBody);
    });

    productsDropdown.addEventListener('mouseleave', (event) => {
      event.stopPropagation();
      hideDropdown(event.target, dropdownBody);
    });
  }
});