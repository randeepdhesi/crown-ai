export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface ProductVariant {
  sku: string;
  label: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  skuBase: string;
  description: string;
  priceFrom: number;
  image?: string;
  icon?: string;
  colors?: { name: string; hex: string }[];
  stock: StockStatus;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export const CATALOG: Category[] = [
  {
    id: "newtechwood",
    name: "NewTechWood Composite Siding",
    products: [
      {
        id: "uh61",
        name: "Norwegian Fluted Siding",
        skuBase: "UH61",
        description: '0.9" × 7.73"',
        priceFrom: 146.14,
        image: "/ntw-norwegian.jpg",
        stock: "in_stock",
        colors: [
          { name: "Ipe", hex: "#3B2314" },
          { name: "Teak", hex: "#8B6A3E" },
          { name: "Red Cedar", hex: "#A0522D" },
          { name: "Cedar", hex: "#C19A6B" },
          { name: "Antique", hex: "#8E7960" },
          { name: "White Dew", hex: "#D9D0C1" },
          { name: "Silver Grey", hex: "#A9A9A9" },
          { name: "Charcoal", hex: "#4A4A4A" },
          { name: "Ebony", hex: "#1C1C1C" },
        ],
        variants: [
          { sku: "UH61-12", label: "12'", price: 146.14 },
          { sku: "UH61-16", label: "16'", price: 194.86 },
        ],
      },
      {
        id: "uh58",
        name: "Belgian Fluted Siding",
        skuBase: "UH58",
        description: '0.9" × 7.73"',
        priceFrom: 146.14,
        image: "/ntw-belgian.jpg",
        stock: "in_stock",
        colors: [
          { name: "Ipe", hex: "#3B2314" },
          { name: "Teak", hex: "#8B6A3E" },
          { name: "Red Cedar", hex: "#A0522D" },
          { name: "Antique", hex: "#8E7960" },
          { name: "Silver Grey", hex: "#A9A9A9" },
          { name: "Charcoal", hex: "#4A4A4A" },
          { name: "Ebony", hex: "#1C1C1C" },
        ],
        variants: [
          { sku: "UH58-12", label: "12'", price: 146.14 },
          { sku: "UH58-16", label: "16'", price: 194.86 },
        ],
      },
      {
        id: "uh67",
        name: "Shiplap Siding",
        skuBase: "UH67",
        description: '0.5" × 5.5"',
        priceFrom: 45.79,
        image: "/ntw-shiplap.jpg",
        stock: "in_stock",
        colors: [
          { name: "Ipe", hex: "#3B2314" },
          { name: "Teak", hex: "#8B6A3E" },
          { name: "Red Cedar", hex: "#A0522D" },
          { name: "Antique", hex: "#8E7960" },
          { name: "White Dew", hex: "#D9D0C1" },
          { name: "Silver Grey", hex: "#A9A9A9" },
          { name: "Charcoal", hex: "#4A4A4A" },
          { name: "Ebony", hex: "#1C1C1C" },
        ],
        variants: [
          { sku: "UH67-12", label: "12'", price: 45.79 },
          { sku: "UH67-16", label: "16'", price: 61.05 },
        ],
      },
      {
        id: "us31",
        name: "Gap Siding",
        skuBase: "US31",
        description: '0.5" × 5.6"',
        priceFrom: 81.97,
        image: "/ntw-gap.jpg",
        stock: "in_stock",
        colors: [
          { name: "Ipe", hex: "#3B2314" },
          { name: "Teak", hex: "#8B6A3E" },
          { name: "Red Cedar", hex: "#A0522D" },
          { name: "Antique", hex: "#8E7960" },
          { name: "White Dew", hex: "#D9D0C1" },
          { name: "Silver Grey", hex: "#A9A9A9" },
          { name: "Charcoal", hex: "#4A4A4A" },
          { name: "Ebony", hex: "#1C1C1C" },
        ],
        variants: [
          { sku: "US31-12", label: "12'", price: 81.97 },
          { sku: "US31-16", label: "16'", price: 109.30 },
        ],
      },
      {
        id: "us09",
        name: "Shou Sugi Ban",
        skuBase: "US09",
        description: '0.5" × 5.5" · Ebony only',
        priceFrom: 79.35,
        image: "/ntw-ssb.jpg",
        stock: "low_stock",
        colors: [
          { name: "Ebony", hex: "#1C1C1C" },
        ],
        variants: [
          { sku: "US09-12-EB-SSB", label: "12'", price: 79.35 },
          { sku: "US09-16-EB-SSB", label: "16'", price: 105.80 },
        ],
      },
    ],
  },
  {
    id: "drywall",
    name: "Drywall",
    products: [
      {
        id: "dw-standard",
        name: "Standard 1/2\" Lightweight",
        skuBase: "CGC",
        description: "4' × 8' to 4' × 14'",
        priceFrom: 20.07,
        stock: "in_stock",
        variants: [
          { sku: "CGC-48", label: "4'×8'", price: 20.07 },
          { sku: "CGC-410", label: "4'×10'", price: 24.00 },
          { sku: "CGC-412", label: "4'×12'", price: 28.50 },
          { sku: "CGC-414", label: "4'×14'", price: 33.00 },
        ],
      },
      {
        id: "dw-typex",
        name: "Fire Rated Type X 5/8\"",
        skuBase: "CGC-TX",
        description: "4' × 8' to 4' × 12'",
        priceFrom: 24.05,
        stock: "in_stock",
        variants: [
          { sku: "CGC-TX-48", label: "4'×8'", price: 24.05 },
          { sku: "CGC-TX-412", label: "4'×12'", price: 35.00 },
        ],
      },
      {
        id: "dw-moldtough",
        name: "Mold Tough 1/2\"",
        skuBase: "CGC-MT",
        description: "4' × 8' and 4' × 10'",
        priceFrom: 36.98,
        stock: "in_stock",
        variants: [
          { sku: "CGC-MT-48", label: "4'×8'", price: 36.98 },
          { sku: "CGC-MT-410", label: "4'×10'", price: 44.00 },
        ],
      },
      {
        id: "dw-exterior",
        name: "Exterior Sheathing 1/2\"",
        skuBase: "CGC-EXT",
        description: "4' × 8'",
        priceFrom: 53.51,
        stock: "low_stock",
        variants: [
          { sku: "CGC-EXT-48", label: "4'×8'", price: 53.51 },
          { sku: "CGC-EXT58-48", label: "5/8\" 4'×8'", price: 61.02 },
        ],
      },
    ],
  },
  {
    id: "insulation",
    name: "Insulation",
    products: [
      {
        id: "rw-sns3",
        name: "ROCKWOOL Safe'N'Sound 3\"",
        skuBase: "RW-SNS3",
        description: "Acoustic · fire resistant",
        priceFrom: 99.99,
        stock: "in_stock",
        variants: [
          { sku: "RW-SNS3", label: "3\"", price: 99.99 },
        ],
      },
      {
        id: "rw-r22",
        name: "ROCKWOOL R22 Comfortbatt",
        skuBase: "RW-R22",
        description: "Thermal batts",
        priceFrom: 89.54,
        stock: "in_stock",
        variants: [
          { sku: "RW-R22", label: "R22", price: 89.54 },
        ],
      },
      {
        id: "jm-r22",
        name: "Johns Manville R22",
        skuBase: "JM-R22",
        description: "Fiberglass batts",
        priceFrom: 79.38,
        stock: "in_stock",
        variants: [
          { sku: "JM-R22", label: "R22", price: 79.38 },
        ],
      },
      {
        id: "jm-r28",
        name: "Johns Manville R28",
        skuBase: "JM-R28",
        description: "Fiberglass batts",
        priceFrom: 61.96,
        stock: "low_stock",
        variants: [
          { sku: "JM-R28", label: "R28", price: 61.96 },
        ],
      },
    ],
  },
];
