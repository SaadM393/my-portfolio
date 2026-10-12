/**
 * Creates the testimonial controls and keeps each selected quote in view.
 * Cloned edge cards preserve the preview's partial cards without adding extra dots.
 */
function initializeRecommendationCarousel() {
  const carouselTrack = document.querySelector('.carousel-track');
  const originalCards = Array.from(
    document.querySelectorAll('.quote-card'),
  );
  const pagination = document.querySelector('.dots');
  const previousButton = document.querySelector('.carousel-arrow.prev');
  const nextButton = document.querySelector('.carousel-arrow.next');

  if (
    !carouselTrack ||
    originalCards.length === 0 ||
    !pagination ||
    !previousButton ||
    !nextButton
  ) {
    return;
  }

  // A clone of the last quote forms the partial card at the left edge.
  const leadingCard = originalCards[originalCards.length - 1].cloneNode(true);
  leadingCard.setAttribute('aria-hidden', 'true');
  carouselTrack.prepend(leadingCard);

  // Three trailing clones keep the last slide filled at the compact width.
  originalCards.slice(0, 3).forEach((card) => {
    const clonedCard = card.cloneNode(true);
    clonedCard.setAttribute('aria-hidden', 'true');
    carouselTrack.append(clonedCard);
  });

  let activeSlide = 0;

  function createPagination() {
    pagination.replaceChildren();

    for (let slideIndex = 0; slideIndex < originalCards.length; slideIndex += 1) {
      const paginationButton = document.createElement('button');
      paginationButton.type = 'button';
      paginationButton.setAttribute('role', 'tab');
      paginationButton.setAttribute(
        'aria-label',
        `Show recommendation ${slideIndex + 1}`,
      );
      paginationButton.addEventListener('click', () => {
        showSlide(slideIndex);
      });
      pagination.append(paginationButton);
    }
  }

  function updateActivePagination() {
    Array.from(pagination.children).forEach((button, index) => {
      button.setAttribute(
        'aria-selected',
        String(index === activeSlide),
      );
    });
  }

  function showSlide(requestedIndex) {
    // Modulo keeps the previous and next controls cycling through all quotes.
    activeSlide = (requestedIndex + originalCards.length) % originalCards.length;

    const leadingCardWidth = carouselTrack.firstElementChild
      .getBoundingClientRect()
      .width;
    const cardGap = Number.parseFloat(
      window.getComputedStyle(carouselTrack).gap,
    ) || 0;
    const cardStep = leadingCardWidth + cardGap;
    const previewShowsEdgeCards =
      window.innerWidth > 650 && window.innerWidth <= 900;
    const leadingOffset = previewShowsEdgeCards ? 0.75 : 1;
    const horizontalOffset = (activeSlide + leadingOffset) * cardStep;

    carouselTrack.style.transform = `translateX(-${horizontalOffset}px)`;
    updateActivePagination();
  }

  previousButton.addEventListener('click', () => {
    showSlide(activeSlide - 1);
  });

  nextButton.addEventListener('click', () => {
    showSlide(activeSlide + 1);
  });

  window.addEventListener('resize', () => {
    showSlide(activeSlide);
  });

  createPagination();
  showSlide(0);
}

/** Keeps the compact navigation usable on touch screens and by keyboard. */
function initializeMobileNavigation() {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav');

  if (!menuButton || !navigation) {
    return;
  }

  function setMenuOpen(isOpen) {
    navigation.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation' : 'Open navigation',
    );
    menuButton.textContent = isOpen ? '×' : '☰';
  }

  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.contains('open');
    setMenuOpen(!isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });
}

/** Validates the demo form locally; no values are stored or sent anywhere. */
function initializeContactForm() {
  const contactForm = document.querySelector('#contact-form');
  const feedbackMessage = document.querySelector('.form-message');

  if (!contactForm || !feedbackMessage) {
    return;
  }

  function showFeedback(message, isError = false) {
    feedbackMessage.textContent = message;
    feedbackMessage.classList.toggle('is-error', isError);
  }

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullName = contactForm.elements.name.value.trim();
    const emailAddress = contactForm.elements.email.value.trim();
    const message = contactForm.elements.message.value.trim();

    if (!fullName || !emailAddress || !message) {
      showFeedback(
        'Please complete your name, email, and message.',
        true,
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailAddress)) {
      showFeedback('Please enter a valid email address.', true);
      return;
    }

    showFeedback(
      'Thanks! This demo does not send or save your details.',
    );
    contactForm.reset();
  });
}

initializeRecommendationCarousel();
initializeMobileNavigation();
initializeContactForm();
