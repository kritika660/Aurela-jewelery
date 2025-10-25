// Static product catalog
window.AurelaData = (function() {
  const products = [
    {
      id: 'r-aurora',
      name: 'Aurora Solitaire Ring',
      price: 249,
      category: 'Rings',
      material: '14k Gold, Moissanite',
      image: 'https://cdn.caratlane.com/media/catalog/product/S/R/SR03897-YGP900_1_lar.jpg',
      description: 'A luminous solitaire that captures dawn’s first light. Hand-set stone with a slim 14k band.'
    },
    {
      id: 'n-lumiere',
      name: 'Lumière Pendant Necklace',
      price: 189,
      category: 'Necklaces',
      material: 'Sterling Silver, Crystal',
      image: 'https://www.silvish.co/cdn/shop/files/MG_5668a.jpg?v=1752589892&width=1946',
      description: 'A minimal pendant with a soft sparkle, designed for layers or a standalone statement.'
    },
    {
      id: 'b-seraph',
      name: 'Seraph Cuff Bracelet',
      price: 279,
      category: 'Bracelets',
      material: '18k Gold Vermeil',
      image: 'https://palmonas.com/cdn/shop/files/PMWSSBR078-G_720ebd5e-dde3-4bd4-83eb-f6622334e624.jpg?v=1744520435&width=1000',
      description: 'Architectural lines meet soft edges in a cuff that elevates the everyday.'
    },
    {
      id: 'e-velour',
      name: 'Velour Hoop Earrings',
      price: 129,
      category: 'Earrings',
      material: '14k Gold Vermeil',
      image: 'https://images.cltstatic.com/media/product/350/AE01307-SS0000-vibes-on-point-earrings-crafted-in-gold-plated--silver-prd-1-base.jpg',
      description: 'Lightweight hoops with a satin finish for an endlessly wearable glow.'
    },
    {
      id: 'r-empyrean',
      name: 'Empyrean Pavé Ring',
      price: 329,
      category: 'Rings',
      material: '18k Gold, CZ Pavé',
      image: 'https://legacyaura.com/cdn/shop/files/GDLBBR068_1.webp?v=1734086831&width=533',
      description: 'A celestial band with pavé stones that shimmer from every angle.'
    },
    {
      id: 'n-aria',
      name: 'Aria Lariat Necklace',
      price: 219,
      category: 'Necklaces',
      material: 'Gold Vermeil',
      image: 'https://cdn.shopify.com/s/files/1/0575/8543/4691/files/105704-79-1_e0d3e5ee-48ee-4b09-a789-f1fb07104195.jpg?v=1750779703',
      description: 'A graceful lariat silhouette that highlights the neckline with subtle motion.'
    },
    {
      id: 'b-helix',
      name: 'Helix Chain Bracelet',
      price: 159,
      category: 'Bracelets',
      material: 'Sterling Silver',
      image: 'https://argentiumcollections.com/cdn/shop/files/PUREBraceletRound03-19.jpg?v=1685015479&width=320',
      description: 'A refined chain with sculpted links and a secure lobster clasp.'
    },
    {
      id: 'e-elysian',
      name: 'Elysian Stud Earrings',
      price: 99,
      category: 'Earrings',
      material: 'Sterling Silver, Crystal',
      image: 'https://fashiony.in/cdn/shop/files/DSC00419_c96e86b0-b120-4dc9-b226-bd5df2829fb8_2048x2048.jpg?v=1717425232',
      description: 'Dainty studs with a clean sparkle for everyday elegance.'
    },
    {
      id: 'e-nova-drop',
      name: 'Nova Drop Earrings',
      price: 120,
      category: 'Earrings',
      material: 'Sterling Gold',
      image: 'https://mara.paris/cdn/shop/files/7u9uoiaxh4bea7fceq24s3kvww9i_f2942db0-d0d2-4faa-827f-6f2dc0bc0abc.jpg?v=1730322555&width=2000',
      description: 'Elegant drop earrings featuring sparkling cubic zirconia for a graceful, luminous look.'
    },
    {
    id: 'e-celestia',
    name: 'Celestia Hoop Earrings',
    price: 109,
    category: 'Earrings',
    material: '14K Gold, Sapphire',
    image: 'https://www.parfois.com/dw/image/v2/BBKR_PRD/on/demandware.static/-/Sites-parfois-master-catalog/default/dw1a7aef00/images/hi-res/252/72/233407_GD_1yf.jpg?sw=2200',
    description: 'Hoop earrings with sapphire accents for a celestial sparkle.'
    },
    {
    id: 'r-opaline',
    name: 'Opaline Halo Ring',
    price: 189,
    category: 'Rings',
    material: 'White Gold, Opal',
    image: 'https://grownleo.com/cdn/shop/files/Opaline_Cushion_Cut_Hidden_Halo_Moissanite_Engagement_Ring_White_Gold8.jpg?v=1727782938&width=1200',
    description: 'Delicate halo ring that enhances the soft glow of opal.'
    },
    {
    id: 'b-radiant-orbit',
    name: 'Radiant Orbit Cuff Bracelet',
    price: 159,
    category: 'Bracelets',
    material: 'Rose Gold, Cubic Zirconia',
    image: 'https://tjoan.com/wp-content/uploads/2024/02/TJOAN-Jewelry-Radiant-Orbit-Bangle-18K-Solid-Gold-1024x1280.jpg',
    description: 'Bold rose gold cuff adorned with sparkling cubic zirconia for a radiant statement.'
    },
    {
    id: 'b-celestia',
    name: 'Celestia Bangle',
    price: 129,
    category: 'Bracelets',
    material: '14K Gold, Crystal',
    image: 'https://mrjewels.in/cdn/shop/files/8195539D-EFD0-483D-954B-23D74FC20FC0.jpg?v=1753285114',
    description: 'Sleek gold bangle with crystal accents, perfect for everyday elegance.'
    },
    {
    id: 'n-celestia-pendant',
    name: 'Celestia Pendant Necklace',
    price: 159,
    category: 'Necklaces',
    material: 'Sterling Silver, Rose Gold ',
    image: 'https://geer.in/cdn/shop/files/GJPO-114_R1.jpg?v=1752660390',
    description: 'Elegant pendant with luminous moonstone in sterling silver for everyday charm.'
    },
    {
    id: 'n-aurora-layered',
    name: 'Aurora Layered Necklace',
    price: 149,
    category: 'Necklaces',
    material: '14K Gold, Topaz',
    image: 'https://jokerandwitch.com/cdn/shop/products/JWJ471_2-min_1080x.jpg?v=1578752747',
    description: 'Layered gold necklace with shimmering topaz stones for a graceful look.'
    },
    {
    id: 'r-celeste-solitaire',
    name: 'Celeste Solitaire Ring',
    price: 199,
    category: 'Rings',
    material: 'Platinum, Diamond',
    image: 'https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dw112d3dce/images/hi-res/SLS3I1FNIA237_1.jpg?sw=640&sh=640',
    description: 'Classic solitaire ring with a brilliant cut diamond for timeless beauty.'
    },
  ];

  function getAll() { return products.slice(); }
  function getById(id) { return products.find(p => p.id === id); }
  function searchByName(q) {
    const s = (q || '').trim().toLowerCase();
    if (!s) return getAll();
    return products.filter(p => p.name.toLowerCase().includes(s));
  }
  function filterByCategory(c) {
    if (!c || c === 'All') return getAll();
    return products.filter(p => p.category === c);
  }
  function sort(list, key) {
    const arr = list.slice();
    if (key === 'price-asc') arr.sort((a,b) => a.price - b.price);
    else if (key === 'price-desc') arr.sort((a,b) => b.price - a.price);
    else if (key === 'name-asc') arr.sort((a,b) => a.name.localeCompare(b.name));
    return arr;
  }

  return { getAll, getById, searchByName, filterByCategory, sort };
})();

