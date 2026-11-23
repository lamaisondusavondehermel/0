/* =====================================================================
   REVIEWS — draws the review cards from reviews.js.
   Homepage: the featured reviews in [data-reviews-home].
   Product page: that product's reviews, in a block placed just before
   "You may also like" (only when the product has reviews).
   To add or change a review, edit assets/js/reviews.js, not this file.
   Depends on: reviews.js, site.js
   ===================================================================== */

(() => {
  if (typeof REVIEWS === "undefined") return;
  const esc = Site.escapeHtml;

  const quoteMark =
    '<svg class="review__mark" viewBox="0 0 32 24" aria-hidden="true"><path d="M0 24V14C0 6 4.5 1.3 12 0l1.4 3.2C9 4.6 7 7.4 6.8 11H12v13H0Zm19 0V14c0-8 4.5-12.7 12-14l1.4 3.2C28 4.6 26 7.4 25.8 11H31v13H19Z"/></svg>';

  function reviewCard(review, group, { link }) {
    const card = document.createElement("figure");
    card.className = "review";
    const page = group.pages[0];
    const product = link && page
      ? `<a class="review__product" href="${Site.url("products/" + page + ".html")}">${esc(group.productAr)}</a>`
      : `<span class="review__product">${esc(group.productAr)}</span>`;
    card.innerHTML = `
      ${quoteMark}
      <blockquote class="review__text"><p>${esc(review.text)}</p></blockquote>
      <figcaption class="review__meta">
        ${product}
        <span class="review__author">${esc(review.name || REVIEW_AUTHOR)}</span>
      </figcaption>`;
    return card;
  }

  // On phones the cards are a swipeable row; the dots show where you are.
  function fillTrack(root, cards) {
    const track = root.querySelector("[data-reviews-track]");
    const dots = root.querySelector("[data-reviews-dots]");
    cards.forEach((card) => track.appendChild(card));
    track.classList.toggle("is-single", cards.length === 1);
    if (!dots || cards.length < 2) return;

    dots.innerHTML = cards.map(() => "<span></span>").join("");
    const dotEls = [...dots.children];
    const update = () => {
      const step = cards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
      const index = Math.min(cards.length - 1, Math.round(Math.abs(track.scrollLeft) / (step || 1)));
      dotEls.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    };
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    update();
  }

  /* ---- Homepage ---- */
  const home = document.querySelector("[data-reviews-home]");
  if (home) {
    const cards = [];
    REVIEWS.forEach((group) => {
      group.reviews.filter((review) => review.featured).forEach((review) => {
        cards.push(reviewCard(review, group, { link: true }));
      });
    });
    if (cards.length) {
      fillTrack(home, cards);
      home.hidden = false;
    }
  }

  /* ---- Product page ---- */
  const productSection = document.querySelector("[data-product]");
  if (productSection) {
    const id = productSection.dataset.product;
    const cards = [];
    REVIEWS.filter((group) => group.pages.includes(id)).forEach((group) => {
      group.reviews.forEach((review) => cards.push(reviewCard(review, group, { link: false })));
    });
    if (!cards.length) return;

    const block = document.createElement("section");
    block.className = "section--tight reviews reviews--product";
    block.setAttribute("aria-labelledby", "reviews-title");
    block.innerHTML = `
      <div class="section-head" data-reveal>
        <p class="eyebrow">Reviews · <span lang="ar" dir="rtl">آراء زبائننا</span></p>
        <h2 class="section-title" id="reviews-title">What customers <em>say</em></h2>
      </div>
      <div class="reviews__track" data-reviews-track dir="rtl" lang="ar" tabindex="0" role="region" aria-label="Customer reviews" data-reveal></div>
      <div class="reviews__dots" data-reviews-dots dir="rtl" aria-hidden="true"></div>`;
    const related = document.querySelector(".related");
    if (related) related.before(block);
    else productSection.parentElement.appendChild(block);
    fillTrack(block, cards);
    Site.observeReveals(block);
  }
})();
