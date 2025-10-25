(function () {
  const listEl = document.getElementById("products");
  const catEl = document.getElementById("filter-category");
  const sortEl = document.getElementById("sort-by");
  const searchEl = document.getElementById("search-input");
  const navSearch = document.getElementById("nav-search");

  const url = new URL(location.href);
  const initialCategory = url.searchParams.get("category") || "All";
  const initialQuery = url.searchParams.get("q") || "";

  if (catEl) catEl.value = initialCategory;
  if (searchEl) searchEl.value = initialQuery;

  function render(products) {
    if (!listEl) return;
    if (!products.length) {
      listEl.innerHTML = '<p class="muted">No products found.</p>';
      return;
    }

    const cart = window.Aurela.getCart();

    listEl.innerHTML = products
      .map((p) => {
        const inCart = cart.find((i) => i.id === p.id);
        return `
        <article class="card shine">
          <a class="media" href="product.html?id=${p.id}">
            <img src="${p.image}" alt="${p.name}">
          </a>
          <div class="body">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <h3 style="margin:0;font-family:Playfair Display,serif;font-size:18px;">${p.name}</h3>
              <div class="price">$${p.price.toFixed(2)}</div>
            </div>
            <div class="muted" style="margin:4px 0 10px;">${p.category} · ${p.material}</div>
            ${
              inCart
                ? `
              <div class="qty-controls" data-id="${p.id}" style="display:flex;align-items:center;gap:6px;justify-content:center;">
                <button class="btn dec" data-dec="${p.id}">−</button>
                <span class="qty-val">${inCart.quantity}</span>
                <button class="btn inc" data-inc="${p.id}">+</button>
              </div>`
                : `<button class="btn btn-primary add-btn" data-add="${p.id}">Add to Cart</button>`
            }
          </div>
        </article>
      `;
      })
      .join("");

    attachEvents();
  }

  function getFiltered() {
    let items = window.AurelaData.getAll();
    const category = (catEl && catEl.value) || "All";
    const query = (searchEl && searchEl.value) || "";

    if (category && category !== "All")
      items = items.filter((p) => p.category === category);
    if (query)
      items = items.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );

    const sortKey = (sortEl && sortEl.value) || "";
    items = window.AurelaData.sort(items, sortKey);
    return items;
  }

  function attachEvents() {
    // Add to Cart
    listEl.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-add");
        const cart = window.Aurela.getCart();
        const existing = cart.find((i) => i.id === id);

        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ id, quantity: 1 });
        }

        window.Aurela.setCart(cart);
        render(getFiltered());
      });
    });

    // Increment / Decrement Qty
    listEl.querySelectorAll(".qty-controls").forEach((ctrl) => {
      const id = ctrl.getAttribute("data-id");
      const decBtn = ctrl.querySelector(".dec");
      const incBtn = ctrl.querySelector(".inc");

      decBtn.addEventListener("click", () => {
        const cart = window.Aurela.getCart();
        const item = cart.find((i) => i.id === id);
        if (!item) return;
        item.quantity -= 1;
        if (item.quantity <= 0) {
          const newCart = cart.filter((i) => i.id !== id);
          window.Aurela.setCart(newCart);
        } else {
          window.Aurela.setCart(cart);
        }
        render(getFiltered());
      });

      incBtn.addEventListener("click", () => {
        const cart = window.Aurela.getCart();
        const item = cart.find((i) => i.id === id);
        if (item) item.quantity += 1;
        window.Aurela.setCart(cart);
        render(getFiltered());
      });
    });
  }

  // React to category/search/sort changes
  [catEl, sortEl, searchEl].forEach((el) =>
    el && el.addEventListener("input", () => render(getFiltered()))
  );

  // React to navbar search
  if (navSearch)
    navSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = new FormData(navSearch).get("q") || "";
      if (searchEl) searchEl.value = q;
      render(getFiltered());
    });

  // React live to cart changes (from cart page)
  window.addEventListener("storage", () => render(getFiltered()));

  render(getFiltered());
})();
