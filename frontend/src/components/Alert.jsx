import React from 'react';

const Alert = ({ type, message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      <div className="flex-between">
        <p>{message}</p>
        {onClose && (
          <button
            className="modal-close-btn"
            onClick={onClose}
            style={{ padding: '0.25rem 0.5rem' }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
