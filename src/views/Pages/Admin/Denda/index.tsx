import { useState, useEffect } from "react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { Search, AlertCircle, Clock, CheckCircle2, User as UserIcon } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";

export default function Denda() {
    const api = useApiClient();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/transactions');
            const dataWithFines = (res.data.transactions || []).filter((t: any) => t.fine_amount > 0 || (t.status === 'in_use' && new Date(t.end_date) < new Date()));
            setTransactions(dataWithFines);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = transactions.filter((item: any) =>
        item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(item.id).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen font-['Outfit']">
            <Breadcrumb title="Sistem Denda" desc="Kelola keterlambatan pengembalian dan denda pelanggan" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari nama pemesan atau ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">Memuat data denda...</div>
                ) : filteredData.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
                        <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                        <p className="font-bold text-gray-800">Semua Tepat Waktu!</p>
                        <p className="text-sm">Tidak ada denda yang perlu ditagih saat ini.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pemesan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tenggat Waktu</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Keterlambatan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Denda</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.map((trx) => {
                                    const isOverdue = new Date(trx.end_date) < new Date() && trx.status === 'in_use';
                                    const daysLate = trx.fine_amount > 0 ? trx.fine_amount / 50000 : Math.ceil((new Date().getTime() - new Date(trx.end_date).getTime()) / (1000 * 60 * 60 * 24));
                                    
                                    return (
                                        <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                        <UserIcon size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{trx.user?.name}</p>
                                                        <p className="text-[10px] text-gray-500">Order #{trx.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                                                    <Clock size={14} className="text-gray-400" />
                                                    {trx.end_date}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold ${daysLate > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    {daysLate > 0 ? `${daysLate} Hari Terlambat` : 'Tepat Waktu'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-extrabold text-gray-900">
                                                    Rp {(trx.fine_amount || (isOverdue ? daysLate * 50000 : 0)).toLocaleString('id-ID')}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isOverdue ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                                        <AlertCircle size={10} /> Berjalan
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                                        <CheckCircle2 size={10} /> Selesai
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
