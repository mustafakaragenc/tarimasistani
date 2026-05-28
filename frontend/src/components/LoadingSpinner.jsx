import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p className="text-center mt-md">Yükleniyor...</p>
    </div>
  );
};

export default LoadingSpinner;
