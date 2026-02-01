import { X } from "lucide-react";

const ProductModal = ({
  show,
  product,
  selectedVariantIdx,
  setSelectedVariantIdx,
  selectedSize,
  setSelectedSize,
  onClose,
  onAddToCart,
  formatPrice,
}: any) => {
  if (!show || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-[860px] max-h-[100vh] overflow-hidden flex relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-100 shadow-md text-gray-600 hover:text-gray-800"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center justify-start p-8 w-1/2 bg-gray-50">
          <div className="w-full h-80 flex items-center justify-center mb-6 rounded-lg bg-white overflow-hidden shadow-sm">
            <img
              src={product.variants[selectedVariantIdx]?.images?.[0] || product.image || "/default.png"}
              alt={product.name}
              className="w-full h-full object-contain p-4"
            />
          </div>
          <div className="flex gap-2">
            {product.variants[selectedVariantIdx]?.images?.slice(0, 4).map((img: string, idx: number) => (
              <div key={idx} className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${idx === 0 ? "border-black" : "border-gray-200"}`}>
                <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-contain p-1 bg-white" />
              </div>
            ))}
            {product.variants[selectedVariantIdx]?.images?.length > 4 && (
              <div className="w-16 h-16 flex items-center justify-center border-2 border-gray-200 rounded-lg text-xs text-gray-500 bg-white">
                +{product.variants[selectedVariantIdx].images.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <span className="font-medium text-gray-800">{product.brand || "Reebok"}</span>
            <span className="text-xs text-gray-400 ml-auto">#{product.id.toUpperCase()}-R</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(4)].map((_, i) => <span key={i}>★</span>)}
              <span className="text-gray-300">★</span>
            </div>
            <span className="text-sm text-gray-500">{product.reviews || 40} reviewers</span>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-6">{formatPrice(product.price)}</div>

          <div className="mb-4">
            <div className="font-semibold text-gray-700 mb-1">Color</div>
            <div className="flex gap-2">
              {product.variants.map((variant: any, idx: number) => (
                <button
                  key={variant.color}
                  onClick={() => { setSelectedVariantIdx(idx); setSelectedSize(null); }}
                  className={`px-3 py-1 rounded border font-medium text-sm ${selectedVariantIdx === idx ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"}`}
                >
                  {variant.color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-800">Size</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.variants[selectedVariantIdx]?.sizes.map((sizeObj: any) => (
                <button
                  key={sizeObj.size}
                  onClick={() => setSelectedSize(sizeObj)}
                  disabled={sizeObj.stock <= 0}
                  className={`h-10 rounded-md border font-medium text-sm transition-all ${
                    selectedSize?.size === sizeObj.size
                      ? "border-black bg-black text-white"
                      : sizeObj.stock <= 0
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 bg-white hover:border-gray-400"
                  }`}
                >
                  {sizeObj.size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onAddToCart}
            disabled={!selectedSize}
            className={`w-full py-3 rounded-md font-medium text-white transition-colors mb-4 ${
              selectedSize ? "bg-black hover:bg-gray-800" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {selectedSize ? "Add to cart" : "Select size"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
