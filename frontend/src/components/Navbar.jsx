import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌾 Tarım Asistanı
        </Link>

        {isAuthenticated ? (
          <>
            <ul className="nav-links">
              <li>
                <Link to="/dashboard" className="nav-link">
                  Gösterge Paneli
                </Link>
              </li>
              <li>
                <Link to="/fields" className="nav-link">
                  Tarlalar
                </Link>
              </li>
              <li>
                <Link to="/activities" className="nav-link">
                  Aktiviteler
                </Link>
              </li>
              <li>
                <Link to="/reports" className="nav-link">
                  Raporlar
                </Link>
              </li>
            </ul>

            <div className="nav-user">
              <div className="user-info">
                <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: '600' }}>{user?.name}</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--gray-text)' }}>
                    {user?.email}
                  </p>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Çıkış Yap
              </button>
            </div>
          </>
        ) : (
          <div className="nav-user">
            <Link to="/login" className="btn btn-primary btn-small">
              Giriş Yap
            </Link>
            <Link to="/register" className="btn btn-secondary btn-small">
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
