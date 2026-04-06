import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { TrendingUp, Wallet, Banknote, History, Printer, Award, Package, Box } from "lucide-react";

export default function FinancialReport() {
    const api = useApiClient();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/reports/financial');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch report', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Memproses Laporan Keuangan...</div>;

    const chartOptions: any = {
        chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Outfit, sans-serif' },
        stroke: { curve: "smooth", width: 3, colors: ["#10B981"] },
        fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'], axisBorder: { show: false } },
        yaxis: { labels: { formatter: (v: number) => `Rp ${(v / 1000).toFixed(0)}k` } },
        colors: ["#10B981"],
        tooltip: { theme: 'light', y: { formatter: (v: number) => `Rp ${v.toLocaleString('id-ID')}` } },
    };

    const series = [{
        name: "Pendapatan Total",
        data: Array.from({ length: 12 }, (_, i) => {
            const found = data?.monthly_revenue?.find((m: any) => m.month === i + 1);
            return found ? parseFloat(found.revenue) : 0;
        })
    }];

    return (
        <div className="p-4 md:p-6 space-y-6 bg-[#f8fafc] min-h-screen font-['Outfit'] print:bg-white print:p-0 print:m-0">
            <div className="print:hidden">
                <Breadcrumb title="Laporan Keuangan" desc="Analisis pendapatan komprehensif dan performa item" />
            </div>

            <div className="flex justify-end gap-3 print:hidden">
                <button 
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-emerald-500/20"
                >
                    <Printer size={18} /> Cetak Laporan PDF
                </button>
            </div>

            <div className="hidden print:block text-center border-b-2 border-gray-900 pb-6 mb-10 mt-2">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900">EnvoRent Financial Report</h1>
                <p className="text-gray-500 mt-1 font-semibold tracking-widest uppercase text-[10px]">Official Audit Document &bull; {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-2 print:gap-4">
                {[
                    { label: "Total Pendapatan Sewa", value: data?.summary?.total_income, icon: TrendingUp, color: "bg-emerald-500" },
                    { label: "Total Pendapatan Denda", value: data?.summary?.total_fine, icon: Banknote, color: "bg-amber-500" },
                    { label: "Total Akhir (Revenue)", value: data?.summary?.grand_total, icon: Wallet, color: "bg-blue-500", highlight: true },
                    { label: "Jumlah Transaksi", value: data?.summary?.transaction_count, icon: History, color: "bg-rose-500", raw: true },
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-white/70 backdrop-blur-xl border border-white/40 p-6 rounded-[2rem] shadow-sm flex items-center gap-4 transition-all print:shadow-none print:border-gray-100 print:bg-white ${stat.highlight ? 'border-blue-200 bg-blue-50/50 print:bg-gray-50' : ''}`}>
                        <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg print:shadow-none print:p-2`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <h4 className="text-xl font-bold text-gray-900">
                                {stat.raw ? stat.value : `Rp ${Number(stat.value).toLocaleString('id-ID')}`}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
                <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-sm print:shadow-none print:border-none print:bg-white print:p-0 print:mb-10">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-500" /> Tren Pendapatan Bulanan
                    </h3>
                    <p className="text-xs text-gray-500 mb-8 font-normal">Data historis pendapatan sepanjang tahun berjalan</p>
                    <div className="print:h-auto">
                        <ApexCharts options={chartOptions} series={series} type="area" height={300} />
                    </div>
                </div>

                <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl border border-white/40 p-8 rounded-[2rem] shadow-sm print:shadow-none print:border-gray-100 print:bg-white print:p-6 print:mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Award size={20} className="text-amber-500" /> Barang Paling Laris
                    </h3>
                    <p className="text-xs text-gray-500 mb-6 font-normal">Top 5 item dengan frekuensi sewa tertinggi</p>
                    <div className="space-y-4">
                        {data?.best_sellers?.slice(0, 5).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 print:bg-white">
                                    {idx === 0 ? <Award size={20} className="text-amber-500" /> : <Package size={18} />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                    <div className="w-full bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden print:hidden">
                                        <div 
                                            className="h-full bg-amber-400 rounded-full" 
                                            style={{ width: `${(item.total_sold / data.best_sellers[0].total_sold) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-extrabold text-gray-900">{item.total_sold}</span>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Unit</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-sm overflow-hidden p-8 print:shadow-none print:border-gray-100 print:bg-white print:p-6 print:mt-10">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Box size={20} className="text-blue-500" /> Detail Performa Inventaris
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Peringkat</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Barang</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Total Terjual</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Performa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {data?.best_sellers?.map((item: any, idx: number) => (
                                <tr key={idx} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="py-4">
                                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td className="py-4 font-bold text-gray-800 text-sm">{item.name}</td>
                                    <td className="py-4 text-center font-bold text-gray-600 font-mono">{item.total_sold} Kali</td>
                                    <td className="py-4 text-right">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-extrabold uppercase">
                                            <TrendingUp size={12} /> Sangat Baik
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-400 font-medium">
                <p>Dokumen ini dihasilkan secara otomatis oleh Sistem EnvoRent.</p>
                <p>Verifikasi data keuangan per {new Date().getHours()}:{new Date().getMinutes()} {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
