import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Loader } from 'lucide-react';
import { useApiClient } from '@/core/helpers/ApiClient';
import Swal from 'sweetalert2';

interface XenditPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactionId: number;
    amount: number;
    paymentFor: 'booking' | 'fine';
    customerEmail: string;
    customerName: string;
    onSuccess?: () => void;
    paymentMethod: 'invoice' | 'virtual_account';
}

export default function XenditPaymentModal({
    isOpen,
    onClose,
    transactionId,
    amount,
    paymentFor,
    customerEmail,
    customerName,
    onSuccess,
    paymentMethod
}: XenditPaymentModalProps) {
    const api = useApiClient();
    const [loading, setLoading] = useState(false);
    const [bankCode, setBankCode] = useState<'BCA' | 'BNI' | 'MANDIRI' | 'BRI'>('BCA');
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [vaNumber, setVaNumber] = useState<string | null>(null);
    const [invoiceId, setInvoiceId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCreatePayment = async () => {
        setLoading(true);
        try {
            const payload = {
                transaction_id: transactionId,
                amount_paid: amount,
                payment_for: paymentFor,
                customer_email: customerEmail,
                customer_name: customerName,
            };

            let response;
            if (paymentMethod === 'invoice') {
                response = await api.post('/payments/invoice', payload);
                setPaymentUrl(response.data.payment_url);
                setInvoiceId(response.data.invoice_id);
            } else {
                response = await api.post('/payments/virtual-account', {
                    ...payload,
                    bank_code: bankCode,
                });
                setVaNumber(response.data.virtual_account_number);
                setInvoiceId(response.data.va_id);
            }

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Membuat Pembayaran',
                text: error.response?.data?.error || 'Terjadi kesalahan',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPayment = () => {
        if (paymentUrl) {
            window.open(paymentUrl, '_blank');
        }
    };

    const handleCopyVA = () => {
        if (vaNumber) {
            navigator.clipboard.writeText(vaNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePaid = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/payments/status/${transactionId}`);
            
            if (response.data.xendit_status === 'PAID') {
                Swal.fire({
                    icon: 'success',
                    title: 'Pembayaran Berhasil!',
                    text: 'Pembayaran Anda telah dikonfirmasi.',
                    confirmButtonColor: '#10b981'
                }).then(() => {
                    if (onSuccess) onSuccess();
                    onClose();
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Pembayaran Belum Dikonfirmasi',
                    text: `Status: ${response.data.xendit_status}`,
                });
            }
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal Mengecek Status',
                text: error.response?.data?.message || 'Terjadi kesalahan',
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
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold">
                            {paymentMethod === 'invoice' ? 'Pembayaran Xendit' : 'Transfer Bank VA'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 bg-emerald-50 rounded-lg p-4 flex items-start gap-3 border border-emerald-100">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-emerald-900">Pembayaran Aman</p>
                            <p className="text-xs text-emerald-700 mt-1">
                                Tagihan Anda sebesar <strong className="font-bold">Rp {amount.toLocaleString('id-ID')}</strong> akan diproses melalui Xendit.
                            </p>
                        </div>
                    </div>

                    {/* Initial State - Show form */}
                    {!paymentUrl && !vaNumber && (
                        <div className="space-y-4">
                            {paymentMethod === 'virtual_account' && (
                                <div>
                                    <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                                        Pilih Bank
                                    </label>
                                    <select
                                        value={bankCode}
                                        onChange={(e) => setBankCode(e.target.value as any)}
                                        disabled={loading}
                                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                                    >
                                        <option value="BCA">BCA</option>
                                        <option value="BNI">BNI</option>
                                        <option value="MANDIRI">Mandiri</option>
                                        <option value="BRI">BRI</option>
                                    </select>
                                </div>
                            )}

                            <div className="pt-4 border-t border-stone-100">
                                <button
                                    onClick={handleCreatePayment}
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Mempersiapkan...
                                        </>
                                    ) : (
                                        `Lanjutkan Pembayaran`
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Invoice Payment - Show payment link */}
                    {paymentUrl && paymentMethod === 'invoice' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm font-medium text-blue-900 mb-3">
                                    Link pembayaran sudah siap. Klik tombol di bawah untuk membuka halaman pembayaran Xendit.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleOpenPayment}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                                    >
                                        Buka Halaman Pembayaran
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg">
                                <p className="font-medium mb-1">Invoice ID:</p>
                                <p className="font-mono break-all">{invoiceId}</p>
                            </div>

                            <div className="pt-4 border-t border-stone-100 space-y-2">
                                <p className="text-sm text-stone-600">
                                    Setelah pembayaran berhasil, sistem akan otomatis mendeteksinya.
                                </p>
                                <button
                                    onClick={handlePaid}
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Mengecek...
                                        </>
                                    ) : (
                                        'Sudah Membayar? Klik di sini'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Virtual Account - Show VA number */}
                    {vaNumber && paymentMethod === 'virtual_account' && (
                        <div className="space-y-4">
                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                                <p className="text-xs text-emerald-600 font-medium mb-2 uppercase tracking-wide">
                                    Nomor Rekening Virtual Account
                                </p>
                                <div className="bg-white p-4 rounded border-2 border-emerald-300 font-mono text-lg font-bold text-center text-stone-900 break-all mb-3">
                                    {vaNumber}
                                </div>
                                <button
                                    onClick={handleCopyVA}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                                >
                                    {copied ? '✓ Disalin' : 'Salin Nomor'}
                                </button>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <p className="text-sm font-medium text-amber-900 mb-2">🏦 Cara Pembayaran:</p>
                                <ol className="text-xs text-amber-800 space-y-1 list-decimal list-inside">
                                    <li>Transfer ke nomor rekening di atas</li>
                                    <li>Gunakan nama: {customerName}</li>
                                    <li>Nominal harus tepat: Rp {amount.toLocaleString('id-ID')}</li>
                                    <li>Pembayaran akan dikonfirmasi otomatis</li>
                                </ol>
                            </div>

                            <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-lg">
                                <p className="font-medium mb-1">VA ID:</p>
                                <p className="font-mono break-all">{invoiceId}</p>
                            </div>

                            <div className="pt-4 border-t border-stone-100 space-y-2">
                                <p className="text-sm text-stone-600">
                                    Setelah transfer berhasil, klik tombol di bawah untuk memverifikasi.
                                </p>
                                <button
                                    onClick={handlePaid}
                                    disabled={loading}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            Memverifikasi...
                                        </>
                                    ) : (
                                        'Verifikasi Pembayaran'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
