/* =====================================================================
   CART & CHECKOUT — order summary, delivery form and order history.
   Orders are sent to Formspree, which emails them to the shop.
   Depends on: products.js, cart.js, site.js
   ===================================================================== */

(() => {
  const FORM_ENDPOINT = "https://formspree.io/f/mdabkaod";
  const HISTORY_KEY = "hermel_order_history";

  const checkout = document.querySelector("[data-checkout]");
  if (!checkout) return;

  const linesEl = document.querySelector("[data-cart-lines]");
  const countEl = document.querySelector("[data-line-count]");
  const subtotalEl = document.querySelector("[data-subtotal]");
  const deliveryEl = document.querySelector("[data-delivery]");
  const totalEl = document.querySelector("[data-total]");
  const summaryTitle = document.querySelector("[data-summary-title]");
  const emptyEl = document.querySelector("[data-empty]");
  const successEl = document.querySelector("[data-success]");
  const pageHead = document.querySelector("[data-page-head]");
  const form = document.getElementById("order-form");
  const submitButton = document.getElementById("submit-btn");
  const submitLabel = submitButton.querySelector("[data-label]");
  const errorEl = document.querySelector("[data-form-error]");
  const detailsInput = document.getElementById("order-details-input");
  const totalInput = document.getElementById("total-price-input");
  const historySection = document.querySelector("[data-history]");
  const historyList = document.querySelector("[data-history-list]");

  const esc = Site.escapeHtml;
  let submitted = false;

  const orderTotal = () => Cart.subtotal() + DELIVERY_FEE;
  const orderDetails = () =>
    Cart.lines().map(({ product, quantity, total }) => `${product.name}, ${product.size} (x${quantity}) – ${formatPrice(total)}`).join(" | ");

  /* ---- Summary ---- */
  function lineTemplate({ product, quantity, total }) {
    const href = Site.productUrl(product);
    return `
      <li class="line" data-id="${product.id}" style="--tint:${product.tint || ""}">
        <a class="line__thumb" href="${href}" tabindex="-1" aria-hidden="true"><img src="${Site.imageUrl(product)}" alt="" loading="lazy"></a>
        <div class="line__info">
          <a class="line__name" href="${href}">${esc(product.name)}</a>
          <p class="line__meta">${esc(product.size)} · ${formatPrice(product.price)} each</p>
          <div class="line__controls">
            <div class="stepper stepper--sm" role="group" aria-label="Quantity of ${esc(product.name)}">
              <button type="button" data-step="-1" aria-label="Decrease quantity" ${quantity <= 1 ? "disabled" : ""}>${Site.icons.minus}</button>
              <output aria-live="polite">${quantity}</output>
              <button type="button" data-step="1" aria-label="Increase quantity" ${quantity >= Cart.MAX_QTY ? "disabled" : ""}>${Site.icons.plus}</button>
            </div>
            <button class="line__remove" type="button" data-remove>Remove</button>
          </div>
        </div>
        <span class="line__total">${formatPrice(total)}</span>
      </li>`;
  }

  // Rebuild the list only when items are added/removed, so focus stays on +/- buttons.
  function syncLines(lines) {
    const shownIds = [...linesEl.children].map((li) => li.dataset.id).join(",");
    const wantedIds = lines.map((line) => line.product.id).join(",");
    if (shownIds !== wantedIds) {
      linesEl.innerHTML = lines.map(lineTemplate).join("");
      return;
    }
    lines.forEach(({ product, quantity, total }) => {
      const li = linesEl.querySelector(`[data-id="${product.id}"]`);
      const output = li.querySelector("output");
      if (output.textContent !== String(quantity)) {
        output.textContent = quantity;
        output.classList.remove("tick");
        void output.offsetWidth;
        output.classList.add("tick");
      }
      li.querySelector('[data-step="-1"]').disabled = quantity <= 1;
      li.querySelector('[data-step="1"]').disabled = quantity >= Cart.MAX_QTY;
      li.querySelector(".line__total").textContent = formatPrice(total);
    });
  }

  function render() {
    if (submitted) return;
    const lines = Cart.lines();
    const isEmpty = lines.length === 0;
    checkout.hidden = isEmpty;
    emptyEl.hidden = !isEmpty;
    submitButton.disabled = isEmpty;
    if (isEmpty) return;

    syncLines(lines);
    const count = Cart.count();
    countEl.textContent = `${count} item${count === 1 ? "" : "s"}`;
    subtotalEl.textContent = formatPrice(Cart.subtotal());
    deliveryEl.textContent = formatPrice(DELIVERY_FEE);
    totalEl.textContent = formatPrice(orderTotal());
    detailsInput.value = orderDetails();
    totalInput.value = formatPrice(orderTotal());
  }

  linesEl.addEventListener("click", (event) => {
    const li = event.target.closest(".line");
    if (!li) return;
    const id = li.dataset.id;
    const step = event.target.closest("[data-step]");
    if (step) {
      const line = Cart.lines().find((entry) => entry.product.id === id);
      if (line) Cart.setQuantity(id, line.quantity + Number(step.dataset.step));
      return;
    }
    if (event.target.closest("[data-remove]")) {
      li.classList.add("is-removing");
      setTimeout(() => {
        Cart.remove(id);
        if (summaryTitle && Cart.count()) summaryTitle.focus({ preventScroll: true });
      }, Site.reducedMotion.matches ? 0 : 320);
    }
  });

  /* ---- Order history (kept on this device) ---- */
  function loadHistory() {
    try {
      const history = JSON.parse(localStorage.getItem(HISTORY_KEY));
      return Array.isArray(history) ? history : [];
    } catch (error) {
      return [];
    }
  }

  function saveOrder(order) {
    const history = loadHistory();
    history.unshift(order);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (error) { /* storage blocked */ }
  }

  function renderHistory() {
    const history = loadHistory();
    historySection.hidden = history.length === 0;
    historyList.innerHTML = history
      .map((order) => `
        <article class="order-card">
          <p class="order-card__date">Placed on ${esc(order.date)}</p>
          <p class="order-card__items">${esc(String(order.details || "").replace(/\s*\|\s*$/, ""))}</p>
          <div class="order-card__foot">
            <span>Total (cash on delivery): ${esc(order.total)}</span>
            <span class="status-pill">✓ Submitted to workshop</span>
          </div>
        </article>`)
      .join("");
  }

  /* ---- Sending the order ---- */
  function setSending(sending) {
    if (sending) Site.hideToast(); // a retry should not keep showing the previous error
    submitButton.disabled = sending;
    submitButton.classList.toggle("is-loading", sending);
    submitLabel.textContent = sending ? "Sending your order…" : "Place my order";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!Cart.count()) return;
    errorEl.hidden = true;
    detailsInput.value = orderDetails();
    totalInput.value = formatPrice(orderTotal());
    setSending(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Order not accepted (" + response.status + ")");

      saveOrder({ date: new Date().toLocaleString(), details: detailsInput.value, total: totalInput.value });
      submitted = true;
      Cart.clear();
      form.reset();
      checkout.hidden = true;
      emptyEl.hidden = true;
      if (pageHead) pageHead.hidden = true;
      successEl.hidden = false;
      renderHistory();
      window.scrollTo({ top: 0, behavior: Site.reducedMotion.matches ? "auto" : "smooth" });
      const heading = successEl.querySelector("h2");
      if (heading) heading.focus({ preventScroll: true });
    } catch (error) {
      setSending(false);
      errorEl.hidden = false;
      Site.toast({ title: "Transmission failed", text: "Please try again.", tone: "error" });
    }
  });

  Cart.onChange(render);
  render();
  renderHistory();
})();
