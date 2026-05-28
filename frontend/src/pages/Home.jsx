import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Solda - Tarım Asistanı Kare */}
        <div className="home-left">
          <div className="home-square">
            <h1 className="home-title">🌾</h1>
            <h2 className="home-subtitle">Tarım<br />Asistanı</h2>
            <p className="home-description">
              Çiftçilerin tarlalarındaki ekim, sulama ve hasat süreçlerini kolayca takip etmelerini sağlayan akıllı çiftçi uygulaması
            </p>
            <div className="home-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Başlayın 🚀
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                Giriş Yapın
              </button>
            </div>
          </div>
        </div>

        {/* Sağda - 3 Özellik Dikdörtgeni */}
        <div className="home-right">
          <div className="home-feature">
            <h3 className="feature-icon">📊</h3>
            <h4 className="feature-title">Takip Et</h4>
            <p className="feature-text">Tarlalarını gerçek zamanlı takip et</p>
          </div>

          <div className="home-feature">
            <h3 className="feature-icon">📈</h3>
            <h4 className="feature-title">Analiz Yap</h4>
            <p className="feature-text">Verimlilik verilerini analiz et</p>
          </div>

          <div className="home-feature">
            <h3 className="feature-icon">🎯</h3>
            <h4 className="feature-title">Optimize Et</h4>
            <p className="feature-text">Üretimi optimize et ve maliyeti düşür</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
