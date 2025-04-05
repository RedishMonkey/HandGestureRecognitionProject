import React from "react";
import "../styles/Modal.css";

export const Modal = ({ isOpen, setIsOpen, onClose = () => {}, children, title }) => {

  const handleClose = () => {
    onClose();
    setIsOpen(false);
  };

  if (!isOpen) return;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
