export default function CatalogPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-white font-semibold text-lg mb-2">Catalog</h1>
      <p className="text-neutral-400 text-sm max-w-xs leading-relaxed mb-6">
        Connect your inventory data to start querying specs, pricing, and availability.
      </p>
      <button className="bg-[#b3874b] hover:bg-[#96703d] text-black text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
        Upload Catalog
      </button>
    </div>
  );
}
