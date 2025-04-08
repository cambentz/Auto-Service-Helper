import React from "react";

const PolicyModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={handleClose}
    >
      <div
        className="bg-white max-w-2xl w-full max-h-[80vh] rounded-lg shadow-lg overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-[#1A3D61] mb-4">{title}</h2>
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{content}</div>
      </div>
    </div>
  );
};

export default PolicyModal;
