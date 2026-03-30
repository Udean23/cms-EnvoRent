import { useState, useEffect } from "react";
import ModalWrapper from "./ModalWrapper";
import Swal from "sweetalert2";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Loader2 } from "lucide-react";

interface Category {
    id: number;
    name: string;
    productCount?: number;
    created_at: string;
    updated_at: string;
}

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category;
    onSuccess: (category: Category) => void;
}

const EditCategoryModal = ({ isOpen, onClose, category, onSuccess }: EditCategoryModalProps) => {
    const apiClient = useApiClient();
    const [name, setName] = useState(category?.name || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Sync state when props change
    useEffect(() => {
        if (category) {
            setName(category.name);
        }
    }, [category]);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Nama kategori tidak boleh kosong.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await apiClient.put(`/categories/${category.id}`, { name });
            
            await Swal.fire({
                title: "Berhasil!",
                text: "Kategori berhasil diperbarui.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            
            onSuccess(res.data.category);
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Terjadi kesalahan saat memperbarui kategori.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-4 font-semibold text-lg flex items-center justify-between shadow-sm">
                <span>Edit Kategori</span>
            </div>
            
            <div className="p-6">
                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center">
                        <span className="font-medium">{error}</span>
                    </div>
                )}
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Nama Kategori <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Elektronik, Pakaian..."
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError(null);
                            }}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={() => {
                        onClose();
                        setError(null);
                    }}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none disabled:opacity-50 transition-colors text-sm"
                >
                    Batal
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading || !name.trim() || name === category?.name}
                    className="px-5 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 focus:outline-none disabled:opacity-50 disabled:grayscale transition-all text-sm flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        "Simpan Perubahan"
                    )}
                </button>
            </div>
        </ModalWrapper>
    );
};

export default EditCategoryModal;
