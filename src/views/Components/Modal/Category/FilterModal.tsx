import ModalWrapper from "./ModalWrapper";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose}>
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-6 py-4 font-semibold text-lg flex items-center justify-between shadow-sm border-b border-emerald-700/50">
                <span>Filter Data Kategori</span>
            </div>
            
            <div className="p-6 min-h-48">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Dibuat Dari Tanggal
                        </label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-gray-600"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Hingga Tanggal
                        </label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-gray-600"
                        />
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex-1 sm:flex-none">
                    <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none transition-colors text-sm">
                        Reset
                    </button>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none transition-colors text-sm"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 focus:outline-none transition-all text-sm shadow-sm hover:shadow-md"
                    >
                        Terapkan
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default FilterModal;
