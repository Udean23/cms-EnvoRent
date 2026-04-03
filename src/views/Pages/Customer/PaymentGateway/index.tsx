import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiClient } from '@/core/helpers/ApiClient';
import { ShieldCheck, Loader2, CheckCircle2, ChevronLeft, Building2, Copy } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MockPaymentGateway() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const api = useApiClient();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('select_method');
    const [selectedMethod, setSelectedMethod] = useState<any>(null);
    const [vaNumber, setVaNumber] = useState('');

    useEffect(() => {
        if (!token) {
            navigate('/orders');
        }
    }, [token, navigate]);

    const paymentMethods = [
        { id: 'bca', name: 'BCA Virtual Account', type: 'bank_transfer', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'bank_transfer', icon: Building2, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 'bni', name: 'BNI Virtual Account', type: 'bank_transfer', icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
        { id: 'bri', name: 'BRIVA', type: 'bank_transfer', icon: Building2, color: 'text-blue-800', bg: 'bg-blue-100' },
    ];

    const handleSelectMethod = (method: any) => {
        setSelectedMethod(method);
        if (method.type === 'bank_transfer') {
            setVaNumber(Math.floor(10000000000000 + Math.random() * 90000000000000).toString());
            setStatus('pending_payment');
        } else if (method.type === 'qris') {
            setStatus('pending_payment');
        } else if (method.type === 'credit_card') {
            setStatus('pending_payment');
        }
    };

    const handlePay = async () => {
        setLoading(true);
        try {
            await api.post('/payments/webhook', {
                order_id: token,
                transaction_status: 'settlement',
                payment_type: selectedMethod.type,
                fraud_status: 'accept',
            });
            setStatus('success');
            setTimeout(() => {
                navigate('/orders');
                Swal.fire('Pembayaran Berhasil', 'Pesanan Anda sudah dibayar.', 'success');
            }, 2000);
        } catch (error) {
            Swal.fire('Error', 'Gagal memproses pembayaran.', 'error');
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(vaNumber);
        Swal.fire({
            icon: 'success',
            title: 'Tersalin!',
            text: 'Nomor Virtual Account telah disalin',
            timer: 1500,
            showConfirmButton: false
        });
    };

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center font-sans p-4">
            <div className="bg-white max-w-md w-full rounded-[2rem] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500 flex flex-col max-h-[90vh]">
                <div className="bg-emerald-600 p-6 flex flex-col text-white relative shrink-0">
                    {status === 'pending_payment' && (
                        <button onClick={() => setStatus('select_method')} className="absolute top-6 left-6 p-1 hover:bg-white/20 rounded-lg transition">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    <ShieldCheck className="w-12 h-12 mx-auto opacity-90 mb-2" />
                    <h1 className="text-xl font-black font-serif text-center">EnvoRent Pay</h1>
                    <p className="text-emerald-100 text-xs text-center">Secure Payment Gateway</p>
                </div>
                
                <div className="overflow-y-auto flex-1 p-6">
                    {status === 'success' ? (
                        <div className="py-10 text-center space-y-6">
                            <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto animate-bounce" />
                            <h2 className="text-2xl font-bold text-stone-800">Pembayaran Berhasil!</h2>
                            <p className="text-stone-500">Mengarahkan kembali ke pesanan Anda...</p>
                        </div>
                    ) : status === 'select_method' ? (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Order ID</p>
                                <p className="font-black text-stone-900 text-lg">{token}</p>
                            </div>
                            
                            <h3 className="font-bold text-stone-800 border-b border-stone-100 pb-2">Pilih Metode Pembayaran</h3>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div 
                                        key={method.id} 
                                        onClick={() => handleSelectMethod(method)}
                                        className="flex items-center gap-4 p-4 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all bg-white group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.bg}`}>
                                            <method.icon className={`w-6 h-6 ${method.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-stone-800 group-hover:text-emerald-700 transition-colors">{method.name}</p>
                                            <p className="text-[10px] text-stone-500 uppercase">{method.type.replace('_', ' ')}</p>
                                        </div>
                                        <ChevronLeft className="w-5 h-5 text-stone-300 rotate-180 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => navigate('/orders')}
                                className="w-full py-4 text-stone-400 hover:text-stone-600 text-sm font-bold transition-colors"
                            >
                                Batalkan Transaksi
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 py-2">
                            <div className="text-center space-y-2">
                                <h2 className="text-lg font-bold text-stone-800">Menunggu Pembayaran</h2>
                                <p className="text-sm text-stone-500">Selesaikan pembayaran Anda menggunakan <span className="font-bold text-emerald-600">{selectedMethod?.name}</span></p>
                            </div>

                            {selectedMethod?.type === 'bank_transfer' && (
                                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-center space-y-4">
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Nomor Virtual Account</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <h3 className="text-2xl font-black text-stone-900 tracking-widest">{vaNumber}</h3>
                                        <button onClick={copyToClipboard} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                            <Copy className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-stone-500">Gunakan ATM atau Mobile Banking untuk mentransfer ke nomor di atas.</p>
                                </div>
                            )}

                            {selectedMethod?.type === 'qris' && (
                                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-center space-y-4">
                                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Scan QR Code</p>
                                    <div className="w-48 h-48 bg-white mx-auto rounded-xl shadow-sm border border-stone-200 flex items-center justify-center p-4">
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MockQRIS" alt="QRIS" className="w-full h-full opacity-80" />
                                    </div>
                                    <p className="text-xs text-stone-500">Buka aplikasi e-wallet Anda dan scan kode QR ini.</p>
                                </div>
                            )}

                            {selectedMethod?.type === 'credit_card' && (
                                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-500 uppercase">Card Number</label>
                                        <input type="text" placeholder="4000 1234 5678 9010" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase">Expiry Date</label>
                                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-stone-500 uppercase">CVV</label>
                                            <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                                <p className="text-[10px] text-emerald-800 leading-relaxed">
                                    Ini adalah lingkungan simulasi yang aman. Menekan tombol di bawah ini akan memberikan instruksi bahwa Anda seolah-olah telah sukses melakukan pembayaran di platform asli.
                                </p>
                            </div>

                            <button 
                                onClick={handlePay} 
                                disabled={loading}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-600/30 active:scale-95 flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Simulasikan Sukses Bayar'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
