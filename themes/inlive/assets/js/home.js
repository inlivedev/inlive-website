const navOverlay = document.querySelector('#mobile-nav-overlay');
const mobileMenu = document.querySelector('#mobile-nav-menu');

const handleToggleNavMenu = () => {
  if (navOverlay) navOverlay.classList.toggle('hidden');
  if (mobileMenu) mobileMenu.classList.toggle('hidden');
}

window.addEventListener('load', () => {
  const sliderUseCases = new KeenSlider('#slider-use-cases', {
    loop: true,
    created: (slider) => {
      const navigation = slider.container.nextElementSibling;
      const arrowLeft = navigation.querySelector('.arrow-left');
      const arrowRight = navigation.querySelector('.arrow-right');
      arrowLeft.addEventListener('click', () => slider.prev());
      arrowRight.addEventListener('click', () => slider.next());
    },
  });
});

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 20) {
    const headerContent = document.querySelector('.header-content');
    if (!headerContent.classList.contains('scrolled')) {
      headerContent.classList.add('scrolled');
    }
  } else {
    const headerContent = document.querySelector('.header-content');
    if (headerContent.classList.contains('scrolled')) {
      headerContent.classList.remove('scrolled');
    }
  }
});