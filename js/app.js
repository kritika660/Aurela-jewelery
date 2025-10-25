/* Core runtime: navbar cart count, carousel, featured slider, shared helpers */
(function() {
  const CART_KEY = 'aurela_cart_v1';

  // ===== CART MANAGEMENT =====
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  function getCartCount() {
    return getCart().reduce((sum, it) => sum + (it.quantity || 1), 0);
  }

  function updateCartBadge() {
    const el = document.getElementById('cart-count') || document.querySelector('.cart-count');
    if (!el) return;

    const count = getCartCount();
    el.textContent = String(count);

    // Hide badge if empty
    el.style.display = count === 0 ? 'none' : 'inline-block';
  }

  function addToCart(productId, quantity) {
    const qty = Math.max(1, Number(quantity || 1));
    const items = getCart();
    const found = items.find(i => i.id === productId);
    if (found) {
      found.quantity = (found.quantity || 1) + qty;
    } else {
      items.push({ id: productId, quantity: qty });
    }
    setCart(items);
    updateCartBadge();
  }

  // Expose globally
  window.Aurela = { getCart, setCart, addToCart, getCartCount, CART_KEY };

  // ===== FOOTER YEAR =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Initialize cart badge
  updateCartBadge();

  // ===== HERO CAROUSEL =====
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach(initCarousel);

  function initCarousel(root) {
    const slidesWrap = root.querySelector('.slides');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    const dotsWrap = root.querySelector('.dots');

    if (!slidesWrap || slides.length === 0) return;

    let index = 0;
    let timer = null;

    slides.forEach(s => {
      const v = getComputedStyle(s).getPropertyValue('--bg').trim();
      if (v && v.startsWith('url')) {
        s.style.backgroundImage = v;
        s.style.backgroundSize = 'cover';
        s.style.backgroundPosition = 'center';
      }
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
    }

    function nextSlide() { go(index + 1); }
    function prevSlide() { go(index - 1); }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('button').forEach((b, bi) => {
        b.classList.toggle('active', bi === index);
        b.setAttribute('aria-selected', String(bi === index));
      });
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(nextSlide, 5000);
    }

    function stopAuto() {
      if (timer) clearInterval(timer);
    }

    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => { go(i); startAuto(); });
        dotsWrap.appendChild(dot);
      });
    }

    if (prev) prev.addEventListener('click', () => { prevSlide(); startAuto(); });
    if (next) next.addEventListener('click', () => { nextSlide(); startAuto(); });

    root.addEventListener('mouseenter', stopAuto);
    root.addEventListener('mouseleave', startAuto);

    go(0);
    startAuto();
  }

  // ===== FEATURED COLLECTION SLIDER =====
  const sliderTrack = document.querySelector('.slider-track');
  const prevBtn = document.querySelector('.slide-btn.prev');
  const nextBtn = document.querySelector('.slide-btn.next');

  if (sliderTrack && prevBtn && nextBtn) {
    const scrollStep = 350;

    nextBtn.addEventListener('click', () => {
      sliderTrack.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
      sliderTrack.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    let isDown = false;
    let startX;
    let scrollLeft;

    sliderTrack.addEventListener('mousedown', e => {
      isDown = true;
      sliderTrack.classList.add('dragging');
      startX = e.pageX - sliderTrack.offsetLeft;
      scrollLeft = sliderTrack.scrollLeft;
    });

    sliderTrack.addEventListener('mouseleave', () => {
      isDown = false;
      sliderTrack.classList.remove('dragging');
    });

    sliderTrack.addEventListener('mouseup', () => {
      isDown = false;
      sliderTrack.classList.remove('dragging');
    });

    sliderTrack.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sliderTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      sliderTrack.scrollLeft = scrollLeft - walk;
    });

    let autoScroll;
    function startAutoScroll() {
      stopAutoScroll();
      autoScroll = setInterval(() => {
        if (sliderTrack.scrollLeft + sliderTrack.clientWidth >= sliderTrack.scrollWidth - 10) {
          sliderTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderTrack.scrollBy({ left: 2, behavior: 'smooth' });
        }
      }, 30);
    }
    function stopAutoScroll() {
      if (autoScroll) clearInterval(autoScroll);
    }

    startAutoScroll();
    sliderTrack.addEventListener('mouseenter', stopAutoScroll);
    sliderTrack.addEventListener('mouseleave', startAutoScroll);
  }

  // ===== ADD TO CART BUTTONS =====
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const productId = btn.dataset.id || btn.getAttribute('data-id') || 'unknown';
    const qty = btn.dataset.qty || 1;
    addToCart(productId, qty);
  });

  // ===== CONTACT PAGE FORM HANDLER =====
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const statusBox = document.createElement('div');
      statusBox.className = 'form-status';
      contactForm.appendChild(statusBox);

      if (!name || !emailOk || message.length < 5) {
        statusBox.textContent = 'Please fill all fields correctly.';
        statusBox.style.color = '#ff8a8a';
        setTimeout(() => statusBox.remove(), 3000);
        return;
      }

      statusBox.textContent = '✅ Message sent successfully!';
      statusBox.style.color = '#9effa9';
      contactForm.reset();
      setTimeout(() => statusBox.remove(), 3000);
    });
  }
})();
