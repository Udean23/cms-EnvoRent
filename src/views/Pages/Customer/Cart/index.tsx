import { useState, useEffect, useMemo } from 'react';
import { useCartStore } from '@/core/store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, Calendar, ArrowLeft, ShoppingBag, Ticket, ChevronRight, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/core/helpers/ApiClient';
import Swal from 'sweetalert2';

export default function CartPage() {
    const api = useApiClient();
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity } = useCartStore();

    const [dates, setDates] = useState({ start: '', end: '' });
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

    useEffect(() => {
        api.get('/products').then(res => {
            setRecommendedProducts((res.data.products || []).slice(0, 4));
        });
        setSelectedItems(items.map(i => i.cartId!));
    }, []);

    const today = new Date().toISOString().split('T')[0];

    const toggleSelectItem = (cartId: string) => {
        setSelectedItems(prev =>
            prev.includes(cartId) ? prev.filter(i => i !== cartId) : [...prev, cartId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map(i => i.cartId!));
        }
    };

    const calculateDays = () => {
        if (!dates.start || !dates.end) return 1;
        const start = new Date(dates.start);
        const end = new Date(dates.end);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const days = calculateDays();
    const subtotal = useMemo(() => {
        return items
            .filter(item => selectedItems.includes(item.cartId!))
            .reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [items, selectedItems]);

    const grandTotal = subtotal * days;

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            Swal.fire('Oops!', 'Please select at least one item to checkout.', 'warning');
            return;
        }

        if (!dates.start || !dates.end) {
            Swal.fire('Rental Dates', 'Please select pickup and return dates.', 'info');
            return;
        }

        setLoading(true);
        try {
            const userRes = await api.get('/me');
            const userId = userRes.data.user.id;

            const payload = {
                user_id: userId,
                price: grandTotal,
                status: 'pending',
                materials: items
                    .filter(item => selectedItems.includes(item.cartId!))
                    .map(item => ({
                        product_id: item.type === 'product' ? item.id : null,
                        bundling_id: item.type === 'bundle' ? item.id : null,
                        quantity: item.quantity
                    }))
            };

            await api.post('/transactions', payload);

            Swal.fire({
                icon: 'success',
                title: 'Order Placed!',
                text: 'Your rental has been successfully processed.',
                timer: 2000,
                showConfirmButton: false
            });

            selectedItems.forEach(cartId => removeFromCart(cartId));
            navigate('/catalogue');
        } catch (error) {
            console.error('Checkout error:', error);
            Swal.fire('Error', 'Failed to process checkout. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans pb-32">
            {/* Header Sticky */}
            <div className="bg-white border-b border-stone-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 text-stone-500 hover:text-emerald-600 transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-stone-800">Keranjang Belanja <span className="text-sm font-normal text-stone-400">({items.length})</span></h1>
                    </div>
                    <Link to="/orders" className="text-emerald-600 font-bold text-sm hover:underline">
                        Pesanan Saya
                    </Link>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
                {items.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl text-center shadow-sm flex flex-col items-center">
                        <div className="w-32 h-32 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-16 h-16 text-stone-200" />
                        </div>
                        <h2 className="text-xl font-bold text-stone-900 mb-2">Wah, keranjangmu masih kosong</h2>
                        <p className="text-stone-400 mb-8 max-w-xs">Ayo cari gear adventure impianmu dan mulai petualangan baru!</p>
                        <Link to="/catalogue" className="bg-emerald-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Items List */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                            {items.map((item, idx) => (
                                <div
                                    key={item.cartId}
                                    className={`p-5 flex gap-4 transition-colors ${idx !== items.length - 1 ? 'border-b border-stone-50' : ''} ${selectedItems.includes(item.cartId!) ? 'bg-white' : 'bg-stone-50/30'}`}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.cartId!)}
                                            onChange={() => toggleSelectItem(item.cartId!)}
                                            className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                                        />
                                    </div>
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-50">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-stone-800 truncate text-lg pr-4">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.cartId!)}
                                                className="text-stone-300 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-bold uppercase tracking-wider">{item.type}</span>
                                        </div>
                                        <div className="mt-auto flex justify-between items-end">
                                            <div className="flex flex-col">
                                                <span className="text-emerald-700 font-black text-lg">Rp {item.price.toLocaleString('id-ID')}</span>
                                            </div>
                                            <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.cartId!, item.quantity - 1)}
                                                    className="w-9 h-9 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-500"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <div className="w-10 text-center font-bold text-stone-800 border-x border-stone-100">{item.quantity}</div>
                                                <button
                                                    onClick={() => updateQuantity(item.cartId!, item.quantity + 1)}
                                                    className="w-9 h-9 flex items-center justify-center hover:bg-stone-50 transition-colors text-stone-500"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Rental Period Card */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                            <h3 className="font-extrabold text-stone-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-600" /> Atur Periode Sewa
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest px-1">Tgl Pickup</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                                        value={dates.start}
                                        min={today}
                                        onChange={(e) => setDates({ ...dates, start: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2 relative">
                                     <div className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-stone-100 shadow-sm items-center justify-center z-10 text-stone-300">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    <label className="text-xs font-black text-stone-400 uppercase tracking-widest px-1">Tgl Kembali</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                                        value={dates.end}
                                        min={dates.start || today}
                                        onChange={(e) => setDates({ ...dates, end: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <Info className="w-5 h-5 text-stone-300" />
                                <p className="text-xs text-stone-500">Durasi sewa Anda adalah <span className="font-bold text-stone-900">{days} hari</span>. Harga akan dikalkulasi berdasarkan durasi ini.</p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-stone-900">Rekomendasi Untuk Kamu</h2>
                                <Link to="/catalogue" className="text-emerald-600 font-bold text-sm">Lihat Semua</Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {recommendedProducts.map((p) => (
                                    <Link key={p.id} to="/catalogue" className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-stone-50">
                                        <div className="aspect-square bg-stone-50 relative overflow-hidden">
                                            <img
                                                src={p.image ? `http://localhost:8000/storage/${p.image}` : `https://via.placeholder.com/150`}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-3 bg-white">
                                            <h4 className="text-xs font-bold text-stone-800 truncate mb-1">{p.name}</h4>
                                            <p className="text-emerald-600 font-black text-sm">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-[8px] text-stone-300">99+ Tersewa</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>

            {items.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <div className="max-w-5xl mx-auto px-4 h-24 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={selectedItems.length === items.length}
                                onChange={toggleSelectAll}
                                className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                            />
                            <span className="text-sm font-bold text-stone-600 hidden sm:inline">Pilih Semua ({items.length})</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-stone-400">Total ({selectedItems.length} Produk):</span>
                                    <span className="text-2xl font-black text-emerald-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={loading || selectedItems.length === 0}
                                className={`px-10 h-14 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-lg shadow-xl ${loading || selectedItems.length === 0 ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-95'}`}
                            >
                                {loading ? 'Memproses...' : 'Checkout'}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div className="h-2 bg-emerald-600/5" />
                </div>
            )}
        </div>
    );
}
