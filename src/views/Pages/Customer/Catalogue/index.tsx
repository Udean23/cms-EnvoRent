import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Plus, ArrowLeft, ChevronLeft, ChevronRight, X, Clock, ShieldCheck, Zap, Info } from 'lucide-react'
import { useCartStore } from '@/core/store/useCartStore'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useApiClient } from '@/core/helpers/ApiClient'
import { getToken } from '@/core/helpers/TokenHandle'

export default function CataloguePage() {
    const api = useApiClient()

    const [categories, setCategories] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [bundles, setBundles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState<'products' | 'bundles'>('products')

    const [productSearch, setProductSearch] = useState('')
    const [bundleSearch, setBundleSearch] = useState('')

    const [selectedCategory, setSelectedCategory] = useState('all')

    const [productPriceRange, setProductPriceRange] = useState<[number, number]>([0, 2000000])
    const [bundlePriceRange, setBundlePriceRange] = useState<[number, number]>([0, 2000000])

    const [currentPage, setCurrentPage] = useState(1)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const itemsPerPage = 6

    const addToCart = useCartStore((state) => state.addToCart)
    const cartItemCount = useCartStore((state) => state.items.length)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes, bundleRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products'),
                    api.get('/bundlings')
                ]);

                const bundlingsData = (bundleRes.data.bundlings || []).map((item: any) => ({
                    ...item,
                    image: item.image
                        ? `http://localhost:8000/storage/${item.image}`
                        : null,
                }));

                const productsData = (prodRes.data.products || []).map((item: any) => ({
                    ...item,
                    image: item.image
                        ? `http://localhost:8000/storage/${item.image}`
                        : null,
                }));

                setCategories([
                    { id: 'all', name: 'All Categories' },
                    ...(catRes.data?.categories ?? [])
                ]);

                setProducts(productsData);
                setBundles(bundlingsData);
            } catch (error) {
                setCategories([{ id: 'all', name: 'All Categories' }]);
                setProducts([]);
                setBundles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredItems = useMemo(() => {
        if (activeTab === 'products') {
            let items = products

            if (productSearch) {
                items = items.filter(item =>
                    item.name?.toLowerCase().includes(productSearch.toLowerCase())
                )
            }

            if (selectedCategory !== 'all') {
                items = items.filter(item =>
                    String(item.category_id) === String(selectedCategory)
                )
            }

            items = items.filter(item =>
                Number(item.price ?? 0) >= productPriceRange[0] &&
                Number(item.price ?? 0) <= productPriceRange[1]
            )

            return items
        }

        if (activeTab === 'bundles') {
            let items = bundles

            if (bundleSearch) {
                items = items.filter(item =>
                    item.name?.toLowerCase().includes(bundleSearch.toLowerCase())
                )
            }

            items = items.filter(item =>
                Number(item.price ?? 0) >= bundlePriceRange[0] &&
                Number(item.price ?? 0) <= bundlePriceRange[1]
            )

            return items
        }

        return []
    }, [
        activeTab,
        products,
        bundles,
        productSearch,
        bundleSearch,
        selectedCategory,
        productPriceRange,
        bundlePriceRange
    ])

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleTabChange = (tab: 'products' | 'bundles') => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    const checkIsOutOfStock = (item: any) => {
        if (activeTab === 'products') {
            return (item.stock ?? 0) <= 0
        } else {
            // For bundles, check if any material has insufficient stock
            return (item.materials ?? []).some((m: any) => (m.product?.stock ?? 0) < (m.quantity ?? 1))
        }
    }

    const getStockAmount = (item: any) => {
        if (activeTab === 'products') {
            return item.stock ?? 0;
        } else {
            if (!item.materials || item.materials.length === 0) return 0;
            let minStock = Infinity;
            item.materials.forEach((m: any) => {
                const productStock = m.product?.stock ?? 0;
                const quantityRequired = m.quantity ?? 1;
                const possibleBundles = Math.floor(productStock / quantityRequired);
                if (possibleBundles < minStock) {
                    minStock = possibleBundles;
                }
            });
            return minStock === Infinity ? 0 : minStock;
        }
    }

    const handleAddToCart = (item: any) => {
        if (!getToken()) {
            Swal.fire({
                icon: 'warning',
                title: 'Akses Ditolak',
                text: 'Silahkan login terlebih dahulu untuk menambah barang ke keranjang.',
                confirmButtonColor: '#059669'
            })
            return
        }

        if (checkIsOutOfStock(item)) return

        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            type: activeTab === 'products' ? 'product' : 'bundle'
        })

        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${item.name} has been added to your cart.`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        })
    }

    const openDetails = (item: any) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const closeDetails = () => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedItem(null), 300)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fcfbf9] font-sans text-stone-800">
            {/* Elegant Navbar */}
            <nav className="sticky top-0 z-50 bg-stone-900/95 backdrop-blur-md text-white shadow-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="group flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-serif tracking-tight font-bold">EnvoRent <span className="text-emerald-500">Catalogue</span></span>
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link to="/orders" className="text-stone-300 hover:text-white font-bold text-sm transition-colors uppercase tracking-widest hidden sm:block">
                                Pesanan
                            </Link>
                            <Link to="/cart" className="relative p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 group">
                                <ShoppingCart className="w-6 h-6 text-stone-300 group-hover:text-white" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform bg-emerald-500 rounded-full border-2 border-stone-900 shadow-xl">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
                <aside className="lg:col-span-1">
                    <div className="sticky top-32 space-y-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 backdrop-blur-sm">
                            <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-emerald-700 font-medium mb-8 transition-all duration-300 group">
                                <div className="p-2 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                </div>
                                Back to Home
                            </Link>

                            <h3 className="font-bold text-xl mb-6 flex items-center gap-3 text-stone-900">
                                <Filter className="w-5 h-5 text-emerald-600" /> Filters
                            </h3>

                            <div className="mb-8">
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Search</label>
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Find your gear..."
                                        className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white focus:border-emerald-500 transition-all"
                                        value={activeTab === 'products' ? productSearch : bundleSearch}
                                        onChange={(e) => {
                                            if (activeTab === 'products') {
                                                setProductSearch(e.target.value)
                                            } else {
                                                setBundleSearch(e.target.value)
                                            }
                                            setCurrentPage(1)
                                        }}
                                    />
                                </div>
                            </div>

                            {activeTab === 'products' && (
                                <div className="mb-8">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Category</label>
                                    <div className="space-y-1.5">
                                        {categories.map((cat) => (
                                            <label
                                                key={cat.id}
                                                className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-xl transition-all duration-200 ${String(selectedCategory) === String(cat.id) ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-stone-500 hover:bg-stone-50'}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    className="hidden"
                                                    checked={String(selectedCategory) === String(cat.id)}
                                                    onChange={() => {
                                                        setSelectedCategory(String(cat.id))
                                                        setCurrentPage(1)
                                                    }}
                                                />
                                                <span className="text-sm">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Price Range</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">Rp</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full pl-8 pr-2 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            value={activeTab === 'products' ? productPriceRange[0] : bundlePriceRange[0]}
                                            onChange={(e) => {
                                                const value = Number(e.target.value)
                                                if (activeTab === 'products') {
                                                    setProductPriceRange([value, productPriceRange[1]])
                                                } else {
                                                    setBundlePriceRange([value, bundlePriceRange[1]])
                                                }
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">Rp</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full pl-8 pr-2 py-2.5 bg-stone-50 border border-stone-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                            value={activeTab === 'products' ? productPriceRange[1] : bundlePriceRange[1]}
                                            onChange={(e) => {
                                                const value = Number(e.target.value)
                                                if (activeTab === 'products') {
                                                    setProductPriceRange([productPriceRange[0], value])
                                                } else {
                                                    setBundlePriceRange([bundlePriceRange[0], value])
                                                }
                                                setCurrentPage(1)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="lg:col-span-3">
                    <div className="flex gap-8 mb-10 border-b border-stone-200">
                        {['products', 'bundles'].map((type) => (
                            <button
                                key={type}
                                className={`pb-5 px-2 font-bold text-sm uppercase tracking-[0.2em] transition-all duration-300 relative ${activeTab === type ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'}`}
                                onClick={() => handleTabChange(type as any)}
                            >
                                {type === 'products' ? 'Individual Gear' : 'Bundling Packages'}
                                {activeTab === type && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-600 rounded-full shadow-[0_2px_10px_rgba(5,150,105,0.3)]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {currentItems.map((item) => {
                            const isOutOfStock = checkIsOutOfStock(item)
                            return (
                                <div
                                    key={item.id}
                                    className={`bg-white rounded-[2rem] shadow-[0_10px_30px_rgb(0,0,0,0.03)] border transition-all duration-500 overflow-hidden flex flex-col h-full group ${isOutOfStock ? 'opacity-75 border-red-100 bg-red-50/10 grayscale-[0.1]' : 'hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:-translate-y-2 border-stone-100'}`}
                                >
                                    <div 
                                        className="aspect-[4/5] bg-stone-50 relative overflow-hidden cursor-pointer"
                                        onClick={() => openDetails(item)}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'opacity-60' : ''}`}
                                        />
                                        {isOutOfStock && (
                                            <div className="absolute inset-0 bg-red-900/10 backdrop-blur-[2px] flex items-center justify-center">
                                                <div className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black tracking-widest shadow-2xl transform -rotate-12 border-2 border-white/50 uppercase">
                                                    Habis
                                                </div>
                                            </div>
                                        )}
                                        {!isOutOfStock && activeTab === 'products' && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-stone-500 shadow-sm border border-stone-100 flex flex-col items-end gap-1">
                                                <span>{item.category?.name}</span>
                                                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">Stok: {getStockAmount(item)}</span>
                                            </div>
                                        )}
                                        {!isOutOfStock && activeTab === 'bundles' && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold text-stone-500 shadow-sm border border-stone-100 flex flex-col items-end gap-1">
                                                <span>Bundle</span>
                                                <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">Stok: {getStockAmount(item)}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/40 px-4 py-2 rounded-full">Lihat Detail</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <h3 
                                            className={`font-bold text-xl mb-2 line-clamp-1 cursor-pointer ${isOutOfStock ? 'text-red-900/50' : 'text-stone-900 group-hover:text-emerald-700 transition-colors'}`}
                                            onClick={() => openDetails(item)}
                                        >
                                            {item.name}
                                        </h3>
                                        <p className="text-stone-400 text-xs mb-6 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {activeTab === 'bundles' && (
                                            <div className="mb-6 flex flex-wrap gap-2 mt-auto">
                                                {(item.materials ?? []).slice(0, 3).map((f: any, i: number) => (
                                                    <span key={i} className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-colors ${isOutOfStock ? 'bg-red-50 text-red-400 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                                                        {f.product?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-50">
                                            <div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isOutOfStock ? 'text-red-300' : 'text-stone-300'}`}>Rental Rate</span>
                                                <div className={`text-xl font-black ${isOutOfStock ? 'text-red-400/50' : 'text-emerald-700'}`}>
                                                    Rp {Number(item.price ?? 0).toLocaleString('id-ID')}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                disabled={isOutOfStock}
                                                className={`p-4 rounded-2xl transition-all duration-300 ${isOutOfStock ? 'bg-stone-100 text-stone-300 cursor-not-allowed shadow-none' : 'bg-stone-900 text-white hover:bg-emerald-600 hover:rotate-6 shadow-lg active:scale-95'}`}
                                            >
                                                {isOutOfStock ? <Plus className="w-5 h-5 opacity-20" /> : <Plus className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {filteredItems.length > 0 && (
                        <div className="flex justify-center items-center gap-6 mt-12 pb-12">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="w-12 h-12 flex items-center justify-center bg-white border border-stone-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm shadow-emerald-900/5"
                            >
                                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-[1px] bg-stone-200" />
                                <span className="text-xs font-black uppercase tracking-widest text-stone-400">
                                    <span className="text-stone-900 text-sm">{currentPage}</span> / {totalPages}
                                </span>
                                <div className="w-8 h-[1px] bg-stone-200" />
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="w-12 h-12 flex items-center justify-center bg-white border border-stone-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-sm shadow-emerald-900/5"
                            >
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Premium Detail Modal */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <div 
                        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={closeDetails}
                    />
                    
                    <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300 max-h-[90vh]">
                        <button 
                            onClick={closeDetails}
                            className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl text-stone-400 hover:text-stone-900 hover:rotate-90 transition-all duration-300 z-20 shadow-sm border border-stone-100"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Gallery Mockup for Modal */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-stone-50 relative overflow-hidden border-r border-stone-50">
                            <img 
                                src={selectedItem.image} 
                                alt={selectedItem.name} 
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            {checkIsOutOfStock(selectedItem) && (
                                <div className="absolute inset-0 bg-red-900/10 backdrop-blur-sm flex items-center justify-center">
                                    <span className="bg-red-600 text-white px-8 py-3 rounded-full text-sm font-black tracking-widest shadow-2xl border-4 border-white/30 uppercase">
                                        Stok Habis
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col custom-scrollbar">
                            <div className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        {activeTab === 'products' ? selectedItem.category?.name : 'Bundle Package'}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-stone-300">
                                        <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Best Choice</span>
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-950 mb-4 leading-tight">
                                    {selectedItem.name}
                                </h2>
                                <div className="text-3xl font-black text-emerald-700 flex items-baseline gap-2">
                                    Rp {Number(selectedItem.price ?? 0).toLocaleString('id-ID')}
                                    <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">/ Day</span>
                                </div>
                                <div className="mt-3 inline-block">
                                    <span className="font-bold text-sm text-stone-600 bg-stone-100 px-4 py-2 rounded-xl border border-stone-200">
                                        Stok Tersedia: <span className="text-emerald-600">{getStockAmount(selectedItem)}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-8 mb-10">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-3 flex items-center gap-2">
                                        <Info className="w-4 h-4 text-emerald-600" /> Deskripsi
                                    </h4>
                                    <p className="text-stone-500 text-sm leading-relaxed whitespace-pre-line bg-stone-50 p-6 rounded-[1.5rem] border border-stone-100 font-medium italic">
                                        "{selectedItem.description || 'Tidak ada deskripsi tersedia untuk produk ini.'}"
                                    </p>
                                </div>

                                {activeTab === 'bundles' && (selectedItem.materials ?? []).length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-4">Inside this Bundle</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {selectedItem.materials.map((m: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                                                    <span className="text-sm font-bold text-stone-800">{m.product?.name}</span>
                                                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">x{m.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Clock className="w-4 h-4 text-stone-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tight text-stone-400">Duration</p>
                                            <p className="text-xs font-bold text-stone-800">24 Hours</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <ShieldCheck className="w-4 h-4 text-stone-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tight text-stone-400">Condition</p>
                                            <p className="text-xs font-bold text-stone-800">Like New</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    handleAddToCart(selectedItem);
                                    closeDetails();
                                }}
                                disabled={checkIsOutOfStock(selectedItem)}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 mt-auto shadow-xl ${checkIsOutOfStock(selectedItem) ? 'bg-stone-100 text-stone-300 cursor-not-allowed' : 'bg-stone-950 text-white hover:bg-emerald-600 hover:-translate-y-1 active:scale-[0.98] shadow-emerald-900/20'}`}
                            >
                                {checkIsOutOfStock(selectedItem) ? 'Tidak Tersedia' : 'Tambahkan ke Keranjang'}
                                {!checkIsOutOfStock(selectedItem) && <Plus className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}