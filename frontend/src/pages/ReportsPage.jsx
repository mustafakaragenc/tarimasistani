import React, { useState, useEffect } from 'react';
import { activityAPI, fieldAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const ReportsPage = () => {
  const [fields, setFields] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fieldsRes, activitiesRes] = await Promise.all([
        fieldAPI.getAll(),
        activityAPI.getAll({})
      ]);

      setFields(fieldsRes.data.fields || []);
      setActivities(activitiesRes.data.activities || []);
      setError(null);
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const selectedField = fields.find((f) => f._id === selectedFieldId);
  const fieldActivities = selectedFieldId
    ? activities.filter((a) => a.fieldId?._id === selectedFieldId)
    : [];

  const totalCost = fieldActivities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const activitiesByType = {};
  fieldActivities.forEach((a) => {
    activitiesByType[a.activityType] = (activitiesByType[a.activityType] || 0) + 1;
  });

  return (
    <div className="container">
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>📊 Raporlar</h1>
        <p className="text-muted">Tarla performansı ve analiz verileri</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="card mb-lg">
        <label htmlFor="fieldSelect">Tarla Seçiniz</label>
        <select
          id="fieldSelect"
          value={selectedFieldId}
          onChange={(e) => setSelectedFieldId(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {fields.map((field) => (
            <option key={field._id} value={field._id}>
              {field.cropName} ({field.area} {field.areaUnit})
            </option>
          ))}
        </select>
      </div>

      {selectedField && (
        <>
          {/* Tarla Özeti */}
          <div className="card mb-lg">
            <h2 className="mb-md">🌾 Tarla Özeti</h2>
            <div className="grid grid-4 gap-md">
              <div>
                <p className="text-muted mb-sm">Ürün</p>
                <p style={{ fontWeight: '600' }}>{selectedField.cropName}</p>
              </div>
              <div>
                <p className="text-muted mb-sm">Alan</p>
                <p style={{ fontWeight: '600' }}>
                  {selectedField.area} {selectedField.areaUnit}
                </p>
              </div>
              <div>
                <p className="text-muted mb-sm">Durum</p>
                <p style={{ fontWeight: '600' }}>{selectedField.status}</p>
              </div>
              <div>
                <p className="text-muted mb-sm">Toprak</p>
                <p style={{ fontWeight: '600' }}>{selectedField.soilType}</p>
              </div>
            </div>
          </div>

          {/* Maliyet Analizi */}
          <div className="card mb-lg">
            <h2 className="mb-md">💰 Maliyet Analizi</h2>
            <div className="grid grid-2 gap-md">
              <div style={{ textAlign: 'center' }}>
                <p className="text-muted mb-sm">Toplam Maliyet</p>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary-green)' }}>
                  {totalCost.toFixed(2)} ₺
                </h3>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p className="text-muted mb-sm">Alan Başına Maliyet</p>
                <h3 style={{ fontSize: '2rem', color: 'var(--dark-green)' }}>
                  {(totalCost / selectedField.area).toFixed(2)} ₺/{selectedField.areaUnit}
                </h3>
              </div>
            </div>

            {fieldActivities.length > 0 && (
              <table style={{ marginTop: '1.5rem' }}>
                <thead>
                  <tr>
                    <th>Aktivite</th>
                    <th>Sayı</th>
                    <th>Toplam Maliyet</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(activitiesByType).map(([type, count]) => {
                    const typeCost = fieldActivities
                      .filter((a) => a.activityType === type)
                      .reduce((sum, a) => sum + (a.cost || 0), 0);

                    return (
                      <tr key={type}>
                        <td style={{ fontWeight: '600' }}>{type}</td>
                        <td>{count}</td>
                        <td style={{ color: '#EF4444', fontWeight: '600' }}>
                          {typeCost.toFixed(2)} ₺
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Aktivite İstatistikleri */}
          <div className="card">
            <h2 className="mb-md">📈 Aktivite İstatistikleri</h2>

            {fieldActivities.length > 0 ? (
              <div className="grid grid-3 gap-md">
                {Object.entries(activitiesByType).map(([type, count]) => (
                  <div
                    key={type}
                    className="card text-center"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      cursor: 'default'
                    }}
                  >
                    <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', color: 'var(--primary-green)' }}>
                      {count}
                    </h3>
                    <p className="text-muted">{type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">Bu tarla için henüz aktivite kaydı yok</p>
            )}
          </div>
        </>
      )}

      {!selectedFieldId && fields.length > 0 && (
        <div className="card text-center">
          <p className="text-muted">Raporları görmek için bir tarla seçiniz</p>
        </div>
      )}

      {fields.length === 0 && (
        <div className="card text-center">
          <p className="text-muted mb-md">Henüz tarla eklenmemiş</p>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
