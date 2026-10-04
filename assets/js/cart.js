/* =====================================================================
   CART — kept in the browser (localStorage) so it survives page changes
   and stays in sync between open tabs. Carts saved by the previous
   version of the site (matched by product name) are upgraded on load.
   Depends on: products.js
   ===================================================================== */

const formatPrice = (value) => "$" + Number(value || 0).toFixed(2);

const Cart = (() => {
  const KEY = "hermel_cart";
  const MAX_QTY = 99;
  const listeners = new Set();

  const normalize = (text) => String(text || "").normalize("NFC").trim().toLowerCase();
  const findById = (id) => PRODUCTS.find((p) => p.id === id) || null;
  const findByName = (name) => {
    const wanted = normalize(name);
    if (!wanted) return null;
    return PRODUCTS.find((p) =>
      normalize(p.name) === wanted || (p.aliases || []).some((alias) => normalize(alias) === wanted)
    ) || null;
  };

  // Reads the saved cart, upgrading old entries and merging duplicates.
  // Products that no longer exist in the catalog are dropped.
  function load() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (error) { saved = null; }
    if (!Array.isArray(saved)) return [];

    const items = [];
    saved.forEach((entry) => {
      if (!entry || typeof entry !== "object") return;
      const product = findById(entry.id) || findByName(entry.name);
      if (!product) return;
      const quantity = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(entry.quantity) || 1)));
      const existing = items.find((item) => item.id === product.id);
      if (existing) existing.quantity = Math.min(MAX_QTY, existing.quantity + quantity);
      else items.push({ id: product.id, quantity });
    });
    return items;
  }

  let items = load();

  // name/price/image are stored too, for anything else that reads this key.
  function persist() {
    const data = items.map(({ id, quantity }) => {
      const product = findById(id);
      return { id, name: product.name, price: product.price, image: product.image, quantity };
    });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (error) { /* storage full or blocked */ }
  }

  const emit = (change) => listeners.forEach((listener) => listener(change));

  function commit(change) {
    persist();
    emit(change);
  }

  // Another tab or page may have changed the cart since this page loaded,
  // so every change starts from what is currently saved.
  function refresh() {
    items = load();
  }

  persist();

  window.addEventListener("storage", (event) => {
    if (event.key !== KEY) return;
    refresh();
    emit({ type: "sync" });
  });

  // Pages restored by the Back button keep their old state in memory.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    refresh();
    emit({ type: "sync" });
  });

  return {
    product: findById,

    lines() {
      return items.map(({ id, quantity }) => {
        const product = findById(id);
        return { product, quantity, total: product.price * quantity };
      });
    },

    count() {
      return items.reduce((sum, item) => sum + item.quantity, 0);
    },

    subtotal() {
      return items.reduce((sum, item) => sum + findById(item.id).price * item.quantity, 0);
    },

    add(id, quantity = 1) {
      if (!findById(id)) return false;
      refresh();
      const amount = Math.max(1, Math.floor(Number(quantity) || 1));
      const existing = items.find((item) => item.id === id);
      if (existing) existing.quantity = Math.min(MAX_QTY, existing.quantity + amount);
      else items.push({ id, quantity: Math.min(MAX_QTY, amount) });
      commit({ type: "add", id, quantity: amount });
      return true;
    },

    setQuantity(id, quantity) {
      refresh();
      const item = items.find((entry) => entry.id === id);
      if (!item) return;
      const next = Math.floor(Number(quantity) || 0);
      if (next < 1) return this.remove(id);
      item.quantity = Math.min(MAX_QTY, next);
      commit({ type: "update", id });
    },

    remove(id) {
      refresh();
      const before = items.length;
      items = items.filter((item) => item.id !== id);
      if (items.length !== before) commit({ type: "remove", id });
    },

    clear() {
      items = [];
      commit({ type: "clear" });
    },

    onChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    MAX_QTY,
  };
})();
