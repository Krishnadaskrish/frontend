import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";

export const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-sand-200 p-6 animate-in fade-in zoom-in-95 duration-200 text-center">
        <div className="flex flex-col items-center">
          {/* Warning Icon */}
          <div className="w-12 h-12 rounded-full bg-ember-100 flex items-center justify-center mb-4 text-ember-500">
            <Trash2 className="h-5 w-5" />
          </div>
          
          <h3 className="font-display text-lg font-extrabold text-forest-950 mb-2">
            {title || "Confirm Deletion"}
          </h3>
          
          <p className="text-xs text-forest-500 mb-6 px-2 leading-relaxed">
            {message || "Are you sure you want to delete this profile? This action cannot be undone."}
          </p>
          
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 h-10 bg-sand-55 px-4 text-forest-700 text-xs font-bold rounded-xl hover:bg-sand-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 h-10 bg-ember-500 hover:bg-ember-600 text-white text-xs font-bold rounded-xl transition-colors shadow-soft cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
