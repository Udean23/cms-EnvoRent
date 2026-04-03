import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { 
    Edit, 
    Trash2, 
    Search, 
    Plus, 
    Layers, 
    RefreshCw, 
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
} from "lucide-react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import AddCategoryModal from "@/views/Components/Modal/Category/AddCategoryModal";
import EditCategoryModal from "@/views/Components/Modal/Category/EditCategoryModal";
import FilterModal from "@/views/Components/Modal/Category/FilterModal";
import { useApiClient } from "@/core/helpers/ApiClient";

interface Category {
    id: number;
    name: string;
    productCount?: number;
    products_count?: number;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    categories: Category[];
}

type SortField = "id" | "name" | "created_at";
type SortDir = "asc" | "desc";

const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const SkeletonRow = () => (
    <tr className="animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
            <td key={i} className="px-6 py-4">
                <div className="h-4 bg-gray-100 rounded-full" style={{ width: `${50 + Math.random() * 40}%` }} />
            </td>
        ))}
    </tr>
);

const SortIcon = ({ field, sortBy, sortDir }: { field: SortField; sortBy: SortField; sortDir: SortDir }) => {
    if (sortBy !== field) return <ChevronsUpDown size={13} className="text-gray-300" />;
    return sortDir === "asc"
        ? <ChevronUp size={13} className="text-emerald-600" />
        : <ChevronDown size={13} className="text-emerald-600" />;
};

const itemsPerPage = 8;

const CategoryPage = () => {
    const apiClient = useApiClient();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    
    // Sort logic handled in frontend since backend currently returns "all()" without built-in paginator for this endpoint initially.
    const [sortBy, setSortBy] = useState<SortField>("created_at");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<ApiResponse>("/categories");
            setCategories(res.data.categories || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Gagal memuat kategori. Pastikan Anda sudah login.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDelete = async (cat: Category) => {
        try {
            const result = await Swal.fire({
                title: "Apakah Anda yakin?",
                text: `Ingin menghapus kategori "${cat.name}"? Data tidak dapat dikembalikan!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ya, Hapus!",
                cancelButtonText: "Batal",
            });

            if (result.isConfirmed) {
                await apiClient.delete(`/categories/${cat.id}`);
                setCategories(prev => prev.filter(c => c.id !== cat.id));
                
                await Swal.fire({
                    title: "Terhapus!",
                    text: "Kategori berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Gagal Hapus",
                text: err?.response?.data?.message || "Gagal menghapus kategori",
            });
        }
    };

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDir("desc");
        }
        setPage(1);
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ).sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        
        if (sortBy === 'created_at') {
            valA = new Date(a.created_at).getTime();
            valB = new Date(b.created_at).getTime();
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortDir === 'asc' 
                ? valA.localeCompare(valB) 
                : valB.localeCompare(valA);
        }

        return sortDir === 'asc' 
            ? (valA as number) - (valB as number) 
            : (valB as number) - (valA as number);
    });

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
    const paginatedCategories = filteredCategories.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, filteredCategories.length);

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                title="Kategori Produk"
                desc="Kelola jenis kategori dari seluruh produk di outlet"
            />
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-4 overflow-hidden">
                {/* Header Toolbar */}
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex w-full md:w-auto items-center gap-3">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full"
                            />
                        </div>
                        <button
                            onClick={fetchCategories}
                            disabled={loading}
                            className="p-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-emerald-300 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="flex w-full md:w-auto items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Kategori
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th 
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group select-none relative w-16"
                                    onClick={() => handleSort("id")}
                                >
                                    <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        No <SortIcon field="id" sortBy={sortBy} sortDir={sortDir} />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group select-none"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        Nama Kategori <SortIcon field="name" sortBy={sortBy} sortDir={sortDir} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Jumlah Item
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group select-none"
                                    onClick={() => handleSort("created_at")}
                                >
                                    <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        Dibuat Pada <SortIcon field="created_at" sortBy={sortBy} sortDir={sortDir} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-gray-400">
                                        <Layers size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium text-gray-600">Tidak ada kategori ditemukan</p>
                                        <p className="text-sm mt-1 text-gray-400">Silakan tambahkan kategori baru.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-emerald-50/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                #{cat.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-800">
                                                {cat.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-gray-200">
                                                {cat.products_count ?? cat.productCount ?? "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">
                                                {formatDate(cat.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setIsEditOpen(true);
                                                    }}
                                                    className="w-8 h-8 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
                                                    title="Edit Kategori"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat)}
                                                    className="w-8 h-8 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
                                                    title="Hapus Kategori"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredCategories.length > 0 && (
                    <div className="bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                        <div>
                            Menampilkan <span className="font-semibold text-gray-700">{startItem}-{endItem}</span> dari <span className="font-semibold text-gray-700">{filteredCategories.length}</span> kategori
                        </div>
                        <div className="flex items-center gap-1 mt-4 sm:mt-0">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {[...Array(totalPages)].map((_, idx) => (
                                <button
                                    key={idx + 1}
                                    onClick={() => setPage(idx + 1)}
                                    className={`w-8 h-8 text-sm font-medium rounded-lg transition-all ${
                                        page === idx + 1
                                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                                            : "border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddCategoryModal 
                isOpen={isAddOpen} 
                onClose={() => setIsAddOpen(false)} 
                onSuccess={(newCat) => setCategories(prev => [newCat, ...prev])}
            />
            {selectedCategory && (
                <EditCategoryModal
                    isOpen={isEditOpen}
                    onClose={() => {
                        setIsEditOpen(false);
                        setSelectedCategory(null);
                    }}
                    category={selectedCategory}
                    onSuccess={(updatedCat) => setCategories(prev => prev.map(c => c.id === updatedCat.id ? updatedCat : c))}
                />
            )}
            <FilterModal 
                isOpen={isFilterOpen} 
                onClose={() => setIsFilterOpen(false)} 
            />
        </div>
    );
};

export default CategoryPage;
