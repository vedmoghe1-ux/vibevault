export const AESTHETICS = [
  { id: "goth", name: "Goth", tagline: "Ritual black, silver hardware, nothing soft", a1: "#B892FF", a2: "#FF4D6D", tone: "#151021", note: "lace · leather · chrome", promise: "for quiet menace" },
  { id: "old-money", name: "Old Money", tagline: "Quiet cloth that never mentions the price", a1: "#D9C89A", a2: "#8FB09B", tone: "#171A16", note: "cashmere · poplin · gold", promise: "for confidence" },
  { id: "cottagecore", name: "Cottagecore", tagline: "Sun-warmed linen and a garden habit", a1: "#F2B8A2", a2: "#A8C686", tone: "#1B1712", note: "linen · gingham · straw", promise: "for slow, soft peace" },
  { id: "clean-girl", name: "Clean Girl", tagline: "Slicked back, unbothered, tonal head to toe", a1: "#E6D8C3", a2: "#9CC7D8", tone: "#14151A", note: "jersey · gold · glass", promise: "for effortless control" },
  { id: "dark-academia", name: "Dark Academia", tagline: "Library dust, tweed and long arguments", a1: "#C9A27E", a2: "#7E96C4", tone: "#161318", note: "tweed · wool · leather", promise: "for intellectual mystery" },
  { id: "y2k", name: "Y2K", tagline: "Low rise, high shine, zero restraint", a1: "#8FE9FF", a2: "#FF7BD5", tone: "#101827", note: "chrome · denim · gloss", promise: "for chaotic confidence" },
  { id: "streetwear", name: "Streetwear", tagline: "Volume, layers, and shoes that argue back", a1: "#F5E663", a2: "#FF8A3D", tone: "#141414", note: "nylon · fleece · rubber", promise: "for street credibility" },
  { id: "cyberpunk", name: "Cyberpunk", tagline: "Technical black with one loud circuit", a1: "#5EF2C9", a2: "#FF4FA3", tone: "#0C1418", note: "ripstop · mesh · reflective", promise: "for future-proof rebellion" },
  { id: "coquette", name: "Coquette", tagline: "Bows, lace, and a little too much innocence", a1: "#FFC9DE", a2: "#E8A0B4", tone: "#1C1417", note: "satin · lace · pearls", promise: "for soft power" },
  { id: "mob-wife", name: "Mob Wife", tagline: "Fur, gold, and zero apologies", a1: "#C99A5B", a2: "#7A2E2E", tone: "#1A1210", note: "fur · leopard · gold chain", promise: "for zero apologies" },
  { id: "indie-sleaze", name: "Indie Sleaze", tagline: "Flash photography, smudged liner, 3am energy", a1: "#E8E252", a2: "#FF5C8A", tone: "#141018", note: "denim · leather · glitter", promise: "for 3am confidence" },
  { id: "balletcore", name: "Balletcore", tagline: "Wrap tops, soft pink, quiet discipline", a1: "#F6D6E0", a2: "#C9B8D8", tone: "#17141A", note: "tulle · ribbon · knit", promise: "for quiet discipline" },
];

export const shopUrl = (brand, name) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${brand} ${name}`)}&tbm=shop`;

export const mk = (id, slot, name, brand, price, tone) => ({
  id, slot, name, brand, price, tone, url: shopUrl(brand, name),
});

/* For real products sourced from an Indian retailer (e.g. Myntra via an
   affiliate network). Prices come in as real ₹ amounts; the app's internal
   "price" unit is USD-equivalent (see lib/currency.js), so we convert on
   the way in. This makes the ₹ figure shown in the app exactly match the
   real listing price, while other currencies still show a fair estimate. */
const INR_RATE = 83.1;
export const mkReal = (id, slot, name, brand, priceINR, tone, description, url) => ({
  id, slot, name, brand, price: priceINR / INR_RATE, tone, description, url, real: true,
});

export const OUTFITS = [
  { id: "o1", aesthetic: "goth", title: "Cathedral Static", curator: "@vellum", saves: 2840, promoted: true, tier: "icon",
    blurb: "Sheer over structure. The skirt does the drama so the jacket can stay mean.",
    items: [ mk("i1","Outerwear","Waxed cropped moto","Ossuary",189,"#1C1723"), mk("i2","Top","Sheer mesh long-sleeve","Veil & Vice",42,"#2A2233"), mk("i3","Bottoms","Buckled satin maxi","Ossuary",96,"#0E0C13"), mk("i4","Shoes","Platform derby","Rotgarden",148,"#171319"), mk("i5","Accessories","Chain rosary belt","Reliquary",38,"#8E8AA3") ] },
  { id: "o2", aesthetic: "goth", title: "Velvet Fallout", curator: "@nyxbloom", saves: 1190, promoted: false,
    blurb: "Velvet reads expensive at night. Keep the silver small and the boots heavy.",
    items: [ mk("i6","Outerwear","Longline velvet coat","Ossuary",214,"#221A2C"), mk("i7","Top","Ribbed square-neck","Veil & Vice",34,"#100E14"), mk("i8","Bottoms","Wide wool trouser","Grave Goods",88,"#15121A"), mk("i9","Shoes","Harness boot","Rotgarden",172,"#191519") ] },

  { id: "o3", aesthetic: "old-money", title: "Off-Season Riviera", curator: "@margaux", saves: 3120, promoted: true, tier: "blaze",
    blurb: "One good knit, one good loafer. Everything else stays out of the way.",
    items: [ mk("i10","Outerwear","Camel wool overcoat","Maison Verdi",420,"#B79C74"), mk("i11","Top","Cotton oxford, ecru","Ashford Row",78,"#E8E1D2"), mk("i12","Bottoms","Pleated tailored trouser","Maison Verdi",164,"#3B4235"), mk("i13","Shoes","Suede penny loafer","Calloway",210,"#6B5138"), mk("i14","Accessories","Silk twill scarf","Ashford Row",92,"#9BB0A0") ] },
  { id: "o4", aesthetic: "old-money", title: "Boathouse Sunday", curator: "@thelark", saves: 870, promoted: false,
    blurb: "Navy and cream, pressed but not precious. The cap is doing real work.",
    items: [ mk("i15","Top","Cable knit, cream","Ashford Row",148,"#EDE6D5"), mk("i16","Bottoms","Straight chino","Calloway",96,"#C6B594"), mk("i17","Shoes","Deck shoe","Calloway",132,"#4A3A2B"), mk("i18","Accessories","Woven leather belt","Maison Verdi",74,"#5C4632") ] },

  { id: "o5", aesthetic: "cottagecore", title: "Six in the Morning Garden", curator: "@fernweh", saves: 2210, promoted: false,
    blurb: "Linen that creases on purpose. Boots because the grass is still wet.",
    items: [ mk("i19","Outerwear","Quilted chore jacket","Fernweh Goods",128,"#8FA26E"), mk("i20","Top","Puff-sleeve blouse","Milk & Meadow",58,"#F3E9DA"), mk("i21","Bottoms","Tiered linen midi","Fernweh Goods",84,"#D9B7A4"), mk("i22","Shoes","Rubber garden boot","Hollowell",66,"#4C5B44"), mk("i23","Accessories","Woven market basket","Milk & Meadow",44,"#C7A16B") ] },
  { id: "o6", aesthetic: "cottagecore", title: "Jam Day", curator: "@plumline", saves: 640, promoted: false,
    blurb: "Gingham without the costume. Cardigan two sizes up, sleeves pushed.",
    items: [ mk("i24","Outerwear","Slouchy wool cardigan","Milk & Meadow",92,"#E3C7A8"), mk("i25","Top","Gingham camisole","Fernweh Goods",38,"#E9A7A0"), mk("i26","Bottoms","Cotton bloomer short","Hollowell",42,"#F2EADB"), mk("i27","Shoes","Leather clog","Hollowell",118,"#7A5436") ] },

  { id: "o7", aesthetic: "clean-girl", title: "Second Coffee", curator: "@ariv", saves: 4090, promoted: true, tier: "icon",
    blurb: "Three tones, no pattern, one gold thing. It reads finished from across the street.",
    items: [ mk("i28","Top","Ribbed tank, bone","Glasshouse",36,"#EDE6DA"), mk("i29","Bottoms","High-rise straight denim","Rue Delphine",118,"#C9CEDB"), mk("i30","Outerwear","Boxy poplin shirt","Glasshouse",74,"#F5F1E9"), mk("i31","Shoes","Leather mesh flat","Rue Delphine",145,"#D8C7AE"), mk("i32","Accessories","Chunky gold hoop","Glasshouse",52,"#D9B45C") ] },
  { id: "o8", aesthetic: "clean-girl", title: "Pilates Adjacent", curator: "@sonora", saves: 1760, promoted: false,
    blurb: "Matching set as a base layer, tailored coat on top so it isn't gym clothes.",
    items: [ mk("i33","Top","Seamless long-sleeve","Rue Delphine",62,"#DDD3C6"), mk("i34","Bottoms","Ankle flare legging","Rue Delphine",88,"#1D1B1C"), mk("i35","Outerwear","Wool car coat","Glasshouse",245,"#B9AFA0"), mk("i36","Shoes","Low-profile sneaker","Halcyon",112,"#F0EDE6") ] },

  { id: "o9", aesthetic: "dark-academia", title: "Late Return", curator: "@corvid", saves: 2530, promoted: false,
    blurb: "Tweed with the tie loose. Everything a half-shade browner than black.",
    items: [ mk("i37","Outerwear","Herringbone blazer","Corvid & Sons",228,"#5A4B3C"), mk("i38","Top","Fine-gauge merino","Pemberly",96,"#2E2A26"), mk("i39","Bottoms","Wool pleated trouser","Corvid & Sons",142,"#3A342C"), mk("i40","Shoes","Leather oxford","Pemberly",198,"#40291B"), mk("i41","Accessories","Canvas satchel","Corvid & Sons",164,"#6B563E") ] },
  { id: "o10", aesthetic: "dark-academia", title: "Thesis Weather", curator: "@ashgrove", saves: 990, promoted: false,
    blurb: "Long coat over knitwear, scarf doubled. Built for walking and arguing.",
    items: [ mk("i42","Outerwear","Charcoal wool overcoat","Pemberly",310,"#33333A"), mk("i43","Top","Cable roll-neck","Ashgrove",118,"#4A4238"), mk("i44","Bottoms","Corduroy trouser","Corvid & Sons",104,"#5C4634"), mk("i45","Shoes","Chelsea boot","Ashgrove",186,"#2C2119") ] },

  { id: "o11", aesthetic: "y2k", title: "Mall Security", curator: "@bitmap", saves: 3380, promoted: true, tier: "blaze",
    blurb: "Baby tee, low rise, and something metallic near the face. Non-negotiable.",
    items: [ mk("i46","Top","Ringer baby tee","Bitmap",29,"#B6E8F5"), mk("i47","Bottoms","Low-rise bootcut","Neon Ossature",92,"#7FA6D8"), mk("i48","Outerwear","Cropped puffer, silver","Bitmap",134,"#C9CFD8"), mk("i49","Shoes","Chunky mesh runner","Halcyon",128,"#EFEFF3"), mk("i50","Accessories","Butterfly clip set","Bitmap",14,"#FF9AD8") ] },
  { id: "o12", aesthetic: "y2k", title: "Frosted Lens", curator: "@glitterloss", saves: 1420, promoted: false,
    blurb: "Denim on denim, one shade apart, tinted sunglasses doing the heavy lifting.",
    items: [ mk("i51","Outerwear","Cropped denim trucker","Neon Ossature",108,"#9DBBE0"), mk("i52","Top","Halter mesh top","Bitmap",34,"#FFB3E6"), mk("i53","Bottoms","Cargo flare, ice wash","Neon Ossature",96,"#CBD9EA"), mk("i54","Accessories","Tinted oval shades","Bitmap",26,"#FF7BD5") ] },

  { id: "o13", aesthetic: "streetwear", title: "Blockwide", curator: "@kaito", saves: 5120, promoted: true, tier: "icon",
    blurb: "Volume up top, tapered below, loud shoe. The hoodie is intentionally too big.",
    items: [ mk("i55","Outerwear","Boxy nylon anorak","Concrete Sun",188,"#F5A03D"), mk("i56","Top","Heavyweight hoodie","Blockwide",96,"#2A2A2A"), mk("i57","Bottoms","Tapered cargo","Concrete Sun",118,"#4A4A42"), mk("i58","Shoes","Trail runner","Halcyon",165,"#E4DC55"), mk("i59","Accessories","Ripstop crossbody","Blockwide",58,"#1D1D1D") ] },
  { id: "o14", aesthetic: "streetwear", title: "Off Rotation", curator: "@dmnd", saves: 2040, promoted: false,
    blurb: "Fleece half-zip, wide denim, cap low. Comfortable enough to lie about the effort.",
    items: [ mk("i60","Top","Grid fleece half-zip","Blockwide",112,"#C8C2B4"), mk("i61","Bottoms","Wide raw denim","Concrete Sun",134,"#3F4A5C"), mk("i62","Shoes","Low leather skate","Halcyon",92,"#E8E4DA"), mk("i63","Accessories","Washed 6-panel cap","Blockwide",38,"#2E3440") ] },

  { id: "o15", aesthetic: "cyberpunk", title: "Night Freight", curator: "@axon", saves: 2760, promoted: false,
    blurb: "All black technical with a single reflective line. Straps over shoulders, not hips.",
    items: [ mk("i64","Outerwear","Ripstop shell, taped","Axon Standard",245,"#12181C"), mk("i65","Top","Mesh base layer","Nullform",68,"#1A2226"), mk("i66","Bottoms","Articulated cargo","Axon Standard",156,"#0F1416"), mk("i67","Shoes","Reflective high-top","Nullform",178,"#3DF2C4"), mk("i68","Accessories","Modular chest rig","Axon Standard",124,"#1B1F22") ] },
  { id: "o16", aesthetic: "cyberpunk", title: "Signal Loss", curator: "@vhsghost", saves: 1310, promoted: false,
    blurb: "Slim silhouette, magenta at the hem only. Read as clean, not costume.",
    items: [ mk("i69","Top","Asymmetric zip top","Nullform",92,"#161B1F"), mk("i70","Bottoms","Slim tech trouser","Axon Standard",138,"#101416"), mk("i71","Outerwear","Cropped bomber, matte","Nullform",196,"#1C1418"), mk("i72","Shoes","Sock runner","Halcyon",144,"#FF4FA3") ] },

  { id: "o17", aesthetic: "coquette", title: "Balcony Scene", curator: "@rosewater", saves: 3410, promoted: true, tier: "blaze",
    blurb: "One bow, worn seriously. Everything else stays soft and a little too sweet.",
    items: [ mk("i73","Top","Ribbon-strap cami","Bisou Bisou",34,"#FBD9E6"), mk("i74","Bottoms","Pleated mini skirt","Petit Four",58,"#F3E7ED"), mk("i75","Shoes","Mary jane flat","Bisou Bisou",72,"#E7C7D2"), mk("i76","Accessories","Oversized satin bow clip","Petit Four",16,"#E8A0B4") ] },
  { id: "o18", aesthetic: "coquette", title: "Diary Entry", curator: "@lacetrim", saves: 1580, promoted: false,
    blurb: "Cardigan buttoned wrong on purpose. Reads more storybook than costume.",
    items: [ mk("i77","Outerwear","Cropped cardigan, blush","Petit Four",64,"#F6DCE4"), mk("i78","Top","Lace-trim camisole","Bisou Bisou",28,"#FDEEF2"), mk("i79","Bottoms","Tiered lace skirt","Petit Four",70,"#F0DCE2") ] },

  { id: "o19", aesthetic: "mob-wife", title: "Sunday Sit-Down", curator: "@goldchain", saves: 2960, promoted: true, tier: "icon",
    blurb: "Fur over silk, sunglasses indoors. Nothing on this look is asking permission.",
    items: [ mk("i80","Outerwear","Faux fur maxi coat","Corleone & Co",245,"#8A6A4A"), mk("i81","Top","Silk cowl-neck cami","Vendetta Row",68,"#7A2E2E"), mk("i82","Bottoms","Leopard midi skirt","Corleone & Co",92,"#5C4530"), mk("i83","Accessories","Chunky gold chain","Vendetta Row",54,"#C99A5B") ] },
  { id: "o20", aesthetic: "mob-wife", title: "Corner Table", curator: "@lastword", saves: 1240, promoted: false,
    blurb: "Pinstripe trouser, red lip energy, heels that mean business.",
    items: [ mk("i84","Top","Satin wrap blouse","Vendetta Row",76,"#6B2226"), mk("i85","Bottoms","Pinstripe wide trouser","Corleone & Co",98,"#2A2622"), mk("i86","Shoes","Pointed stiletto","Vendetta Row",118,"#20181A") ] },

  { id: "o21", aesthetic: "indie-sleaze", title: "Last Train Out", curator: "@disposablecam", saves: 2140, promoted: false,
    blurb: "Smudged liner, borrowed leather jacket, flash-photo lighting energy.",
    items: [ mk("i87","Outerwear","Distressed leather jacket","Static Youth",128,"#1E1A22"), mk("i88","Top","Cropped band tee","Static Youth",22,"#242024"), mk("i89","Bottoms","Skinny raw denim","Neon Static",64,"#2C2A30"), mk("i90","Accessories","Studded belt","Static Youth",26,"#3A343C") ] },
  { id: "o22", aesthetic: "indie-sleaze", title: "House Party", curator: "@filmgrain", saves: 980, promoted: false,
    blurb: "Sequins under a hoodie, because the night has two acts.",
    items: [ mk("i91","Top","Sequin slip top","Neon Static",38,"#E8E252"), mk("i92","Outerwear","Oversized grey hoodie","Static Youth",54,"#8A8A8E"), mk("i93","Bottoms","Low-rise skinny jean","Neon Static",58,"#26262C") ] },

  { id: "o23", aesthetic: "balletcore", title: "Barre Adjacent", curator: "@pointeshoes", saves: 1870, promoted: false,
    blurb: "Wrap top, soft pink, quiet posture. Looks trained even standing still.",
    items: [ mk("i94","Top","Wrap ballet top","Maison Pliée",48,"#F6D6E0"), mk("i95","Bottoms","Ribbed knit skirt","Pas de Deux",56,"#EADDE3"), mk("i96","Shoes","Ribbon-tie flat","Maison Pliée",64,"#E3C9D2"), mk("i97","Accessories","Silk hair ribbon","Pas de Deux",12,"#C9B8D8") ] },

  { id: "o24", aesthetic: "old-money", title: "Upper East Side", curator: "@you", saves: 0, promoted: false, real: true,
    blurb: "Resort tailoring that never tries too hard — texture and fit doing the work logos usually do.",
    items: [
      mkReal("i98", "Top", "Men Knitted Fit Textured Spread Collar Casual Shirt", "RAHI TRENDZ", 413, "#D8C7A8", "Resort vibe", "https://myntr.it/572d4HD"),
      mkReal("i99", "Bottoms", "Men Cotton Comfort Beach Lounge Pants", "The Veshti Company", 963, "#C9B89A", "Stealth wealth", "https://myntr.it/x5XAkOc"),
      mkReal("i100", "Shoes", "Men JOAN Beige All Day Sneakers", "U.S. Polo Assn.", 2621, "#E3D5BE", "Retro tennis", "https://myntr.it/vU1232y"),
    ] },
];

export const SEED_FRIENDS = [
  { id: "f1", handle: "@margaux", name: "Margaux Iyer", vibes: ["old-money", "clean-girl"] },
  { id: "f2", handle: "@vellum", name: "Vellum Rao", vibes: ["goth", "cyberpunk"] },
  { id: "f3", handle: "@bitmap", name: "Priya Bitmap", vibes: ["y2k", "indie-sleaze"] },
  { id: "f4", handle: "@kaito", name: "Kaito Sharma", vibes: ["streetwear"] },
  { id: "f5", handle: "@fernweh", name: "Ananya Fernweh", vibes: ["cottagecore", "balletcore"] },
  { id: "f6", handle: "@corvid", name: "Corvid Mehta", vibes: ["dark-academia"] },
  { id: "f7", handle: "@rosewater", name: "Rosewater Kapoor", vibes: ["coquette"] },
  { id: "f8", handle: "@goldchain", name: "Goldchain Verma", vibes: ["mob-wife"] },
  { id: "f9", handle: "@sonora", name: "Sonora Desai", vibes: ["clean-girl", "y2k"] },
  { id: "f10", handle: "@ashgrove", name: "Ashgrove Nair", vibes: ["dark-academia", "old-money"] },
];

export const SEED_LISTINGS = [
  { id: "l1", title: "Archive leather trench, size M", seller: "@vellum", aesthetic: "goth", condition: "Very good", price: 240, promoted: true, tier: "blaze", tone: "#221A2C", url: "#", createdAt: "2026-08-22" },
  { id: "l2", title: "Cashmere crew, unworn with tags", seller: "@margaux", aesthetic: "old-money", condition: "New", price: 165, promoted: false, tone: "#B79C74", url: "#", createdAt: "2026-08-24" },
  { id: "l3", title: "Y2K bundle — 4 pieces, size S", seller: "@bitmap", aesthetic: "y2k", condition: "Good", price: 98, promoted: true, tier: "icon", tone: "#7FA6D8", url: "#", createdAt: "2026-08-27" },
  { id: "l4", title: "Wool blazer, mended elbow", seller: "@corvid", aesthetic: "dark-academia", condition: "Fair", price: 72, promoted: false, tone: "#5A4B3C", url: "#", createdAt: "2026-08-28" },
  { id: "l5", title: "Anorak, one season worn", seller: "@kaito", aesthetic: "streetwear", condition: "Very good", price: 130, promoted: false, tone: "#F5A03D", url: "#", createdAt: "2026-08-30" },
  { id: "l6", title: "Linen tiered skirt, hand-dyed", seller: "@fernweh", aesthetic: "cottagecore", condition: "Good", price: 46, promoted: false, tone: "#D9B7A4", url: "#", createdAt: "2026-09-01" },
];

export const TIERS = [
  { id: "spark", name: "Spark", price: 9, days: 3, icon: "zap",
    lines: ["Sits above standard listings in its own style feed", "A small Featured mark on the card", "Views and saves broken out daily"] },
  { id: "blaze", name: "Blaze", price: 29, days: 14, popular: true, icon: "flame",
    lines: ["Enters the For You feed of everyone matching your style", "The 🔥 Featured badge", "One free re-list if it doesn't sell", "Weekly price guidance from comparable sales"] },
  { id: "icon", name: "Icon", price: 79, days: 30, icon: "crown",
    lines: ["Top slot on the Style Vault home grid", "Featured badge plus a verified seller check", "Included in the Friday newsletter drop", "Direct-message priority from buyers"] },
];

export const CONDITIONS = ["New with tags", "Like new", "Very good", "Good", "Well loved"];
export const money = (n) => `$${n.toLocaleString()}`;
export const byId = (id) => AESTHETICS.find((a) => a.id === id) || AESTHETICS[0];
