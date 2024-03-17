import React from 'react';
import './ConfirmationModal.css';

export default function ConfirmationModal({ message, onConfirm, onCancel }) {
  return (
    <div className="overlay">
      <div className="logoutConfirm" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="flexBtw">
          <button className="linkLi" onClick={onConfirm}>
            Aceptar
          </button>
          <button className="linkLi" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
