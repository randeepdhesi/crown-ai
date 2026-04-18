"use client";

import { useRef, useState } from "react";
import { ChevronLeft, Layers, Thermometer } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CATALOG, type Product, type StockStatus } from "@/lib/catalog-data";

type UploadState = "idle" | "uploading" | "done";

function stockDot(status: StockStatus) {
  if (status === "in_stock")
    return <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />;
  if (status === "low_stock")
    return <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />;
  return <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />;
}

function stockLabel(status: StockStatus) {
  if (status === "in_stock") return "In Stock";
  if (status === "low_stock") return "Low Stock";
  return "Out of Stock";
}

function stockColor(status: StockStatus) {
  if (status === "in_stock") return "text-emerald-400";
  if (status === "low_stock") return "text-amber-400";
  return "text-red-400";
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  drywall: <Layers size={18} className="text-blue-400" />,
  insulation: <Thermometer size={18} className="text-orange-400" />,
};

const CATEGORY_ICON_BG: Record<string, string> = {
  drywall: "bg-blue-500/10",
  insulation: "bg-orange-500/10",
};

function ProductCard({ product, categoryId }: { product: Product; categoryId: string }) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));
  const maxPrice = Math.max(...product.variants.map((v) => v.price));
  const priceStr =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;

  return (
    <div className="flex items-stretch bg-neutral-800 rounded-xl overflow-hidden">
      {/* Image or icon */}
      {product.image ? (
        <div className="relative w-24 flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      ) : (
        <div className={`w-24 flex-shrink-0 flex items-center justify-center ${CATEGORY_ICON_BG[categoryId] ?? "bg-neutral-700"}`}>
          {CATEGORY_ICONS[categoryId]}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 px-3 py-3 flex flex-col justify-between gap-1.5">
        {/* Name + stock */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-white text-sm font-semibold leading-snug">{product.name}</p>
          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
            {stockDot(product.stock)}
            <span className={`text-xs font-medium ${stockColor(product.stock)}`}>
              {stockLabel(product.stock)}
            </span>
          </div>
        </div>

        {/* SKU + description */}
        <p className="text-neutral-500 text-xs">
          {product.skuBase} · {product.description}
        </p>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3.5 h-3.5 rounded-full border border-neutral-600 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <span className="text-neutral-500 text-xs ml-1">
              {product.colors.length} colour{product.colors.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Variants + price */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {product.variants.map((v) => (
              <span
                key={v.sku}
                className="text-xs text-neutral-400 bg-neutral-700 px-2 py-0.5 rounded-full"
              >
                {v.label}
              </span>
            ))}
          </div>
          <span className="text-crown-gold text-xs font-semibold">{priceStr}</span>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const router = useRouter();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploadState("uploading");
    setTimeout(() => setUploadState("done"), 1800);
  }

  return (
    <div className="min-h-dvh bg-neutral-900">
      <div className="max-w-2xl mx-auto w-full px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft size={18} className="text-neutral-300" />
            </button>
            <h1 className="text-white font-semibold text-lg">Catalog</h1>
          </div>

          {/* Manage / upload */}
          <div>
            {uploadState === "idle" && (
              <button
                onClick={() => inputRef.current?.click()}
                className="text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
              >
                + Add products
              </button>
            )}
            {uploadState === "uploading" && (
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-crown-gold animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            )}
            {uploadState === "done" && (
              <span className="text-xs text-emerald-400">{fileName} uploaded</span>
            )}
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.json,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-8">
          {CATALOG.map((category) => (
            <div key={category.id}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-crown-gold text-xs uppercase tracking-widest font-semibold">
                  {category.name}
                </p>
                <span className="text-neutral-500 text-xs">
                  {category.products.length} products
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {category.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categoryId={category.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
