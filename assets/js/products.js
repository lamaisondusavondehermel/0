/* =====================================================================
   PRODUCT CATALOG — La Maison du Savon de Hermel
   ---------------------------------------------------------------------
   This is the ONE place where each product's name, price, size,
   category and photo are defined. The shop grid, the product pages,
   "You may also like", the cart and the checkout all read from here,
   so a change made here appears everywhere at once.

   To change a price ......... edit `price` (a number, in US dollars).
                               Each product page also lists its price for
                               Google (the application/ld+json block in its
                               <head>). The page corrects it from here when
                               it loads, but change it there too so every
                               search engine sees the new price.
   To change the delivery fee  edit DELIVERY_FEE below.
   To run or end a sale ...... edit SALE at the bottom of this file.
   To add a new product:
     1. Save its photo as      assets/images/products/<id>.jpg
     2. Copy any page in       products/   and rename it  <id>.html
        In the copy, find & replace the old product's id with the new
        id (this updates its photo, data-product attributes and web
        address), then update the names, descriptions and ingredients,
        and in <head> the title, description, keywords, og:/twitter:
        tags and image size, in English and Arabic like the others,
        and the application/ld+json block (name, description, sku,
        size, price, images). Add the page and photos to sitemap.xml.
     3. Copy one entry below, paste it where you want it to appear in
        the shop, and fill it in. `id` must match the page file name.

   Fields:
     id          short name used for the page + photo (lowercase, dashes)
     name        English name          nameAr   Arabic name
     categories  any of: "soap", "face", "hair", "body"
     size        shown next to the price, e.g. "100 ml"
     price       number, e.g. 8 or 7.5
     image       photo file inside assets/images/products/
     tint        soft background colour behind the photo (optional)
     aliases     older names, so carts saved before a rename still work
     sizeOf      (optional) id of the product this is another size of. It
                 shares that product's page, where the shopper picks the
                 size, and is not shown as its own card in the shop.
     scent       (optional) the scent, for products sold in several scents.
                 Each scent is its own entry, linked with `sizeOf`. It is
                 shown in the cart and on the order, and the "+" on the
                 product's card opens its page so a scent can be chosen.
   ===================================================================== */

const DELIVERY_FEE = 5;

// `short` (optional) is the label shown on phones, where space is tight.
const CATEGORIES = [
  { id: "soap", label: "Natural Soaps", short: "Soaps", labelAr: "صابون طبيعي" },
  { id: "face", label: "Face", labelAr: "الوجه" },
  { id: "hair", label: "Hair", labelAr: "الشعر" },
  { id: "body", label: "Body", labelAr: "الجسم" },
];

const PRODUCTS = [
  /* ---------- Natural soaps ---------- */
  {
    id: "lavender-oat-soap",
    name: "Lavender & Oat Soap",
    nameAr: "صابونة اللافندر والشوفان",
    categories: ["soap", "face"],
    size: "100 g",
    price: 8,
    image: "lavender-oat-soap.jpg",
    tint: "#EAE4EF",
  },
  {
    id: "honey-frankincense-soap",
    name: "Honey & Frankincense Soap",
    nameAr: "صابونة العسل ولبان الذكر",
    categories: ["soap", "face", "body"],
    size: "130 g",
    price: 8,
    image: "honey-frankincense-soap.jpg",
    tint: "#F5E6C8",
  },
  {
    id: "charcoal-detox-soap",
    name: "Charcoal Detox Bar",
    nameAr: "صابونة الفحم النشط",
    categories: ["soap", "face", "body"],
    size: "130 g",
    price: 8,
    image: "charcoal-detox-soap.jpg",
    tint: "#E6E6E3",
  },
  {
    id: "hair-minimizing-soap",
    name: "Hair Minimizing Soap",
    nameAr: "صابونة بديل الليزر",
    categories: ["soap", "body"],
    size: "130 g",
    price: 10,
    image: "hair-minimizing-soap.jpg",
    tint: "#F3EEE2",
  },
  {
    id: "liquid-soap",
    name: "Liquid Soap",
    nameAr: "صابون سائل",
    categories: ["soap", "body"],
    size: "200 ml",
    price: 6,
    image: "liquid-soap.jpg",
    tint: "#E6ECD9",
  },
  {
    id: "grape-cluster-soap",
    name: "Grape Cluster Soap",
    nameAr: "عنقود العنب",
    categories: ["soap"],
    size: "Large",
    price: 7,
    image: "grape-cluster-soap.jpg",
    tint: "#F3E4E1",
  },
  {
    id: "grape-cluster-soap-stand",
    sizeOf: "grape-cluster-soap",
    name: "Grape Cluster Soap",
    nameAr: "عنقود العنب",
    categories: ["soap"],
    size: "Large + stand",
    price: 12,
    image: "grape-cluster-soap.jpg",
    tint: "#F3E4E1",
  },

  /* ---------- Face ---------- */
  {
    id: "chamomile-bright-cleanser",
    name: "Chamomile Bright Cleanser",
    nameAr: "غسول البابونج المفتح",
    categories: ["face"],
    size: "100 ml",
    price: 10,
    image: "chamomile-bright-cleanser.jpg",
    tint: "#F3EED6",
  },
  {
    id: "rosy-repair-cleanser",
    name: "Rosy Repair Cleanser",
    nameAr: "غسول الورد للترميم",
    categories: ["face"],
    size: "100 ml",
    price: 10,
    image: "rosy-repair-cleanser.jpg",
    tint: "#F4E1E1",
  },
  {
    id: "clear-balance-cleanser",
    name: "Clear Balance Cleanser",
    nameAr: "غسول التوازن والصفاء",
    categories: ["face"],
    size: "100 ml",
    price: 10,
    image: "clear-balance-cleanser.jpg",
    tint: "#E1EAE0",
  },
  {
    id: "eclat-face-cream",
    name: "Éclat Face Cream",
    nameAr: "كريم فائق الترطيب",
    categories: ["face"],
    size: "50 ml",
    price: 10,
    image: "eclat-face-cream.jpg",
    tint: "#E9E8EF",
    aliases: ["Face Cream"],
  },
  {
    id: "honey-frankincense-cream",
    name: "Honey & Frankincense Cream",
    nameAr: "كريم لبان الذكر والعسل",
    categories: ["face"],
    size: "50 ml",
    price: 9,
    image: "honey-frankincense-cream.jpg",
    tint: "#F2EADC",
    aliases: ["Miel et Encens Cream"],
  },
  {
    id: "eye-repair-gel",
    name: "Eye Repair Gel",
    nameAr: "جل العيون",
    categories: ["face"],
    size: "15 ml",
    price: 16,
    image: "eye-repair-gel.jpg",
    tint: "#F1E9DD",
  },
  {
    id: "lip-balm",
    name: "Lip Balm",
    nameAr: "مرطب شفاه",
    categories: ["face"],
    size: "4.5 ml",
    price: 4,
    image: "lip-balm.jpg",
    tint: "#E5EDF0",
  },
  {
    id: "brow-nourishing-serum",
    name: "Brow Nourishing Serum",
    nameAr: "سيروم الحواجب",
    categories: ["face"],
    size: "10 ml",
    price: 9,
    image: "brow-nourishing-serum.jpg",
    tint: "#F2E9DC",
  },
  {
    id: "eyebrow-soap",
    name: "Eyebrow Soap",
    nameAr: "صابونة الحواجب",
    categories: ["face"],
    size: "30 ml",
    price: 10,
    image: "eyebrow-soap.jpg",
    tint: "#EEEBE6",
  },

  /* ---------- Hair ---------- */
  {
    id: "rosemary-hair-oil",
    name: "Rosemary Hair Oil",
    nameAr: "زيت اكليل الجبل للشعر",
    categories: ["hair"],
    size: "30 ml",
    price: 8,
    image: "rosemary-hair-oil.jpg",
    tint: "#E3E9DA",
  },
  {
    id: "scalp-hair-serum",
    name: "Scalp Hair Serum",
    nameAr: "سيروم الشعر",
    categories: ["hair"],
    size: "30 ml",
    price: 9,
    image: "scalp-hair-serum.jpg",
    tint: "#F5E7D6",
    aliases: ["Hair Serum"],
  },
  {
    id: "rosemary-shampoo",
    name: "Rosemary & Caffeine Shampoo",
    nameAr: "شامبو الروزماري بالكافيين",
    categories: ["hair"],
    size: "200 ml",
    price: 10,
    image: "rosemary-shampoo.jpg",
    tint: "#E2EADB",
  },
  {
    id: "rosemary-shampoo-500ml",
    sizeOf: "rosemary-shampoo",
    name: "Rosemary & Caffeine Shampoo",
    nameAr: "شامبو الروزماري بالكافيين",
    categories: ["hair"],
    size: "500 ml",
    price: 25,
    image: "rosemary-shampoo.jpg",
    tint: "#E2EADB",
  },
  {
    id: "tea-tree-shampoo",
    name: "Tea Tree Shampoo",
    nameAr: "شامبو شجرة الشاي",
    categories: ["hair"],
    size: "200 ml",
    price: 10,
    image: "tea-tree-shampoo.jpg",
    tint: "#E1EBDD",
  },
  {
    id: "tea-tree-shampoo-500ml",
    sizeOf: "tea-tree-shampoo",
    name: "Tea Tree Shampoo",
    nameAr: "شامبو شجرة الشاي",
    categories: ["hair"],
    size: "500 ml",
    price: 25,
    image: "tea-tree-shampoo.jpg",
    tint: "#E1EBDD",
  },
  {
    id: "naturguard-kids-set",
    name: "Naturguard Kids Shampoo & Mist",
    nameAr: "شامبو وميست الحماية للأطفال",
    categories: ["hair"],
    size: "200 ml + 100 ml",
    price: 18,
    image: "naturguard-kids-set.jpg",
    tint: "#E3EEF5",
  },

  /* ---------- Body ---------- */
  {
    id: "rose-body-oil",
    name: "Rose Body Oil",
    nameAr: "زيت الورد للجسم",
    categories: ["body"],
    size: "30 ml",
    price: 5,
    image: "rose-body-oil.jpg",
    tint: "#ECE6EF",
  },
  {
    id: "hand-cream",
    name: "Hand Cream",
    nameAr: "كريم اليدين",
    categories: ["body"],
    size: "50 ml",
    price: 6,
    image: "hand-cream.jpg",
    tint: "#F1E8D9",
  },
  {
    id: "nail-oil",
    name: "Nail Oil",
    nameAr: "زيت الأظافر",
    categories: ["body"],
    size: "15 ml",
    price: 10,
    image: "nail-oil.jpg",
    tint: "#F3EADC",
  },
  {
    id: "body-lotion",
    name: "Body Lotion",
    nameAr: "لوشن الجسم",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "body-lotion.jpg",
    tint: "#F5E9E3",
    scent: "Rose",
    aliases: ["Rose Body Lotion"],
  },
  {
    id: "vanilla-body-lotion",
    sizeOf: "body-lotion",
    name: "Body Lotion",
    nameAr: "لوشن الجسم",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "body-lotion.jpg",
    tint: "#F5E9E3",
    scent: "Vanilla",
  },
  {
    id: "strawberry-body-lotion",
    sizeOf: "body-lotion",
    name: "Body Lotion",
    nameAr: "لوشن الجسم",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "body-lotion.jpg",
    tint: "#F5E9E3",
    scent: "Strawberry",
  },
  {
    id: "white-musk-body-lotion",
    sizeOf: "body-lotion",
    name: "Body Lotion",
    nameAr: "لوشن الجسم",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "body-lotion.jpg",
    tint: "#F5E9E3",
    scent: "White Musk",
  },
  {
    id: "hair-minimizing-cream",
    name: "Hair Minimizing Cream",
    nameAr: "كريم بديل الليزر",
    categories: ["body"],
    size: "50 ml",
    price: 15,
    image: "hair-minimizing-cream.jpg",
    tint: "#ECE8F0",
  },
  {
    id: "hair-minimizing-oil",
    name: "Hair Minimizing Oil",
    nameAr: "زيت السعد",
    categories: ["body", "face"],
    size: "30 ml",
    price: 9,
    image: "hair-minimizing-oil.jpg",
    tint: "#EFE6D2",
  },
];

/* Holiday sale: every price above is reduced by `percent` until `ends`
   (Lebanon time), then the normal prices come back on their own. While
   it runs, each product keeps its normal price in `regularPrice`, which
   the site shows crossed out. To end the sale early, set percent to 0. */
const SALE = {
  percent: 25,
  ends: "2027-01-02T00:00:00+02:00", // the end of 1 January
  until: "1 January",
  untilAr: "1 كانون الثاني",
};
SALE.active = SALE.percent > 0 && Date.now() < Date.parse(SALE.ends);

if (SALE.active) {
  PRODUCTS.forEach((product) => {
    product.regularPrice = product.price;
    product.price = Math.round(product.price * (100 - SALE.percent)) / 100;
  });
}
