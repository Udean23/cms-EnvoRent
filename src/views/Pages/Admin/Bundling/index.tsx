import { Eye, Pencil, Trash, X } from "lucide-react";
import { useState } from "react";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import dummyBundlingData from "@/core/dummy/bundlingdummy";
import BundlingFilterModal from "@/views/Components/Modal/Bundling/FilterModal";
import SearchInput from "@/views/Components/Input/SearchInput";
import Filter from "@/views/Components/Button/filterBtn";
import { useNavigate } from "react-router-dom";

export default function Bundling() {
    const nav = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownOpenId, setDropdownOpenId] = useState(null);
    const [packages, setPackages] = useState(dummyBundlingData);
    const [showFilter, setShowFilter] = useState(false);
    const [filterValues, setFilterValues] = useState({
        minPrice: "",
        maxPrice: "",
        minMaterial: "",
        maxMaterial: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredPackages = packages.filter((pkg) => {
        const matchesSearch =
            pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pkg.kode_Bundling.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice =
            (!filterValues.minPrice || pkg.harga >= Number(filterValues.minPrice)) &&
            (!filterValues.maxPrice || pkg.harga <= Number(filterValues.maxPrice));

        const matchesMaterial =
            (!filterValues.minMaterial ||
                pkg.bundling_material_count >= Number(filterValues.minMaterial)) &&
            (!filterValues.maxMaterial ||
                pkg.bundling_material_count <= Number(filterValues.maxMaterial));

        return matchesSearch && matchesPrice && matchesMaterial;
    });

    const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
    const displayedPackages = filteredPackages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatPrice = (price) => {
        return `Rp ${price.toLocaleString("id-ID")}`;
    };

    const handleApplyFilter = () => {
        setCurrentPage(1);
        setShowFilter(false);
    };

    const isFilterActive = Object.values(filterValues).some((v) => v && v !== "");

    const handleDetail = (pkg) => {
        nav(`/bundling/${pkg.id}`);
    };

    const handleEdit = (pkg) => {
        nav(`/bundling/edit/${pkg.id}`);
    };

    const handleDelete = (pkg) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus bundling "${pkg.name}"?`)) {
            setPackages(packages.filter((p) => p.id !== pkg.id));
            alert("Bundling berhasil dihapus!");
        }
        setDropdownOpenId(null);
    };

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb title="Bundling" desc="Data Bundling Produk" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 w-full sm:w-auto max-w-lg">
                    <SearchInput value={searchQuery} onChange={(val) => setSearchQuery(val)} />
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
                        onClick={() => nav("/bundling/create")}
                    >
                        <FiPlus /> Tambah Bundling
                    </button>
                </div>
            </div>

            {displayedPackages.length === 0 ? (
                <div className="text-gray-500 text-center py-12">
                    Tidak ada paket bundling ditemukan.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayedPackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white rounded-xl shadow-md p-4 relative">
                                <div className="absolute top-3 right-3">
                                    <button
                                        className="p-1 rounded-full cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            setDropdownOpenId(dropdownOpenId === pkg.id ? null : pkg.id)
                                        }
                                    >
                                        <FiMoreVertical size={18} className="text-gray-600" />
                                    </button>
                                    {dropdownOpenId === pkg.id && (
                                        <div className="absolute right-0 top-8 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-20 py-1">
                                            <button
                                                className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                                                onClick={() => handleDetail(pkg)}
                                            >
                                                <Eye size={16} /> Detail
                                            </button>
                                            <button
                                                className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 text-sm"
                                                onClick={() => handleEdit(pkg)}
                                            >
                                                <Pencil size={16} /> Edit
                                            </button>
                                            <button
                                                className="w-full cursor-pointer text-left px-4 py-2 flex items-center gap-2 text-red-600 hover:bg-gray-100 text-sm"
                                                onClick={() => handleDelete(pkg)}
                                            >
                                                <Trash size={16} /> Hapus
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center mb-4">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.name}
                                        className="w-16 h-16 rounded-full border-2 border-white object-cover bg-gray-200 cursor-pointer"
                                        onClick={() => handleDetail(pkg)}
                                    />
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-900 truncate">
                                        {pkg.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">#{pkg.kode_Bundling}</p>
                                </div>

                                <div className="mt-14 space-y-1 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Quantity Item:</span>
                                        <span className="font-semibold text-gray-400">
                                            {pkg.bundling_material_count} Item
                                        </span>
                                    </div>
                                    <div className="flex justify-between mt-5">
                                        <span className="font-medium text-gray-600">Harga:</span>
                                        <span className="font-semibold text-gray-400">
                                            {formatPrice(pkg.harga)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-gray-600">
                            Menampilkan {displayedPackages.length} dari {filteredPackages.length}{" "}
                            Bundling
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

            <BundlingFilterModal
                open={showFilter}
                onClose={() => setShowFilter(false)}
                filterValues={filterValues}
                setFilterValues={setFilterValues}
                onApply={handleApplyFilter}
            />
        </div>
    );
}