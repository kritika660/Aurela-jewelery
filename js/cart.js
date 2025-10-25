// js/cart.js
(function () {
  const tableBody = document.querySelector('#cart-table tbody');
  const totalEl = document.getElementById('cart-total');
  // support both id and class for the badge
  const badgeEl = document.getElementById('cart-count') || document.querySelector('.cart-count');

  function fmt(n) { return `$${Number(n || 0).toFixed(2)}`; }

  // wrappers around your Aurela storage helpers
  function readCart() {
    return (window.Aurela && typeof window.Aurela.getCart === 'function')
      ? window.Aurela.getCart()
      : JSON.parse(localStorage.getItem('aurela_cart_v1') || '[]');
  }
  function writeCart(items) {
    if (window.Aurela && typeof window.Aurela.setCart === 'function') {
      window.Aurela.setCart(items);
    } else {
      localStorage.setItem('aurela_cart_v1', JSON.stringify(items));
    }
    // after writing update UI
    render();
    updateBadge();
  }

  function updateBadge() {
    if (!badgeEl) return;
    // try to use Aurela.getCartCount if available
    let count = 0;
    if (window.Aurela && typeof window.Aurela.getCartCount === 'function') {
      count = window.Aurela.getCartCount();
    } else {
      count = readCart().reduce((s, it) => s + (Number(it.quantity) || 1), 0);
    }
    badgeEl.textContent = String(count);
    badgeEl.style.display = count === 0 ? 'none' : 'inline-block';
  }

  function setQty(id, qty) {
    const items = readCart();
    const it = items.find(i => i.id === id);
    if (!it) return;
    const q = Math.max(1, Math.floor(Number(qty) || 1));
    it.quantity = q;
    writeCart(items);
  }

  function removeItem(id) {
    const items = readCart().filter(i => i.id !== id);
    writeCart(items);
  }

  // render table rows
  function render() {
    if (!tableBody) return;
    const items = readCart();
    if (!items.length) {
      tableBody.innerHTML = '<tr><td colspan="5" class="muted">Your cart is empty.</td></tr>';
      if (totalEl) totalEl.textContent = fmt(0);
      updateBadge();
      return;
    }

    let total = 0;
    const rows = items.map(({ id, quantity }) => {
      const p = (window.AurelaData && typeof window.AurelaData.getById === 'function')
        ? window.AurelaData.getById(id)
        : null;
      if (!p) return '';

      const q = Math.max(1, Number(quantity) || 1);
      const subtotal = p.price * q;
      total += subtotal;

      return `
        <tr data-id="${p.id}">
          <td><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a></td>
          <td>${fmt(p.price)}</td>
          <td style="text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:6px;">
              <button class="btn qty-btn" data-action="dec" data-id="${p.id}" aria-label="Decrease">−</button>
              <input class="qty-input" data-id="${p.id}" type="number" min="1" value="${q}" style="width:64px;background:transparent;border:1px solid var(--border);color:var(--text);padding:6px;border-radius:8px;text-align:center;">
              <button class="btn qty-btn" data-action="inc" data-id="${p.id}" aria-label="Increase">+</button>
            </div>
          </td>
          <td>${fmt(subtotal)}</td>
          <td style="text-align:center;">
            <button class="btn remove-btn" data-action="remove" data-id="${p.id}">Remove</button>
          </td>
        </tr>`;
    }).join('');
    tableBody.innerHTML = rows;

    if (totalEl) totalEl.textContent = fmt(total);
    updateBadge();
  }

  // small helper to escape text for HTML
  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  // event delegation: clicks for remove/inc/dec and input events for qty changes
  if (tableBody) {
    // clicks (inc/dec/remove)
    tableBody.addEventListener('click', function (ev) {
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      if (!id) return;

      const cart = readCart();
      const item = cart.find(i => i.id === id);

      if (action === 'remove') {
        removeItem(id);
        return;
      }

      if (!item) return;

      if (action === 'inc') {
        item.quantity = (Number(item.quantity) || 1) + 1;
        writeCart(cart);
        return;
      }
      if (action === 'dec') {
        item.quantity = (Number(item.quantity) || 1) - 1;
        if (item.quantity <= 0) {
          // remove item
          writeCart(cart.filter(i => i.id !== id));
        } else {
          writeCart(cart);
        }
        return;
      }
    });

    // input changes (typing a number)
    tableBody.addEventListener('input', function (ev) {
      const input = ev.target.closest('.qty-input');
      if (!input) return;
      const id = input.getAttribute('data-id');
      let val = Math.floor(Number(input.value) || 0);
      if (val < 1) val = 1;
      // update UI quickly and storage
      input.value = val;
      setQty(id, val);
    });

    // also handle when someone presses Enter inside quantity input (prevent accidental submits)
    tableBody.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && ev.target.classList && ev.target.classList.contains('qty-input')) {
        ev.preventDefault();
        ev.target.blur();
      }
    });
  }

  // update view when other tabs/windows change localStorage
  window.addEventListener('storage', function (ev) {
    // if your app uses a specific key, you can check ev.key but we'll just re-render
    render();
  });

  // initialize
  render();
  updateBadge();
})();
