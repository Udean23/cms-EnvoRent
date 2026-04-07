import React, { useState } from 'react';
import { CreditCard, X, ShieldCheck } from 'lucide-react';
import { useApiClient } from '@/core/helpers/ApiClient';
import Swal from 'sweetalert2';

interface OfflinePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: number;
    amount: number;
    paymentFor: 'booking' | 'fine';
    onSuccess?: () => void;
    isOnline?: boolean;
}

export default function OfflinePaymentModal({ isOpen, onClose, transactionId, amount, paymentFor, onSuccess, isOnline = false }: OfflinePaymentModalProps) {
    const api = useApiClient();
    const [loading, setLoading] = useState(false);
    const now = new Date();
    const currentExpiry = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}`;

    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: currentExpiry,
        cvv: '',
        bankName: 'BCA'
    });

    if (!isOpen) return null;

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'cardNumber') {
            setFormData(prev => ({ ...prev, [name]: formatCardNumber(value) }));
        } else if (name === 'expiry') {
            setFormData(prev => ({ ...prev, [name]: formatExpiry(value) }));
        } else if (name === 'cvv') {
            const v = value.replace(/\D/g, '').substring(0, 4);
            setFormData(prev => ({ ...prev, [name]: v }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = isOnline ? '/payments/credit-card' : '/payments/offline';

        try {
            await api.post(endpoint, {
                transaction_id: transactionId,
                amount_paid: amount,
                payment_for: paymentFor,
                card_number: formData.cardNumber.replace(/\s/g, ''),
                expiry: formData.expiry,
                bank_name: formData.bankName
            });

            Swal.fire({
                icon: 'success',
                title: 'Pembayaran Berhasil',
                text: isOnline ? 'Pembayaran kartu kredit Anda telah berhasil diverifikasi.' : 'Pembayaran offline telah dicatat.',
                confirmButtonColor: '#10b981'
            }).then(() => {
                if (onSuccess) onSuccess();
                onClose();
            });

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Pembayaran Gagal',
                text: error.response?.data?.message || 'Terjadi kesalahan sistem'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-stone-800">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold">{isOnline ? 'Pembayaran Kartu / Visa' : 'Input Debit/Credit Card'}</h3>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 bg-emerald-50 rounded-lg p-4 flex items-start gap-3 border border-emerald-100">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-emerald-900">Pembayaran Aman</p>
                            <p className="text-xs text-emerald-700 mt-1">
                                Tagihan Anda sebesar <strong className="font-bold">Rp {amount.toLocaleString('id-ID')}</strong>. Data CVV tidak akan disimpan oleh sistem, hanya digunakan untuk validasi visual.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Pilih Bank</label>
                            <select 
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                            >
                                <option value="BCA">BCA</option>
                                <option value="Mandiri">Mandiri</option>
                                <option value="BNI">BNI</option>
                                <option value="BRI">BRI</option>
                                <option value="CIMB Niaga">CIMB Niaga</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Nomor Kartu</label>
                            <div className="relative">
                                <input 
                                    required
                                    type="text" 
                                    name="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    maxLength={19}
                                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors font-mono"
                                />
                                <CreditCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">Masa Berlaku</label>
                                <input 
                                    required
                                    type="text" 
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                    maxLength={5}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors font-mono text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-1.5">CVV / CVN</label>
                                <input 
                                    required
                                    type="password" 
                                    name="cvv"
                                    placeholder="•••"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    maxLength={4}
                                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors font-mono text-center tracking-[0.2em]"
                                />
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-stone-100">
                            <button
                                disabled={loading || formData.cardNumber.length < 15}
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? 'Memproses...' : `Bayar Rp ${amount.toLocaleString('id-ID')}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
