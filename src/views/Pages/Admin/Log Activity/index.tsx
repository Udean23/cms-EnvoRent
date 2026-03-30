import { useState, useEffect, useCallback } from "react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Activity,
    Shield,
    ShoppingCart,
    Settings,
    Tag,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
    User,
    Clock,
    AlertCircle,
} from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";

interface ActivityLogUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface ActivityLog {
    id: number;
    user_id: number;
    description: string;
    activity_type: "authentication" | "crud" | "transaction" | "system" | "other";
    created_at: string;
    updated_at: string;
    user: ActivityLogUser;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface ApiResponse {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

type SortField = "id" | "user_id" | "description" | "activity_type" | "created_at";
type SortDir = "asc" | "desc";

const ACTIVITY_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: JSX.Element }> = {
    authentication: {
        label: "Autentikasi",
        color: "text-blue-700",
        bg: "bg-blue-50 border-blue-200",
        icon: <Shield size={12} />,
    },
    crud: {
        label: "CRUD",
        color: "text-emerald-700",
        bg: "bg-emerald-50 border-emerald-200",
        icon: <Settings size={12} />,
    },
    transaction: {
        label: "Transaksi",
        color: "text-violet-700",
        bg: "bg-violet-50 border-violet-200",
        icon: <ShoppingCart size={12} />,
    },
    system: {
        label: "Sistem",
        color: "text-orange-700",
        bg: "bg-orange-50 border-orange-200",
        icon: <Activity size={12} />,
    },
    other: {
        label: "Lainnya",
        color: "text-gray-700",
        bg: "bg-gray-50 border-gray-200",
        icon: <Tag size={12} />,
    },
};

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    superadmin: { label: "Super Admin", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
    admin: { label: "Admin", color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
    customer: { label: "Customer", color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
};

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) + " " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

const SortIcon = ({ field, sortBy, sortDir }: { field: SortField; sortBy: SortField; sortDir: SortDir }) => {
    if (sortBy !== field) return <ChevronsUpDown size={13} className="text-gray-300" />;
    return sortDir === "asc"
        ? <ChevronUp size={13} className="text-emerald-600" />
        : <ChevronDown size={13} className="text-emerald-600" />;
};

const SkeletonRow = () => (
    <tr className="animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
            <td key={i} className="px-5 py-4">
                <div className="h-4 bg-gray-100 rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} />
            </td>
        ))}
    </tr>
);

const ActivityLogs = () => {
    const apiClient = useApiClient();

    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activityType, setActivityType] = useState("");
    const [role, setRole] = useState("");
    const [sortBy, setSortBy] = useState<SortField>("created_at");
    const [sortDir, setSortDir] = useState<SortDir>("desc");
    const [page, setPage] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: Record<string, string> = {
                page: String(page),
                sort_by: sortBy,
                sort_dir: sortDir,
            };
            if (role) params.role = role;
            if (activityType) params.activity_type = activityType;
            if (debouncedSearch) params.search = debouncedSearch;

            const res = await apiClient.get<ApiResponse>("/activity-logs", { params });
            setLogs(res.data.data);
            setMeta({
                current_page: res.data.current_page,
                last_page: res.data.last_page,
                per_page: res.data.per_page,
                total: res.data.total,
                from: res.data.from,
                to: res.data.to,
            });
        } catch (err: any) {
            setError(err?.response?.data?.message || "Gagal memuat data. Pastikan Anda sudah login.");
        } finally {
            setLoading(false);
        }
    }, [page, sortBy, sortDir, role, activityType, debouncedSearch]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortDir("desc");
        }
        setPage(1);
    };

    const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setter(e.target.value);
        setPage(1);
    };

    const totalPages = meta?.last_page ?? 1;
    const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        if (totalPages <= 5) return i + 1;
        if (page <= 3) return i + 1;
        if (page >= totalPages - 2) return totalPages - 4 + i;
        return page - 2 + i;
    });

    return (
        <div className="p-4 md:p-6 space-y-5 bg-gray-50 min-h-screen">
            <Breadcrumb
                title="Log Aktivitas"
                desc="Monitor seluruh aktivitas admin dan superadmin secara real-time"
            />

            {/* Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                    { label: "Semua", value: "", count: meta?.total },
                    ...Object.entries(ACTIVITY_TYPE_CONFIG).map(([k, v]) => ({
                        label: v.label,
                        value: k,
                        count: undefined,
                    })),
                ].map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => { setActivityType(item.value); setPage(1); }}
                        className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                            activityType === item.value
                                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
                        }`}
                    >
                        <p className={`text-xs font-medium ${activityType === item.value ? "text-emerald-700" : "text-gray-500"}`}>
                            {item.label}
                        </p>
                        {item.count !== undefined && (
                            <p className="text-xl font-bold text-gray-800 mt-0.5">{item.count}</p>
                        )}
                    </button>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Cari deskripsi atau nama user..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all w-64"
                            />
                        </div>

                        {/* Role filter */}
                        <select
                            value={role}
                            onChange={handleFilterChange(setRole)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-gray-600 bg-white"
                        >
                            <option value="">Semua Role</option>
                            <option value="superadmin">Super Admin</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        onClick={fetchLogs}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-emerald-300 text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mx-5 mt-4 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th
                                    className="px-5 py-3.5 text-left cursor-pointer select-none group"
                                    onClick={() => handleSort("id")}
                                >
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                                        # ID <SortIcon field="id" sortBy={sortBy} sortDir={sortDir} />
                                    </span>
                                </th>
                                <th
                                    className="px-5 py-3.5 text-left cursor-pointer select-none group"
                                    onClick={() => handleSort("user_id")}
                                >
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                                        <User size={12} /> User <SortIcon field="user_id" sortBy={sortBy} sortDir={sortDir} />
                                    </span>
                                </th>
                                <th
                                    className="px-5 py-3.5 text-left cursor-pointer select-none group"
                                    onClick={() => handleSort("description")}
                                >
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                                        Deskripsi <SortIcon field="description" sortBy={sortBy} sortDir={sortDir} />
                                    </span>
                                </th>
                                <th
                                    className="px-5 py-3.5 text-left cursor-pointer select-none group"
                                    onClick={() => handleSort("activity_type")}
                                >
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                                        Tipe <SortIcon field="activity_type" sortBy={sortBy} sortDir={sortDir} />
                                    </span>
                                </th>
                                <th
                                    className="px-5 py-3.5 text-left cursor-pointer select-none group"
                                    onClick={() => handleSort("created_at")}
                                >
                                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                                        <Clock size={12} /> Waktu <SortIcon field="created_at" sortBy={sortBy} sortDir={sortDir} />
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-16 text-gray-400">
                                        <Activity size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">Tidak ada log aktivitas</p>
                                        <p className="text-sm mt-1 text-gray-300">Coba ubah filter atau kata kunci pencarian</p>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log, idx) => {
                                    const typeConf = ACTIVITY_TYPE_CONFIG[log.activity_type] ?? ACTIVITY_TYPE_CONFIG.other;
                                    const roleConf = ROLE_CONFIG[log.user?.role] ?? ROLE_CONFIG.customer;
                                    return (
                                        <tr
                                            key={log.id}
                                            className="hover:bg-emerald-50/30 transition-colors duration-150 group"
                                            style={{ animationDelay: `${idx * 30}ms` }}
                                        >
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                                    #{log.id}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                                                        {log.user?.name ?? "—"}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${roleConf.bg} ${roleConf.color}`}>
                                                            {roleConf.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 max-w-xs">
                                                <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                                                    {log.description}
                                                </p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${typeConf.bg} ${typeConf.color}`}>
                                                    {typeConf.icon}
                                                    {typeConf.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    {formatDate(log.created_at)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta && !loading && logs.length > 0 && (
                    <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-xs text-gray-500">
                            Menampilkan <span className="font-semibold text-gray-700">{meta.from}–{meta.to}</span> dari{" "}
                            <span className="font-semibold text-gray-700">{meta.total}</span> log
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={15} />
                            </button>

                            {pageNumbers.map(num => (
                                <button
                                    key={num}
                                    onClick={() => setPage(num)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                        num === page
                                            ? "bg-emerald-600 text-white shadow-sm"
                                            : "border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300"
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;