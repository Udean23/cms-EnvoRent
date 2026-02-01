import React, { useState } from 'react';
import { useCartStore } from '@/core/store/useCartStore';
import { Trash2, Plus, Minus, ArrowRight, Calendar, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, total } = useCartStore();
    const navigate = useNavigate();
    const [dates, setDates] = useState({ start: '', end: '' });

    const calculateDays = () => {
        if (!dates.start || !dates.end) return 1;
        const start = new Date(dates.start);
        const end = new Date(dates.end);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const days = calculateDays();
    const subtotal = total();
    const grandTotal = subtotal * days;

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link to="/catalogue" className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-700 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Catalogue
                    </Link>
                </div>

                <h1 className="text-3xl font-serif mb-8 text-stone-900">Your Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl text-center border border-stone-100 shadow-sm">
                        <h2 className="text-xl font-medium text-stone-900 mb-4">Your cart is empty</h2>
                        <Link to="/catalogue" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                            Start Browsing
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex gap-4 items-center">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-stone-100" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-stone-900">{item.name}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 uppercase">{item.type}</span>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-emerald-700 font-medium">Rp {item.price.toLocaleString('id-ID')} <span className="text-xs text-stone-400">/day</span></div>
                                            <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-white rounded shadow-sm"><Minus className="w-3 h-3" /></button>
                                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-white rounded shadow-sm"><Plus className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 sticky top-4">
                                <h3 className="font-bold text-lg mb-4">Rental Details</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">Pick-up Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                                            <input
                                                type="date"
                                                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                                                value={dates.start}
                                                onChange={(e) => setDates({ ...dates, start: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-stone-500 uppercase mb-1 block">Return Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                                            <input
                                                type="date"
                                                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm"
                                                value={dates.end}
                                                onChange={(e) => setDates({ ...dates, end: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-stone-100 pt-4 space-y-2 mb-6">
                                    <div className="flex justify-between text-sm text-stone-600">
                                        <span>Daily Rate</span>
                                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-stone-600">
                                        <span>Duration</span>
                                        <span>{days} Days</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-stone-900 pt-2 border-t border-stone-100 mt-2">
                                        <span>Total</span>
                                        <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    Checkout <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
