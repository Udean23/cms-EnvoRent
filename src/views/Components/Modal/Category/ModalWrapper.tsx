const ModalWrapper = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-lg w-100 max-w-md overflow-hidden"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
