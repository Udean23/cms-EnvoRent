import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { 
    Edit, 
    Trash2, 
    Search, 
    Plus, 
    Users, 
    RefreshCw, 
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    Eye
} from "lucide-react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import AddUserModal from "@/views/Components/Modal/User/AddUserModal";
import EditUserModal from "@/views/Components/Modal/User/EditUserModal";
import ViewUserModal from "@/views/Components/Modal/User/ViewUserModal";
import { useApiClient } from "@/core/helpers/ApiClient";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    users: User[];
}

type SortField = "id" | "name" | "email" | "created_at";
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
        {Array.from({ length: 6 }).map((_, i) => (
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

const UserPage = () => {
    const apiClient = useApiClient();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    
    const [sortBy, setSortBy] = useState<SortField>("created_at");
    const [sortDir, setSortDir] = useState<SortDir>("desc");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.get<ApiResponse>("/users?role=admin");
            setUsers(res.data.users || []);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Gagal memuat data karyawan.");
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (userParam: User) => {
        try {
            const result = await Swal.fire({
                title: "Apakah Anda yakin?",
                text: `Ingin menghapus karyawan "${userParam.name}"? Data tidak dapat dikembalikan!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ya, Hapus!",
                cancelButtonText: "Batal",
            });

            if (result.isConfirmed) {
                await apiClient.delete(`/users/${userParam.id}`);
                setUsers(prev => prev.filter(u => u.id !== userParam.id));
                
                await Swal.fire({
                    title: "Terhapus!",
                    text: "Data karyawan berhasil dihapus.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        } catch (err: any) {
            Swal.fire({
                icon: "error",
                title: "Gagal Hapus",
                text: err?.response?.data?.message || "Gagal menghapus karyawan",
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

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearch.toLowerCase())
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

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const paginatedUsers = filteredUsers.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const startItem = (page - 1) * itemsPerPage + 1;
    const endItem = Math.min(page * itemsPerPage, filteredUsers.length);

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                title="Karyawan"
                desc="Manajemen Data Karyawan (Admin Utama)"
            />
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-4 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex w-full md:w-auto items-center gap-3">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full"
                            />
                        </div>
                        <button
                            onClick={fetchUsers}
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
                        Tambah Karyawan
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
                                        ID <SortIcon field="id" sortBy={sortBy} sortDir={sortDir} />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group select-none"
                                    onClick={() => handleSort("name")}
                                >
                                    <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        Karyawan <SortIcon field="name" sortBy={sortBy} sortDir={sortDir} />
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group select-none hidden md:table-cell"
                                    onClick={() => handleSort("email")}
                                >
                                    <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        Email <SortIcon field="email" sortBy={sortBy} sortDir={sortDir} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer group select-none hidden sm:table-cell"
                                    onClick={() => handleSort("created_at")}
                                >
                                    <div className="flex items-center gap-1 hover:text-emerald-700 transition-colors">
                                        Terdaftar Pada <SortIcon field="created_at" sortBy={sortBy} sortDir={sortDir} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-gray-400">
                                        <Users size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium text-gray-600">Tidak ada karyawan ditemukan</p>
                                        <p className="text-sm mt-1 text-gray-400">Silakan tambahkan data karyawan baru.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-emerald-50/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                #{user.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border border-emerald-200">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-gray-500">
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-gray-200 capitalize shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="text-sm text-gray-500">
                                                {formatDate(user.created_at)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsViewOpen(true);
                                                    }}
                                                    className="w-8 h-8 bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsEditOpen(true);
                                                    }}
                                                    className="w-8 h-8 bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
                                                    title="Edit Karyawan"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="w-8 h-8 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg flex items-center justify-center transition-all shadow-sm"
                                                    title="Hapus Karyawan"
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

                {!loading && filteredUsers.length > 0 && (
                    <div className="bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 border-t border-gray-100">
                        <div>
                            Menampilkan <span className="font-semibold text-gray-700">{startItem}-{endItem}</span> dari <span className="font-semibold text-gray-700">{filteredUsers.length}</span> karyawan
                        </div>
                        <div className="flex items-center gap-1 mt-4 sm:mt-0">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {[...Array(totalPages)].map((_, idx) => {
                                if (
                                    totalPages <= 5 ||
                                    idx === 0 ||
                                    idx === totalPages - 1 ||
                                    (idx + 1 >= page - 1 && idx + 1 <= page + 1)
                                ) {
                                    return (
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
                                    );
                                } else if (
                                    (idx === 1 && page > 3) ||
                                    (idx === totalPages - 2 && page < totalPages - 2)
                                ) {
                                    return <span key={idx} className="px-1 text-gray-400">...</span>;
                                }
                                return null;
                            })}

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
            <AddUserModal 
                isOpen={isAddOpen} 
                onClose={() => setIsAddOpen(false)} 
                onSuccess={(newUser) => setUsers(prev => [newUser, ...prev])}
            />
            
            <EditUserModal
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setTimeout(() => setSelectedUser(null), 300); // clear after animation
                }}
                user={selectedUser}
                onSuccess={(updatedUser) => setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))}
            />

            <ViewUserModal
                isOpen={isViewOpen}
                onClose={() => {
                    setIsViewOpen(false);
                    setTimeout(() => setSelectedUser(null), 300);
                }}
                user={selectedUser}
            />
        </div>
    );
};

export default UserPage;