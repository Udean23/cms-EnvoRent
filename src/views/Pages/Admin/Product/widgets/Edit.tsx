import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { ArrowLeft, Plus, Upload, X, Check, Box } from "lucide-react";
import { Breadcrumb } from "@/views/Components/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import categoryData from "@/core/dummy/categorydummy";
import colorData from "@/core/dummy/colorData";
import sizeData from "@/core/dummy/sizeData";
import productsData from "@/core/dummy/productdummy";

interface VariationOption {
    name: string;
}

interface Variation {
    id: string;
    name: string;
    options: VariationOption[];
}

interface VariantItem {
    id: string;
    variation1: string;
    variation2?: string;
    price: number;
    stock: number;
    sku: string;
}

export default function ProductEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");

    const [images, setImages] = useState<string[]>([]); 
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [enableVariations, setEnableVariations] = useState(false);
    const [variations, setVariations] = useState<Variation[]>([]);

    const [globalPrice, setGlobalPrice] = useState("");
    const [globalStock, setGlobalStock] = useState("");
    const [globalSku, setGlobalSku] = useState("");

    const [variantItems, setVariantItems] = useState<VariantItem[]>([]);

    const [bulkPrice, setBulkPrice] = useState("");
    const [bulkStock, setBulkStock] = useState("");
    const [bulkSku, setBulkSku] = useState("");

    useEffect(() => {
        if (id) {
            const product = productsData.find(p => p.id === id);
            if (product) {
                setProductName(product.name);
                setCategory(product.category);
                setBrand(product.brand);
                setGlobalPrice(String(product.price));
                setImages([product.image]); 
                setProductDescription("Deskripsi produk dummy..."); 

                if (product.variants && product.variants.length > 0) {
                    setEnableVariations(true);
                    const colorVar: Variation = {
                        id: "1",
                        name: "Warna",
                        options: product.variants.map(v => ({ name: v.color }))
                    };
                    setVariations([colorVar]);
                } else {
                    setGlobalStock("100");
                }
            }
        }
    }, [id]);

    const generateVariantItems = (currentVariations: Variation[]) => {
        if (currentVariations.length === 0) return [];

        const var1 = currentVariations[0];
        const var2 = currentVariations[1]; 

        let items: VariantItem[] = [];

        if (var1 && var1.options.length > 0) {
            var1.options.forEach(opt1 => {
                if (var2 && var2.options.length > 0) {
                    var2.options.forEach(opt2 => {
                        items.push({
                            id: `${opt1.name}-${opt2.name}`,
                            variation1: opt1.name,
                            variation2: opt2.name,
                            price: 0,
                            stock: 0,
                            sku: "",
                        });
                    });
                } else {
                    items.push({
                        id: opt1.name,
                        variation1: opt1.name,
                        price: 0,
                        stock: 0,
                        sku: "",
                    });
                }
            });
        }
        return items;
    };

    const updateVariantItems = (newVariations: Variation[]) => {
        const newItems = generateVariantItems(newVariations);
        const mergedItems = newItems.map(item => {
            const existing = variantItems.find(prev => prev.id === item.id);
            return existing ? { ...item, price: existing.price, stock: existing.stock, sku: existing.sku } : item;
        });
        setVariantItems(mergedItems);
    };

    const handleAddVariation = () => {
        if (variations.length >= 2) return;

        const existingType = variations[0]?.name;
        const nextType = existingType === "Warna" ? "Ukuran" : "Warna";

        const newVar: Variation = {
            id: Date.now().toString(),
            name: nextType,
            options: []
        };
        const updatedVars = [...variations, newVar];
        setVariations(updatedVars);
    };

    const handleRemoveVariation = (index: number) => {
        const updated = variations.filter((_, i) => i !== index);
        setVariations(updated);
        updateVariantItems(updated);
    };

    const handleVariationNameChange = (index: number, val: string) => {
        if (variations.some((v, i) => i !== index && v.name === val)) {
            alert("Tipe variasi ini sudah dipilih!");
            return;
        }
        const updated = [...variations];
        if (updated[index].name !== val) {
            updated[index].name = val;
            updated[index].options = [];
        }
        setVariations(updated);
        setVariantItems(generateVariantItems(updated));
    };

    const addOption = (varIndex: number, val: string) => {
        if (!val) return;
        if (variations[varIndex].options.some(o => o.name === val)) return;

        const updated = [...variations];
        updated[varIndex].options.push({ name: val });
        setVariations(updated);
        updateVariantItems(updated);
    };

    const removeOption = (varIndex: number, optIndex: number) => {
        const updated = [...variations];
        updated[varIndex].options.splice(optIndex, 1);
        setVariations(updated);
        updateVariantItems(updated);
    };

    const handleVariantItemChange = (id: string, field: keyof VariantItem, value: any) => {
        setVariantItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const applyBulkEdit = () => {
        setVariantItems(prev => prev.map(item => ({
            ...item,
            price: bulkPrice ? Number(bulkPrice) : item.price,
            stock: bulkStock ? Number(bulkStock) : item.stock,
            sku: bulkSku ? bulkSku : item.sku
        })));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImage = URL.createObjectURL(files[0]);
            setImages([newImage]);
        }
    };

    const removeImage = (index: number) => {
        setImages([]);
    };

    const getAvailableOptions = (type: string) => {
        if (type === "Warna") return colorData;
        if (type === "Ukuran") return sizeData;
        return [];
    };

    const handleSave = () => {
        Swal.fire({
            title: "Berhasil!",
            text: "Produk berhasil diperbarui.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
        }).then(() => {
            navigate("/products");
        });
    };

    return (
        <div className="p-4 md:p-6 pb-24 bg-gray-50 min-h-screen">
            <Breadcrumb title="Edit Produk" desc="Perbarui data produk" />

            <div className="max-w-7xl mx-auto py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN - FORM */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. Basic Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Informasi Dasar</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="Contoh: Sepatu Lari Nike Air Zoom"
                                    value={productName}
                                    onChange={e => setProductName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={category}
                                        onChange={e => setCategory(e.target.value)}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categoryData.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Merek (Brand)</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Contoh: Nike, Adidas"
                                        value={brand}
                                        onChange={e => setBrand(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
                                <textarea
                                    rows={5}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={productDescription}
                                    onChange={e => setProductDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Media Management */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Foto Produk</h2>
                        <div className="flex flex-wrap gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
                                    <img src={img} alt="Product" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {images.length === 0 && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition cursor-pointer"
                                >
                                    <Upload size={20} />
                                    <span className="text-xs mt-1">Tambah Foto</span>
                                </button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    {/* 3. Sales Info */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Informasi Penjualan</h2>

                        {!enableVariations ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-500">Rp</span>
                                            <input
                                                type="number"
                                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                placeholder="0"
                                                value={globalPrice}
                                                onChange={e => setGlobalPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="0"
                                            value={globalStock}
                                            onChange={e => setGlobalStock(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setEnableVariations(true); setVariations([{ id: "1", name: "Warna", options: [] }]); }}
                                    className="text-blue-600 font-medium hover:underline flex items-center gap-2 cursor-pointer"
                                >
                                    <Plus size={16} /> Aktifkan Variasi Produk
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Variation Definition Zone */}
                                {variations.map((variant, vIdx) => (
                                    <div key={vIdx} className="bg-gray-50 p-4 rounded-lg relative">
                                        <div className="flex justify-between items-center mb-3">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-1">Variasi {vIdx + 1}</label>
                                                <select
                                                    value={variant.name}
                                                    onChange={(e) => handleVariationNameChange(vIdx, e.target.value)}
                                                    className="border-b-2 bg-transparent focus:border-blue-500 focus:outline-none px-1 py-1 font-medium min-w-[100px]"
                                                >
                                                    {/* Show selected option or available options */}
                                                    <option value={variant.name}>{variant.name}</option>
                                                    {/* Show other options only if they are not selected by other variations */}
                                                    {["Warna", "Ukuran"].filter(t => t !== variant.name && !variations.some(v => v.name === t)).map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button onClick={() => handleRemoveVariation(vIdx)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                                                <X size={20} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {variant.options.map((opt, oIdx) => (
                                                <div key={oIdx} className="bg-white border px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                                                    <span>{opt.name}</span>
                                                    <button onClick={() => removeOption(vIdx, oIdx)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="relative">
                                                <select
                                                    className="border border-dashed border-gray-400 rounded-full px-3 py-1 text-sm bg-transparent focus:outline-none focus:border-blue-500 cursor-pointer"
                                                    onChange={(e) => {
                                                        addOption(vIdx, e.target.value);
                                                        e.target.value = ""; // Reset
                                                    }}
                                                >
                                                    <option value="">+ Tambah Pilihan</option>
                                                    {getAvailableOptions(variant.name)
                                                        .filter(opt => !variant.options.some(existing => existing.name === opt.name)) // Filter out already selected options
                                                        .map(opt => (
                                                            <option key={opt.id} value={opt.name}>{opt.name}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {variations.length < 2 && (
                                    <button
                                        onClick={handleAddVariation}
                                        className="text-blue-600 font-medium hover:underline flex items-center gap-2 text-sm cursor-pointer"
                                    >
                                        <Plus size={16} /> Tambah Variasi 2 (Ukuran/Warna)
                                    </button>
                                )}

                                {/* Variation Table */}
                                {variantItems.length > 0 && (
                                    <div className="mt-6">
                                        <h3 className="font-bold text-gray-700 mb-2">Daftar Variasi</h3>
                                        <div className="mb-4 flex flex-col sm:flex-row gap-4 p-4 bg-blue-50 rounded-lg sm:items-end">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Harga</label>
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1 text-gray-500 text-xs">Rp</span>
                                                    <input type="number" className="w-full border rounded pl-6 pr-2 py-1 text-sm bg-white"
                                                        value={bulkPrice}
                                                        onChange={(e) => setBulkPrice(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Stok</label>
                                                <input type="number" className="w-full border rounded px-2 py-1 text-sm bg-white"
                                                    value={bulkStock}
                                                    onChange={(e) => setBulkStock(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">SKU</label>
                                                <input type="text" className="w-full border rounded px-2 py-1 text-sm bg-white"
                                                    value={bulkSku}
                                                    onChange={(e) => setBulkSku(e.target.value)}
                                                />
                                            </div>
                                            <button
                                                onClick={applyBulkEdit}
                                                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
                                            >
                                                Terapkan ke Semua
                                            </button>
                                        </div>

                                        <div className="overflow-x-auto border rounded-t-lg">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-gray-700 uppercase bg-gray-100">
                                                    <tr>
                                                        <th className="px-4 py-3 min-w-[100px]">{variations[0]?.name}</th>
                                                        {variations[1] && <th className="px-4 py-3 min-w-[100px]">{variations[1]?.name}</th>}
                                                        <th className="px-4 py-3 min-w-[150px]">Harga</th>
                                                        <th className="px-4 py-3 min-w-[100px]">Stok</th>
                                                        <th className="px-4 py-3 min-w-[150px]">SKU</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {variantItems.map((item) => (
                                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                                            <td className="px-4 py-3 font-medium">{item.variation1}</td>
                                                            {variations[1] && <td className="px-4 py-3 font-medium">{item.variation2}</td>}
                                                            <td className="px-4 py-2">
                                                                <div className="relative">
                                                                    <span className="absolute left-2 top-1.5 text-gray-400 text-xs">Rp</span>
                                                                    <input
                                                                        type="number"
                                                                        value={item.price}
                                                                        onChange={(e) => handleVariantItemChange(item.id, 'price', e.target.value)}
                                                                        className="border rounded w-full pl-6 pr-2 py-1"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    type="number"
                                                                    value={item.stock}
                                                                    onChange={(e) => handleVariantItemChange(item.id, 'stock', e.target.value)}
                                                                    className="border rounded w-full px-2 py-1"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-2">
                                                                <input
                                                                    type="text"
                                                                    value={item.sku}
                                                                    onChange={(e) => handleVariantItemChange(item.id, 'sku', e.target.value)}
                                                                    className="border rounded w-full px-2 py-1"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => { setEnableVariations(false); setVariations([]); setVariantItems([]); }}
                                    className="text-red-600 text-sm hover:underline cursor-pointer"
                                >
                                    Batalkan Variasi (Reset)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 4. Shipping (Simplified) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Pengiriman</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Berat (Gram)</label>
                                <input type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - PREVIEW */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-6 space-y-4">
                        <div className="bg-white rounded-xl shadow-md p-4 max-w-sm mx-auto border border-gray-100">
                            <h3 className="font-bold text-gray-700 py-3">Preview Produk</h3>
                            <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                                {images[0] ? (
                                    <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <Box size={40} />
                                        <span className="text-xs mt-2">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                                    {productName || "Nama Produk"}
                                </div>

                                <div className="text-red-500 font-bold text-lg">
                                    {enableVariations && variantItems.length > 0
                                        ? `Rp ${(Math.min(...variantItems.map(v => v.price || 0))).toLocaleString('id-ID')} - Rp ${(Math.max(...variantItems.map(v => v.price || 0))).toLocaleString('id-ID')}`
                                        : `Rp ${Number(globalPrice).toLocaleString('id-ID')}`
                                    }
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Check size={12} className="text-green-500" /> Tersedia
                                    </div>
                                    <span>|</span>
                                    <span>{brand || "No Brand"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                            <p className="font-semibold mb-1">Tips:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Pastikan foto produk jernih dan menarik.</li>
                                <li>Deskripsi lengkap membantu pembeli.</li>
                                <li>Gunakan variasi untuk warna/ukuran berbeda.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto flex justify-end gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium cursor-pointer"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors cursor-pointer"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}
