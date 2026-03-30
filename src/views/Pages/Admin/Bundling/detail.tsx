import { useState, useEffect } from "react";
import { ArrowLeft, Tag, Info, TrendingUp, DollarSign, Calendar, Box, Activity, ShieldCheck, Layers, Package } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { useApiClient } from "@/core/helpers/ApiClient";
import { motion } from "framer-motion";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const StatCard = ({ label, value, icon: Icon, colorClass, subtitle }: any) => (
  <div className="bg-white/60 border border-white/50 backdrop-blur-md rounded-3xl p-6 shadow-sm flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-10`}>
        <Icon size={22} className={colorClass.replace("bg-", "text-")} />
      </div>
      {subtitle && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{subtitle}</span>}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
    </div>
  </div>
);

const InfoRow = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3">
      <div className="text-gray-400">
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-gray-500">{label}</span>
    </div>
    <span className="text-sm font-black text-gray-800">{value}</span>
  </div>
);

export default function BundlingDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const apiClient = useApiClient();
    const [pkg, setPkg] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBundling = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/bundlings/${id}`);
                if (response.data && response.data.bundling) {
                    setPkg(response.data.bundling);
                }
            } catch (error) {
                console.error("Failed to fetch bundling detail", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchBundling();
    }, [id, apiClient]);

    const calculateBundleStock = (materials: any[]) => {
        if (!materials || materials.length === 0) return 0;
        const stocks = materials.map(m => {
            const pStock = m.product?.stock ?? 0;
            return Math.floor(pStock / m.quantity);
        });
        return Math.min(...stocks);
    };

    if (loading) {
        return (
            <div className="p-6 min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    <p className="text-gray-400 font-bold text-sm animate-pulse uppercase tracking-widest font-['Outfit']">Menyelami Data...</p>
                </div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="p-6 min-h-screen bg-[#f8fafc] font-['Outfit'] flex flex-col items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2.5rem] p-12 text-center max-w-md">
                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">404 - Not Found</h2>
                    <p className="text-gray-500 mt-2 mb-8">Data bundling tidak tersedia atau telah dihapus dari server.</p>
                    <button onClick={() => navigate(-1)} className="w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
                        <ArrowLeft size={18} /> Kembali ke Katalog
                    </button>
                </div>
            </div>
        );
    }

    const stock = calculateBundleStock(pkg.materials || []);
    const imageUrl = pkg.image 
        ? (pkg.image.startsWith('http') ? pkg.image : `http://localhost:8000/storage/${pkg.image}`)
        : "https://via.placeholder.com/600x800?text=No+Image";

    return (
        <div className="p-6 md:p-12 bg-[#f8fafc] min-h-screen font-['Outfit'] text-gray-900">
            <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button onClick={() => navigate(-1)} className="p-3 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-gray-900 transition-all group border-none cursor-pointer">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1 block">Konfigurasi Bundling Premium</span>
                            <h1 className="text-3xl font-black tracking-tight">{pkg.name}</h1>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Update Terakhir</span>
                        <div className="flex items-center gap-2 text-sm font-black text-gray-800">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(pkg.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-3 rounded-[3rem] shadow-2xl shadow-gray-200/50 relative group">
                            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-50 relative">
                                <img src={imageUrl} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm text-[10px] font-black uppercase text-emerald-600 tracking-widest border border-white/50">
                                        {pkg.category?.name || "Premium"}
                                    </div>
                                    <div className={`bg-gray-900/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm text-[10px] font-black uppercase text-white tracking-widest border border-white/10 ${stock === 0 ? 'text-rose-400' : ''}`}>
                                        Stok: {stock}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/10 rounded-xl">
                                        <TrendingUp size={20} className="text-indigo-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Komposisi Bundling</span>
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-3xl font-black">{pkg.materials?.length || 0}</p>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Produk Dalam Paket</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-indigo-400 italic">#{pkg.id}</p>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Registry ID</p>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-400 w-full rounded-full shadow-[0_0_15px_rgba(129,140,248,0.5)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                                <div className="space-y-1">
                                    <h2 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Deskripsi</h2>
                                    <div className="flex items-center gap-3 text-sm text-gray-400 font-bold">
                                        <Layers size={16} />
                                        <span>SKU Bundling: BNDL-{pkg.id.toString().padStart(4, '0')}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">{formatRupiah(pkg.price)}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Harga Paket / Hari</p>
                                </div>
                            </div>
                            
                            <p className="text-lg text-gray-500 font-medium leading-relaxed italic border-l-4 border-emerald-500/30 pl-8 py-2">
                                {pkg.description || "Paket bundling ini dirancang untuk memberikan nilai maksimal bagi penyewa dengan kombinasi produk yang saling melengkapi."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <StatCard label="Harga Sewa" value={formatRupiah(pkg.price)} icon={DollarSign} colorClass="bg-emerald-500" subtitle="Daily Rate" />
                            <StatCard label="Ketersediaan" value={`${stock} Paket`} icon={Box} colorClass="bg-blue-500" subtitle="Virtual Stock" />
                            <StatCard label="Kategori" value={pkg.category?.name || "Premium"} icon={Tag} colorClass="bg-purple-500" subtitle="Classification" />
                        </div>

                        <div className="bg-white/70 border border-white/50 backdrop-blur-xl rounded-[2.5rem] p-10 space-y-8 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-900 text-white rounded-2xl">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">Material Produk</h3>
                                    <p className="text-xs text-gray-400 font-bold">Daftar perangkat yang termasuk dalam paket ini</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {pkg.materials?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 group-hover:scale-110 transition-transform">
                                                <img src={item.product?.image ? `http://localhost:8000/storage/${item.product.image}` : "https://via.placeholder.com/50"} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-800 uppercase italic leading-none mb-1">{item.product?.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.product?.category?.name || "Equipment"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs font-black text-gray-900 italic">x{item.quantity} Unit</p>
                                                <p className="text-[9px] font-bold text-emerald-500 uppercase">{formatRupiah(item.product?.price)} / unit</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <ShieldCheck size={18} className="text-emerald-400" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">EnvoRent Bundling Intelligence System • 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}