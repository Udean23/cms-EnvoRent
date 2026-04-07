import { useEffect, useState } from 'react';
import { useApiClient } from '@/core/helpers/ApiClient';
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, CreditCard, Box, Package, Printer } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import InvoiceModal from '@/views/Components/InvoiceModal';
import XenditPaymentModal from '@/views/Components/XenditPaymentModal';

export default function OrdersPage() {
    const api = useApiClient();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [invoiceType, setInvoiceType] = useState<'booking' | 'fine'>('booking');

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentTarget, setPaymentTarget] = useState<{ id: number; amount: number; paymentFor: 'booking' | 'fine' } | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'invoice' | 'virtual_account'>('invoice');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const userRes = await api.get('/me');
            setUser(userRes.data.user);
            const userId = userRes.data.user.id;
            const res = await api.get('/transactions');
            const userOrders = (res.data.transactions || [])
                .filter((t: any) => t.user_id === userId)
                .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setTransactions(userOrders);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = (transactionId: number, amount: number) => {
        setPaymentTarget({ id: transactionId, amount, paymentFor: 'booking' });
        selectPaymentMethod();
    };

    const handlePayFine = (transactionId: number, fineAmount: number) => {
        setPaymentTarget({ id: transactionId, amount: fineAmount, paymentFor: 'fine' });
        selectPaymentMethod();
    };

    const selectPaymentMethod = () => {
        Swal.fire({
            title: 'Pilih Metode Pembayaran',
            html: `
                <div class="space-y-3">
                    <button id="invoice-btn" class="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl text-left transition-all">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-emerald-900">Invoice Xendit</div>
                                <div class="text-sm text-emerald-700">Bayar melalui link pembayaran</div>
                            </div>
                        </div>
                    </button>
                    <button id="va-btn" class="w-full p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl text-left transition-all">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="font-bold text-blue-900">Virtual Account</div>
                                <div class="text-sm text-blue-700">Transfer ke rekening bank</div>
                            </div>
                        </div>
                    </button>
                </div>
            `,
            showConfirmButton: false,
            showCancelButton: false,
            customClass: {
                popup: 'rounded-2xl'
            },
            didOpen: () => {
                document.getElementById('invoice-btn')?.addEventListener('click', () => {
                    setPaymentMethod('invoice');
                    setShowPaymentModal(true);
                    Swal.close();
                });
                document.getElementById('va-btn')?.addEventListener('click', () => {
                    setPaymentMethod('virtual_account');
                    setShowPaymentModal(true);
                    Swal.close();
                });
            }
        });
    };

    const handlePaymentSuccess = async () => {
        const userRes = await api.get('/me');
        const userId = userRes.data.user.id;
        const trRes = await api.get('/transactions');
        const userOrders = (trRes.data.transactions || [])
            .filter((t: any) => t.user_id === userId)
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setTransactions(userOrders);

        if (paymentTarget) {
            const updatedTx = userOrders.find((t: any) => t.id === paymentTarget.id);
            if (updatedTx) {
                if (paymentTarget.paymentFor === 'fine') {
                    openInvoice({ ...updatedTx, fine_amount: paymentTarget.amount }, 'fine');
                } else {
                    openInvoice(updatedTx, paymentTarget.paymentFor);
                }
            }
        }
    };

    const handleReturn = async (id: number) => {
        const result = await Swal.fire({
            title: 'Ajukan Pengembalian?',
            text: "Pastikan semua barang sudah siap untuk dikembalikan.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Ajukan!'
        });

        if (result.isConfirmed) {
            try {
                await api.post(`/transactions/return/${id}`);
                Swal.fire('Berhasil', 'Permintaan pengembalian telah diajukan.', 'success');
                fetchOrders();
            } catch (error) {
                Swal.fire('Error', 'Gagal mengajukan pengembalian.', 'error');
            }
        }
    };

    const openInvoice = (transaction: any, type: 'booking' | 'fine') => {
        setSelectedInvoice(transaction);
        setInvoiceType(type);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: 'Diproses', color: 'bg-amber-100 text-amber-700', icon: Clock };
            case 'accepted':
                return { label: 'Siap Dibayar', color: 'bg-blue-100 text-blue-700', icon: CreditCard };
            case 'in_use':
                return { label: 'Sedang Disewa', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
            case 'in_progress':
                return { label: 'Menunggu Persetujuan', color: 'bg-stone-100 text-stone-700', icon: RefreshCw };
            case 'returned':
                return { label: 'Selesai', color: 'bg-stone-200 text-stone-500', icon: Box };
            case 'done':
                return { label: 'Tuntas', color: 'bg-stone-200 text-stone-500', icon: Box };
            case 'declined':
                return { label: 'Ditolak', color: 'bg-rose-100 text-rose-700', icon: AlertCircle };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-700', icon: AlertCircle };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfbf9]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-stone-500 font-bold animate-pulse">Menghubungkan ke EnvoRent...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfbf9] font-sans pb-20 text-stone-800">
            <div className="bg-white border-b border-stone-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/catalogue')} className="p-2 text-stone-500 hover:text-emerald-600 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-black text-stone-900">Riwayat Pesanan</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {transactions.length === 0 ? (
                    <div className="bg-white p-16 rounded-[2.5rem] text-center shadow-sm flex flex-col items-center border border-stone-100">
                        <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-8">
                            <ShoppingBag className="w-16 h-16 text-stone-200" />
                        </div>
                        <h2 className="text-2xl font-black text-stone-900 mb-2">Belum ada pesanan</h2>
                        <p className="text-stone-400 mb-8 max-w-sm">Jelajahi gear petualangan kami dan buat pesanan pertama Anda sekarang!</p>
                        <Link to="/catalogue" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
                            Cari Produk
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {transactions.map((t) => {
                            const { label, color, icon: Icon } = getStatusConfig(t.status);

                            const finePayment = t.payments?.find((p: any) => p.payment_for === 'fine' && p.transaction_status === 'settlement');
                            const paidFineAmount = finePayment ? finePayment.gross_amount : 0;
                            const isOverdue = new Date(t.end_date) < new Date() && t.status === 'in_use';
                            const daysLate = t.fine_amount > 0 ? t.fine_amount / 50000 : paidFineAmount > 0 ? paidFineAmount / 50000 : Math.ceil((new Date().getTime() - new Date(t.end_date).getTime()) / (1000 * 60 * 60 * 24));
                            const fineAmount = t.fine_amount || paidFineAmount || (isOverdue ? daysLate * 50000 : 0);
                            const hasFine = fineAmount > 0;
                            const isLateOrFined = t.fine_amount > 0 && t.status !== 'done';

                            return (
                                <div key={t.id} className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6 border-b border-stone-50 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Order ID: #{t.id}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${color}`}>
                                                        {label}
                                                    </span>
                                                    {isLateOrFined && (
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-rose-100 text-rose-700">
                                                            Terlambat
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-stone-400 font-medium mt-1">
                                                    {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-300 block mb-1">Total Pembayaran</span>
                                            <span className="text-xl font-black text-emerald-800">Rp {Number(t.price).toLocaleString('id-ID')}</span>
                                            {hasFine && (
                                                <div className="mt-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-300 block mb-0.5">Denda Telat</span>
                                                    <span className="text-sm font-black text-rose-600">Rp {Number(fineAmount).toLocaleString('id-ID')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-stone-50/30 font-sans">
                                        <div className="space-y-3">
                                            {t.materials?.map((m: any, idx: number) => (
                                                <div key={idx} className="flex flex-col gap-2 p-3 bg-white rounded-2xl border border-stone-100 shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                            {m.product ? <Package className="w-6 h-6 text-stone-300" /> : <Box className="w-6 h-6 text-emerald-300" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-stone-800 truncate">{m.product?.name || m.bundling?.name}</p>
                                                            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Quantity: {m.quantity}</p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-[10px] text-stone-300 font-bold uppercase tracking-tight">Price</p>
                                                            <p className="text-sm font-black text-stone-600">Rp {Number(m.product?.price || m.bundling?.price || 0).toLocaleString('id-ID')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-wrap justify-end items-center gap-4">
                                        {!['pending', 'accepted', 'declined'].includes(t.status) && (
                                            <button
                                                onClick={() => openInvoice(t, 'booking')}
                                                className="px-6 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200 transition-colors flex items-center gap-2"
                                            >
                                                <Printer size={16} /> Nota Sewa
                                            </button>
                                        )}
                                        {paidFineAmount > 0 && (
                                            <button
                                                onClick={() => openInvoice({ ...t, fine_amount: fineAmount }, 'fine')}
                                                className="px-6 py-2.5 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs hover:bg-stone-200 transition-colors flex items-center gap-2"
                                            >
                                                <Printer size={16} /> Nota Denda
                                            </button>
                                        )}

                                        {t.status === 'pending' && (
                                            <button disabled className="px-8 py-3 rounded-xl bg-stone-100 text-stone-400 font-black text-sm cursor-not-allowed">
                                                Diproses
                                            </button>
                                        )}
                                        {t.status === 'accepted' && (
                                            <button
                                                onClick={() => handlePayment(t.id, Number(t.price))}
                                                className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                                            >
                                                Bayar Barang <ArrowRight size={18} />
                                            </button>
                                        )}
                                        {t.status === 'in_use' && !hasFine && (
                                            <button
                                                onClick={() => handleReturn(t.id)}
                                                className="px-8 py-3 rounded-xl border-2 border-emerald-600 text-emerald-600 font-black text-sm hover:bg-emerald-50 transition-all active:scale-95"
                                            >
                                                Ajukan Pengembalian
                                            </button>
                                        )}
                                        {t.status === 'in_progress' && !hasFine && (
                                            <div className="flex items-center gap-2 px-6 py-2 bg-stone-100 rounded-xl">
                                                <RefreshCw size={16} className="text-stone-400 animate-spin" />
                                                <span className="text-xs font-black text-stone-400 uppercase">Menunggu Persetujuan Return</span>
                                            </div>
                                        )}

                                        {isLateOrFined && (
                                            <button
                                                onClick={() => handlePayFine(t.id, fineAmount)}
                                                className="px-8 py-3 rounded-xl bg-rose-600 text-white font-black text-sm hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95"
                                            >
                                                Bayar Denda ({daysLate} Hari)
                                            </button>
                                        )}

                                        {(t.status === 'returned' || t.status === 'done') && !isLateOrFined && (
                                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] px-4">TRANSAKSI TUNTAS</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {paymentTarget && user && (
                <XenditPaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    transactionId={paymentTarget.id}
                    amount={paymentTarget.amount}
                    paymentFor={paymentTarget.paymentFor}
                    customerEmail={user.email}
                    customerName={user.name}
                    onSuccess={handlePaymentSuccess}
                    paymentMethod={paymentMethod}
                />
            )}

            <InvoiceModal
                isOpen={selectedInvoice !== null}
                onClose={() => setSelectedInvoice(null)}
                transaction={selectedInvoice}
                type={invoiceType}
            />
        </div>
    );
}