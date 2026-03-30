import { useEffect, useState, useMemo, useCallback } from "react";
import { Eye, Pencil, Trash, Plus, Search, MoreVertical, Package, ChevronRight, ChevronLeft, LayoutGrid } from "lucide-react";
import Swal from "sweetalert2";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { useNavigate } from "react-router-dom";
import AddProductModal from "@/views/Components/Modal/Product/AddProductModal";
import ProductFilterModal from "@/views/Components/Modal/Product/FilterModal";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const ProductCard = ({ product, onEdit, onDelete, onDetail, openDropdown, setOpenDropdown }: any) => {
  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`)
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group relative">
        <div className="absolute top-4 right-4 z-10">
            <button 
                onClick={() => setOpenDropdown(openDropdown === product.id ? null : product.id)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors cursor-pointer"
            >
                <MoreVertical size={18} className="text-gray-500" />
            </button>
            {openDropdown === product.id && (
                <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-2xl border border-gray-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <button onClick={() => onDetail(product)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer">
                        <Eye size={16} /> Detail
                    </button>
                    <button onClick={() => onEdit(product)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer">
                        <Pencil size={16} /> Edit
                    </button>
                    <button onClick={() => onDelete(product)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                        <Trash size={16} /> Hapus
                    </button>
                </div>
            )}
        </div>

        <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-5 bg-gray-50 relative group-hover:scale-[1.02] transition-transform duration-500">
            <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[10px] font-extrabold text-emerald-600 shadow-sm uppercase tracking-wider">
                {product.category?.name || "Kategori"}
            </div>
            <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                Stok: {product.stock || 0}
            </div>
        </div>

        <div className="space-y-2 px-1">
            <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
            <p className="text-gray-400 text-xs font-medium line-clamp-2 min-h-[32px]">{product.description || "Tidak ada deskripsi produk."}</p>
            <div className="pt-3 flex items-center justify-between border-t border-gray-100 mt-4">
                <span className="text-emerald-600 font-extrabold text-lg">{formatRupiah(product.price)}</span>
                <span className="bg-gray-100 text-gray-400 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-tighter">ID: {product.id}</span>
            </div>
        </div>
    </div>
  );
};

export default function Product() {
  const navigate = useNavigate();
  const apiClient = useApiClient();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiClient.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Gagal mengambil data kategori", error);
    }
  }, [apiClient]);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []); // Run once on mount to avoid infinite loops

  // Client-Side Search and Filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "" || p.category_id.toString() === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Client-Side Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handleDelete = async (product: any) => {
    const result = await Swal.fire({
      title: "Hapus Produk?",
      text: `Anda akan menghapus "${product.name}". Tindakan ini tidak dapat dibatalkan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[2rem]',
        confirmButton: 'rounded-2xl px-6 py-3 font-bold',
        cancelButton: 'rounded-2xl px-6 py-3 font-bold'
      }
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/products/${product.id}`);
        Swal.fire("Terhapus!", "Produk berhasil dihapus.", "success");
        fetchData();
      } catch (error) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus produk.", "error");
      }
    }
    setDropdownOpenId(null);
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const goDetail = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 bg-[#f8fafc] min-h-screen font-['Outfit']">
      <Breadcrumb title="Katalog Produk" desc="Kelola stok dan harga barang persewaan Anda" />
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Cari barang..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/70 backdrop-blur border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
            </div>
            
            <div className="relative w-full md:w-56 group">
                <LayoutGrid size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white/70 backdrop-blur border-none rounded-2xl pl-12 pr-4 py-4 text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                >
                    <option value="">Semua Kategori</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
        </div>
        
        <button 
            onClick={openAddModal}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
        >
            <Plus size={20} />
            <span>Tambah Barang</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            <p className="text-gray-400 font-bold text-sm animate-pulse uppercase tracking-wider">Memuat Barang...</p>
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-xl border border-dashed border-gray-200 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <Package size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-400">Tidak Ada Barang</h3>
            <p className="text-gray-400 max-w-xs mt-2">Belum ada barang yang terdaftar atau tidak ditemukan berdasarkan kriteria Anda.</p>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedProducts.map((p) => (
                    <ProductCard 
                        key={p.id} 
                        product={p} 
                        onEdit={openEditModal} 
                        onDelete={handleDelete} 
                        onDetail={goDetail}
                        openDropdown={dropdownOpenId}
                        setOpenDropdown={setDropdownOpenId}
                    />
                ))}
            </div>

            {/* Pagination Area */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-10">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-emerald-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all cursor-pointer"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => handlePageChange(i + 1)}
                                className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all shadow-sm cursor-pointer ${currentPage === i + 1 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-gray-400 hover:text-emerald-600'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-emerald-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-all cursor-pointer"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </>
      )}

      {/* Modals */}
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
        product={selectedProduct}
      />
      
      <ProductFilterModal 
        open={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filterValues={{
          minPrice: "",
          maxPrice: "",
          minStock: "",
          maxStock: ""
        }} 
        setFilterValues={() => {}}
        onApply={() => setIsFilterOpen(false)}
      />
    </div>
  );
}
