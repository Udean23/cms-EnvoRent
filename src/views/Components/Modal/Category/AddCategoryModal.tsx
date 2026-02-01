import ModalWrapper from "./ModalWrapper";
import Swal from "sweetalert2";

const AddCategoryModal = ({ isOpen, onClose }) => {
  const handleSave = () => {
    Swal.fire({
      title: "Berhasil!",
      text: "Kategori berhasil ditambahkan.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      onClose();
    });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-gradient-to-r from-[#0050E0] to-purple-600 text-white px-6 py-3 font-semibold">
        Tambah Kategori Baru
      </div>
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Nama Kategori"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded text-white bg-gradient-to-r from-[#0050E0] to-purple-600 hover:bg-gradient-to-tr hover:from-[#0050E0] hover:to-purple-600"
        >
          Tambah
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddCategoryModal;
