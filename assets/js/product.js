/* =====================================================================
   PRODUCT PAGE — quantity, add to cart / buy now, photo gallery,
   "You may also like" and the sticky add-to-cart bar on phones.
   The page tells us which product it is with data-product="<id>".
   Depends on: products.js, cart.js, site.js
   ===================================================================== */

(() => {
  const section = document.querySelector("[data-product]");
  if (!section) return;
  const base = Cart.product(section.dataset.product);
  if (!base) return;
  let product = base; // the size being bought (see the size picker below)

  /* ---- Prices in the page's structured data (read by Google) follow products.js ---- */
  const schema = document.querySelector("script[data-product-schema]");
  if (schema) {
    try {
      const data = JSON.parse(schema.textContent);
      (data.hasVariant || [data]).forEach((item) => {
        const entry = Cart.product(item.sku);
        if (entry && item.offers) item.offers.price = entry.price.toFixed(2);
      });
      schema.textContent = JSON.stringify(data);
    } catch (error) { /* keep the markup as written */ }
  }

  const stage = section.querySelector(".product__stage");
  if (product.tint) section.style.setProperty("--tint", product.tint);

  /* ---- Quantity ---- */
  let quantity = 1;
  const output = section.querySelector("[data-qty]");
  const minus = section.querySelector('[data-qty-step="-1"]');
  const plus = section.querySelector('[data-qty-step="1"]');

  function setQuantity(next) {
    quantity = Math.min(Cart.MAX_QTY, Math.max(1, next));
    output.textContent = quantity;
    output.classList.remove("tick");
    void output.offsetWidth;
    output.classList.add("tick");
    minus.disabled = quantity <= 1;
    plus.disabled = quantity >= Cart.MAX_QTY;
  }
  minus.addEventListener("click", () => setQuantity(quantity - 1));
  plus.addEventListener("click", () => setQuantity(quantity + 1));
  minus.disabled = true;

  /* ---- Add to cart / Buy it now ---- */
  const addButton = section.querySelector("[data-add]");
  const addLabel = addButton.querySelector("[data-label]");
  addButton.addEventListener("click", () => {
    if (!Site.addToCart(product, quantity, stage)) return;
    addButton.classList.add("is-added");
    addLabel.textContent = "Added";
    clearTimeout(addButton.addedTimer);
    addButton.addedTimer = setTimeout(() => {
      addButton.classList.remove("is-added");
      addLabel.textContent = "Add to cart";
    }, 1800);
  });

  section.querySelector("[data-buy]").addEventListener("click", () => {
    Cart.add(product.id, quantity);
    window.location.href = Site.url("cart.html");
  });

  /* ---- Photo gallery ---- */
  const mainImage = stage.querySelector("img");
  const thumbs = [...section.querySelectorAll(".thumb")];
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      if (thumb.getAttribute("aria-pressed") === "true") return;
      thumbs.forEach((t) => t.setAttribute("aria-pressed", String(t === thumb)));
      const swap = () => {
        mainImage.src = thumb.dataset.src;
        mainImage.alt = thumb.dataset.alt || mainImage.alt;
        stage.classList.toggle("is-photo", thumb.classList.contains("is-photo"));
      };
      if (Site.reducedMotion.matches) return swap();
      stage.classList.add("is-swapping");
      setTimeout(() => {
        swap();
        const reveal = () => stage.classList.remove("is-swapping");
        if (mainImage.complete) requestAnimationFrame(reveal);
        else {
          mainImage.addEventListener("load", reveal, { once: true });
          mainImage.addEventListener("error", reveal, { once: true });
        }
      }, 220);
    });
  });

  /* ---- You may also like: closest categories first ---- */
  const relatedGrid = document.querySelector("[data-related]");
  if (relatedGrid) {
    const shared = (other) => other.categories.filter((c) => base.categories.includes(c)).length;
    PRODUCTS.filter((other) => other.id !== base.id && !other.sizeOf)
      .map((other, index) => ({ other, score: shared(other), index }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .slice(0, 4)
      .forEach(({ other }, index) => relatedGrid.appendChild(Site.productCard(other, { revealDelay: index * 90 })));
    Site.observeReveals(relatedGrid);
  }

  /* ---- Sticky add-to-cart bar once the main button scrolls away (phones) ---- */
  const buyBlock = section.querySelector(".buy");
  const bar = document.createElement("div");
  bar.className = "buybar";
  if (product.tint) bar.style.setProperty("--tint", product.tint);
  bar.setAttribute("aria-hidden", "true");
  bar.inert = true;
  bar.innerHTML = `
    <span class="buybar__thumb"><img src="${Site.imageUrl(product)}" alt=""></span>
    <span class="buybar__info">
      <span class="buybar__name">${Site.escapeHtml(product.name)}</span>
      <span class="buybar__price">${formatPrice(product.price)} · ${Site.escapeHtml(product.size)}</span>
    </span>
    <button class="btn btn--primary btn--sm" type="button">Add to cart</button>`;
  document.body.appendChild(bar);
  bar.querySelector("button").addEventListener("click", () => {
    Site.addToCart(product, quantity, bar.querySelector(".buybar__thumb"));
  });

  /* ---- Size picker (products listed with `sizeOf` in products.js) ---- */
  const priceEl = section.querySelector("[data-price-of]");
  const sizeButtons = [...section.querySelectorAll("[data-size-option]")];
  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const chosen = Cart.product(button.dataset.sizeOption);
      if (!chosen || chosen === product) return;
      product = chosen;
      sizeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      priceEl.dataset.priceOf = product.id;
      priceEl.textContent = formatPrice(product.price);
      bar.querySelector(".buybar__price").textContent = `${formatPrice(product.price)} · ${product.size}`;
    });
  });

  if ("IntersectionObserver" in window && buyBlock) {
    const phone = window.matchMedia("(max-width: 959px)");
    new IntersectionObserver(([entry]) => {
      const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      bar.classList.toggle("is-visible", show);
      bar.inert = !show;
      bar.setAttribute("aria-hidden", String(!show));
      document.body.classList.toggle("has-buybar", show && phone.matches);
    }).observe(buyBlock);
  }
})();
