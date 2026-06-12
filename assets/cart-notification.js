function tweenNumber(el, from, to, duration = 600) {
  if (!el) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = to;
    return;
  }
  if (from === to) {
    el.textContent = to;
    return;
  }
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (to - from) * ease(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function readCartCount(bubble) {
  if (!bubble) return 0;
  const el = bubble.querySelector('span[aria-hidden="true"]');
  if (!el) return 0;
  const n = parseInt(el.textContent.trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);

    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  open() {
    this.notification.classList.add('animate', 'active');

    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      trapFocus(this.notification);
    }, { once: true });

    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
    this.notification.classList.remove('active');
    document.body.removeEventListener('click', this.onBodyClick);

    removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {
      this.cartItemKey = parsedState.key;
      const oldCount = readCartCount(document.querySelector('.cart-count-bubble'));
      this.getSectionsToRender().forEach((section => {
        document.getElementById(section.id).innerHTML =
          this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }));

      if (this.header) this.header.reveal();
      this.pulseCartBubble(oldCount);
      this.open();
  }

  pulseCartBubble(oldCount) {
    const bubble = document.querySelector('.cart-count-bubble');
    if (!bubble) return;
    bubble.classList.remove('is-updated');
    void bubble.offsetWidth;
    bubble.classList.add('is-updated');
    setTimeout(() => bubble.classList.remove('is-updated'), 700);

    if (typeof oldCount !== 'number') return;
    const countEl = bubble.querySelector('span[aria-hidden="true"]');
    if (!countEl) return;
    const newCount = parseInt(countEl.textContent.trim(), 10);
    if (!Number.isFinite(newCount)) return;
    tweenNumber(countEl, oldCount, newCount, 600);
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      {
        id: 'cart-notification-button'
      },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure, header-menu');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
