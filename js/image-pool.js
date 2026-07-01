/* =========================================================
   LUMINA — Verified Image Pool
   Every ID below was confirmed live by fetching the real Unsplash photo
   or search-results page (not recalled from memory), to avoid the dead-link
   problem with guessed/misremembered IDs. Organized by category so the
   catalog can draw multiple, visually-distinct images per product type.
   Helper: img(id, w) builds a properly-parameterized CDN URL.
   ========================================================= */

function img(id, w = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;
}

const IMAGE_POOL = {
  headphones: [
    "photo-1546435770-a3e426bf472b", // black wireless headphones between keyboard and mouse
    "photo-1505740420928-5e560c06d30e", // flatlay wireless headphones
    "photo-1618366712010-f4ae9c647dcb", // black wireless headphones on white table
    "photo-1545127398-14699f92334b", // gold beats wireless headphones
    "photo-1613040809024-b4ef7ba99bc3", // pink and white wireless headphones
    "photo-1590658268037-6bf12165a8df", // black and white headphones on white table
    "photo-1609081219090-a6d81d3085bf", // white and gray wireless headphones
    "photo-1567928513899-997d98489fbd", // black wireless headphones
    "photo-1491927570842-0261e477d937", // white beats headphones mid-air
    "photo-1487215078519-e21cc028cb29"  // silver headphones on black surface
  ],
  earbuds: [
    "photo-1606741965326-cb990ae01bb2", // white apple earpods with case
    "photo-1612858249937-1cc0852093dd", // black and blue corded headphones
    "photo-1590602847861-f357a9332bbc"  // (kept from original verified set)
  ],
  smartwatch: [
    "photo-1579586337278-3befd40fd17a", // black smart watch black strap
    "photo-1546868871-7041f2a55e12", // space gray apple watch black sport band
    "photo-1508685096489-7aacd43bd3b1", // apple watch at 14:24
    "photo-1637160151663-a410315e4e75", // apple watch time displayed
    "photo-1617043983671-adaadcaa2460", // white and black apple watch
    "photo-1551816230-ef5deaed4a26", // black G208 smart watch
    "photo-1660844817855-3ecc7ef21f12", // watch with black face
    "photo-1544117519-31a4b719223d", // apple watch at 3:58
    "photo-1517420879524-86d64ac2f339", // person holding silver apple watch
    "photo-1617043786394-f977fa12eddf", // silver apple watch white sport band
    "photo-1434493789847-2f02dc6ca35d"  // person wearing silver apple watch
  ],
  fitness_band: [
    "photo-1575311373937-040b8e1fd5b6", // turned-on black LED watch
    "photo-1557438159-51eec7a6c9e8", // black chronograph watch
    "photo-1579721840641-7d0e67f1204e"  // black and red digital device
  ],
  laptop: [
    "photo-1541560052-5e137f229371", // person using macbook
    "photo-1535957998253-26ae1ef29506", // macbook pro
    "photo-1508780709619-79562169bc64", // person using laptop
    "photo-1501504905252-473c47e087f8", // macbook pro near book
    "photo-1542767352-e98201e84ed8", // silver macbook air adobe file
    "photo-1516387938699-a93567ec168e", // person typing on silver macbook
    "photo-1516542076529-1ea3854896f2", // person using laptop computer
    "photo-1570717173024-ec8081c8f8e9", // turned-on gray laptop
    "photo-1507206130118-b5907f817163", // laptop on wooden table
    "photo-1577100078279-b3445eae827c"  // macbook pro person sitting
  ],
  keyboard: [
    "photo-1511467687858-23d96c32e4ae", // (kept from original verified set)
    "photo-1587829741301-dc798b83add3", // (kept from original verified set)
    "photo-1561112078-7d24e04c3407"  // (kept from original verified set)
  ],
  mouse: [
    "photo-1527864550417-7fd91fc51a46", // (kept from original verified set)
    "photo-1615663245857-ac93bb7c39e7"  // (kept from original verified set)
  ],
  desk_setup: [
    "photo-1461151351821-7973444c0452", // (kept from original verified set)
    "photo-1593062096033-9a26b09da705", // (kept from original verified set)
    "photo-1497366216548-37526070297c"  // (kept from original verified set)
  ],
  office_chair: [
    "photo-1505797149-43b007662973", // (kept from original verified set)
    "photo-1580480055273-228ff5388ef8"  // (kept from original verified set)
  ],
  desk_mat_organizer: [
    "photo-1516387750719-14ec0464f198", // (kept from original verified set)
    "photo-1518655048521-f130df041f66", // (kept from original verified set)
    "photo-1593305841991-05c297ba4575"  // (kept from original verified set)
  ],
  misc_accessory: [
    "photo-1593642634524-b40b5baae6bb", // (kept from original verified set)
    "photo-1611078489935-0cb964de46d6", // (kept from original verified set)
    "photo-1625961332071-f1c0e0fcb1ed"  // (kept from original verified set)
  ],
  microphone: [
    "photo-1590602847861-f357a9332bbc", // (kept from original verified set)
    "photo-1610792516286-524726503fb2"  // (kept from original verified set)
  ],
  wired_earphones: [
    "photo-1631176093617-43792a07780a"  // (kept from original verified set)
  ]
};

/* Round-robin picker so repeated calls for the same category cycle through
   variety instead of always returning the first image. */
const _poolCursor = {};
function pickImg(category, w = 800) {
  const list = IMAGE_POOL[category] || IMAGE_POOL.desk_setup;
  _poolCursor[category] = (_poolCursor[category] || 0) % list.length;
  const id = list[_poolCursor[category]];
  _poolCursor[category]++;
  return img(id, w);
}
