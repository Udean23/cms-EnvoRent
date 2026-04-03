import { useState, useEffect } from "react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { Search, ChevronLeft, ChevronRight, CheckCircle2, Box, Package, RefreshCw, Archive } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";

export default function Pemesanan() {
    const api = useApiClient();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data.transactions || []);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        const result = await Swal.fire({
            title: 'Konfirmasi Tindakan',
            text: `Apakah Anda yakin ingin mengubah status pesanan menjadi ${newStatus}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Lanjutkan'
        });

        if (result.isConfirmed) {
            try {
                await api.post(`/transactions/accept/${id}`, { status: newStatus });
                Swal.fire('Berhasil', 'Status pesanan berhasil diperbarui.', 'success');
                fetchTransactions();
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'Gagal memperbarui status', 'error');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "done": return "bg-gray-100 text-gray-700";
            case "accepted": return "bg-blue-100 text-blue-700";
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "in_use": return "bg-emerald-100 text-emerald-700";
            case "in_progress": return "bg-orange-100 text-orange-700";
            case "returned": return "bg-stone-200 text-stone-600";
            case "declined": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "done": return "Selesai Tuntas";
            case "accepted": return "Menunggu Pembayaran";
            case "pending": return "Menunggu Persetujuan";
            case "in_use": return "Sedang Disewa";
            case "in_progress": return "Permintaan Pengembalian";
            case "returned": return "Telah Dikembalikan";
            case "declined": return "Pesanan Ditolak";
            default: return status;
        }
    };

    const filteredData = transactions.filter((item: any) =>
        item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(item.id).toLowerCase().includes(search.toLowerCase())
    ).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb title="Pemesanan" desc="Kelola permintaan pesanan dan pengembalian penyewaan dari pengguna" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari Order ID atau nama pemesan..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">Memuat data pesanan...</div>
                ) : filteredData.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Tidak ada data pesanan yang ditemukan.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pemesan</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Item Dipinjam</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi Petugas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedData.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">#{trx.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">{trx.user?.name}</span>
                                                <span className="text-xs text-gray-500">{trx.user?.email}</span>
                                                <span className="text-[10px] text-gray-400 mt-1">{new Date(trx.created_at).toLocaleString('id-ID')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {trx.materials?.map((m: any, idx: number) => (
                                                    <div key={idx} className="flex flex-col gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-gray-100 flex-shrink-0">
                                                                {m.product ? <Package className="w-4 h-4 text-gray-400" /> : <Box className="w-4 h-4 text-emerald-400" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-semibold text-gray-800 truncate">{m.product?.name || m.bundling?.name}</p>
                                                                <p className="text-[10px] text-gray-500">Qty: {m.quantity} &bull; Rp {Number(m.product?.price || m.bundling?.price || 0).toLocaleString('id-ID')}</p>
                                                            </div>
                                                        </div>
                                                        {m.bundling && m.bundling.materials && (
                                                            <div className="ml-11 mt-1 flex flex-col gap-1 border-l-2 border-emerald-100 pl-3">
                                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Isi Bundle:</p>
                                                                {m.bundling.materials.map((bm: any, bIdx: number) => (
                                                                    <div key={bIdx} className="flex justify-between items-center text-[10px]">
                                                                        <span className="text-gray-600 font-medium truncate pr-2">- {bm.product?.name}</span>
                                                                        <span className="text-gray-400 font-bold">x{bm.quantity * m.quantity}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                <div className="mt-1 pt-1 border-t border-gray-100 text-right">
                                                    <span className="text-[10px] text-gray-500">Total Harga: </span>
                                                    <span className="text-xs font-bold text-emerald-700">Rp {Number(trx.price).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(trx.status)}`}>
                                                {getStatusLabel(trx.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-y-2">
                                            {trx.status === 'pending' && (
                                                <div className="flex flex-col gap-2">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(trx.id, 'accepted')}
                                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" /> Setujui Pesanan
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(trx.id, 'declined')}
                                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200 transition"
                                                    >
                                                        Tolak Pesanan
                                                    </button>
                                                </div>
                                            )}
                                            {trx.status === 'in_progress' && (
                                                <button 
                                                    onClick={() => handleUpdateStatus(trx.id, 'done')}
                                                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition"
                                                >
                                                    <Archive className="w-4 h-4" /> Setujui & Selesaikan
                                                </button>
                                            )}
                                            {![ 'pending', 'in_progress' ].includes(trx.status) && (
                                                <span className="text-xs text-gray-400 italic block mt-2">- Menunggu pihak User -</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Menampilkan {filteredData.length === 0 ? 0 : (page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, filteredData.length)} dari {filteredData.length} data
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || totalPages === 0}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}