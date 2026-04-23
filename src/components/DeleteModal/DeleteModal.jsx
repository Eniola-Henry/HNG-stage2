import { useEffect, useRef } from "react";
import "./DeleteModal.css";

export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleEsc = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div
      className="delete-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="delete-modal__box">
        <h2 className="delete-modal__title" id="delete-modal-title">
          Confirm Deletion
        </h2>
        <p className="delete-modal__body">
          Are you sure you want to delete invoice{" "}
          <strong>#{invoiceId}</strong>? This action cannot be undone.
        </p>
        <div className="delete-modal__actions">
          <button ref={cancelRef} className="btn btn-edit" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
