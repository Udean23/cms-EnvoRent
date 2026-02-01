import { Eye, Pencil, Trash } from "lucide-react";
import Swal from "sweetalert2";
import { useState, useMemo } from "react";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import productsData from "@/core/dummy/productdummy";
import ProductFilterModal from "@/views/Components/Modal/Product/FilterModal";
import SearchInput from "@/views/Components/Input/SearchInput";
import Filter from "@/views/Components/Button/filterBtn";
import { useNavigate } from "react-router-dom";

export default function Product() {
    const nav = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
    const [products, setProducts] = useState(productsData);
    const [showFilter, setShowFilter] = useState(false);
    const [filterValues, setFilterValues] = useState({
        minPrice: "",
        maxPrice: "",
        minStock: "",
        maxStock: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const enrichedProducts = useMemo(() => {
        return products.map(product => {
            const totalStock = product.variants.reduce((acc, variant) => {
                return acc + variant.sizes.reduce((sizeAcc, size) => sizeAcc + size.stock, 0);
            }, 0);
            return {
                ...product,
                totalStock
            };
        });
    }, [products]);

    const filteredProducts = enrichedProducts.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice =
            (!filterValues.minPrice || product.price >= Number(filterValues.minPrice)) &&
            (!filterValues.maxPrice || product.price <= Number(filterValues.maxPrice));

        const matchesStock =
            (!filterValues.minStock ||
                product.totalStock >= Number(filterValues.minStock)) &&
            (!filterValues.maxStock ||
                product.totalStock <= Number(filterValues.maxStock));

        return matchesSearch && matchesPrice && matchesStock;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString("id-ID")}`;
    };

    const handleApplyFilter = () => {
        setCurrentPage(1);
        setShowFilter(false);
    };

    const isFilterActive = Object.values(filterValues).some((v) => v && v !== "");

    const handleDetail = (product: typeof productsData[0]) => {
        nav(`/product/${product.id}`);
    };

    const handleEdit = (product: typeof productsData[0]) => {
        nav(`/product/edit/${product.id}`);
    };

    const handleDelete = (product: typeof productsData[0]) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: `Ingin menghapus produk "${product.name}"? Data tidak dapat dikembalikan!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                setProducts(products.filter((p) => p.id !== product.id));
                Swal.fire({
                    title: "Terhapus!",
                    text: "Produk berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
        setDropdownOpenId(null);
    };

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb title="Product" desc="Data Produk" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 w-full sm:w-auto max-w-lg">
                    <SearchInput value={searchQuery} onChange={(val: string) => setSearchQuery(val)} />
                    <div className="relative">
                        <Filter onClick={() => setShowFilter(true)} />
                        {isFilterActive && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        className="bg-gradient-to-r from-[#0050E0] to-purple-600 hover:bg-gradient-to-tr hover:from-[#0050E0] hover:to-purple-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer"
                        onClick={() => nav("/product/create")}
                    >
                        <FiPlus /> Tambah Produk
                    </button>
                </div>
            </div>

            {displayedProducts.length === 0 ? (
                <div className="text-gray-500 text-center py-12">
                    Tidak ada produk ditemukan.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayedProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-md p-4 relative">
                                <div className="absolute top-3 right-3">
                                    <button
                                        className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            setDropdownOpenId(dropdownOpenId === product.id ? null : product.id)
                                        }
                                    >
                                        <FiMoreVertical size={18} className="text-gray-600" />
                                    </button>
                                    {dropdownOpenId === product.id && (
                                        <div className="absolute right-0 top-8 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20 py-1">
                                            <button
                                                className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                                                onClick={() => handleDetail(product)}
                                            >
                                                <Eye size={16} /> Detail
                                            </button>
                                            <button
                                                className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Pencil size={16} /> Edit
                                            </button>
                                            <button
                                                className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-gray-100 text-sm"
                                                onClick={() => handleDelete(product)}
                                            >
                                                <Trash size={16} /> Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center mb-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-16 h-16 rounded-full border-2 border-white object-cover bg-gray-200 cursor-pointer"
                                        onClick={() => handleDetail(product)}
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900 truncate" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">#{product.id}</p>
                                </div>

                                <div className="mt-14 space-y-1 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Total Stok:</span>
                                        <span className="font-semibold text-gray-400">
                                            {product.totalStock} Item
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-5">
                                        <span className="font-medium text-gray-600">Harga:</span>
                                        <span className="font-semibold text-gray-400">
                                            {formatPrice(product.price)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-600">
                            Menampilkan {displayedProducts.length} dari {filteredProducts.length}{" "}
                            Produk
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 border rounded text-sm hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded text-sm ${currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                className="px-3 py-1 border rounded text-sm hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}

            <ProductFilterModal
                open={showFilter}
                onClose={() => setShowFilter(false)}
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                onApply={handleApplyFilter}
            />
        </div>
    );
}
