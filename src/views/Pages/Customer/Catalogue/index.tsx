import React, { useState, useMemo, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Plus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/core/store/useCartStore'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useApiClient } from '@/core/helpers/ApiClient'

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

    const handleAddToCart = (item: any) => {
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
            <nav className="sticky top-0 z-50 bg-stone-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="text-xl font-serif tracking-wide">EnvoRent Catalogue</Link>
                        <div className="flex items-center gap-4">
                            <Link to="/cart" className="relative p-2 hover:bg-stone-800 rounded-full">
                                <ShoppingCart className="w-6 h-6" />
                                {cartItemCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                        <Link to="/" className="flex items-center gap-2 text-stone-500 hover:text-emerald-700 font-medium mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>

                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5 text-emerald-600" /> Filters
                        </h3>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-stone-600 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search gear..."
                                    className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-stone-600 mb-2">Category</label>
                                <div className="space-y-2">
                                    {categories.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-stone-50 p-1 rounded transition-colors">
                                            <input
                                                type="radio"
                                                name="category"
                                                className="text-emerald-600 focus:ring-emerald-500"
                                                checked={String(selectedCategory) === String(cat.id)}
                                                onChange={() => {
                                                    setSelectedCategory(String(cat.id))
                                                    setCurrentPage(1)
                                                }}
                                            />
                                            <span className="text-sm text-stone-600">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-2">Price Range</label>
                            <div className="flex items-center gap-2 text-sm">
                                <input
                                    type="number"
                                    className="w-full px-2 py-1 border rounded bg-stone-50"
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
                                <span>-</span>
                                <input
                                    type="number"
                                    className="w-full px-2 py-1 border rounded bg-stone-50"
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
                </aside>

                <div className="lg:col-span-3">
                    <div className="flex gap-4 mb-6 border-b border-stone-200">
                        <button
                            className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'products' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}
                            onClick={() => handleTabChange('products')}
                        >
                            Individual Gear
                        </button>
                        <button
                            className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'bundles' ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-stone-500 hover:text-stone-700'}`}
                            onClick={() => handleTabChange('bundles')}
                        >
                            Bundling Packages
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {currentItems.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
                                <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="text-xs text-stone-500 uppercase font-bold mb-1">
                                        {activeTab === 'products' ? item.category?.name ?? '' : 'Bundle'}
                                    </div>
                                    <h3 className="font-bold text-lg text-stone-900 mb-2 truncate">{item.name}</h3>
                                    <p className="text-stone-500 text-xs mb-4 line-clamp-2 min-h-[2.5em]">{item.description}</p>

                                    {activeTab === 'bundles' && (
                                        <div className="mb-4 flex flex-wrap gap-1 mt-auto">
                                            {(item.materials ?? []).slice(0, 3).map((f: any, i: number) => (
                                                <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                                                    {f.product?.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <div>
                                            <span className="text-xs text-stone-400">Start from</span>
                                            <div className="text-emerald-700 font-bold">Rp {Number(item.price ?? 0).toLocaleString('id-ID')}</div>
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="bg-stone-900 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length > 0 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5 text-stone-600" />
                            </button>
                            <span className="text-sm font-medium text-stone-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5 text-stone-600" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}