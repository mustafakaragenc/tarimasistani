import React, { useState, useEffect } from 'react';
import { fieldAPI, activityAPI } from '../utils/api';
import { useAuth } from '../utils/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFields: 0,
    totalActivities: 0,
    harvesting: 0,
    totalCost: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const fieldsRes = await fieldAPI.getAll();
      const activitiesRes = await activityAPI.getAll({});

      const fields = fieldsRes.data.fields || [];
      const activities = activitiesRes.data.activities || [];

      // İstatistik hesapla
      const totalCost = activities.reduce((sum, act) => sum + (act.cost || 0), 0);
      const harvestingCount = fields.filter((f) => f.status === 'Hasat').length;

      setStats({
        totalFields: fields.length,
        totalActivities: activities.length,
        harvesting: harvestingCount,
        totalCost: totalCost.toFixed(2)
      });

      // Son aktiviteleri getir
      setRecentActivities(activities.slice(0, 5));
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>👋 Hoş Geldiniz, {user?.name}!</h1>
        <p className="text-muted">Tarım operasyonlarınızın özeti</p>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* İstatistik Kartları */}
      <div className="grid grid-4 gap-md mb-lg">
        <div className="card text-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
          <h3 style={{ fontSize: '2rem', color: 'var(--primary-green)', margin: '0.5rem 0' }}>
            {stats.totalFields}
          </h3>
          <p className="text-muted">Toplam Tarla</p>
        </div>

        <div className="card text-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
          <h3 style={{ fontSize: '2rem', color: '#3B82F6', margin: '0.5rem 0' }}>
            {stats.totalActivities}
          </h3>
          <p className="text-muted">Toplam Aktivite</p>
        </div>

        <div className="card text-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
          <h3 style={{ fontSize: '2rem', color: '#F59E0B', margin: '0.5rem 0' }}>
            {stats.harvesting}
          </h3>
          <p className="text-muted">Hasat Zamanı</p>
        </div>

        <div className="card text-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <h3 style={{ fontSize: '2rem', color: '#EF4444', margin: '0.5rem 0' }}>
            {stats.totalCost} ₺
          </h3>
          <p className="text-muted">Toplam Maliyet</p>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="card">
        <h2 className="mb-md">📝 Son Aktiviteler</h2>

        {recentActivities.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Aktivite</th>
                <th>Tarla</th>
                <th>Tarih</th>
                <th>Miktar</th>
                <th>Maliyet</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity._id}>
                  <td style={{ fontWeight: '600' }}>{activity.activityType}</td>
                  <td>{activity.fieldId?.cropName}</td>
                  <td>{new Date(activity.date).toLocaleDateString('tr-TR')}</td>
                  <td>
                    {activity.quantity} {activity.unit}
                  </td>
                  <td style={{ color: '#EF4444', fontWeight: '600' }}>{activity.cost} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">Henüz aktivite kaydı yok</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
