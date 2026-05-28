import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      {/* HERO SECTION - SAGE GREEN BACKGROUND */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Toprağın gücü, akıllı teknolojiyle buluşuyor.
          </h1>
          <p className="hero-subtitle">
            Tarlalarınızdaki her ekim, sulama ve hasat sürecini kolayca takip edin, verimliliğinizi bilimsel yöntemlerle artırın.
          </p>
          <p className="hero-description">
            Tarım Asistanı, çiftçilerin modern teknolojiyi kullanarak arazilerini uçtan uca yönetmelerini, faaliyet giderlerini analiz etmelerini ve sürdürülebilir tarım yapmalarını sağlayan yeni nesil dijital yönetim sistemidir.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-yellow btn-large-custom" onClick={() => navigate('/register')}>
              Hemen Başlayın 🌾
            </button>
            <button className="btn btn-secondary-custom" onClick={() => navigate('/login')}>
              Giriş Yapın
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - SAND/CREAM BACKGROUND */}
      <section className="home-features-section">
        <div className="features-container">
          <div className="features-header">
            <span className="features-tag">ÖZELLİKLER</span>
            <h2 className="features-section-title">Neden Tarım Asistanı?</h2>
            <p className="features-section-subtitle">Tarlanızı dijitalleştirmek ve veriminizi artırmak için ihtiyacınız olan her şey tek bir platformda.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">📊</div>
              <h3 className="feature-card-title">Tarlaları Takip Et</h3>
              <p className="feature-card-text">
                Tüm tarım arazilerinizi konum, yüzölçümü ve ürün tipleriyle kaydedin. Her tarlanın güncel durumunu anlık olarak görüntüleyin.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">📈</div>
              <h3 className="feature-card-title">Aktiviteleri Planla</h3>
              <p className="feature-card-text">
                Sulama, gübreleme, ilaçlama ve hasat faaliyetlerini takvim üzerinden düzenleyin. Hiçbir adımı kaçırmadan tam zamanında uygulayın.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">🎯</div>
              <h3 className="feature-card-title">Giderleri Analiz Et</h3>
              <p className="feature-card-text">
                Yapılan harcamaları ve elde edilen gelirleri tarlalar bazında grafikleştirin. Karlılığınızı artıracak kararları verilerle alın.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
