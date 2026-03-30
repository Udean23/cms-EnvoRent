import { useState, useEffect } from "react";
import ModalWrapper from "../Category/ModalWrapper";
import Swal from "sweetalert2";
import { useApiClient } from "@/core/helpers/ApiClient";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: User) => void;
    user: User | null;
}

const EditUserModal = ({ isOpen, onClose, onSuccess, user }: EditUserModalProps) => {
    const apiClient = useApiClient();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && isOpen) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPassword("");
            setShowPassword(false);
            setError(null);
        }
    }, [user, isOpen]);

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            setError("Nama dan Email wajib diisi.");
            return;
        }

        if (password && password.length < 8) {
            setError("Password minimal 8 karakter.");
            return;
        }

        if (!user) return;

        setLoading(true);
        setError(null);

        const payload: any = { 
            name, 
            email,
            role: "admin"
        };
        
        if (password) {
            payload.password = password;
        }

        try {
            const res = await apiClient.put(`/users/${user.id}`, payload);
            
            await Swal.fire({
                title: "Berhasil!",
                text: "Data karyawan berhasil diperbarui.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
            
            onSuccess(res.data.user);
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.response?.data?.error || "Terjadi kesalahan saat memperbarui karyawan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-4 font-semibold text-lg flex items-center justify-between shadow-sm">
                <span>Edit Karyawan</span>
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
                            Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Contoh: Budi Santoso"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError(null);
                            }}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            placeholder="Contoh: budi@envorent.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError(null);
                            }}
                            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Password Baru <span className="text-gray-400 font-normal">(opsional)</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Isi hanya jika ingin mengubah password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError(null);
                                }}
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none disabled:opacity-50 transition-colors text-sm"
                >
                    Batal
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 focus:outline-none disabled:opacity-50 transition-all text-sm flex items-center gap-2 shadow-sm hover:shadow-md"
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

export default EditUserModal;
