/* =========================================================
   LUMINA — Product Catalog Data
   Single source of truth for all product/catalog data.
   ========================================================= */

const CATEGORIES = [
  { id: 'audio',       label: 'Audio',        icon: 'headphones' },
  { id: 'wearables',   label: 'Wearables',     icon: 'watch' },
  { id: 'desk',        label: 'Desk & Office', icon: 'monitor' },
  { id: 'accessories', label: 'Accessories',   icon: 'cable' },
  { id: 'seating',     label: 'Seating',       icon: 'armchair' }
];

const COLLECTIONS = [
  { id: 'new',      label: 'New Arrivals' },
  { id: 'bestseller', label: 'Bestsellers' },
  { id: 'sale',     label: 'On Sale' }
];

/* Each product:
   id, name, brand, category, collections[], price, compareAt (or null),
   rating, reviewCount, colors[{name,hex}], sizes[] (or null),
   img (primary), gallery[], badge (or null), stock, description, specs[]
*/
const PRODUCTS = [
  {
    id: 1,
    name: "Acoustic Wireless Headphones",
    brand: "Lumina Audio",
    category: "audio",
    collections: ["bestseller"],
    price: 299, compareAt: 349,
    rating: 4.8, reviewCount: 214,
    colors: [{ name: "Graphite", hex: "#2b2b2e" }, { name: "Cream", hex: "#ece6d8" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "Sale",
    stock: 34,
    description: "Over-ear headphones tuned for clarity at every volume. Active noise cancellation, 40-hour battery life, and memory-foam cushions built for full workdays.",
    specs: [["Driver", "40mm Dynamic"], ["Battery", "40 hrs ANC on"], ["Connectivity", "Bluetooth 5.3"], ["Weight", "254g"]]
  },
  {
    id: 2,
    name: "Mechanical Keyboard — Low Profile",
    brand: "Lumina Desk",
    category: "desk",
    collections: ["bestseller"],
    price: 159, compareAt: null,
    rating: 4.6, reviewCount: 188,
    colors: [{ name: "Slate", hex: "#3a3d42" }, { name: "Ivory", hex: "#f1ede2" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1561112078-7d24e04c3407?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 51,
    description: "Hot-swappable low-profile switches with a CNC aluminum frame. Quiet enough for calls, tactile enough for long writing sessions.",
    specs: [["Switches", "Hot-swap tactile"], ["Layout", "75%"], ["Connectivity", "USB-C / BT 5.1"], ["Backlight", "RGB, per-key"]]
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    brand: "Lumina Wear",
    category: "wearables",
    collections: ["new", "bestseller"],
    price: 399, compareAt: null,
    rating: 4.9, reviewCount: 302,
    colors: [{ name: "Onyx", hex: "#1c1c1e" }, { name: "Titanium", hex: "#9a958a" }],
    sizes: ["41mm", "45mm"],
    img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "New",
    stock: 22,
    description: "Always-on display, 10-day battery, and precise sleep and workout tracking. Built to disappear into your routine, not interrupt it.",
    specs: [["Display", "AMOLED, always-on"], ["Battery", "10 days"], ["Water rating", "5ATM"], ["Sensors", "HR, SpO2, GPS"]]
  },
  {
    id: 4,
    name: "Minimalist Wireless Mouse",
    brand: "Lumina Desk",
    category: "desk",
    collections: [],
    price: 89, compareAt: null,
    rating: 4.4, reviewCount: 96,
    colors: [{ name: "White", hex: "#f5f5f3" }, { name: "Graphite", hex: "#3a3a3c" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 67,
    description: "A silent-click mouse shaped around how your hand actually rests. Three months on a single charge.",
    specs: [["Sensor", "4000 DPI optical"], ["Battery", "~90 days"], ["Connectivity", "USB-C / BT"], ["Weight", "76g"]]
  },
  {
    id: 5,
    name: "USB-C Desktop Hub — 9 Port",
    brand: "Lumina Desk",
    category: "accessories",
    collections: ["bestseller"],
    price: 129, compareAt: null,
    rating: 4.5, reviewCount: 142,
    colors: [{ name: "Space Gray", hex: "#4a4a4d" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1461151351821-7973444c0452?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1461151351821-7973444c0452?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1625961332071-f1c0e0fcb1ed?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 88,
    description: "One cable, every port. Dual 4K display output, gigabit ethernet, and 100W passthrough charging.",
    specs: [["Ports", "9-in-1"], ["Display out", "Dual 4K@60Hz"], ["Charging", "100W PD passthrough"], ["Cable", "30cm braided"]]
  },
  {
    id: 6,
    name: "Full-Grain Leather Desk Mat",
    brand: "Lumina Desk",
    category: "desk",
    collections: [],
    price: 45, compareAt: 59,
    rating: 4.7, reviewCount: 73,
    colors: [{ name: "Saddle", hex: "#8a5a36" }, { name: "Black", hex: "#262220" }],
    sizes: ["80×40cm", "90×45cm"],
    img: "https://images.unsplash.com/photo-1516387750719-14ec0464f198?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1516387750719-14ec0464f198?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "Sale",
    stock: 110,
    description: "Vegetable-tanned leather that gets better with age. Stitched edges, water-resistant finish, cork backing that won't slide.",
    specs: [["Material", "Full-grain leather"], ["Backing", "Natural cork"], ["Care", "Wipe clean"], ["Thickness", "3mm"]]
  },
  {
    id: 7,
    name: "Ergonomic Mesh Office Chair",
    brand: "Lumina Seating",
    category: "seating",
    collections: ["bestseller"],
    price: 549, compareAt: null,
    rating: 4.8, reviewCount: 256,
    colors: [{ name: "Charcoal", hex: "#3b3b3d" }, { name: "Stone", hex: "#c9c4b8" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1505797149-43b007662973?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1505797149-43b007662973?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 18,
    description: "Adjustable lumbar support, 4D armrests, and breathable mesh that holds its shape through a full day of sitting.",
    specs: [["Recline", "90°–135°"], ["Weight capacity", "150kg"], ["Lumbar", "Adjustable"], ["Warranty", "5 years"]]
  },
  {
    id: 8,
    name: "Studio Condenser Microphone",
    brand: "Lumina Audio",
    category: "audio",
    collections: ["new"],
    price: 199, compareAt: null,
    rating: 4.6, reviewCount: 121,
    colors: [{ name: "Black", hex: "#1d1d1f" }, { name: "Silver", hex: "#c7c8ca" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1610792516286-524726503fb2?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "New",
    stock: 40,
    description: "Studio-grade cardioid capsule with a built-in pop filter and zero-latency monitoring. Plug in and sound finished.",
    specs: [["Pattern", "Cardioid"], ["Sample rate", "24-bit / 96kHz"], ["Connectivity", "USB-C"], ["Mount", "Desktop stand incl."]]
  },
  {
    id: 9,
    name: "True Wireless Earbuds",
    brand: "Lumina Audio",
    category: "audio",
    collections: ["new", "bestseller"],
    price: 179, compareAt: 219,
    rating: 4.5, reviewCount: 168,
    colors: [{ name: "Pearl", hex: "#eceae4" }, { name: "Graphite", hex: "#2b2b2e" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "Sale",
    stock: 75,
    description: "Compact earbuds with adaptive noise cancellation and a case that tops up a full charge in 10 minutes.",
    specs: [["Battery", "6h + 24h case"], ["ANC", "Adaptive, 2-mic"], ["Charging", "USB-C, wireless"], ["Water rating", "IPX4"]]
  },
  {
    id: 10,
    name: "Sit-Stand Desk Frame",
    brand: "Lumina Desk",
    category: "desk",
    collections: [],
    price: 429, compareAt: null,
    rating: 4.7, reviewCount: 91,
    colors: [{ name: "Black", hex: "#1c1c1c" }, { name: "White", hex: "#f4f4f2" }],
    sizes: ["120cm", "140cm", "160cm"],
    img: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 29,
    description: "Dual-motor lift with four memory presets and near-silent operation. Goes from sitting to standing in under 12 seconds.",
    specs: [["Lift range", "62–128cm"], ["Motors", "Dual, 100W"], ["Memory presets", "4"], ["Weight capacity", "120kg"]]
  },
  {
    id: 11,
    name: "Aluminum Laptop Stand",
    brand: "Lumina Desk",
    category: "accessories",
    collections: [],
    price: 59, compareAt: null,
    rating: 4.3, reviewCount: 64,
    colors: [{ name: "Silver", hex: "#c9cace" }, { name: "Space Gray", hex: "#54555a" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 130,
    description: "Folds flat for travel, holds steady on the desk. Raises your screen to eye level so your neck stops paying for your focus.",
    specs: [["Material", "6061 Aluminum"], ["Height", "Adjustable, 6 steps"], ["Max load", "5kg"], ["Folded size", "26×10×3cm"]]
  },
  {
    id: 12,
    name: "Bluetooth Mechanical Numpad",
    brand: "Lumina Desk",
    category: "accessories",
    collections: ["new"],
    price: 49, compareAt: null,
    rating: 4.2, reviewCount: 38,
    colors: [{ name: "Ivory", hex: "#f1ede2" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "New",
    stock: 56,
    description: "The full tactile feel of your keyboard, just for numbers. Pairs to three devices and switches with one tap.",
    specs: [["Switches", "Tactile brown"], ["Connectivity", "BT 5.1, multi-pair"], ["Battery", "~60 hrs"], ["Size", "Compact 18-key"]]
  },
  {
    id: 13,
    name: "Fitness Tracker Band",
    brand: "Lumina Wear",
    category: "wearables",
    collections: ["sale"],
    price: 79, compareAt: 99,
    rating: 4.4, reviewCount: 154,
    colors: [{ name: "Black", hex: "#1c1c1e" }, { name: "Sage", hex: "#7e8a72" }, { name: "Coral", hex: "#d97a5b" }],
    sizes: ["S/M", "L/XL"],
    img: "https://images.unsplash.com/photo-1575311373937-f5a09b81a712?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1575311373937-f5a09b81a712?auto=format&fit=crop&q=80&w=900",
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "Sale",
    stock: 98,
    description: "Lightweight enough to forget you're wearing it. Tracks sleep, steps, and heart rate for up to two weeks per charge.",
    specs: [["Battery", "14 days"], ["Water rating", "5ATM"], ["Display", "AMOLED"], ["Weight", "24g"]]
  },
  {
    id: 14,
    name: "Noise-Isolating Wired Earphones",
    brand: "Lumina Audio",
    category: "audio",
    collections: ["sale"],
    price: 39, compareAt: 55,
    rating: 4.1, reviewCount: 47,
    colors: [{ name: "Black", hex: "#1d1d1f" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1631176093617-43792a07780a?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1631176093617-43792a07780a?auto=format&fit=crop&q=80&w=900"
    ],
    badge: "Sale",
    stock: 200,
    description: "No battery, no pairing, no drama. Braided cable, in-line mic, and a sound signature tuned for vocals.",
    specs: [["Driver", "10mm Dynamic"], ["Connector", "USB-C"], ["Cable", "1.2m braided"], ["Mic", "In-line, omnidirectional"]]
  },
  {
    id: 15,
    name: "Adjustable Monitor Arm",
    brand: "Lumina Desk",
    category: "desk",
    collections: [],
    price: 119, compareAt: null,
    rating: 4.6, reviewCount: 82,
    colors: [{ name: "Black", hex: "#23232a" }, { name: "White", hex: "#f2f2ef" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 47,
    description: "Full-motion gas-spring arm that holds your monitor exactly where you put it. Clamps or grommets through your desk, your call.",
    specs: [["Load range", "2–9kg"], ["VESA", "75×75 / 100×100"], ["Mount", "Clamp + grommet"], ["Motion", "Full articulating"]]
  },
  {
    id: 16,
    name: "Recycled Felt Desk Organizer",
    brand: "Lumina Desk",
    category: "accessories",
    collections: [],
    price: 35, compareAt: null,
    rating: 4.5, reviewCount: 29,
    colors: [{ name: "Charcoal", hex: "#4a4a4a" }, { name: "Oat", hex: "#d9d2c3" }],
    sizes: null,
    img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=700",
    gallery: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=900"
    ],
    badge: null,
    stock: 84,
    description: "Made from recycled PET felt. Six compartments for cables, pens, and the small things that pile up by Thursday.",
    specs: [["Material", "Recycled felt"], ["Compartments", "6"], ["Dimensions", "28×18×8cm"], ["Care", "Spot clean"]]
  }
];

/* Sample reviews keyed by product id — used to seed the reviews panel */
const REVIEWS = {
  1: [
    { author: "Dara K.", rating: 5, date: "2026-05-02", title: "Best purchase this year", body: "The ANC actually works on the train, not just in marketing photos. Battery easily lasts my whole work week." },
    { author: "Femi A.", rating: 5, date: "2026-04-18", title: "Comfortable for long sessions", body: "I wear these for 6+ hour writing sessions. No ear fatigue, and the cream colorway looks great." },
    { author: "Priya S.", rating: 4, date: "2026-03-29", title: "Great sound, app could be better", body: "Audio quality is excellent. The companion app is a little clunky but doesn't affect daily use." }
  ],
  3: [
    { author: "Chinedu O.", rating: 5, date: "2026-05-10", title: "Battery life is no joke", body: "Genuinely gets close to the advertised 10 days with always-on display enabled. Sleep tracking is accurate too." },
    { author: "Wale T.", rating: 5, date: "2026-04-22", title: "Switched from a big-name brand", body: "Lighter on the wrist and the titanium finish doesn't show scratches like I expected it to." }
  ],
  7: [
    { author: "Ngozi E.", rating: 5, date: "2026-05-15", title: "My back thanks me daily", body: "Took a week to dial in the lumbar support, now it's perfect. Worth the price for anyone at a desk all day." },
    { author: "Tunde B.", rating: 4, date: "2026-04-02", title: "Solid build, slow delivery", body: "Chair itself is excellent and very sturdy. Shipping took longer than I expected." }
  ]
};
