import { ArrowLeft, Printer, Package, CheckCircle2, Download } from 'lucide-react';
import { jsPDF } from "jspdf";

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: any;
    type: 'booking' | 'fine';
}

export default function InvoiceModal({ isOpen, onClose, transaction, type }: InvoiceModalProps) {
    if (!isOpen || !transaction) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("EnvoRent - Nota Pembayaran", 20, 20);

        doc.setFontSize(10);
        doc.text("Penyewaan Alat Camping Terpercaya", 20, 28);

        doc.setFontSize(12);
        doc.text(`No. Invoice: #INV-${isFine ? 'FINE' : 'BOOK'}-${transaction.id}`, 20, 42);
        doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 50);
        doc.text(`Nama Pelanggan: ${transaction.user?.name || 'Customer'}`, 20, 58);
        doc.text(`Email: ${transaction.user?.email || '-'}`, 20, 66);
        doc.text(`Tipe: ${isFine ? 'Pembayaran Denda' : 'Penyewaan Barang'}`, 20, 74);

        doc.line(20, 80, 190, 80);

        doc.setFontSize(12);
        doc.text("Detail Transaksi:", 20, 90);
        let yPos = 100;

        if (isFine) {
            doc.text(`Denda keterlambatan pesanan #${transaction.id}`, 20, yPos);
            yPos += 8;
            doc.text(`Jumlah Hari Terlambat: ${Math.ceil((transaction.fine_amount || 0) / 50000)} hari`, 20, yPos);
            yPos += 8;
            doc.text(`Tarif per Hari: Rp 50.000`, 20, yPos);
            yPos += 8;
            doc.text(`Total Denda: Rp ${(transaction.fine_amount || 0).toLocaleString('id-ID')}`, 20, yPos);
            yPos += 10;
        } else {
            transaction.materials?.forEach((mat: any) => {
                const name = mat.product?.name || mat.bundling?.name || 'Item';
                const price = mat.product?.price || mat.bundling?.price || 0;
                doc.text(`- ${name} (x${mat.quantity}) : Rp ${(price * mat.quantity).toLocaleString('id-ID')}`, 20, yPos);
                yPos += 8;
            });
        }

        doc.line(20, yPos + 2, 190, yPos + 2);

        const total = isFine ? transaction.fine_amount : transaction.price;
        doc.setFontSize(14);
        doc.text(`TOTAL DIBAYAR: Rp ${(total || 0).toLocaleString('id-ID')}`, 20, yPos + 14);

        doc.setFontSize(9);
        doc.text("Status: LUNAS", 20, yPos + 24);
        doc.text("Terima kasih telah menggunakan layanan EnvoRent.", 20, yPos + 34);
        doc.text("Lembar ini sah sebagai bukti pembayaran.", 20, yPos + 42);

        doc.save(`Nota_EnvoRent_${isFine ? 'Denda' : 'Sewa'}_${transaction.id}.pdf`);
    };

    const isFine = type === 'fine';
    const amount = isFine ? transaction.fine_amount : transaction.price;
    const daysLate = isFine ? Math.ceil((transaction.fine_amount || 0) / 50000) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0 print:block">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
                <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex justify-between items-center print:hidden">
                    <div className="flex items-center gap-2 text-stone-800">
                        <Package className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold">Nota Pembayaran</h3>
                    </div>
                    <button onClick={onClose} className="flex items-center gap-1 text-stone-500 hover:text-stone-700 transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                </div>

                <div className="p-8 print:p-4 max-h-[70vh] overflow-y-auto" id="printable-invoice">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-emerald-600 mb-1">EnvoRent</h2>
                            <p className="text-sm text-stone-500">Penyewaan Alat Camping Terpercaya</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xl font-bold text-stone-800 uppercase tracking-widest">INVOICE</h3>
                            <p className="text-sm text-stone-500 mt-1">#INV-{isFine ? 'FINE' : 'BOOK'}-{transaction.id}</p>
                            <p className="text-sm font-semibold text-emerald-600 mt-2 flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-4 h-4" /> LUNAS
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-8 border-y border-stone-100 py-6">
                        <div>
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Tagihan Untuk</h4>
                            <p className="font-bold text-stone-800">{transaction.user?.name}</p>
                            <p className="text-sm text-stone-600">{transaction.user?.email}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Detail Transaksi</h4>
                            <p className="text-sm text-stone-800">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
                            <p className="text-sm text-stone-800">Tipe: {isFine ? 'Pembayaran Denda' : 'Penyewaan Barang'}</p>
                            <p className="text-sm text-stone-800">Order: #{transaction.id}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-stone-200">
                                    <th className="pb-3 font-bold text-stone-800 text-sm">Deskripsi</th>
                                    {!isFine && <th className="pb-3 font-bold text-stone-800 text-sm text-center">Qty</th>}
                                    <th className="pb-3 font-bold text-stone-800 text-sm text-right">Harga</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {isFine ? (
                                    <>
                                        <tr>
                                            <td className="py-4 text-sm text-stone-600">
                                                Denda keterlambatan pengembalian pesanan #{transaction.id}
                                            </td>
                                            <td className="py-4 text-sm font-medium text-stone-800 text-right">
                                                Rp {(amount || 0).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-xs text-stone-400">
                                                Jumlah Hari Terlambat: {daysLate} hari × Rp 50.000/hari
                                            </td>
                                            <td></td>
                                        </tr>
                                    </>
                                ) : (
                                    transaction.materials?.map((mat: any, idx: number) => {
                                        const name = mat.product?.name || mat.bundling?.name || 'Item';
                                        const price = mat.product?.price || mat.bundling?.price || 0;
                                        return (
                                            <tr key={idx}>
                                                <td className="py-4 text-sm text-stone-600">{name}</td>
                                                <td className="py-4 text-sm text-stone-600 text-center">{mat.quantity}</td>
                                                <td className="py-4 text-sm font-medium text-stone-800 text-right">
                                                    Rp {(price * mat.quantity).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-1/2">
                            <div className="flex justify-between items-center py-4 border-t-2 border-stone-800">
                                <span className="font-bold text-stone-800">Total Dibayar</span>
                                <span className="text-xl font-bold text-emerald-600">Rp {(amount || 0).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center text-sm text-stone-400">
                        <p>Terima kasih telah menggunakan layanan EnvoRent.</p>
                        <p>Lembar ini sah sebagai bukti pembayaran yang sah.</p>
                    </div>
                </div>

                <div className="bg-stone-50 px-6 py-4 border-t border-stone-100 flex justify-between items-center print:hidden">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-stone-600 hover:bg-stone-200 bg-stone-100 rounded-lg font-bold transition-colors text-sm flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownloadPdf}
                            className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold transition-colors text-sm flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Simpan Nota
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors text-sm flex items-center gap-2"
                        >
                            <Printer className="w-4 h-4" /> Print Nota
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
