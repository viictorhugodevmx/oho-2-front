import type { Product, ProductOption } from "@/types";

const apparelSizes: ProductOption = {
  id: "size",
  name: "Talla",
  values: [
    { id: "size-s", label: "S", value: "s", priceModifier: 0 },
    { id: "size-m", label: "M", value: "m", priceModifier: 0 },
    { id: "size-l", label: "L", value: "l", priceModifier: 0 },
    { id: "size-xl", label: "XL", value: "xl", priceModifier: 40 },
  ],
};

const textileColors: ProductOption = {
  id: "color",
  name: "Color",
  values: [
    {
      id: "color-black",
      label: "Negro",
      value: "black",
      priceModifier: 0,
      colorHex: "#111111",
    },
    {
      id: "color-bone",
      label: "Hueso",
      value: "bone",
      priceModifier: 0,
      colorHex: "#e7e0d2",
    },
    {
      id: "color-red",
      label: "Rojo",
      value: "red",
      priceModifier: 20,
      colorHex: "#9d1712",
    },
  ],
};

const printFinish: ProductOption = {
  id: "finish",
  name: "Acabado",
  values: [
    {
      id: "finish-matte",
      label: "Mate",
      value: "matte",
      priceModifier: 0,
    },
    {
      id: "finish-gloss",
      label: "Brillante",
      value: "gloss",
      priceModifier: 45,
    },
  ],
};

export const mockProducts: Product[] = [
  {
    id: "product-001",
    slug: "playera-directors-cut",
    name: "Playera Director's Cut",
    shortDescription: "Algodón pesado con impresión frontal.",
    description:
      "Playera de corte relajado en algodón de alto gramaje, creada para fotografías de alto contraste.",
    category: "apparel",
    basePrice: 449,
    imageUrl:
      "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: true,
    active: true,
    badge: "BEST FRAME",
    options: [apparelSizes, textileColors],
    printArea: { top: 23, left: 32, width: 36, height: 42 },
  },
  {
    id: "product-002",
    slug: "hoodie-after-hours",
    name: "Hoodie After Hours",
    shortDescription: "Hoodie pesado para las sesiones nocturnas.",
    description:
      "Sudadera amplia con capucha, interior suave y área central para impresión fotográfica.",
    category: "apparel",
    basePrice: 849,
    imageUrl:
      "https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: true,
    active: true,
    badge: "LIMITED",
    options: [apparelSizes, textileColors],
    printArea: { top: 27, left: 32, width: 36, height: 35 },
  },
  {
    id: "product-003",
    slug: "tote-street-tape",
    name: "Tote Street Tape",
    shortDescription: "Bolsa de lona para cargar el archivo.",
    description:
      "Tote bag resistente de lona gruesa con impresión de gran formato.",
    category: "accessories",
    basePrice: 299,
    imageUrl:
      "https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: false,
    active: true,
    options: [textileColors],
    printArea: { top: 30, left: 25, width: 50, height: 45 },
  },
  {
    id: "product-004",
    slug: "gorra-frame-002",
    name: "Gorra Frame 002",
    shortDescription: "Silueta clásica con gráfico frontal.",
    description:
      "Gorra ajustable de seis paneles con aplicación visual frontal compacta.",
    category: "accessories",
    basePrice: 379,
    imageUrl:
      "https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: false,
    active: true,
    badge: "DROP 002",
    options: [textileColors],
    printArea: { top: 30, left: 34, width: 32, height: 22 },
  },
  {
    id: "product-005",
    slug: "poster-archive",
    name: "Póster Archive",
    shortDescription: "Impresión editorial para muro.",
    description:
      "Póster fotográfico de alta definición disponible en dos formatos.",
    category: "wall-art",
    basePrice: 249,
    imageUrl:
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: true,
    active: true,
    options: [
      {
        id: "size",
        name: "Formato",
        values: [
          {
            id: "poster-a3",
            label: "A3",
            value: "a3",
            priceModifier: 0,
          },
          {
            id: "poster-a2",
            label: "A2",
            value: "a2",
            priceModifier: 180,
          },
        ],
      },
      printFinish,
    ],
    printArea: { top: 10, left: 18, width: 64, height: 80 },
  },
  {
    id: "product-006",
    slug: "cuadro-gallery-frame",
    name: "Cuadro Gallery Frame",
    shortDescription: "Fotografía enmarcada lista para exhibirse.",
    description:
      "Cuadro con marco negro y montaje editorial para una pieza principal.",
    category: "wall-art",
    basePrice: 749,
    imageUrl:
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: false,
    active: true,
    options: [
      {
        id: "size",
        name: "Tamaño",
        values: [
          {
            id: "frame-medium",
            label: "40 × 50 cm",
            value: "medium",
            priceModifier: 0,
          },
          {
            id: "frame-large",
            label: "60 × 80 cm",
            value: "large",
            priceModifier: 350,
          },
        ],
      },
      printFinish,
    ],
    printArea: { top: 14, left: 23, width: 54, height: 70 },
  },
  {
    id: "product-007",
    slug: "case-night-block",
    name: "Case Night Block",
    shortDescription: "Protección rígida con impresión completa.",
    description:
      "Case para celular con acabado resistente y fotografía de borde a borde.",
    category: "accessories",
    basePrice: 329,
    imageUrl:
      "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: false,
    active: true,
    options: [
      {
        id: "model",
        name: "Modelo",
        values: [
          {
            id: "model-iphone",
            label: "iPhone 15",
            value: "iphone-15",
            priceModifier: 0,
          },
          {
            id: "model-galaxy",
            label: "Galaxy S24",
            value: "galaxy-s24",
            priceModifier: 30,
          },
        ],
      },
      printFinish,
    ],
    printArea: { top: 8, left: 20, width: 60, height: 84 },
  },
  {
    id: "product-008",
    slug: "taza-studio-session",
    name: "Taza Studio Session",
    shortDescription: "Cerámica para sesiones largas.",
    description:
      "Taza de cerámica con impresión panorámica y acabado resistente.",
    category: "objects",
    basePrice: 279,
    imageUrl:
      "https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: false,
    active: true,
    options: [
      {
        id: "color",
        name: "Interior",
        values: [
          {
            id: "mug-black",
            label: "Negro",
            value: "black",
            priceModifier: 0,
            colorHex: "#111111",
          },
          {
            id: "mug-red",
            label: "Rojo",
            value: "red",
            priceModifier: 25,
            colorHex: "#9d1712",
          },
        ],
      },
      printFinish,
    ],
    printArea: { top: 27, left: 22, width: 56, height: 42 },
  },
  {
    id: "product-009",
    slug: "sticker-pack-contact-sheet",
    name: "Sticker Pack Contact Sheet",
    shortDescription: "Seis recortes del archivo visual.",
    description:
      "Paquete de seis stickers resistentes al agua con recortes de la fotografía elegida.",
    category: "objects",
    basePrice: 159,
    imageUrl:
      "https://images.pexels.com/photos/7319070/pexels-photo-7319070.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: false,
    active: true,
    badge: "6 PIECES",
    options: [printFinish],
    printArea: { top: 18, left: 18, width: 64, height: 64 },
  },
  {
    id: "product-010",
    slug: "libreta-production-notes",
    name: "Libreta Production Notes",
    shortDescription: "Notas, encuadres y próximas tomas.",
    description:
      "Libreta de pasta rígida con portada personalizada y papel color hueso.",
    category: "objects",
    basePrice: 319,
    imageUrl:
      "https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=1200",
    gallery: [],
    featured: true,
    active: true,
    options: [
      {
        id: "paper",
        name: "Interior",
        values: [
          {
            id: "paper-lined",
            label: "Rayado",
            value: "lined",
            priceModifier: 0,
          },
          {
            id: "paper-dotted",
            label: "Punteado",
            value: "dotted",
            priceModifier: 20,
          },
        ],
      },
      printFinish,
    ],
    printArea: { top: 10, left: 18, width: 64, height: 80 },
  },
];
