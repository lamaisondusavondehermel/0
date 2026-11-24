/* =====================================================================
   CUSTOMER REVIEWS — آراء زبائننا
   ---------------------------------------------------------------------
   This is the ONE place where customer reviews are kept. The homepage
   section "What our customers say" and the "Reviews" block on each
   product page both read from here (see assets/js/testimonials.js).

   To add a new review:
     1. Find the product's group below (e.g. "Body Lotion").
     2. Copy one line inside its `reviews: [ ... ]`, for example
          { text: "الكريم بجنن، من أول مرة حسّيت بفرق" },
        paste it on a new line in the same list, and replace the text
        between the quotes with the new review. Keep the comma at the
        end of the line. If the review itself contains a " character,
        write it as \" instead.
     3. Save the file. The review appears on that product's page.
     4. To also show it on the homepage, add  featured: true  like this:
          { text: "…", featured: true },
        Keep about 6–8 featured reviews in total so the section stays short.

   To add a first name later (only with the customer's permission), add
   name: "…" and it is shown instead of "زبونة من لبنان":
          { text: "…", name: "ريما" },

   To add a review for a product that has no group yet, copy a whole
   group (from { product: … to the closing }, ) and fill it in:
     product     English name of the product (for you; shown nowhere)
     productAr   the Arabic name shown under each review
     pages       the product page(s) the reviews appear on: the page's
                 file name in products/ without ".html", e.g. "hand-cream".
                 The first page is also where the name links to on the
                 homepage. Leave it empty, pages: [], to keep reviews here
                 without showing them on any product page.
   ===================================================================== */

// Shown under every review that has no `name`.
const REVIEW_AUTHOR = "زبونة من لبنان";

const REVIEWS = [
  {
    product: "Body Lotion",
    productAr: "لوشن الجسم",
    pages: ["body-lotion"],
    reviews: [
      { text: "لوشن الجسم رائع، وخاصة بعد الحمام. بيبقى ساعات عم يعطي ريحة ناعمة، وبيعطي رطوبة. كتيير حبيت", featured: true },
      { text: "لوشن الفانيليا كتير منيح، بيعطي ترطيب قوي وريحته كتير حلوة ومنعشة وبتضاين، وخفيف دغري بيمتصه الجلد" },
      { text: "رائحة جميلة ومنعشة، مرطب وسريع الفعالية" },
      { text: "شكرًا كتير عاللوشن، روعة عنجد. فعالية سريعة وريحة بتعقد" },
    ],
  },
  {
    product: "Body Butter",
    productAr: "زبدة الجسم",
    pages: ["body-butter"],
    reviews: [
      { text: "زبدة الشيا للجسم بتجنن، مجرد ما تنحط عالجلد بتختفي وبتندمج بطريقة سحرية عنجد، وبتعطي رطوبة لطيفة ولمعة ناعمة، والأروع من هاد كلو الريحة البتعقد البتعلق عالجسم، من الصبح لهلق بعدا الريحة، يعني صارو ١٢ ساعة!" },
    ],
  },
  {
    product: "Hand Cream",
    productAr: "كريم الإيدين",
    pages: ["hand-cream"],
    reviews: [
      { text: "كريم الإيدين كتير بيطري وبيدوم وقت طويل عالإيد", featured: true },
      { text: "الكريم بجنن، من أول مرة حسّيت بفرق" },
    ],
  },
  {
    product: "Body Oil",
    productAr: "زيت الجسم",
    pages: ["rose-body-oil"],
    reviews: [
      { text: "زيت الجسم من أول مرة حطيتو عطاني فرق بالملمس" },
      { text: "كمان زيت الجسم وباقي المنتجات كتيير حبيت، فعّالة وبضاينو وقت طويل" },
    ],
  },
  {
    product: "Honey & Frankincense Cream / Set",
    productAr: "كريم ومجموعة العسل واللبان",
    pages: ["honey-frankincense-cream"],
    reviews: [
      { text: "الكريم ماشالله رائع، كتير عجبني بيعطي نضارة للوجه ولمعة طبيعية. حسّيت وجهي صار متل المراية", featured: true },
      { text: "الكريم روعة فعلًا، من أول مرة استعملتو حسّيت بشرتي نضرة" },
      { text: "بطبيعة شغلنا إيدينا بضلّو ناشفين من الغسيل والتعقيم المستمر، بس هيدا فعاليتو رهيبة. أكتر شي عم بستخدمو" },
      { text: "والله عم بحكي بكل موضوعية، شغل كتير روعة… برافو" },
    ],
  },
  {
    product: "Lavender Face Cream (Éclat Face Cream)",
    productAr: "كريم الوجه باللافندر",
    pages: ["eclat-face-cream"],
    reviews: [
      { text: "رطوبة عالية بتضل من الصبح، وجهي متل الخسة. متل الكريم لكنت جيبو من فرنسا", featured: true },
    ],
  },
  {
    product: "Eye Repair Gel",
    productAr: "جل العيون",
    pages: ["eye-repair-gel"],
    reviews: [
      { text: "لاحظت الترطيب تحت العين بشكل رهيب. مشكورة زينب، وناطرين الجديد" },
    ],
  },
  {
    product: "Rosy Repair Face Wash",
    productAr: "غسول الوجه",
    pages: ["rosy-repair-cleanser"],
    reviews: [
      { text: "زاد النعومة والنضارة للبشرة، وكمان مش ضروري حط المرطب بعدو", featured: true },
    ],
  },
  {
    product: "Lip Balm",
    productAr: "مرطب الشفايف",
    pages: ["lip-balm"],
    reviews: [
      { text: "الليب كير كتير حلو وما بزيّت، وبنفس اللحظة بيعطي نتيجة. مرسي مرسي", featured: true },
    ],
  },
  {
    product: "Rosemary Shampoo & Mask",
    productAr: "شامبو وماسك إكليل الجبل",
    pages: ["rosemary-shampoo"],
    reviews: [
      { text: "الشامبو تمام التمام، والماسك هوّي الرائع: بيشتغل متل الـ leave-in، بيظهر الكيرلي تبع الشعر وما ببيّن النوبرة أبدًا", featured: true },
    ],
  },
  {
    product: "Hair Oil & Serum",
    productAr: "زيت وسيروم الشعر",
    pages: ["rosemary-hair-oil", "scalp-hair-serum"],
    reviews: [
      { text: "شعري كان كتير منشّف ومنوبر. جرّبت الزيت والسيروم وكتير فرق الوضع، وأكيد بس يخلصو بدي ارجع جيب" },
    ],
  },
  {
    product: "Hair Minimizing Set",
    productAr: "مجموعة تخفيف الشعر",
    pages: ["hair-minimizing-cream", "hair-minimizing-oil"],
    reviews: [
      { text: "هيدي المجموعة كتير عجبتني، والنتيجة ما كنت متوقعتها. رح كمّل استخدام الكريم والزيت" },
    ],
  },
  {
    // Kept here for later: not shown on any page yet (pages is empty).
    product: "Soap & Moisturizer",
    productAr: "الصابون والمرطب",
    pages: [],
    reviews: [
      { text: "المرطب والصابونة كتير مناح: نظافة، ترطيب، لمعان. رح أعتمدهن ويكونو روتيني اليومي" },
      { text: "مرطب روعة، وريحة ولا أروع" },
      { text: "الـ face soap كمان كتير منيحة للجسم" },
    ],
  },
];
