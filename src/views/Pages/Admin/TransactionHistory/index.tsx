import { useState, useEffect } from "react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { Search, ChevronLeft, ChevronRight, Filter, Calendar, Package, Box, Archive } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";

export default function TransactionHistory() {
    const api = useApiClient();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 7;

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/transactions');
            // Filter only completed or declined
            const historyData = (res.data.transactions || []).filter((t: any) => 
                t.status === 'done' || t.status === 'declined' || t.status === 'returned'
            );
            setTransactions(historyData);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "done": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "returned": return "bg-blue-100 text-blue-800 border-blue-200";
            case "declined": return "bg-red-100 text-red-800 border-red-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "done": return "Selesai";
            case "returned": return "Selesai (Dikembalikan)";
            case "declined": return "Dibatalkan / Ditolak";
            default: return status;
        }
    };

    const filteredData = transactions
        .filter((item: any) =>
            item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            String(item.id).toLowerCase().includes(search.toLowerCase())
        )
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="p-4 md:p-8 space-y-8 bg-[#f8f9fa] min-h-screen font-sans shrink-0">
            <Breadcrumb title="Riwayat Transaksi" desc="Arsip transaksi penyewaan yang telah selesai maupun dibatalkan" />

            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-6 border-b border-stone-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-stone-50/50">
                    <div className="relative w-full lg:w-1/3">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Cari Order ID atau nama pemesan..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-stone-800 placeholder:text-stone-400 shadow-sm"
                        />
                    </div>
                    <div className="flex gap-3 w-full lg:w-auto">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-stone-200 rounded-2xl hover:bg-stone-50 text-stone-600 font-bold text-sm transition-all shadow-sm">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            Tanggal
                        </button>
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-stone-200 rounded-2xl hover:bg-stone-50 text-stone-600 font-bold text-sm transition-all shadow-sm">
                            <Filter className="w-4 h-4 text-stone-400" />
                            Status
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                        <div className="w-10 h-10 border-4 border-stone-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
                        <p className="font-medium text-sm">Memuat data histori...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-stone-400 text-center px-4">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                            <Archive className="w-10 h-10 text-stone-300" />
                        </div>
                        <h3 className="font-bold text-stone-800 text-lg mb-1">Tidak Ada Data</h3>
                        <p className="text-sm">Tidak ditemukan histori transaksi yang sesuai kriteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-stone-50/80 border-b border-stone-100">
                                    <th className="px-6 py-5 text-left text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap">Order ID Date</th>
                                    <th className="px-6 py-5 text-left text-[11px] font-black text-stone-500 uppercase tracking-widest">Customer Info</th>
                                    <th className="px-6 py-5 text-left text-[11px] font-black text-stone-500 uppercase tracking-widest">Items Detail</th>
                                    <th className="px-6 py-5 text-left text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap">Grand Total</th>
                                    <th className="px-6 py-5 text-left text-[11px] font-black text-stone-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {paginatedData.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <p className="font-black text-stone-800 mb-1">#{trx.id}</p>
                                            <p className="text-[11px] font-medium text-stone-400">{new Date(trx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                            <p className="text-[10px] text-stone-400">{new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0">
                                                    {trx.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-stone-800">{trx.user?.name}</p>
                                                    <p className="text-xs text-stone-500">{trx.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-2 max-w-sm">
                                                {trx.materials?.map((m: any, idx: number) => (
                                                    <div key={idx} className="flex items-start gap-2 text-xs">
                                                        <div className="mt-0.5 w-5 h-5 rounded bg-white border border-stone-200 flex items-center justify-center flex-shrink-0">
                                                            {m.product ? <Package className="w-3 h-3 text-stone-400" /> : <Box className="w-3 h-3 text-emerald-500" />}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-stone-700 truncate">{m.product?.name || m.bundling?.name} <span className="text-stone-400 font-normal">x{m.quantity}</span></span>
                                                            {m.bundling && m.bundling.materials && (
                                                                <div className="pl-2 border-l border-emerald-200 mt-1 space-y-0.5">
                                                                    {m.bundling.materials.map((bm: any, bIdx: number) => (
                                                                        <div key={bIdx} className="text-[9px] text-stone-500 flex justify-between gap-2">
                                                                            <span className="truncate">- {bm.product?.name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="font-black text-emerald-700 text-base flex items-center gap-1">
                                                <span className="text-xs font-bold text-emerald-500">Rp</span> {Number(trx.price).toLocaleString("id-ID")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusColor(trx.status)}`}>
                                                {getStatusLabel(trx.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-6 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
                    <p className="text-sm font-medium text-stone-500">
                        Menampilkan <span className="font-bold text-stone-800">{filteredData.length === 0 ? 0 : (page - 1) * itemsPerPage + 1}</span> hingga <span className="font-bold text-stone-800">{Math.min(page * itemsPerPage, filteredData.length)}</span> dari <span className="font-bold text-stone-800">{filteredData.length}</span> entri
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border ${page === 1 ? 'border-stone-100 text-stone-300' : 'border-stone-200 text-stone-600 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'} transition-all`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border ${page === totalPages || totalPages === 0 ? 'border-stone-100 text-stone-300' : 'border-stone-200 text-stone-600 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'} transition-all`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
