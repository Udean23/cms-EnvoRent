import { useState, useEffect } from "react";
import swal from "sweetalert2";
import ModalWrapper from "./ModalWrapper";

const EditSizeModal = ({ isOpen, onClose, defaultValue }) => {
  const [sizeName, setSizeName] = useState("");

  useEffect(() => {
    if (defaultValue) {
      setSizeName(defaultValue);
    }
  }, [defaultValue, isOpen]);
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-gradient-to-r from-[#0050E0] to-purple-600 text-white px-6 py-3 font-semibold">
        Edit Size
      </div>
      <div className="p-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Size<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)}
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
          onClick={() => {
            if (!sizeName.trim()) {
              swal.fire({
                title: "Error!",
                text: "Nama size tidak boleh kosong!",
                icon: "error"
              });
              return;
            }
            swal.fire({
              title: "Berhasil!",
              text: "Size berhasil diperbarui.",
              icon: "success"
            }).then(() => {
              setSizeName("");
              onClose();
            });
          }}
          className="px-4 py-2 text-white rounded bg-gradient-to-r from-[#0050E0] to-purple-600 hover:bg-gradient-to-tr hover:from-[#0050E0] hover:to-purple-600"
        >
          Simpan
        </button>
      </div>
    </ModalWrapper>
  );
};

export default EditSizeModal;