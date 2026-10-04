/* =====================================================================
   SHARED UI — header, cart badge, toasts, scroll reveals, product cards
   and the add-to-cart animation. Loaded on every page.
   Depends on: products.js, cart.js
   ===================================================================== */

const Site = (() => {
  // Pages inside /products set data-root="../" so links resolve from the site root.
  const root = document.body.dataset.root || "";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const url = (path) => root + path;
  const productUrl = (product) => url("products/" + product.id + ".html");
  const imageUrl = (product) => url("assets/images/products/" + product.image);
  const categoryOf = (product) => CATEGORIES.find((category) => category.id === product.categories[0]) || null;

  const escapeHtml = (text) =>
    String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  const icons = {
    plus: '<svg class="icon icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
    check: '<svg class="icon icon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  /* ---- Header turns compact once the page scrolls ---- */
  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Cart badge ---- */
  function renderBadge() {
    const count = Cart.count();
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
      badge.textContent = count > 99 ? "99+" : String(count);
      badge.hidden = count === 0;
    });
    document.querySelectorAll("[data-cart-link]").forEach((link) => {
      link.setAttribute("aria-label", count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart, empty");
    });
  }

  function bumpBadge() {
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
      badge.classList.remove("is-bumping");
      void badge.offsetWidth; // restart the animation
      badge.classList.add("is-bumping");
    });
  }

  renderBadge();
  Cart.onChange(renderBadge);

  /* ---- Toast notifications ---- */
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  document.body.appendChild(toastEl);
  let toastTimer = null;

  function hideToast() {
    clearTimeout(toastTimer);
    toastEl.classList.remove("is-visible");
  }

  function toast({ title, text = "", product = null, action = null, tone = "" }) {
    clearTimeout(toastTimer);
    toastEl.className = "toast" + (tone ? " toast--" + tone : "") + (toastEl.classList.contains("is-visible") ? " is-visible" : "");
    toastEl.innerHTML = `
      ${product ? `<span class="toast__thumb" style="--tint:${product.tint || ""}"><img src="${imageUrl(product)}" alt=""></span>` : ""}
      <span class="toast__body">
        <span class="toast__title">${escapeHtml(title)}</span>
        ${text ? `<span class="toast__text">${escapeHtml(text)}</span>` : ""}
      </span>
      ${action ? `<a class="toast__action" href="${action.href}">${escapeHtml(action.label)}</a>` : ""}
      <button class="toast__close" type="button" aria-label="Dismiss">${icons.close}</button>`;
    toastEl.querySelector(".toast__close").addEventListener("click", hideToast);
    requestAnimationFrame(() => toastEl.classList.add("is-visible"));
    toastTimer = setTimeout(hideToast, 4200);
  }

  toastEl.addEventListener("mouseenter", () => clearTimeout(toastTimer));
  toastEl.addEventListener("mouseleave", () => {
    if (toastEl.classList.contains("is-visible")) toastTimer = setTimeout(hideToast, 2000);
  });

  /* ---- Product image flies into the cart button ---- */
  function flyToCart(source, product) {
    const target = document.querySelector("[data-cart-link]");
    if (!source || !target || reducedMotion.matches || !source.animate) return Promise.resolve();
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    if (!from.width || from.bottom < 0 || from.top > window.innerHeight) return Promise.resolve();

    const size = Math.min(from.width, from.height, 150);
    const left = from.left + from.width / 2 - size / 2;
    const top = from.top + from.height / 2 - size / 2;
    const dx = to.left + to.width / 2 - (left + size / 2);
    const dy = to.top + to.height / 2 - (top + size / 2);

    const ghost = document.createElement("div");
    ghost.className = "fly-ghost";
    ghost.style.cssText = `left:${left}px;top:${top}px;width:${size}px;height:${size}px;--tint:${product.tint || ""}`;
    ghost.innerHTML = `<div class="fly-ghost__inner"><img src="${imageUrl(product)}" alt=""></div>`;
    document.body.appendChild(ghost);

    // Different easings per axis make the item travel along a curve.
    const duration = 820;
    const horizontal = ghost.animate(
      [{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }],
      { duration, easing: "cubic-bezier(.55, 0, .7, 1)", fill: "forwards" }
    );
    ghost.firstElementChild.animate(
      [
        { transform: "translateY(0) scale(1)", opacity: 1 },
        { transform: `translateY(${dy}px) scale(.14)`, opacity: 0.55 },
      ],
      { duration, easing: "cubic-bezier(.2, .75, .35, 1)", fill: "forwards" }
    );
    const cleanUp = () => ghost.remove();
    return horizontal.finished.then(cleanUp, cleanUp);
  }

  /* ---- Add to cart with visual feedback ---- */
  function addToCart(product, quantity = 1, source = null) {
    if (!product || !Cart.add(product.id, quantity)) return false;
    flyToCart(source, product).then(bumpBadge);
    toast({
      title: "Added to your ritual",
      text: `${product.name} × ${quantity}`,
      product,
      action: { href: url("cart.html"), label: "View cart" },
    });
    return true;
  }

  /* ---- Reveal elements as they scroll into view ---- */
  const revealObserver =
    "IntersectionObserver" in window && !reducedMotion.matches
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const el = entry.target;
              revealObserver.unobserve(el);
              el.classList.add("is-visible");
              // Once revealed, hand the element back to its own styles/transitions.
              const delay = parseFloat(el.style.getPropertyValue("--reveal-delay")) || 0;
              setTimeout(() => {
                el.removeAttribute("data-reveal");
                el.classList.remove("is-visible");
                el.style.removeProperty("--reveal-delay");
              }, 1000 + delay);
            });
          },
          { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
        )
      : null;

  function observeReveals(scope = document) {
    scope.querySelectorAll("[data-reveal]").forEach((el) => {
      if (revealObserver) revealObserver.observe(el);
      else el.removeAttribute("data-reveal");
    });
  }

  /* ---- Values that come from products.js ---- */
  function bindData(scope = document) {
    scope.querySelectorAll("[data-price-of]").forEach((el) => {
      const product = Cart.product(el.dataset.priceOf);
      if (product) el.textContent = formatPrice(product.price);
    });
    scope.querySelectorAll("[data-size-of]").forEach((el) => {
      const product = Cart.product(el.dataset.sizeOf);
      if (product) el.textContent = product.size;
    });
    scope.querySelectorAll("[data-delivery-fee]").forEach((el) => {
      el.textContent = formatPrice(DELIVERY_FEE).replace(/\.00$/, "");
    });
    scope.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- Product card (shop grid and "You may also like") ---- */
  function productCard(product, { revealDelay = 0 } = {}) {
    const category = categoryOf(product);
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = product.id;
    card.setAttribute("data-reveal", "");
    if (product.tint) card.style.setProperty("--tint", product.tint);
    if (revealDelay) card.style.setProperty("--reveal-delay", revealDelay + "ms");
    card.innerHTML = `
      <div class="card__media"><img src="${imageUrl(product)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async"></div>
      ${category ? `<span class="card__tag">${escapeHtml(category.label)}</span>` : ""}
      <div class="card__body">
        <h3 class="card__title"><a class="card__link" href="${productUrl(product)}">${escapeHtml(product.name)}</a></h3>
        <p class="card__ar" lang="ar" dir="rtl">${escapeHtml(product.nameAr)}</p>
        <p class="card__meta"><span class="card__size">${escapeHtml(product.size)}</span><span class="card__price">${formatPrice(product.price)}</span></p>
      </div>
      <button class="card__add" type="button" data-quick-add="${product.id}" aria-label="Add ${escapeHtml(product.name)} to cart">${icons.plus}${icons.check}</button>`;

    const img = card.querySelector("img");
    const loaded = () => img.classList.add("is-loaded");
    if (img.complete) loaded();
    else {
      img.addEventListener("load", loaded, { once: true });
      img.addEventListener("error", loaded, { once: true });
    }
    return card;
  }

  // Quick "+" button on cards
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quick-add]");
    if (!button) return;
    const product = Cart.product(button.dataset.quickAdd);
    const card = button.closest(".card");
    if (!addToCart(product, 1, card ? card.querySelector(".card__media") : button)) return;
    button.classList.add("is-added");
    clearTimeout(button.addedTimer);
    button.addedTimer = setTimeout(() => button.classList.remove("is-added"), 1600);
  });

  /* ---- Card photo morphs into the product page photo (View Transitions) ---- */
  let morphSource = null;
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".card__link");
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const media = link.closest(".card").querySelector(".card__media");
    if (morphSource) morphSource.style.viewTransitionName = "";
    // Only one element per page may carry the name.
    const stage = document.querySelector(".product__stage");
    if (stage) stage.style.viewTransitionName = "none";
    media.style.viewTransitionName = "product-hero";
    morphSource = media;
  });

  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    if (morphSource) morphSource.style.viewTransitionName = "";
    morphSource = null;
    const stage = document.querySelector(".product__stage");
    if (stage) stage.style.viewTransitionName = "";
  });

  bindData();
  observeReveals();

  return {
    url,
    productUrl,
    imageUrl,
    escapeHtml,
    categoryOf,
    icons,
    reducedMotion,
    toast,
    hideToast,
    addToCart,
    productCard,
    observeReveals,
    bindData,
  };
})();
