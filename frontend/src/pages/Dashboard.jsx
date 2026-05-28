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
    totalCost: 0,
    totalIncome: 0,
    netProfit: 0
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
      const totalIncome = activities.reduce((sum, act) => sum + (act.income || 0), 0);
      const netProfit = totalIncome - totalCost;
      const harvestingCount = fields.filter((f) => f.status === 'Hasat').length;

      setStats({
        totalFields: fields.length,
        totalActivities: activities.length,
        harvesting: harvestingCount,
        totalCost: totalCost.toFixed(2),
        totalIncome: totalIncome.toFixed(2),
        netProfit: netProfit.toFixed(2)
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
      <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', marginBottom: '0.5rem', fontWeight: '500' }}>
          Hoş Geldiniz, {user?.name}
        </h1>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>Tarım operasyonlarınızın güncel özeti</p>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* İstatistik Kartları */}
      <div className="grid grid-5 gap-md mb-lg">
        <div className="card text-center" style={{ backgroundColor: 'var(--light-green)', borderColor: 'rgba(124, 154, 112, 0.3)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', margin: '0.5rem 0', fontWeight: '600' }}>
            {stats.totalFields}
          </h3>
          <p style={{ fontWeight: '600', color: 'var(--dark-green)', margin: 0, fontSize: '0.95rem' }}>Toplam Tarla</p>
        </div>

        <div className="card text-center" style={{ backgroundColor: 'rgba(91, 130, 84, 0.08)', borderColor: 'rgba(91, 130, 84, 0.2)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--success-green)', margin: '0.5rem 0', fontWeight: '600' }}>
            {stats.totalIncome} ₺
          </h3>
          <p style={{ fontWeight: '600', color: 'var(--success-green)', margin: 0, fontSize: '0.95rem' }}>Toplam Gelir</p>
        </div>

        <div className="card text-center" style={{ backgroundColor: '#FFF5F2', borderColor: 'rgba(217, 70, 38, 0.2)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--error-red)', margin: '0.5rem 0', fontWeight: '600' }}>
            {stats.totalCost} ₺
          </h3>
          <p style={{ fontWeight: '600', color: 'var(--error-red)', margin: 0, fontSize: '0.95rem' }}>Toplam Gider</p>
        </div>

        <div className="card text-center" style={{ 
          backgroundColor: parseFloat(stats.netProfit) >= 0 ? 'var(--light-green)' : '#FFF5F2', 
          borderColor: parseFloat(stats.netProfit) >= 0 ? 'rgba(124, 154, 112, 0.3)' : 'rgba(217, 70, 38, 0.2)' 
        }}>
          <h3 style={{ 
            fontSize: '2.5rem', 
            fontFamily: 'var(--font-serif)', 
            color: parseFloat(stats.netProfit) >= 0 ? 'var(--success-green)' : 'var(--error-red)', 
            margin: '0.5rem 0', 
            fontWeight: '600' 
          }}>
            {stats.netProfit} ₺
          </h3>
          <p style={{ 
            fontWeight: '600', 
            color: parseFloat(stats.netProfit) >= 0 ? 'var(--success-green)' : 'var(--error-red)', 
            margin: 0, 
            fontSize: '0.95rem' 
          }}>Net Kar / Bakiye</p>
        </div>

        <div className="card text-center" style={{ backgroundColor: 'var(--lighter-green)', borderColor: 'rgba(124, 154, 112, 0.15)' }}>
          <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--gray-text)', margin: '0.5rem 0', fontWeight: '600' }}>
            {stats.totalActivities}
          </h3>
          <p style={{ fontWeight: '600', color: 'var(--gray-text)', margin: 0, fontSize: '0.95rem' }}>Toplam Aktivite</p>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="card">
        <h2 className="mb-md" style={{ fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', fontWeight: '500' }}>Son Aktiviteler</h2>

        {recentActivities.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Aktivite</th>
                  <th>Tarla</th>
                  <th>Tarih</th>
                  <th>Miktar</th>
                  <th>Gider</th>
                  <th>Gelir</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity._id}>
                    <td style={{ fontWeight: '600', color: 'var(--dark-green)' }}>{activity.activityType}</td>
                    <td>{activity.fieldId?.cropName}</td>
                    <td>{new Date(activity.date).toLocaleDateString('tr-TR')}</td>
                    <td>
                      {activity.quantity} {activity.unit}
                    </td>
                    <td style={{ color: 'var(--error-red)', fontWeight: '700' }}>{activity.cost || 0} ₺</td>
                    <td style={{ color: 'var(--success-green)', fontWeight: '700' }}>{activity.income || 0} ₺</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-muted" style={{ padding: '2rem 0' }}>Henüz aktivite kaydı yok</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
