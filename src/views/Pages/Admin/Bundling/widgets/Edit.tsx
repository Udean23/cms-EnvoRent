import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Info, X, Search, Plus, Filter, ChevronLeft, ChevronRight, ArrowLeft, Users } from "lucide-react";
import { RotateCw } from "react-feather";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

const dummyProducts = [
  {
    id: "1",
    name: "Reebok Zig Kinetica 3",
    image: "/public/img/Products/shoes1.png",
    category: "Shoes",
    details_sum_stock: 100,
    variants: [
      { id: "v1", name: "White - Size 40", stock: 5, price: 3084500, unit_code: "pcs", product_code: "REEBOK-ZIG-1325-W40" },
      { id: "v2", name: "White - Size 41", stock: 8, price: 3084500, unit_code: "pcs", product_code: "REEBOK-ZIG-1325-W41" },
      { id: "v3", name: "Black - Size 40", stock: 7, price: 3084500, unit_code: "pcs", product_code: "REEBOK-ZIG-1325-B40" }
    ]
  },
  {
    id: "2",
    name: "Nike Air Max 270",
    image: "/public/img/Products/shoes2.png",
    category: "Shoes",
    details_sum_stock: 85,
    variants: [
      { id: "v4", name: "Black - Size 40", stock: 12, price: 2790000, unit_code: "pcs", product_code: "NIKE-AIRMAX-B40" },
      { id: "v5", name: "Black - Size 41", stock: 14, price: 2790000, unit_code: "pcs", product_code: "NIKE-AIRMAX-B41" },
      { id: "v6", name: "White - Size 40", stock: 8, price: 2790000, unit_code: "pcs", product_code: "NIKE-AIRMAX-W40" }
    ]
  },
  {
    id: "3",
    name: "Adidas Ultraboost 22",
    image: "/public/img/Products/shoes3.png",
    category: "Shoes",
    details_sum_stock: 67,
    variants: [
      { id: "v7", name: "Gray - Size 40", stock: 15, price: 2945000, unit_code: "pcs", product_code: "ADIDAS-ULTRA-G40" },
      { id: "v8", name: "Gray - Size 41", stock: 12, price: 2945000, unit_code: "pcs", product_code: "ADIDAS-ULTRA-G41" }
    ]
  },
  {
    id: "4",
    name: "Puma RS-X Efekt",
    image: "/public/img/Products/shoes4.png",
    category: "Shoes",
    details_sum_stock: 45,
    variants: [
      { id: "v9", name: "Red - Size 40", stock: 10, price: 2480000, unit_code: "pcs", product_code: "PUMA-RSX-R40" },
      { id: "v10", name: "Black - Size 40", stock: 7, price: 2480000, unit_code: "pcs", product_code: "PUMA-RSX-B40" }
    ]
  }
];

const dummyCategories = [
  { value: "1", label: "Sepatu Olahraga" },
  { value: "2", label: "Pakaian" },
  { value: "3", label: "Aksesoris" }
];

const existingBundlingData = {
  id: "bundle-1",
  productName: "Bundling Sepatu Sport Premium",
  productCode: "BUNDLE-SPORT-001",
  category: "1",
  price: "8500000",
  description: "Paket bundling sepatu sport dengan kualitas premium untuk aktivitas sehari-hari",
  images: [],
  materials: [
    {
      product_detail_id: "v1",
      quantity: "2",
      productName: "Reebok Zig Kinetica 3",
      variantName: "White - Size 40",
      price: 3084500
    },
    {
      product_detail_id: "v4",
      quantity: "1",
      productName: "Nike Air Max 270",
      variantName: "Black - Size 40",
      price: 2790000
    }
  ]
};

interface ProductVariant {
  id: string;
  name: string;
  code: string;
  image: string;
  selected: boolean;
  stock: number;
  price: number;
  unit_code: string;
  product_code: string;
}

interface Product {
  id: string;
  name: string;
  code: string;
  stock: string;
  image: string;
  category: string;
  hasVariants?: boolean;
  variants: ProductVariant[];
  details_sum_stock: number;
}

function SearchProduct({
  onAdd,
  onReset,
}: {
  onAdd: (items: (Product | ProductVariant)[]) => void;
  onReset: () => void;
}) {
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const modalRef = useRef<HTMLDivElement>(null);

  const products: Product[] = dummyProducts.map(product => ({
    id: product.id,
    name: product.name,
    code: product.variants[0]?.product_code || `PR${product.id}`,
    stock: product.details_sum_stock.toString(),
    image: product.image,
    category: product.category,
    hasVariants: product.variants.length > 0,
    variants: product.variants.map(variant => ({
      id: variant.id,
      name: variant.name,
      code: variant.product_code,
      image: product.image,
      selected: false,
      stock: variant.stock,
      price: variant.price,
      unit_code: variant.unit_code,
      product_code: variant.product_code
    })),
    details_sum_stock: product.details_sum_stock
  }));

  const categories = ["Shoes", "Pakaian", "Aksesoris"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        if (showAddModal) setShowAddModal(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAddModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showAddModal]);

  const filteredProducts = products.filter(
    (p) =>
      (p.code.toLowerCase().includes(modalSearchValue.toLowerCase()) ||
        p.name.toLowerCase().includes(modalSearchValue.toLowerCase())) &&
      (categoryFilter === "" || p.category === categoryFilter)
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handleProductClick = (product: Product) => {
    if (product.variants.length > 0) {
      setSelectedProduct(product);
      setShowVariants(true);
      setCurrentPage(1);
    } else {
      toggleProductSelect(product.id);
    }
  };

  const handleBackToProducts = () => {
    setShowVariants(false);
    setSelectedProduct(null);
    setCurrentPage(1);
  };

  const toggleProductSelect = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleVariantSelect = (variantId: string) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const filteredVariants = selectedProduct
    ? selectedProduct.variants.filter(
        (variant) =>
          variant.name.toLowerCase().includes(modalSearchValue.toLowerCase()) ||
          variant.code.toLowerCase().includes(modalSearchValue.toLowerCase())
      )
    : [];

  const currentFilteredVariants = filteredVariants.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const resetData = () => {
    setSelectedProducts([]);
    setSelectedVariants([]);
    setModalSearchValue("");
    setCategoryFilter("");
    setCurrentPage(1);
  };

  const Pagination = () => {
    const totalItems = showVariants
      ? filteredVariants.length
      : filteredProducts.length;
    const currentItems = showVariants
      ? currentFilteredVariants.length
      : currentProducts.length;
    const pages = showVariants
      ? Math.ceil(filteredVariants.length / productsPerPage)
      : totalPages;

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-t-slate-400/[0.5]">
        <div className="text-sm text-gray-700">
          Menampilkan {indexOfFirstProduct + 1} sampai{" "}
          {Math.min(indexOfLastProduct, totalItems)} dari {totalItems}{" "}
          {showVariants ? "varian" : "produk"}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 text-sm font-medium">
            Halaman {currentPage} dari {pages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pages))}
            disabled={currentPage === pages}
            className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="mb-3">
        <div className="flex justify-start items-center gap-5">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Tambah
          </button>
          <button
            onClick={() => onReset()}
            className="bg-green-600 text-white px-4 py-2.5 rounded-lg cursor-pointer hover:bg-green-700 flex items-center gap-2 font-medium transition-colors shadow-sm"
          >
            <RotateCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {showVariants
                  ? `Variants - ${selectedProduct?.name}`
                  : "Tambah Product"}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X
                  className="h-6 w-6 text-gray-600 cursor-pointer"
                  onClick={() => resetData()}
                />
              </button>
            </div>

            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder={
                      showVariants
                        ? "Cari Variant"
                        : "Cari Produk (Kode/Nama)"
                    }
                    value={modalSearchValue}
                    onChange={(e) => {
                      setModalSearchValue(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-11 pr-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {!showVariants && (
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-11 pr-8 py-3 cursor-pointer outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-48 appearance-none"
                    >
                      <option value="">Semua Kategori</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {showVariants && (
                <>
                  <button
                    onClick={handleBackToProducts}
                    className="px-6 py-3 cursor-pointer text-lg hover:text-slate-700 font-medium transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </button>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {showVariants ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {currentFilteredVariants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`group bg-white rounded-xl p-3 relative cursor-pointer transition-all duration-200 ${
                        selectedVariants.includes(variant.id)
                          ? "border-2 border-dashed border-blue-500 bg-blue-50"
                          : "border border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleVariantSelect(variant.id)}
                    >
                      <div className="relative mb-3">
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon size={32} className="text-gray-400" />
                        </div>
                        {selectedVariants.includes(variant.id) && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {variant.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {variant.code}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-green-600">
                            Rp {variant.price.toLocaleString("id-ID")}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            {variant.stock} unit
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`group bg-white rounded-xl p-3 relative cursor-pointer transition-all duration-200 ${
                        selectedProducts.includes(product.id)
                          ? "border-2 border-dashed border-blue-500 bg-blue-50"
                          : "border border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="relative mb-3">
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon size={32} className="text-gray-400" />
                        </div>
                        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {product.variants.length} Variants
                        </div>
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {product.category}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          {product.code}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-green-600">
                            Rp {product.variants[0]?.price.toLocaleString("id-ID") || "0"}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            {product.stock} unit
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {((showVariants && currentFilteredVariants.length === 0) ||
                (!showVariants && currentProducts.length === 0)) && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {showVariants ? "Tidak Ada Variant" : "Tidak Ada Produk"}
                  </h3>
                  <p className="text-gray-600">
                    Ulangi pencarian yang sesuai dengan{" "}
                    {showVariants ? "nama variant" : "nama produk"}
                  </p>
                </div>
              )}
            </div>

            {!showVariants && <Pagination />}

            <div className="p-6 border-t border-t-gray-200 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div>
                  {selectedProducts.length + selectedVariants.length > 0 && (
                    <div className="font-medium text-gray-400 text-md">
                      Produk dipilih (
                      {selectedProducts.length + selectedVariants.length})
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      resetData();
                      setShowAddModal(false);
                    }}
                    className="px-6 py-3 cursor-pointer rounded-xl bg-white border border-gray-300 hover:bg-gray-50 font-medium transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      const selectedProductItems = selectedProducts
                        .map((productId) =>
                          products.find((p) => p.id === productId)
                        )
                        .filter((p): p is Product => p !== undefined);

                      const variantMap = new Map<string, Product>();

                      selectedVariants.forEach((variantId) => {
                        products.forEach((product) => {
                          const variant = product.variants?.find(
                            (v) => v.id === variantId
                          );
                          if (variant) {
                            if (!variantMap.has(product.id)) {
                              variantMap.set(product.id, {
                                ...product,
                                variants: [],
                                hasVariants: true,
                              });
                            }
                            variantMap
                              .get(product.id)!
                              .variants!.push({ ...variant, selected: true });
                          }
                        });
                      });

                      const selectedVariantProducts = Array.from(
                        variantMap.values()
                      );

                      const finalItems = [
                        ...selectedProductItems,
                        ...selectedVariantProducts,
                      ];

                      onAdd(finalItems);

                      setShowAddModal(false);
                      setShowVariants(false);
                      setSelectedProduct(null);
                      setSelectedProducts([]);
                      setSelectedVariants([]);
                      setModalSearchValue("");
                      setCategoryFilter("");
                      setCurrentPage(1);
                    }}
                    disabled={
                      selectedProducts.length === 0 &&
                      selectedVariants.length === 0
                    }
                    className="px-6 py-3 cursor-pointer rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
                  >
                    Tambah {selectedProducts.length + selectedVariants.length}{" "}
                    Produk
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BundlingEdit() {
  const [productName, setProductName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [composition, setComposition] = useState([]);
  const [materials, setMaterials] = useState([]);
  
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showComposition, setShowComposition] = useState(true);
  
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [activeQtyId, setActiveQtyId] = useState(null);
  const [qtyInput, setQtyInput] = useState("");

  useEffect(() => {
    setProductName(existingBundlingData.productName);
    setProductCode(existingBundlingData.productCode);
    setCategory(existingBundlingData.category);
    setPrice(existingBundlingData.price);
    setDescription(existingBundlingData.description);
    setImages(existingBundlingData.images);
    setMaterials(existingBundlingData.materials);
    setComposition(existingBundlingData.materials.map(mat => `${mat.productName} - ${mat.variantName}`));
  }, []);

  const filteredCategories = dummyCategories.filter(cat =>
    cat.label.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleRemoveComposition = (index) => {
    setComposition(prev => prev.filter((_, i) => i !== index));
    setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      productName,
      productCode,
      category,
      price,
      description,
      images,
      materials
    });
    alert("Bundling berhasil diperbarui! (Demo mode - check console for data)");
  };

  const handleQtySubmit = () => {
    if (!qtyInput || parseFloat(qtyInput) <= 0) {
      alert("Quantity harus lebih dari 0");
      return;
    }
    setMaterials(prev =>
      prev.map(mat =>
        mat.product_detail_id === activeQtyId
          ? { ...mat, quantity: qtyInput }
          : mat
      )
    );
    setShowQtyModal(false);
    setActiveQtyId(null);
    setQtyInput("");
  };

  const handleAddProducts = (items) => {
    const newMaterials = items.map(item => {
      if (item.variants && item.variants.length > 0) {
        return item.variants.map(variant => ({
          product_detail_id: variant.id,
          quantity: null,
          productName: item.name,
          variantName: variant.name,
          price: variant.price
        }));
      } else {
        return {
          product_detail_id: item.id,
          quantity: null,
          productName: item.name,
          variantName: item.name,
          price: item.price || item.variants?.[0]?.price || 0
        };
      }
    }).flat();

    setMaterials(prev => [...prev, ...newMaterials]);
    setComposition(prev => [...prev, ...newMaterials.map(mat => `${mat.productName} - ${mat.variantName}`)]);
  };

  const handleResetProducts = () => {
    setMaterials([]);
    setComposition([]);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Edit Bundling</h1>
        <div className="text-sm text-gray-500">
          ID: {existingBundlingData.id}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
                <Info size={18} /> Informasi Produk
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Bundling<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama Bundling"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Bundling<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kode Bundling"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                />
              </div>

              <div className="relative">
                <label className="block mb-1 text-sm text-gray-700">Kategori</label>
                <div
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 bg-white cursor-pointer"
                  onClick={() => setCategoryDropdown(v => !v)}
                >
                  {dummyCategories.find(cat => cat.value === category)?.label || "Pilih kategori"}
                </div>
                {categoryDropdown && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
                      placeholder="Cari kategori..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                    <div className="max-h-40 overflow-y-auto">
                      {filteredCategories.map(cat => (
                        <div
                          key={cat.value}
                          className={`px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer ${cat.value === category ? "bg-blue-100" : ""}`}
                          onClick={() => {
                            setCategory(cat.value);
                            setCategoryDropdown(false);
                            setCategorySearch("");
                          }}
                        >
                          {cat.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm mt-4 border border-gray-200">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="text-blue-600 font-semibold">Produk Dibundling</span>
                  <button
                    type="button"
                    onClick={() => setShowComposition(!showComposition)}
                    className="text-blue-600"
                  >
                    {showComposition ? <GoTriangleDown size={24}/> : <GoTriangleUp size={24}/>}
                  </button>
                </div>

                {showComposition && (
                  <>
                    <div className="space-y-4 p-4 max-h-96 overflow-y-auto">
                      {composition.length === 0 && (
                        <div className="text-gray-400 italic text-center py-6">
                          Belum ada produk bundling dipilih
                        </div>
                      )}
                      {materials.map((mat, index) => {
                        const product = dummyProducts.find(p =>
                          p.variants.some(v => v.id === mat.product_detail_id)
                        );
                        const variant = product?.variants.find(v => v.id === mat.product_detail_id);

                        return (
                          <div key={index} className="flex items-center justify-between border border-gray-200 rounded-xl bg-white px-4 py-3">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                                <ImageIcon size={24} className="text-gray-400" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-800">{mat.productName}</div>
                                <div className="text-xs text-gray-500">Varian</div>
                                <div className="text-xs font-medium text-gray-700">{mat.variantName}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-sm text-gray-700">
                                <div className="text-xs text-gray-500">Harga</div>
                                <div>Rp {(variant?.price || mat.price || 0).toLocaleString("id-ID")}</div>
                              </div>
                              <div className="text-sm text-gray-700">
                                <div className="text-xs text-gray-500">Quantity</div>
                                {mat.quantity ? (
                                  <div className="text-sm">{mat.quantity} pcs</div>
                                ) : (
                                  <div className="text-sm text-gray-400">-</div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveQtyId(mat.product_detail_id);
                                  setQtyInput(mat.quantity || "");
                                  setShowQtyModal(true);
                                }}
                                className={`text-white px-3 py-1.5 rounded text-xs font-semibold ${mat.quantity ? "bg-yellow-400 hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-700"}`}
                              >
                                Atur Quantity
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveComposition(index)}
                              className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
                      <span className="text-gray-400">{composition.length} Produk Ditambah</span>
                      <SearchProduct 
                        onAdd={handleAddProducts}
                        onReset={handleResetProducts}
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Rp.</span>
                  <input
                    type="number"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="500.000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan Deskripsi Produk"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-2xl p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600">
              <ImageIcon size={18} /> Gambar Produk
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              {images.length > 0 ? (
                <div className="relative">
                  <img 
                    src={URL.createObjectURL(images[0])} 
                    alt="Preview" 
                    className="w-full h-48 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setImages([file]);
                    }}
                    className="hidden"
                  />
                  <ImageIcon size={48} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Klik untuk upload gambar</span>
                </label>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button 
                type="button" 
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Perbarui Bundling
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="text-sm text-gray-600 mb-4">Rincian Produk</div>
            <div className="bg-gray-100 rounded-lg p-4 mb-4 h-48 flex items-center justify-center">
              {images.length > 0 ? (
                <img src={URL.createObjectURL(images[0])} alt="Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon size={48} className="mx-auto mb-2" />
                  <div className="text-xs">No image</div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-xl font-bold text-blue-600">Rp {Number(price || 0).toLocaleString("id-ID")}</div>
              <div className="font-medium text-gray-800">{productName || "Nama Bundling"}</div>
              <div className="text-sm text-gray-600">{productCode || "Kode Bundling"}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Komposisi:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {materials.map((mat, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{mat.productName} - {mat.variantName}</span>
                    <span>{mat.quantity} pcs</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showQtyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-[95%] max-w-md shadow-xl">
            <div className="bg-blue-600 text-white px-6 py-4">
              <h3 className="text-lg font-semibold">Atur Quantity</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan quantity"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 bg-gray-100 rounded-r-lg px-4">
                  pcs
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
              <button
                onClick={() => {
                  setShowQtyModal(false);
                  setActiveQtyId(null);
                  setQtyInput("");
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleQtySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}