import React from 'react';

const ActivityCard = ({ activity, onEdit, onDelete }) => {
  const activityIcons = {
    'Ekim': '🌱',
    'Sulama': '💧',
    'GübreLeme': '🧪',
    'İlaçlama': '🦠',
    'Çapalama': '🛠️',
    'Hasat': '🌾',
    'Depolama': '📦',
    'Diğer': '📝'
  };

  const weatherIcons = {
    'Güneşli': '☀️',
    'Bulutlu': '☁️',
    'Yağmurlu': '🌧️',
    'Kar': '❄️',
    'Dolu': '⛈️',
    'Rüzgârlı': '💨'
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">
            {activityIcons[activity.activityType]} {activity.activityType}
          </h3>
          <p className="text-muted">
            📅 {new Date(activity.date).toLocaleDateString('tr-TR')}
          </p>
        </div>
        <span className="badge">{activity.fieldId?.cropName}</span>
      </div>

      <div className="card-body">
        <div className="grid grid-2 gap-sm">
          {activity.duration && (
            <div>
              <p className="text-muted mb-sm">Süre</p>
              <p style={{ fontWeight: '600' }}>{activity.duration} saat</p>
            </div>
          )}

          {activity.quantity && (
            <div>
              <p className="text-muted mb-sm">Miktar</p>
              <p style={{ fontWeight: '600' }}>
                {activity.quantity} {activity.unit}
              </p>
            </div>
          )}

          {activity.temperature && (
            <div>
              <p className="text-muted mb-sm">Sıcaklık</p>
              <p style={{ fontWeight: '600' }}>{activity.temperature}°C</p>
            </div>
          )}

          {activity.humidity && (
            <div>
              <p className="text-muted mb-sm">Nemlilik</p>
              <p style={{ fontWeight: '600' }}>{activity.humidity}%</p>
            </div>
          )}

          {activity.weatherCondition && (
            <div>
              <p className="text-muted mb-sm">Hava</p>
              <p style={{ fontWeight: '600' }}>
                {weatherIcons[activity.weatherCondition]} {activity.weatherCondition}
              </p>
            </div>
          )}

          {activity.cost > 0 && (
            <div>
              <p className="text-muted mb-sm">Gider</p>
              <p style={{ fontWeight: '600', color: 'var(--error-red)' }}>{activity.cost} ₺</p>
            </div>
          )}

          {activity.income > 0 && (
            <div>
              <p className="text-muted mb-sm">Gelir</p>
              <p style={{ fontWeight: '600', color: 'var(--success-green)' }}>{activity.income} ₺</p>
            </div>
          )}
        </div>

        {activity.notes && (
          <div className="mt-md">
            <p className="text-muted mb-sm">Notlar</p>
            <p>{activity.notes}</p>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button className="btn btn-primary btn-small" onClick={() => onEdit(activity)}>
          Düzenle
        </button>
        <button className="btn btn-danger btn-small" onClick={() => onDelete(activity._id)}>
          Sil
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;
