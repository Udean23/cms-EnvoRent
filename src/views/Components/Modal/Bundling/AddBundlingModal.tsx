import React, { useEffect, useState } from "react";
import { X, Upload, Loader2, Search, Plus, Trash2, Package, Layers, CheckCircle2, Save, ShoppingCart } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  name: string;
}

interface AddBundlingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bundle?: any;
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const AddBundlingModal = ({ isOpen, onClose, onSuccess, bundle }: AddBundlingModalProps) => {
  const apiClient = useApiClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchDataLoading, setFetchDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
  });
  
  const [materials, setMaterials] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
      if (bundle) {
        setFormData({
          name: bundle.name || "",
          price: bundle.price?.toString() || "",
          category_id: bundle.category_id?.toString() || "",
          description: bundle.description || "",
        });
        setMaterials(bundle.materials?.map((m: any) => ({
          product_id: m.product_id,
          name: m.product?.name,
          price: m.product?.price,
          image: m.product?.image,
          quantity: m.quantity
        })) || []);
        if (bundle.image) {
          setImagePreview(bundle.image.startsWith('http') ? bundle.image : `http://localhost:8000/storage/${bundle.image}`);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, bundle]);

  const fetchInitialData = async () => {
    setFetchDataLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        apiClient.get("/categories"),
        apiClient.get("/products")
      ]);
      setCategories(catRes.data.categories || []);
      setProducts(prodRes.data.products || []);
    } catch (error) {
      console.error("Failed to fetch initial data", error);
    } finally {
      setFetchDataLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category_id: "", description: "" });
    setMaterials([]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleProduct = (product: any) => {
    setMaterials(prev => {
      const exists = prev.find(m => m.product_id === product.id);
      if (exists) return prev.filter(m => m.product_id !== product.id);
      return [...prev, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      }];
    });
  };

  const updateMaterialQty = (id: number, qty: number) => {
    setMaterials(prev => prev.map(m => m.product_id === id ? { ...m, quantity: Math.max(1, qty) } : m));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (materials.length === 0) {
      Swal.fire("Peringatan", "Pilih minimal 1 produk dalam bundling", "warning");
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category_id", formData.category_id);
    data.append("description", formData.description);
    if (imageFile) data.append("image", imageFile);
    
    if (bundle) data.append("_method", "PUT");

    materials.forEach((m, i) => {
      data.append(`materials[${i}][product_id]`, m.product_id.toString());
      data.append(`materials[${i}][quantity]`, m.quantity.toString());
    });

    try {
      const url = bundle ? `/bundlings/${bundle.id}` : "/bundlings";
      await apiClient.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      Swal.fire("Berhasil", bundle ? "Bundling diperbarui" : "Bundling ditambahkan", "success");
      onSuccess();
      onClose();
    } catch (error: any) {
      Swal.fire("Gagal", error.response?.data?.message || "Kesalahan sistem", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategoryId === "" || p.category_id.toString() === selectedCategoryId)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-2xl border border-white/50 w-full max-w-5xl max-h-[95vh] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-black text-gray-800 tracking-tight">
            {bundle ? "Edit Bundling" : "Tambah Bundling Baru"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors border-none bg-transparent cursor-pointer">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Side: Form */}
          <form id="bundling-form" onSubmit={handleSubmit} className="w-full md:w-1/2 p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar border-r border-gray-100">
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-emerald-400 transition-all shadow-sm">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Upload size={24} className="mb-2" />
                    <span className="text-[10px] font-bold uppercase">Upload Image</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Bundling</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Harga (IDR)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Kategori</label>
                  <select required name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-[46px]">
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Deskripsi</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium resize-none" />
              </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Produk Terpilih ({materials.length})</label>
                <div className="space-y-2">
                    {materials.map(m => (
                        <div key={m.product_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white shadow-sm">
                                <img src={`http://localhost:8000/storage/${m.image}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h6 className="text-[11px] font-bold truncate text-gray-700">{m.name}</h6>
                                <p className="text-[9px] text-gray-400 font-bold">{formatRupiah(m.price)}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-100">
                                <button type="button" onClick={() => updateMaterialQty(m.product_id, m.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-rose-500 border-none bg-transparent cursor-pointer"><X size={10} className="rotate-45" /></button>
                                <span className="text-xs font-bold w-4 text-center">{m.quantity}</span>
                                <button type="button" onClick={() => updateMaterialQty(m.product_id, m.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-emerald-500 border-none bg-transparent cursor-pointer"><Plus size={10} /></button>
                            </div>
                            <button type="button" onClick={() => toggleProduct({id: m.product_id})} className="text-gray-300 hover:text-rose-500 transition-colors border-none bg-transparent cursor-pointer">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                    {materials.length === 0 && (
                        <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl text-gray-300 text-[10px] font-bold uppercase">Belum ada produk terpilih</div>
                    )}
                </div>
            </div>
          </form>

          {/* Right Side: Product Library */}
          <div className="w-full md:w-1/2 bg-gray-50/50 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-white/50 backdrop-blur-md">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                    <input type="text" placeholder="Cari produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border-none rounded-xl pl-12 pr-4 py-3 text-sm font-medium outline-none shadow-sm focus:ring-2 focus:ring-emerald-500/10" />
                </div>
                <div className="flex gap-2 overflow-x-auto mt-3 pb-2 custom-scrollbar">
                    <button onClick={() => setSelectedCategoryId("")} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${selectedCategoryId === "" ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>All</button>
                    {categories.map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategoryId(cat.id.toString())} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${selectedCategoryId === cat.id.toString() ? 'bg-emerald-500 text-white' : 'bg-white text-gray-400 hover:bg-gray-100'}`}>{cat.name}</button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-4 custom-scrollbar">
                {fetchDataLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-white/50 rounded-2xl animate-pulse border border-white" />)
                ) : filteredProducts.map(p => {
                    const isSelected = materials.find(m => m.product_id === p.id);
                    return (
                        <div key={p.id} onClick={() => toggleProduct(p)} className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 relative ${isSelected ? 'border-emerald-500 bg-white shadow-md' : 'border-transparent bg-white/80 hover:bg-white hover:shadow-sm'}`}>
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                                <img src={`http://localhost:8000/storage/${p.image}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                                <h6 className="text-[10px] font-bold truncate text-gray-800 uppercase">{p.name}</h6>
                                <p className="text-[9px] font-black text-emerald-500">{formatRupiah(p.price)}</p>
                            </div>
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-lg">
                                    <CheckCircle2 size={12} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6 border-t border-gray-100 flex gap-4 flex-shrink-0 bg-white">
          <button type="button" onClick={onClose} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl transition-all border-none cursor-pointer">Batal</button>
          <button form="bundling-form" type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 border-none cursor-pointer">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <span>Simpan Bundling</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBundlingModal;
