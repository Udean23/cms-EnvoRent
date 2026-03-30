import React, { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { useApiClient } from "@/core/helpers/ApiClient";
import Swal from "sweetalert2";

interface Category {
  id: number;
  name: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any; // If provided, we are in Edit mode
}

const AddProductModal = ({ isOpen, onClose, onSuccess, product }: AddProductModalProps) => {
  const apiClient = useApiClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    description: "",
    stock: "0",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        setFormData({
          name: product.name || "",
          price: product.price?.toString() || "",
          category_id: product.category_id?.toString() || "",
          description: product.description || "",
          stock: product.stock?.toString() || "0",
        });
        if (product.image) {
            // Assume image is a URL or relative path handled by backend
            setImagePreview(product.image.startsWith('http') ? product.image : `http://localhost:8000/storage/${product.image}`);
        }
      } else {
        setFormData({
          name: "",
          price: "",
          category_id: "",
          description: "",
          stock: "0",
        });
        setImageFile(null);
        setImagePreview(null);
      }
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    setFetchingCategories(true);
    try {
      const response = await apiClient.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setFetchingCategories(false);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category_id", formData.category_id);
    data.append("description", formData.description);
    data.append("stock", formData.stock);
    if (imageFile) {
      data.append("image", imageFile);
    }
    
    // Laravel PUT request with files can be tricky, often requires _method spoofing
    if (product) {
        data.append("_method", "PUT");
    }

    try {
      if (product) {
        await apiClient.post(`/products/${product.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire("Berhasil", "Produk berhasil diperbarui", "success");
      } else {
        await apiClient.post("/products", data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire("Berhasil", "Produk berhasil ditambahkan", "success");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Failed to save product", error);
      Swal.fire("Gagal", error.response?.data?.message || "Terjadi kesalahan saat menyimpan produk", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl border border-white/50 w-full max-w-xl max-h-[95vh] flex flex-col rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-xl font-black text-gray-800 tracking-tight">
            {product ? "Edit Produk" : "Tambah Produk Baru"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* Image Upload Area */}
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
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleImageChange} 
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">Format: JPG, PNG, WEBP (Max 2MB)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Produk</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="Misal: Tenda Dome 4P"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Harga (IDR)</label>
              <input
                required
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Stok Barang</label>
              <input
                required
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Kategori</label>
            <select
                required
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-[46px]"
            >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
            {fetchingCategories && <p className="text-[10px] text-emerald-500 ml-1 animate-pulse">Memuat kategori...</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Deskripsi</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium resize-none"
              placeholder="Jelaskan detail produk Anda di sini..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Produk</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
