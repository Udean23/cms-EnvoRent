import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Wallet, Shirt, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock, User as UserIcon, Printer } from "lucide-react";
import { Breadcrumb } from "@/views/Components/breadcrumb";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accepted: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    done: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const GlassCard = ({ children, className = "" }: any) => (
  <div className={`bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 print:shadow-none print:border-gray-100 print:bg-white ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, growth, icon: Icon, colorClass }: any) => (
  <GlassCard className="relative overflow-hidden group">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:scale-150 ${colorClass} print:hidden`}></div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {growth !== undefined && (
          <div className={`flex items-center mt-2 text-xs font-semibold ${growth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {growth >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
            {Math.abs(growth)}% <span className="text-gray-400 font-normal ml-1 print:hidden">dari bulan lalu</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10 text-current print:p-2`}>
        <Icon size={24} className={colorClass.replace("bg-", "text-")} />
      </div>
    </div>
  </GlassCard>
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="text-sm text-gray-500 font-medium animate-pulse">Menyiapkan Dashboard...</p>
        </div>
      </div>
    );
  }

  const revenueChartOptions: any = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Outfit, sans-serif' },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 4, colors: ["#10B981"] },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100, 100], colorStops: [{ offset: 0, color: '#10B981', opacity: 0.4 }, { offset: 100, color: '#10B981', opacity: 0 }] } },
    xaxis: { categories: data?.weekly_labels || [], labels: { style: { colors: "#94a3b8", fontSize: "12px" } }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { colors: "#94a3b8", fontSize: "12px" }, formatter: (val: number) => `${val / 1000}k` } },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4, xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
    tooltip: { theme: 'light', y: { formatter: (val: number) => formatRupiah(val) } },
    colors: ["#10B981"],
  };

  const donutOptions: any = {
    chart: { type: "donut", fontFamily: 'Outfit, sans-serif' },
    labels: data?.category_sales?.labels || [],
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"],
    legend: { position: "bottom", fontSize: "12px", markers: { radius: 12 } },
    plotOptions: { pie: { donut: { size: "75%", labels: { show: true, total: { show: true, label: "Total", formatter: (w: any) => w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0) } } } } },
    dataLabels: { enabled: false },
    stroke: { show: false }
  };

  const radialOptions: any = {
    chart: { type: "radialBar", fontFamily: 'Outfit, sans-serif' },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: "70%" },
        track: { background: "#f1f5f9", strokeWidth: "100%" },
        dataLabels: {
          name: { offsetY: -10, show: true, color: "#64748b", fontSize: "13px" },
          value: { formatter: (val: any) => `${val}%`, color: "#1e293b", fontSize: "22px", fontWeight: "700", show: true }
        }
      }
    },
    fill: { type: "gradient", gradient: { shade: "dark", type: "horizontal", gradientToColors: ["#34d399"], stops: [0, 100] } },
    stroke: { lineCap: "round" },
    labels: ["Target Sales"]
  };

  return (
    <div className="p-4 md:p-6 space-y-8 bg-[#f8fafc] min-h-screen font-['Outfit'] print:bg-white print:p-0">
      {/* Screen only header */}
      <div className="print:hidden space-y-4">
        <Breadcrumb title="Ringkasan Pasar" desc="Analisis mendalam performa bisnis EnvoRent Anda" />
        <button 
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
        >
          <Printer size={18} /> Cetak Laporan Penyewaan (PDF)
        </button>
      </div>

      {/* Print only detailed report */}
      <div className="hidden print:block font-['Outfit']">
          <div className="text-center border-b-2 border-gray-900 pb-6 mb-10 mt-2">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-gray-900">Official Rental Report</h1>
              <p className="text-gray-500 mt-2 font-semibold tracking-widest uppercase text-xs">Laporan Histori Penyewaan Selesai &bull; {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
          </div>
            
          <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 border-l-8 border-emerald-500 pl-4">Daftar Transaksi Selesai</h3>
                  <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Transaksi</p>
                      <p className="text-xl font-black text-gray-900">{data?.all_completed_rentals?.length || 0}</p>
                  </div>
              </div>
              <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <table className="w-full text-left bg-white border-collapse">
                      <thead>
                          <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b border-gray-100">
                              <th className="px-8 py-5">ID</th>
                              <th className="px-8 py-5">Pelanggan</th>
                              <th className="px-8 py-5">Barang Disewa</th>
                              <th className="px-8 py-5 text-center">Tanggal</th>
                              <th className="px-8 py-5 text-right">Total</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {data?.all_completed_rentals?.map((trx: any) => (
                              <tr key={trx.id} className="text-xs group hover:bg-gray-50/30 transition-colors">
                                  <td className="px-8 py-5 font-mono font-bold text-emerald-600">#{trx.id}</td>
                                  <td className="px-8 py-5 font-bold text-gray-900">{trx.customer}</td>
                                  <td className="px-8 py-5 text-gray-600 font-medium leading-relaxed max-w-xs">{trx.items}</td>
                                  <td className="px-8 py-5 text-center font-medium text-gray-500">{trx.date}</td>
                                  <td className="px-8 py-5 text-right font-black text-gray-900">{formatRupiah(trx.total)}</td>
                              </tr>
                          ))}
                      </tbody>
                      <tfoot>
                          <tr className="bg-gray-900 text-white border-t-4 border-emerald-500">
                              <td colSpan={4} className="px-8 py-6 text-right text-xs font-bold uppercase tracking-widest">Total Pendapatan Bersih:</td>
                              <td className="px-8 py-6 text-right text-xl font-black font-mono">
                                  {formatRupiah(data?.all_completed_rentals?.reduce((sum: number, t: any) => sum + t.total, 0) || 0)}
                              </td>
                          </tr>
                      </tfoot>
                  </table>
              </div>
          </div>

          <div className="flex justify-between items-end mt-16 px-4">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest space-y-1">
                  <p>EnvoRent Security Paper</p>
                  <p>Audit ID: {Math.random().toString(36).substring(2, 12).toUpperCase()}</p>
              </div>
              <div className="text-center w-48 border-t-2 border-gray-900 pt-2">
                  <p className="text-[10px] font-bold text-gray-900 uppercase">Administrator</p>
              </div>
          </div>
      </div>

      {/* Screen only dashboard content */}
      <div className="print:hidden space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Pendapatan Bulanan" value={formatRupiah(data?.revenue_this_month || 0)} growth={data?.revenue_growth} icon={Wallet} colorClass="bg-emerald-500" />
          <StatCard label="Total Pesanan" value={data?.total_pesanan || 0} growth={5.2} icon={ShoppingBag} colorClass="bg-blue-500" />
          <StatCard label="Pelanggan Aktif" value={data?.total_pelanggan || 0} growth={12.5} icon={Users} colorClass="bg-amber-500" />
          <StatCard label="Total Produk" value={data?.total_produk || 0} icon={Shirt} colorClass="bg-rose-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <GlassCard className="lg:col-span-8 overflow-hidden pointer-events-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Analitik Pendapatan</h3>
                <p className="text-sm text-gray-500">Performa pendapatan 7 hari terakhir</p>
              </div>
            </div>
            <div className="h-[300px] -ml-4">
              <ApexCharts options={revenueChartOptions} series={[{ name: "Pendapatan", data: data?.weekly_sales || [] }]} type="area" height={320} />
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Target Bulanan</h3>
            <p className="text-sm text-gray-500 mb-4 font-normal px-4">Progres pencapaian target Rp 50jt bulan ini</p>
            <div className="w-full h-[280px]">
              <ApexCharts options={radialOptions} series={[data?.sales_progress || 0]} type="radialBar" height={300} />
            </div>
            <div className="mt-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-xs font-bold border border-emerald-100 uppercase tracking-wider">
              Tepat Waktu Untuk Selesai
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <GlassCard className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">Transaksi Terbaru</h3>
              <button className="text-emerald-600 font-bold text-sm hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-4">
                    <th className="pb-4 font-bold">Pelanggan</th>
                    <th className="pb-4 font-bold text-center">Status</th>
                    <th className="pb-4 font-bold text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/50">
                  {data?.recent_transactions?.map((t: any) => (
                    <tr key={t.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            <UserIcon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{t.customer}</p>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                              <Clock size={10} /> {t.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-4 text-right">
                        <p className="text-sm font-extrabold text-gray-900">{formatRupiah(t.amount)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-5">
             <h3 className="text-xl font-bold text-gray-900 mb-1">Performa Kategori</h3>
             <p className="text-sm text-gray-500 mb-8">Distribusi item terjual per kategori (Status: Selesai)</p>
             <div className="h-[300px]">
               <ApexCharts options={donutOptions} series={data?.category_sales?.series || []} type="donut" height={320} />
             </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Produk Unggulan</h2>
            <p className="text-sm text-gray-500">Katalog produk dengan performa terbaik bulan ini</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {data?.produk_terlaris?.map((item: any) => (
              <div key={item.id} className="group relative">
                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden mb-4 bg-gray-100 relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-2xl text-[10px] font-extrabold text-emerald-600 shadow-sm uppercase tracking-wider">
                    Tersedia
                  </div>
                </div>
                <div className="px-2">
                  <h4 className="font-bold text-gray-800 text-base mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 capitalize">Penjualan: {item.sold} Unit</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-[10px]">★</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
