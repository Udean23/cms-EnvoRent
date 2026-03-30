import ModalWrapper from "../Category/ModalWrapper";
import { User, Mail, Shield, Calendar, Clock } from "lucide-react";

interface UserData {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface ViewUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserData | null;
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
};

const formatTime = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const ViewUserModal = ({ isOpen, onClose, user }: ViewUserModalProps) => {
    if (!user) return null;

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-4 font-semibold text-lg flex items-center justify-between shadow-sm">
                <span>Detail Karyawan</span>
            </div>
            
            <div className="p-6">
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold mb-3 shadow-inner">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mt-2 border border-emerald-200 capitalize shadow-sm">
                        {user.role}
                    </span>
                </div>

                <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mt-0.5 shrink-0">
                            <User size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Lengkap</p>
                            <p className="text-sm font-medium text-gray-800 mt-0.5">{user.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mt-0.5 shrink-0">
                            <Mail size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alamat Email</p>
                            <p className="text-sm font-medium text-gray-800 mt-0.5">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mt-0.5 shrink-0">
                            <Shield size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</p>
                            <p className="text-sm font-medium text-gray-800 mt-0.5 capitalize">{user.role}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200/60 mt-2">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mt-0.5 shrink-0">
                                <Calendar size={16} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Bergabung</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{formatDate(user.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mt-0.5 shrink-0">
                                <Clock size={16} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jam</p>
                                <p className="text-sm font-medium text-gray-800 mt-0.5">{formatTime(user.created_at)} WIB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none transition-colors text-sm shadow-sm"
                >
                    Tutup
                </button>
            </div>
        </ModalWrapper>
    );
};

export default ViewUserModal;
