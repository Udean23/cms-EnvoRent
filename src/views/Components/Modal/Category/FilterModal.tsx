import ModalWrapper from "./ModalWrapper";

const FilterModal = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="px-6 py-4 min-h-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-12">Filter Data</h2>
        <div className="grid grid-cols-2 gap-4 mt-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dibuat Dari Tanggal
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hingga Tanggal
            </label>
            <input
              type="date"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
          Reset
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Batal
        </button>
        <button className="px-4 py-2 rounded text-white bg-gradient-to-r from-[#0050E0] to-purple-600 hover:bg-gradient-to-tr hover:from-[#0050E0] hover:to-purple-600">
          Terapkan
        </button>
      </div>
    </ModalWrapper>
  );
};

export default FilterModal;
