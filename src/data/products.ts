export interface Product {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice?: number;
  priceRange?: string;
  image: string;
  images?: string[];
  swatches?: { color: string; name: string }[];
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  sale?: boolean;
  description?: string;
  features?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export const products: Product[] = [
  // Featured Products
  {
    id: "arden-carbon-gray-bedframe",
    title: "Arden Carbon Gray Fabric Bedframe",
    category: "BEDROOM",
    price: 4999,
    priceRange: "R3,499 – R5,999",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    swatches: [
      { color: "#d3cfca", name: "Beige" },
      { color: "#666666", name: "Gray" }
    ],
    sizes: ["Double", "Queen", "King"],
    rating: 5,
    reviewCount: 12,
    isFeatured: true,
    description: "The Arden Carbon Gray Fabric Bedframe combines modern elegance with exceptional comfort. Upholstered in premium fabric with a sturdy wooden frame."
  },
  {
    id: "georges-modular-sofa",
    title: "Georges Modular Sofa – 4-Seater Plush Sectional",
    category: "SOFA",
    subcategory: "4-Seater & Up",
    price: 12999,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    rating: 5,
    reviewCount: 8,
    isFeatured: true,
    description: "The Georges Modular 4-Seater Sofa features sculptural tufting, plush high-density foam, and a versatile modular design. Upholstered in soft, performance-grade fabric."
  },
  {
    id: "hannah-marble-dining-table",
    title: "Hannah 1.2M Round Marble Dining Table",
    category: "DINING",
    price: 4199,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80",
    swatches: [
      { color: "#563e30", name: "Walnut" },
      { color: "#e0b17f", name: "Oak" }
    ],
    isFeatured: true,
    description: "The Hannah Round Marble Dining Table brings elegance to any dining space with its genuine marble top and solid wood base."
  },
  {
    id: "lucenzo-leather-dining-set",
    title: "Lucenzo Modern Leather Dining Table Set",
    category: "DINING",
    price: 9999,
    image: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=600&q=80",
    swatches: [
      { color: "#c9a227", name: "Gold Plated" },
      { color: "#c0c0c0", name: "Silver Plated" }
    ],
    isFeatured: true,
    description: "The Lucenzo Modern Leather Dining Table Set combines contemporary design with luxurious comfort. Features genuine leather chairs and a sleek glass table."
  },
  {
    id: "moderno-l-shape-recliner",
    title: "Moderno L-Shape 3-Seater Electric Recliner Sofa",
    category: "SOFA",
    subcategory: "4-Seater & Up",
    price: 10499,
    originalPrice: 14999,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    swatches: [
      { color: "#6e6e6e", name: "Dark Gray" },
      { color: "#a59a86", name: "Beige" },
      { color: "#666764", name: "Charcoal" }
    ],
    rating: 4.9,
    reviewCount: 15,
    sale: true,
    isFeatured: true,
    description: "Experience ultimate relaxation with the Moderno L-Shape Electric Recliner. Features power recline, USB charging ports, and premium upholstery."
  },
  {
    id: "orae-sherpa-bench",
    title: "Orae Cirrus 1.74M Upholstered Sherpa Bench – Ivory",
    category: "SOFA",
    subcategory: "2-Seater",
    price: 5599,
    originalPrice: 7499,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",
    rating: 5,
    reviewCount: 6,
    sale: true,
    isFeatured: true,
    description: "The Orae Sherpa Bench adds a touch of luxury with its plush sherpa upholstery and modern silhouette. Perfect for entryways or bedroom seating."
  },
  {
    id: "ronny-arm-dining-chair",
    title: "Ronny Arm Dining Chair – Walnut",
    category: "DINING",
    price: 1349,
    originalPrice: 1999,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80",
    swatches: [
      { color: "#d3c5b7", name: "Cream" },
      { color: "#3c3c3c", name: "Charcoal" },
      { color: "#707966", name: "Sage" },
      { color: "#dfc270", name: "Mustard" }
    ],
    rating: 4.8,
    reviewCount: 24,
    sale: true,
    isFeatured: true,
    description: "The Ronny Arm Dining Chair combines mid-century modern design with exceptional comfort. Features solid walnut legs and premium fabric upholstery."
  },
  {
    id: "shayne-velvet-swivel-chair",
    title: "Shayne Velvet Linen Swivel Chair – Cream",
    category: "DINING",
    price: 1199,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    rating: 5,
    reviewCount: 18,
    isFeatured: true,
    description: "The Shayne Swivel Chair features a luxurious velvet linen blend upholstery and 360-degree swivel base. Perfect for home offices or dining spaces."
  },
  {
    id: "valente-recliner-corner",
    title: "Valente Recliner Corner Sofa",
    category: "SOFA",
    subcategory: "4-Seater & Up",
    price: 14999,
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80",
    swatches: [
      { color: "#efe8de", name: "Ivory" },
      { color: "#959595", name: "Gray" }
    ],
    rating: 5,
    reviewCount: 9,
    isFeatured: true,
    description: "The Valente Recliner Corner Sofa offers spacious seating with built-in recliners. Premium leather upholstery with power recline functionality."
  },
  
  // On Sale Products
  {
    id: "montero-velvet-l-shape",
    title: "Montero Velvet L-Shape Sofa",
    category: "SOFA",
    subcategory: "L-Shape",
    price: 6499,
    originalPrice: 8499,
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&q=80",
    swatches: [
      { color: "#0d2439", name: "Navy" },
      { color: "#000000", name: "Black" },
      { color: "#d6a841", name: "Mustard" },
      { color: "#5e071d", name: "Burgundy" }
    ],
    rating: 5,
    reviewCount: 11,
    sale: true,
    description: "The Montero Velvet L-Shape Sofa brings luxury to your living room with its plush velvet upholstery and generous seating space."
  },
  {
    id: "tatum-accent-chair",
    title: "Tatum Walnut Veneer Accent Chair with PVC Upholstery",
    category: "SOFA",
    subcategory: "1-Seater",
    price: 3999,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
    swatches: [
      { color: "#000000", name: "Black" },
      { color: "#5f4a44", name: "Brown" },
      { color: "#ffffff", name: "White" }
    ],
    rating: 5,
    reviewCount: 7,
    sale: true,
    description: "The Tatum Accent Chair features elegant walnut veneer framing and durable PVC upholstery. A perfect statement piece for any room."
  },
  {
    id: "ronny-4-seater-dining-set",
    title: "Ronny 4-Seater Dining Set – Natural (1 Table + 4 Chairs)",
    category: "DINING",
    price: 10499,
    originalPrice: 11999,
    image: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=600&q=80",
    rating: 5,
    reviewCount: 14,
    sale: true,
    description: "The Ronny 4-Seater Dining Set includes a beautiful natural wood table and four matching chairs. Perfect for family meals and entertaining."
  },
  {
    id: "edra-modular-sofa",
    title: "Edra Modular Sofa",
    category: "SOFA",
    subcategory: "4-Seater & Up",
    price: 19999,
    originalPrice: 29999,
    image: "https://images.unsplash.com/photo-1512212621149-107ffe572d2f?w=600&q=80",
    swatches: [
      { color: "#bcbcb2", name: "Light Gray" },
      { color: "#848484", name: "Gray" },
      { color: "#dd3333", name: "Red" },
      { color: "#215c86", name: "Teal" }
    ],
    rating: 5,
    reviewCount: 5,
    sale: true,
    isNew: true,
    description: "The Edra Modular Sofa offers endless configuration possibilities with its innovative modular design. Premium fabric upholstery and high-density foam cushioning."
  },
  
  // New Arrivals
  {
    id: "auralie-textured-lounge",
    title: "Auralie Textured Lounge Sofa",
    category: "SOFA",
    subcategory: "3-Seater",
    price: 14999,
    originalPrice: 20999,
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=80",
    swatches: [
      { color: "#a29b92", name: "Taupe" },
      { color: "#788084", name: "Slate" },
      { color: "#bf9d90", name: "Blush" }
    ],
    sale: true,
    isNew: true,
    description: "The Auralie Textured Lounge Sofa features a unique textured fabric and deep, comfortable seating. A stunning centerpiece for modern living spaces."
  },
  {
    id: "amara-rattan-dining-set",
    title: "Amara 5-Piece Compact Rattan Dining Set",
    category: "DECOR",
    subcategory: "Outdoor/Patio",
    price: 5999,
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&q=80",
    swatches: [
      { color: "#c6c0b2", name: "Natural" },
      { color: "#3b383b", name: "Dark" }
    ],
    rating: 5,
    reviewCount: 8,
    isNew: true,
    description: "The Amara Rattan Dining Set is perfect for outdoor entertaining. Weather-resistant rattan with comfortable cushions."
  },
  {
    id: "basir-dining-set",
    title: "Basir 4-Seater Dining Set with Ormond Chairs (Sintered Stone)",
    category: "DINING",
    price: 10699,
    priceRange: "R10,699 – R11,499",
    image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&q=80",
    sizes: ["1.4m", "1.6m"],
    isNew: true,
    description: "The Basir Dining Set features a stunning sintered stone tabletop and elegant Ormond chairs. Durable and beautiful for everyday use."
  },
  
  // Additional products for Shop page
  {
    id: "abessa-velvet-chair",
    title: "Abessa Velvet Dining Chair – White",
    category: "DINING",
    price: 999,
    originalPrice: 1499,
    image: "https://images.unsplash.com/photo-1519947486511-4639940be4b3?w=600&q=80",
    rating: 5,
    reviewCount: 22,
    sale: true,
    description: "The Abessa Velvet Dining Chair adds elegance to any dining space with its plush velvet upholstery and modern design."
  },
  {
    id: "adain-2-seater-gray",
    title: "Adain 2-Seater Sofa – Grey",
    category: "SOFA",
    subcategory: "2-Seater",
    price: 4999,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
    description: "The Adain 2-Seater Sofa offers compact comfort with its modern design and premium fabric upholstery."
  },
  {
    id: "adain-3-seater-gray",
    title: "Adain 3-Seater Leathaire Sofa – Grey",
    category: "SOFA",
    subcategory: "3-Seater",
    price: 6999,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    description: "The Adain 3-Seater Leathaire Sofa combines the look of leather with the softness of fabric. Durable and easy to maintain."
  },
  {
    id: "adain-4-seater-gray",
    title: "Adain 4-Seater Leathaire Sofa – Grey",
    category: "SOFA",
    subcategory: "4-Seater & Up",
    price: 8999,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",
    description: "The Adain 4-Seater Leathaire Sofa provides spacious seating for the whole family with premium leathaire upholstery."
  },
  {
    id: "adain-armchair-gray",
    title: "Adain Grey Leathaire Armchair with Metal Legs",
    category: "SOFA",
    subcategory: "1-Seater",
    price: 3899,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    description: "The Adain Armchair features comfortable leathaire upholstery and sleek metal legs for a modern look."
  },
  {
    id: "adaliz-upholstered-bed",
    title: "Adaliz Luxe Upholstered Bedframe with Matching Pedestals",
    category: "BEDROOM",
    price: 6499,
    priceRange: "R6,499 – R7,999",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
    sizes: ["Queen Bed Size", "King Bed Size"],
    sale: true,
    description: "The Adaliz Luxe Bedframe brings hotel-style luxury to your bedroom with its plush upholstery and matching pedestals."
  }
];

export const getFeaturedProducts = () => products.filter(p => p.isFeatured);
export const getSaleProducts = () => products.filter(p => p.sale);
export const getNewArrivals = () => products.filter(p => p.isNew);
export const getProductsByCategory = (category: string) => products.filter(p => p.category.toLowerCase() === category.toLowerCase());
export const getProductById = (id: string) => products.find(p => p.id === id);
