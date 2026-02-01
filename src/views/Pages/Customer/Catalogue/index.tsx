import React, { useState, useMemo } from 'react';
import { Search, Filter, ShoppingCart, Star, Plus, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, products, bundles } from '../dummy/catalogueData';
import { useCartStore } from '@/core/store/useCartStore';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function CataloguePage() {
    const [activeTab, setActiveTab] = useState<'products' | 'bundles'>('products');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const addToCart = useCartStore((state) => state.addToCart);
    const cartItemCount = useCartStore((state) => state.items.length);

    const filteredItems = useMemo(() => {
        let items = activeTab === 'products' ? products : bundles;

        if (searchQuery) {
            items = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (activeTab === 'products' && selectedCategory !== 'all') {
            // @ts-ignore
            items = items.filter(item => item.category === selectedCategory);
        }

        items = items.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

        return items;
    }, [activeTab, searchQuery, selectedCategory, priceRange]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const currentItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleTabChange = (tab: 'products' | 'bundles') => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleAddToCart = (item: any) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            type: activeTab === 'products' ? 'product' : 'bundle'
        });
        Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${item.name} has been added to your cart.`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
    };

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
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
                                                checked={selectedCategory === cat.id}
                                                onChange={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
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
                                    value={priceRange[0]}
                                    onChange={(e) => { setPriceRange([Number(e.target.value), priceRange[1]]); setCurrentPage(1); }}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    className="w-full px-2 py-1 border rounded bg-stone-50"
                                    value={priceRange[1]}
                                    onChange={(e) => { setPriceRange([priceRange[0], Number(e.target.value)]); setCurrentPage(1); }}
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
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold text-amber-500 shadow-sm">
                                        <Star className="w-3 h-3 fill-current" /> {item.rating}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="text-xs text-stone-500 uppercase font-bold mb-1">
                                        {/* @ts-ignore */}
                                        {activeTab === 'products' ? item.category : 'Bundle'}
                                    </div>
                                    <h3 className="font-bold text-lg text-stone-900 mb-2 truncate" title={item.name}>{item.name}</h3>
                                    {/* @ts-ignore */}
                                    <p className="text-stone-500 text-xs mb-4 line-clamp-2 min-h-[2.5em]">{item.description}</p>

                                    {activeTab === 'bundles' && (
                                        <div className="mb-4 flex flex-wrap gap-1 mt-auto">
                                            {/* @ts-ignore */}
                                            {item.features.slice(0, 3).map((f, i) => (
                                                <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">{f}</span>
                                            ))}
                                            {/* @ts-ignore */}
                                            {item.features.length > 3 && <span className="text-[10px] text-stone-400 px-1 py-1">+{item.features.length - 3} more</span>}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-4">
                                        <div>
                                            <span className="text-xs text-stone-400">Start from</span>
                                            <div className="text-emerald-700 font-bold">Rp {item.price.toLocaleString('id-ID')}</div>
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

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 text-stone-500">
                            <p>No items found matching your filters.</p>
                        </div>
                    )}

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
    );
}
