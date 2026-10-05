/* =====================================================================
   PRODUCT CATALOG — La Maison du Savon de Hermel
   ---------------------------------------------------------------------
   This is the ONE place where each product's name, price, size,
   category and photo are defined. The shop grid, the product pages,
   "You may also like", the cart and the checkout all read from here,
   so a change made here appears everywhere at once.

   To change a price ......... edit `price` (a number, in US dollars).
   To change the delivery fee  edit DELIVERY_FEE below.
   To add a new product:
     1. Save its photo as      assets/images/products/<id>.jpg
     2. Copy any page in       products/   and rename it  <id>.html
        In the copy, find & replace the old product's id with the new
        id (this updates its photo and data-product attributes), then
        update the page title, names, descriptions and ingredients.
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
   ===================================================================== */

const DELIVERY_FEE = 4;

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
    size: "100 g",
    price: 7,
    image: "honey-frankincense-soap.jpg",
    tint: "#F5E6C8",
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
    size: "50 g",
    price: 9,
    image: "honey-frankincense-cream.jpg",
    tint: "#F2EADC",
    aliases: ["Miel et Encens Cream"],
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
    id: "rose-body-lotion",
    name: "Rose Body Lotion",
    nameAr: "لوشن الجسم بالورد",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "rose-body-lotion.jpg",
    tint: "#F5E3E3",
  },
  {
    id: "white-musk-body-lotion",
    name: "White Musk Body Lotion",
    nameAr: "لوشن الجسم بالمسك الأبيض",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "white-musk-body-lotion.jpg",
    tint: "#EEEDE8",
  },
  {
    id: "strawberry-body-lotion",
    name: "Strawberry Body Lotion",
    nameAr: "لوشن الجسم بالفراولة",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "strawberry-body-lotion.jpg",
    tint: "#F6E0DE",
  },
  {
    id: "vanilla-body-lotion",
    name: "Vanilla Body Lotion",
    nameAr: "لوشن الجسم بالفانيليا",
    categories: ["body"],
    size: "250 ml",
    price: 12,
    image: "vanilla-body-lotion.jpg",
    tint: "#F3ECDD",
  },
];
