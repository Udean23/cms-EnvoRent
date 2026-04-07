import { useState, useEffect } from "react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { Search, AlertCircle, Clock, CheckCircle2, User as UserIcon, CreditCard, Printer, History } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import OfflinePaymentModal from "@/views/Components/OfflinePaymentModal";
import InvoiceModal from "@/views/Components/InvoiceModal";

export default function Denda() {
    const api = useApiClient();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const [showModal, setShowModal] = useState(false);
    const [selectedFine, setSelectedFine] = useState<{ id: number, amount: number } | null>(null);

    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [invoiceTransaction, setInvoiceTransaction] = useState<any>(null);

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

    const handleBayarDenda = (trxId: number, amount: number) => {
        setSelectedFine({ id: trxId, amount });
        setShowModal(true);
    };

    const handlePaymentSuccess = () => {
        if (selectedFine) {
            const txToInvoice = transactions.find(t => t.id === selectedFine.id);
            if (txToInvoice) {
                setInvoiceTransaction({ ...txToInvoice, fine_amount: selectedFine.amount });
                setInvoiceModalOpen(true);
            }
        }
        fetchTransactions();
    };

    const activeData = transactions.filter((t: any) =>
        t.fine_amount > 0 || (t.status === 'in_use' && new Date(t.end_date) < new Date())
    );

    const historyData = transactions.filter((t: any) =>
        t.status === 'done' && t.payments?.some((p: any) => p.payment_for === 'fine' && p.transaction_status === 'settlement')
    );

    const currentData = activeTab === 'active' ? activeData : historyData;

    const filteredData = currentData.filter((item: any) =>
        item.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(item.id).toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen font-['Outfit']">
            <Breadcrumb title="Sistem Denda" desc="Kelola keterlambatan pengembalian dan denda pelanggan" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'active' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            <AlertCircle size={16} />
                            Denda Aktif ({activeData.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            <History size={16} />
                            Riwayat Lunas ({historyData.length})
                        </button>
                    </div>
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
                        <p className="font-bold text-gray-800">{activeTab === 'active' ? 'Semua Tepat Waktu!' : 'Belum Ada Riwayat'}</p>
                        <p className="text-sm">{activeTab === 'active' ? 'Tidak ada denda yang perlu ditagih saat ini.' : 'Belum ada transaksi denda yang telah dilunasi.'}</p>
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
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.map((trx) => {
                                    const finePayment = trx.payments?.find((p: any) => p.payment_for === 'fine' && p.transaction_status === 'settlement');
                                    const paidFineAmount = finePayment ? finePayment.gross_amount : 0;
                                    const isOverdue = new Date(trx.end_date) < new Date() && trx.status === 'in_use';
                                    const daysLate = trx.fine_amount > 0 ? trx.fine_amount / 50000 : paidFineAmount > 0 ? paidFineAmount / 50000 : Math.ceil((new Date().getTime() - new Date(trx.end_date).getTime()) / (1000 * 60 * 60 * 24));
                                    const fineAmount = trx.fine_amount || paidFineAmount || (isOverdue ? daysLate * 50000 : 0);
                                    const needsPayment = trx.fine_amount > 0 && trx.status !== 'done';

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
                                                    Rp {fineAmount.toLocaleString('id-ID')}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {needsPayment ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                                        <AlertCircle size={10} /> Belum Lunas
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                                        <CheckCircle2 size={10} /> Lunas
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {needsPayment && (
                                                        <button
                                                            onClick={() => handleBayarDenda(trx.id, fineAmount)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                                                        >
                                                            <CreditCard size={14} />
                                                            Bayar
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setInvoiceTransaction({ ...trx, fine_amount: fineAmount || trx.fine_amount });
                                                            setInvoiceModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        <Printer size={14} />
                                                        Nota
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedFine && (
                <OfflinePaymentModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    transactionId={selectedFine.id}
                    amount={selectedFine.amount}
                    paymentFor="fine"
                    onSuccess={handlePaymentSuccess}
                />
            )}

            <InvoiceModal
                isOpen={invoiceModalOpen}
                onClose={() => setInvoiceModalOpen(false)}
                transaction={invoiceTransaction}
                type="fine"
            />
        </div>
    );
}
