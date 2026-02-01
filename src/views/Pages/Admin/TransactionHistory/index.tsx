import { useState } from "react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface Transaction {
    id: string;
    customer: string;
    date: string;
    total: number;
    status: "Success" | "Pending" | "Failed";
    paymentMethod: string;
}

const dummyTransactions: Transaction[] = [
    { id: "TRX-001", customer: "Budi Santoso", date: "2023-10-25 14:30", total: 150000, status: "Success", paymentMethod: "Cash" },
    { id: "TRX-002", customer: "Siti Aminah", date: "2023-10-25 10:15", total: 250000, status: "Pending", paymentMethod: "QRIS" },
    { id: "TRX-003", customer: "Rudi Hartono", date: "2023-10-24 16:45", total: 75000, status: "Failed", paymentMethod: "Transfer" },
    { id: "TRX-004", customer: "Dewi Lestari", date: "2023-10-24 09:20", total: 500000, status: "Success", paymentMethod: "Cash" },
    { id: "TRX-005", customer: "Andi Wijaya", date: "2023-10-23 13:10", total: 125000, status: "Success", paymentMethod: "QRIS" },
    { id: "TRX-006", customer: "Maya Sari", date: "2023-10-23 11:05", total: 300000, status: "Pending", paymentMethod: "Transfer" },
    { id: "TRX-007", customer: "Eko Prasetyo", date: "2023-10-22 15:50", total: 95000, status: "Success", paymentMethod: "Cash" },
    { id: "TRX-008", customer: "Rina Marlina", date: "2023-10-22 08:30", total: 450000, status: "Success", paymentMethod: "QRIS" },
    { id: "TRX-009", customer: "Dedi Susanto", date: "2023-10-21 17:15", total: 180000, status: "Failed", paymentMethod: "Transfer" },
    { id: "TRX-010", customer: "Nina Kurnia", date: "2023-10-21 14:40", total: 220000, status: "Success", paymentMethod: "Cash" },
];

const TransactionHistory = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const filteredData = dummyTransactions.filter((item) =>
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Success": return "bg-green-100 text-green-700";
            case "Pending": return "bg-yellow-100 text-yellow-700";
            case "Failed": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            <Breadcrumb title="Riwayat Transaksi" desc="Lihat dan kelola riwayat transaksi penjualan" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari ID atau nama pelanggan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors">
                            <Calendar className="w-4 h-4" />
                            <span>Filter Tanggal</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filter Status</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Transaksi</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelanggan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Metode</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{trx.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{trx.customer}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{trx.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{trx.paymentMethod}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Rp {trx.total.toLocaleString("id-ID")}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trx.status)}`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Menampilkan {Math.min((page - 1) * itemsPerPage + 1, filteredData.length)} - {Math.min(page * itemsPerPage, filteredData.length)} dari {filteredData.length} data
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
