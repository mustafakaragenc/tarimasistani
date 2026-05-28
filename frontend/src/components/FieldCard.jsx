import React from 'react';
import { useNavigate } from 'react-router-dom';

const FieldCard = ({ field, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const statusColors = {
    'Hazırlık': '#6B7280',
    'Ekim': '#3B82F6',
    'Büyüme': '#10B981',
    'Olgunlaşma': '#F59E0B',
    'Hasat': '#EF4444',
    'Tamamlandı': '#8B5CF6'
  };

  const daysRemaining = new Date(field.expectedHarvestDate) - new Date();
  const daysRemainingNumber = Math.ceil(daysRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{field.cropName}</h3>
          <p className="text-muted">
            📍 {field.area} {field.areaUnit}
          </p>
        </div>
        <span
          className="badge"
          style={{ backgroundColor: statusColors[field.status] + '22', color: statusColors[field.status] }}
        >
          {field.status}
        </span>
      </div>

      <div className="card-body">
        <div className="grid grid-2 gap-sm">
          <div>
            <p className="text-muted mb-sm">Ekim Tarihi</p>
            <p style={{ fontWeight: '600' }}>
              {new Date(field.plantingDate).toLocaleDateString('tr-TR')}
            </p>
          </div>
          <div>
            <p className="text-muted mb-sm">Hasat Tarihi</p>
            <p style={{ fontWeight: '600' }}>
              {new Date(field.expectedHarvestDate).toLocaleDateString('tr-TR')}
            </p>
          </div>
          <div>
            <p className="text-muted mb-sm">Toprak Tipi</p>
            <p style={{ fontWeight: '600' }}>{field.soilType}</p>
          </div>
          <div>
            <p className="text-muted mb-sm">Kalan Gün</p>
            <p style={{ fontWeight: '600', color: daysRemainingNumber < 30 ? '#EF4444' : '#10B981' }}>
              {daysRemainingNumber > 0 ? `${daysRemainingNumber} gün` : 'Hasat zamanı!'}
            </p>
          </div>
        </div>

        {field.description && (
          <div className="mt-md">
            <p className="text-muted mb-sm">Açıklama</p>
            <p>{field.description}</p>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button
          className="btn btn-secondary btn-small"
          onClick={() => navigate(`/fields/${field._id}`)}
        >
          Detayları Gör
        </button>
        <button className="btn btn-primary btn-small" onClick={() => onEdit(field)}>
          Düzenle
        </button>
        <button className="btn btn-danger btn-small" onClick={() => onDelete(field._id)}>
          Sil
        </button>
      </div>
    </div>
  );
};

export default FieldCard;
