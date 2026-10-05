/* =====================================================================
   HOME — renders the collection from products.js and runs the
   category filters (also reachable as index.html?category=face).
   Depends on: products.js, cart.js, site.js
   ===================================================================== */

(() => {
  const grid = document.querySelector("[data-product-grid]");
  const bar = document.querySelector("[data-filters]");
  const status = document.querySelector("[data-filter-status]");
  if (!grid || !bar) return;

  /* ---- Product cards ---- */
  const columns = getComputedStyle(grid).gridTemplateColumns.split(" ").length || 1;
  const cards = PRODUCTS.map((product, index) => {
    const card = Site.productCard(product, { revealDelay: (index % columns) * 90 });
    grid.appendChild(card);
    return card;
  });
  Site.observeReveals(grid);

  /* ---- Filter chips ---- */
  const filters = [{ id: "all", label: "All" }, ...CATEGORIES]
    .map((filter) => ({
      ...filter,
      count: filter.id === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.categories.includes(filter.id)).length,
    }))
    .filter((filter) => filter.count > 0);

  bar.innerHTML =
    '<span class="filters__indicator no-anim" aria-hidden="true"></span>' +
    filters
      .map((filter) => {
        const label = filter.short
          ? `<span class="chip__long">${Site.escapeHtml(filter.label)}</span><span class="chip__short">${Site.escapeHtml(filter.short)}</span>`
          : Site.escapeHtml(filter.label);
        return `<button class="chip" type="button" data-filter="${filter.id}" aria-pressed="false">${label}<span class="chip__count">${filter.count}</span></button>`;
      })
      .join("");

  const indicator = bar.querySelector(".filters__indicator");
  const chips = [...bar.querySelectorAll(".chip")];
  const requested = new URLSearchParams(window.location.search).get("category");
  let active = filters.some((filter) => filter.id === requested) ? requested : "all";

  function placeIndicator() {
    const chip = chips.find((c) => c.dataset.filter === active);
    if (!chip) return;
    indicator.style.width = chip.offsetWidth + "px";
    indicator.style.height = chip.offsetHeight + "px";
    indicator.style.transform = `translate(${chip.offsetLeft}px, ${chip.offsetTop}px)`;
  }

  function placeIndicatorInstantly() {
    indicator.classList.add("no-anim");
    placeIndicator();
    requestAnimationFrame(() => requestAnimationFrame(() => indicator.classList.remove("no-anim")));
  }

  const matches = (card, filter) => filter === "all" || Cart.product(card.dataset.id).categories.includes(filter);

  function showMatchingCards(filter, animate) {
    let shown = 0;
    cards.forEach((card) => {
      const visible = matches(card, filter);
      const wasHidden = card.hidden;
      card.hidden = !visible;
      card.classList.remove("is-entering");
      if (!visible) return;
      if (animate && wasHidden) {
        card.style.setProperty("--enter-delay", Math.min(shown, 8) * 45 + "ms");
        void card.offsetWidth;
        card.classList.add("is-entering");
      }
      shown += 1;
    });
    return shown;
  }

  function applyFilter(filter, { animate = true } = {}) {
    active = filter;
    chips.forEach((chip) => {
      const on = chip.dataset.filter === filter;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", String(on));
    });
    placeIndicator();

    const label = filter === "all" ? "" : " in " + filters.find((f) => f.id === filter).label;
    const announce = (count) => {
      if (status) status.textContent = `Showing ${count} product${count === 1 ? "" : "s"}${label}.`;
    };

    if (!animate || Site.reducedMotion.matches) {
      announce(showMatchingCards(filter, false));
      return;
    }

    // Cards animated by the filter no longer need their scroll reveal.
    cards.forEach((card) => card.removeAttribute("data-reveal"));

    if (document.startViewTransition) {
      // Cards slide to their new places; the chip bar stays live so its pill can glide.
      cards.forEach((card) => { card.style.viewTransitionName = "card-" + card.dataset.id; });
      bar.style.viewTransitionName = "filters";
      const transition = document.startViewTransition(() => announce(showMatchingCards(filter, false)));
      transition.finished.finally(() => {
        cards.forEach((card) => { card.style.viewTransitionName = ""; });
        bar.style.viewTransitionName = "";
      });
    } else {
      announce(showMatchingCards(filter, true));
    }
  }

  // Keep the address in sync so the filtered view can be shared or bookmarked.
  function rememberFilter() {
    const params = new URLSearchParams(window.location.search);
    if (active === "all") params.delete("category");
    else params.set("category", active);
    const query = params.toString();
    history.replaceState(null, "", window.location.pathname + (query ? "?" + query : "") + window.location.hash);
  }

  const smooth = () => (Site.reducedMotion.matches ? "auto" : "smooth");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.dataset.filter === active) return;
      applyFilter(chip.dataset.filter);
      rememberFilter();
      chip.scrollIntoView({ block: "nearest", inline: "nearest", behavior: smooth() });
    });
  });

  // Footer links such as "?category=face#shop" filter in place instead of reloading the page.
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="?category="]');
    if (!link) return;
    const filter = new URL(link.href).searchParams.get("category");
    if (!filters.some((f) => f.id === filter)) return;
    event.preventDefault();
    if (filter !== active) applyFilter(filter, { animate: false });
    rememberFilter();
    document.getElementById("shop").scrollIntoView({ behavior: smooth() });
  });

  applyFilter(active, { animate: false });
  placeIndicatorInstantly();
  if ("ResizeObserver" in window) new ResizeObserver(placeIndicatorInstantly).observe(bar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeIndicatorInstantly);
})();
