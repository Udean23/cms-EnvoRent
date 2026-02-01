import React, { useState } from 'react';
import { useCartStore } from '@/core/store/useCartStore';
import { ArrowLeft, CheckCircle, CreditCard, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CheckoutPage() {
    const { total, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            clearCart();
            Swal.fire({
                icon: 'success',
                title: 'Order Placed!',
                text: 'Your rental request has been received. We will contact you shortly.',
                confirmButtonText: 'Back to Home',
                confirmButtonColor: '#059669'
            }).then(() => {
                navigate('/');
            });
        }, 2000);
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
                                    <input required type="text" className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Email Address</label>
                                    <input required type="email" className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Phone Number</label>
                                    <input required type="tel" className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">ID Card Number (KTP)</label>
                                    <input required type="text" className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                            <h3 className="font-bold text-lg mb-4">Payment Method</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-4 p-4 border border-emerald-200 bg-emerald-50 rounded-lg cursor-pointer transition-colors">
                                    <input type="radio" name="payment" defaultChecked className="text-emerald-600 focus:ring-emerald-500" />
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-emerald-700" />
                                        <span className="font-medium text-stone-900">Bank Transfer</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-4 p-4 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50 transition-colors">
                                    <input type="radio" name="payment" className="text-emerald-600 focus:ring-emerald-500" />
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-emerald-700" />
                                        <span className="font-medium text-stone-900">E-Wallet (GoPay/Ovo)</span>
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
        </div>
    );
}
