import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/core/store/useCartStore';
import { ArrowLeft, CheckCircle, CreditCard, Landmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useApiClient } from '@/core/helpers/ApiClient';
import XenditPaymentModal from '@/views/Components/XenditPaymentModal';

export default function CheckoutPage() {
    const { total, items, clearCart } = useCartStore();
    const navigate = useNavigate();
    const api = useApiClient();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('xendit_invoice');
    const [userId, setUserId] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [pendingTransactionId, setPendingTransactionId] = useState<number | null>(null);
    const [xenditPaymentType, setXenditPaymentType] = useState<'invoice' | 'virtual_account'>('invoice');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        cardNumber: '',
        expiry: '',
        bankName: 'BCA'
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/me');
                setUserId(res.data.user.id);
                setFormData(prev => ({
                    ...prev,
                    fullName: res.data.user.name || '',
                    email: res.data.user.email || '',
                    phoneNumber: res.data.user.phone || ''
                }));
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const transactionPayload = {
                user_id: userId || 1,
                price: total(),
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                materials: items.map(item => ({
                    [item.type === 'product' ? 'product_id' : 'bundling_id']: item.id,
                    quantity: item.quantity
                }))
            };

            const res = await api.post('/transactions', transactionPayload);
            const transactionRecord = res.data.transaction;

            setPendingTransactionId(transactionRecord.id);

            if (paymentMethod === 'xendit_invoice') {
                setXenditPaymentType('invoice');
                setShowModal(true);
            } else if (paymentMethod === 'xendit_va') {
                setXenditPaymentType('virtual_account');
                setShowModal(true);
            }

        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to checkout', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = () => {
        clearCart();
        Swal.fire({
            icon: 'success',
            title: 'Pembayaran Berhasil!',
            text: 'Pesanan Anda telah berhasil diproses.',
            confirmButtonColor: '#059669'
        }).then(() => {
            navigate('/orders');
        });
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <Link to="/cart" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-6 text-sm font-medium transition-colors w-fit">
                    <ArrowLeft className="w-4 h-4" /> Back to Cart
                </Link>
                <h1 className="text-3xl font-serif mb-8 text-stone-900">Checkout</h1>

                <form onSubmit={handleCheckout} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                            <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                            <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'xendit_invoice' ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                                    <input type="radio" name="payment" checked={paymentMethod === 'xendit_invoice'} onChange={() => setPaymentMethod('xendit_invoice')} className="text-emerald-600 focus:ring-emerald-500" />
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-emerald-700" />
                                        <div>
                                            <span className="font-medium text-stone-900 block">Xendit Invoice</span>
                                            <span className="text-xs text-stone-500">Kartu kredit, e-wallet, BNPL</span>
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'xendit_va' ? 'border-emerald-200 bg-emerald-50' : 'border-stone-200 hover:bg-stone-50'}`}>
                                    <input type="radio" name="payment" checked={paymentMethod === 'xendit_va'} onChange={() => setPaymentMethod('xendit_va')} className="text-emerald-600 focus:ring-emerald-500" />
                                    <div className="flex items-center gap-2">
                                        <Landmark className="w-5 h-5 text-emerald-700" />
                                        <div>
                                            <span className="font-medium text-stone-900 block">Transfer Bank Virtual Account</span>
                                            <span className="text-xs text-stone-500">BCA, BNI, Mandiri, BRI</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 sticky top-4">
                            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                            <p className="text-sm text-stone-500 mb-6">Review your items and rental duration in the cart before proceeding.</p>
                            <div className="flex justify-between items-center text-xl font-bold text-stone-900 py-4 border-t border-emerald-100">
                                <span>Total To Pay</span>
                                <span className="text-emerald-700">Rp {total().toLocaleString('id-ID')}</span>
                            </div>
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-all mt-4"
                            >
                                {loading ? 'Processing...' : 'Confirm Order'}
                                {!loading && <CheckCircle className="w-5 h-5" />}
                            </button>
                            <p className="text-xs text-stone-400 text-center mt-4">By clicking Confirm Order, you agree to our Rental Terms & Conditions.</p>
                        </div>
                    </div>
                </form>
            </div>

            {pendingTransactionId && (
                <XenditPaymentModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    transactionId={pendingTransactionId}
                    amount={total()}
                    paymentFor="booking"
                    customerEmail={formData.email}
                    customerName={formData.fullName}
                    onSuccess={handlePaymentSuccess}
                    paymentMethod={xenditPaymentType}
                />
            )}
        </div>
    );
}

