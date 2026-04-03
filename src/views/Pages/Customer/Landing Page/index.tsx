import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Instagram, Facebook, Twitter, Star, ChevronRight, ShoppingCart, Shield, Clock, Heart, Tent } from 'lucide-react';
import { useCartStore } from '@/core/store/useCartStore';
import { Link } from 'react-router-dom';
import { getToken } from '@/core/helpers/TokenHandle';
import { useAuth } from '@/core/hooks/useAuth';
import { useApiClient } from '@/core/helpers/ApiClient';

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const serviceBenefits = [
  { icon: Shield, title: "Kualitas Premium", description: "Hanya peralatan terbaik dan terawat untuk petualangan Anda." },
  { icon: Clock, title: "Sewa Fleksibel", description: "Harian, mingguan, atau durasi kustom sesuai kebutuhan Anda." },
  { icon: Heart, title: "Dukungan 24/7", description: "Tim kami siap membantu Anda kapan saja selama perjalanan." },
  { icon: Tent, title: "Paket Lengkap", description: "Paket lengkap agar Anda tidak melewatkan hal-hal penting." }
];

const howItWorks = [
  { step: "01", title: "Pilih Alat", description: "Lihat katalog kami dan pilih item atau paket yang Anda butuhkan." },
  { step: "02", title: "Pesan Online", description: "Pilih tanggal dan selesaikan proses pembayaran yang aman." },
  { step: "03", title: "Ambil Alat", description: "Ambil alat Anda di stasiun kami atau pilih layanan pengiriman." },
  { step: "04", title: "Mulai Petualangan", description: "Nikmati alam dengan tenang menggunakan peralatan premium kami." }
];

const reviews = [
  { id: 1, name: "Aris Munandar", role: "Solo Hiker", rating: 5, comment: "Gear-nya sangat terawat dan bersih. Proses sewanya juga sangat cepat!", image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Siti Sarah", role: "Family Camper", rating: 5, comment: "Paket bundling keluarga sangat membantu, semua perlengkapan lengkap!", image: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Reza Aditya", role: "Nature Photographer", rating: 4, comment: "EnvoRent adalah pilihan terbaik untuk sewa alat outdoor di Bandung.", image: "https://i.pravatar.cc/150?u=3" }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.items.length);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const api = useApiClient();

  const [bundlings, setBundlings] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  }

  useEffect(() => {
    const checkExistingSession = async () => {
      if (getToken()) {
        try {
          const response = await api.get('/me');
          const role = response.data.user.role;
          if (role === 'admin' || role === 'superadmin' || role === 'super admin') {
            window.location.href = '/dashboard';
          }
        } catch (err) {
          // Ignored
        }
      }
    };
    checkExistingSession();
  }, [api]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bundlingRes, productRes] = await Promise.all([
          api.get('/bundlings'),
          api.get('/products'),
        ]);

        const bData = (bundlingRes.data.bundlings || []).map((item: any) => ({
          ...item,
          image: item.image ? `http://localhost:8000/storage/${item.image}` : null,
        }));

        const pData = (productRes.data.products || []).map((item: any) => ({
          ...item,
          image: item.image ? `http://localhost:8000/storage/${item.image}` : null,
        }));

        setBundlings(bData);
        setProducts(pData);
      } catch (error) {
        console.error('Error fetching landing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  return (
    <div className="font-sans text-stone-800 bg-stone-50">
      <nav className="fixed w-full z-50 bg-stone-900/90 backdrop-blur-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <img src="/envolvemini.png" className='w-10 h-10' alt="Logo" />
              <span className="font-serif text-2xl tracking-wide">EnvoRent</span>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline text-white">Beranda</Link>
                <Link to="/catalogue" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline text-white">Katalog</Link>
                <a href="#bundling" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline text-white">Paket</a>
                <a href="#reviews" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline text-white">Ulasan</a>

                <Link to="/cart" className="p-2 hover:bg-stone-800 rounded-full relative text-white">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                {getToken() ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors border-none cursor-pointer">
                    {isLoggingOut ? 'Keluar...' : 'Keluar'}
                  </button>
                ) : (
                  <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors no-underline">
                    Masuk
                  </Link>
                )}
              </div>
            </div>

            <div className="md:hidden">
              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative p-2 hover:bg-stone-800 rounded-full text-white">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-stone-800 border-none bg-transparent cursor-pointer text-white"
                >
                  {mobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900 absolute top-20 left-0 w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
              <Link to="/" className="block px-3 py-4 rounded-md text-base font-medium hover:text-emerald-400 text-white no-underline">Beranda</Link>
              <Link to="/catalogue" className="block px-3 py-4 rounded-md text-base font-medium hover:text-emerald-400 text-white no-underline">Katalog</Link>
              <a href="#bundling" className="block px-3 py-4 rounded-md text-base font-medium hover:text-emerald-400 text-white no-underline">Paket</a>
              <Link to="/catalogue" className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl text-sm font-bold block text-center no-underline">
                Sewa Sekarang
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000"
            alt="Camping Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16 animate-in fade-in duration-1000">
          <p className="text-emerald-400 font-medium tracking-widest mb-4 uppercase text-sm md:text-base">Penyewaan Alat Outdoor Premium</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 leading-tight">
            SEWA ALAT PREMIUM, <br />
            <span className="italic text-emerald-200">JELAJAHI KEBEBASAN ALAM!</span>
          </h1>
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto mb-10 text-stone-200 font-medium">
            Jangan biarkan alat mahal menghalangi Anda. Sewa peralatan camping berkualitas tinggi dari kami dan mulai petualangan Anda hari ini. Bersih, mudah, dan terjangkau.
          </p>
          <Link to="/catalogue" className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full text-lg font-medium transition-all inline-block shadow-lg active:scale-95 no-underline">
             Lihat Katalog
          </Link>
        </div>
      </section>

      <section className="py-24 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Mengapa Memilih EnvoRent</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">Kami Membuat Camping Jadi Mudah</h2>
          <p className="mt-4 max-w-2xl mx-auto text-stone-600 leading-relaxed font-medium">
            Lupakan repotnya membeli, menyimpan, dan merawat alat. Kami menyediakan semua yang Anda butuhkan untuk liburan luar ruangan yang sempurna.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceBenefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">{benefit.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50 skew-x-12 translate-x-20 z-0" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16">
            <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Proses Sederhana</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">Cara Kerja Kami</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative group">
                <div className="text-6xl font-serif text-emerald-100 absolute -top-8 -left-4 z-0 font-bold group-hover:text-emerald-200 transition-colors duration-300">{item.step}</div>
                <div className="relative z-10 pt-4">
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>
                </div>
                {index !== howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2 text-emerald-200">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bundling" className="py-20 px-4 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Penawaran Hemat</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">Paket Bundling</h2>
            </div>
            <Link to="/catalogue" className="hidden md:flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium mt-4 md:mt-0 no-underline">
              Lihat Semua Paket <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-stone-400 font-medium">Memuat paket...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bundlings.slice(0, 3).map((pack) => (
                <div key={pack.id} className="group bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full">
                  <div className="h-56 overflow-hidden relative">
                    <img src={pack.image} alt={pack.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                      PILIHAN TERBAIK
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-stone-900 mb-2">{pack.name}</h3>
                    <p className="text-stone-500 text-xs mb-6 line-clamp-2 leading-relaxed">{pack.description || "Paket peralatan lengkap untuk petualangan Anda."}</p>
                    <div className="text-emerald-700 font-bold text-2xl mb-6">{formatRupiah(pack.price)}</div>

                    <div className="flex-1 mt-auto">
                      <ul className="space-y-2 mb-8 border-t border-stone-50 pt-6">
                        {pack.materials?.slice(0, 4).map((material: any, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-stone-600"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                            {material.product?.name} × {material.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link to={`/bundling/${pack.id}`} className="w-full py-4 bg-stone-100 hover:bg-emerald-700 hover:text-white text-stone-800 rounded-lg font-bold text-sm transition-all text-center no-underline shadow-sm active:scale-95">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="bestseller" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Favorit Pelanggan</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900">Barang Best Seller</h2>
          </div>

          {loading ? (
             <div className="text-center py-20 text-stone-400 font-medium">Memuat barang...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-stone-50 rounded-2xl p-6 hover:shadow-lg transition-all border border-transparent hover:border-emerald-100 flex flex-col h-full group">
                  <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-white relative flex items-center justify-center p-4 border border-stone-100 group-hover:bg-white transition-all duration-300">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mb-2">
                       {typeof item.category === 'object' ? item.category?.name : item.category}
                    </div>
                    <h3 className="font-bold text-stone-900 text-lg leading-tight uppercase italic tracking-tight min-h-[48px] line-clamp-2">{item.name}</h3>
                    <p className="text-stone-500 text-[10px] mb-8 font-medium line-clamp-3 leading-relaxed">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-stone-100">
                      <span className="text-stone-900 font-extrabold text-lg tracking-tighter">{formatRupiah(item.price)}</span>
                      <Link to="/catalogue" className="w-10 h-10 rounded-xl bg-stone-900 text-emerald-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-lg active:scale-95 border-none cursor-pointer">
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/catalogue" className="border-2 border-emerald-600 text-emerald-700 px-10 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-emerald-600 hover:text-white transition-all no-underline inline-block active:scale-95">
              Semua Katalog
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-stone-900 text-white relative overflow-hidden rounded-[3rem] mx-4 mb-12">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-5xl font-serif mb-6 leading-tight">Siap Memulai Petualangan Anda?</h2>
          <p className="text-stone-400 text-lg mb-10 max-w-2xl mx-auto font-medium italic">Alat berkualitas, harga terjangkau, dan kenangan tak terlupakan menanti. Pesan perlengkapan Anda sekarang.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/catalogue" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 inline-block no-underline shadow-xl active:scale-95">
              Sewa Sekarang
            </Link>
            <button className="bg-transparent border border-white/30 hover:border-white hover:bg-white/10 text-white px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all cursor-pointer border-none no-underline">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-24 px-4 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-700 text-xs font-bold tracking-widest uppercase">Testimoni</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif text-stone-900 uppercase italic">Kata Para Petualang</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 flex flex-col group hover:shadow-xl transition-all duration-500">
                <div className="flex gap-1 text-amber-400 mb-6 group-hover:scale-105 transition-transform">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-stone-600 italic mb-8 leading-relaxed flex-1 font-medium">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <img src={review.image} alt={review.name} className="w-12 h-12 rounded-xl object-cover shadow-md border-2 border-white group-hover:border-emerald-500 transition-colors" />
                  <div>
                    <div className="font-bold text-stone-900 uppercase tracking-tight">{review.name}</div>
                    <div className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-24 bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
                <img src="/envolvemini.png" className='w-8 h-8' />
                <span className="text-2xl font-serif tracking-tight">EnvoRent</span>
            </div>
            <h2 className="text-3xl font-serif mb-6 italic text-white leading-tight">Berlangganan Newsletter Kami</h2>
            <p className="text-emerald-200/50 mb-10 font-medium text-sm leading-relaxed">Dapatkan pembaruan koleksi perlengkapan terbaru, diskon musiman, dan tips pendakian eksklusif langsung di email Anda.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Alamat email Anda"
                className="flex-1 bg-emerald-900/40 border border-emerald-900 rounded-xl px-5 py-4 text-white placeholder-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold transition-all"
              />
              <button className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors border-none cursor-pointer shadow-lg active:scale-95 text-xs">
                Daftar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-12 lg:ml-auto">
            <div>
              <h4 className="font-black mb-8 text-emerald-400 uppercase tracking-widest text-xs">Layanan Kami</h4>
              <ul className="space-y-4 text-emerald-200/40 font-bold uppercase text-[10px] tracking-[0.2em] no-underline">
                <li><a href="#" className="hover:text-white transition-colors no-underline text-emerald-200/70">Sewa Tenda Premium</a></li>
                <li><a href="#" className="hover:text-white transition-colors no-underline text-emerald-200/70">Alat Mendaki Pro</a></li>
                <li><a href="#" className="hover:text-white transition-colors no-underline text-emerald-200/70">Kitchen Gear</a></li>
                <li><a href="#" className="hover:text-white transition-colors no-underline text-emerald-200/70">Safety Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-8 text-emerald-400 uppercase tracking-widest text-xs">Hubungi Kami</h4>
              <ul className="space-y-4 text-emerald-200/40 font-bold uppercase text-[10px] tracking-[0.2em] no-underline">
                <li className="text-emerald-200/70">hello@envorent.com</li>
                <li className="text-emerald-200/70">+62 812 3456 7890</li>
                <li className="text-emerald-200/70">Bandung, Jawa Barat</li>
                <li className="text-emerald-200/70">Indonesia Central</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-32 pt-10 border-t border-emerald-900/50 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-900">
          <p>&copy; 2024 ENVORENT EXPLORATION. SELURUH HAK CIPTA DILINDUNGI.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-emerald-400 transition-all hover:scale-110 text-emerald-800"><Instagram className="w-6 h-6" /></a>
            <a href="#" className="hover:text-emerald-400 transition-all hover:scale-110 text-emerald-800"><Facebook className="w-6 h-6" /></a>
            <a href="#" className="hover:text-emerald-400 transition-all hover:scale-110 text-emerald-800"><Twitter className="w-6 h-6" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}