(function(){
  const root = document.getElementById('product');
  const relatedEl = document.getElementById('related');
  const id = new URL(location.href).searchParams.get('id');
  const product = window.AurelaData.getById(id);

  if (!product) {
    if (root) root.innerHTML = '<p class="muted">Product not found.</p>';
    return;
  }

  // Render product details
  if (root) root.innerHTML = `
    <div class="zoom" id="zoom">
      <img src="${product.image}" alt="${product.name}">
    </div>
    <div class="product-details">
      <h1>${product.name}</h1>
      <div class="price" style="font-size:22px;">$${product.price.toFixed(2)}</div>
      <p class="muted">${product.material}</p>
      <p>${product.description}</p>
      <div class="stack">
        <div class="cart-section">
          <button type="button" id="add" class="btn btn-primary">Add to Cart</button>
          <div class="qty hidden" id="qty-box">
            <button type="button" id="minus">−</button>
            <input type="number" id="qty" value="1" min="1">
            <button type="button" id="plus">+</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Zoom interaction
  const zoom = document.getElementById('zoom');
  if (zoom) {
    zoom.addEventListener('mousemove', (e)=>{
      const rect = zoom.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      zoom.style.setProperty('--x', x + '%');
      zoom.style.setProperty('--y', y + '%');
      zoom.classList.add('is-zoomed');
    });
    zoom.addEventListener('mouseleave', ()=> zoom.classList.remove('is-zoomed'));
  }

  // Quantity and Add-to-Cart
  const qtyBox = document.getElementById('qty-box');
  const qtyEl = document.getElementById('qty');
  const minus = document.getElementById('minus');
  const plus = document.getElementById('plus');
  const addBtn = document.getElementById('add');

  let qty = 0; // current quantity in cart

  // Show quantity box when clicking Add to Cart
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      qty = 1;
      qtyEl.value = qty;
      addBtn.classList.add('hidden');
      qtyBox.classList.remove('hidden');
      window.Aurela.addToCart(product.id, 1); // add only one initially
    });
  }

  if (plus) {
    plus.addEventListener('click', () => {
      const newQty = Number(qtyEl.value) + 1;
      const diff = newQty - qty; // difference to add
      qty = newQty;
      qtyEl.value = qty;
      if (diff > 0) window.Aurela.addToCart(product.id, diff);
    });
  }

  if (minus) {
    minus.addEventListener('click', () => {
      const newQty = Math.max(0, Number(qtyEl.value) - 1);
      const diff = newQty - qty; // difference to subtract
      qty = newQty;
      qtyEl.value = qty;

      if (diff < 0) window.Aurela.addToCart(product.id, diff); // negative qty → remove
      if (qty === 0) {
        qtyBox.classList.add('hidden');
        addBtn.classList.remove('hidden');
      }
    });
  }

  // Related products section
  const related = window.AurelaData.getAll()
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (relatedEl) {
    relatedEl.innerHTML = related.map(p => `
      <article class="card shine">
        <a class="media" href="product.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}">
        </a>
        <div class="body">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <h3 style="margin:0;font-family:Playfair Display,serif;font-size:18px;">${p.name}</h3>
            <div class="price">$${p.price.toFixed(2)}</div>
          </div>
        </div>
      </article>
    `).join('');
  }
})();
