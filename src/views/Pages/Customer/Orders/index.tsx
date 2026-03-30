import { useEffect, useState } from 'react';
import { useApiClient } from '@/core/helpers/ApiClient';
import { ShoppingBag, Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, RefreshCw, CreditCard, Box, Package } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

declare global {
    interface Window {
        snap: any;
    }
}

export default function OrdersPage() {
    const api = useApiClient();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute('data-client-key', "SB-Mid-client-T-dsnzl6aSpPNB0L");
        document.body.appendChild(script);

        fetchOrders();

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const userRes = await api.get('/me');
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

    const handlePayment = async (transactionId: number) => {
        try {
            const res = await api.post('/payments/checkout', { transaction_id: transactionId });
            const snapToken = res.data.snap_token;

            window.snap.pay(snapToken, {
                onSuccess: () => {
                    Swal.fire('Success', 'Pembayaran berhasil!', 'success');
                    fetchOrders();
                },
                onPending: () => {
                    Swal.fire('Info', 'Menunggu pembayaran...', 'info');
                    fetchOrders();
                },
                onError: () => {
                    Swal.fire('Error', 'Pembayaran gagal!', 'error');
                },
                onClose: () => {
                    console.log('Snap modal closed');
                }
            });
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Gagal memproses pembayaran', 'error');
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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: 'Diproses', color: 'bg-amber-100 text-amber-700', icon: Clock };
            case 'accepted':
                return { label: 'Siap Dibayar', color: 'bg-blue-100 text-blue-700', icon: CreditCard };
            case 'done':
                return { label: 'Sudah Dibayar', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
            case 'returning':
                return { label: 'Dalam Pengembalian', color: 'bg-stone-100 text-stone-700', icon: RefreshCw };
            case 'returned':
                return { label: 'Selesai', color: 'bg-stone-200 text-stone-500', icon: Box };
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
                                                </div>
                                                <p className="text-xs text-stone-400 font-medium mt-1">
                                                    {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-300 block mb-1">Total Pembayaran</span>
                                            <span className="text-xl font-black text-emerald-800">Rp {Number(t.price).toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-stone-50/30 font-sans">
                                        <div className="space-y-3">
                                            {t.materials?.map((m: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-stone-100 shadow-sm">
                                                    <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden">
                                                        {m.product ? <Package className="w-6 h-6 text-stone-300" /> : <Box className="w-6 h-6 text-emerald-300" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-stone-800 truncate">{m.product?.name || m.bundling?.name}</p>
                                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Quantity: {m.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-stone-300 font-bold uppercase tracking-tight">Price</p>
                                                        <p className="text-sm font-black text-stone-600">Rp {Number(m.product?.price || m.bundling?.price || 0).toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 flex justify-end items-center gap-4">
                                        {t.status === 'pending' && (
                                            <button disabled className="px-8 py-3 rounded-xl bg-stone-100 text-stone-400 font-black text-sm cursor-not-allowed">
                                                Diproses
                                            </button>
                                        )}
                                        {t.status === 'accepted' && (
                                            <button 
                                                onClick={() => handlePayment(t.id)}
                                                className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
                                            >
                                                Bayar Barang <ArrowRight size={18} />
                                            </button>
                                        )}
                                        {t.status === 'done' && (
                                            <button 
                                                onClick={() => handleReturn(t.id)}
                                                className="px-8 py-3 rounded-xl border-2 border-emerald-600 text-emerald-600 font-black text-sm hover:bg-emerald-50 transition-all active:scale-95"
                                            >
                                                Ajukan Pengembalian
                                            </button>
                                        )}
                                        {t.status === 'returning' && (
                                            <div className="flex items-center gap-2 px-6 py-2 bg-stone-100 rounded-xl">
                                                <RefreshCw size={16} className="text-stone-400 animate-spin" />
                                                <span className="text-xs font-black text-stone-400 uppercase">Menunggu Persetujuan Return</span>
                                            </div>
                                        )}
                                        {t.status === 'returned' && (
                                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">Penyewaan Telah Selesai</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
