import React, { useState, useEffect } from 'react';

const ActivityForm = ({ activity, fields, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    fieldId: '',
    activityType: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    quantity: '',
    unit: 'kg',
    weatherCondition: 'Güneşli',
    temperature: '',
    humidity: '',
    notes: '',
    cost: '0'
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        fieldId: activity.fieldId?._id || '',
        activityType: activity.activityType || '',
        date: activity.date?.split('T')[0] || '',
        duration: activity.duration || '',
        quantity: activity.quantity || '',
        unit: activity.unit || 'kg',
        weatherCondition: activity.weatherCondition || 'Güneşli',
        temperature: activity.temperature || '',
        humidity: activity.humidity || '',
        notes: activity.notes || '',
        cost: activity.cost || '0'
      });
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const activityTypes = ['Ekim', 'Sulama', 'GübreLeme', 'İlaçlama', 'Çapalama', 'Hasat', 'Depolama', 'Diğer'];
  const weatherOptions = ['Güneşli', 'Bulutlu', 'Yağmurlu', 'Kar', 'Dolu', 'Rüzgârlı'];
  const units = ['kg', 'litre', 'ton', 'adet', 'saat'];

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="mb-md">{activity ? '✏️ Aktiviteyi Güncelle' : '📝 Yeni Aktivite Ekle'}</h3>

      <div className="grid grid-2 gap-md">
        <div className="form-group">
          <label htmlFor="fieldId">Tarla *</label>
          <select
            id="fieldId"
            name="fieldId"
            value={formData.fieldId}
            onChange={handleChange}
            required
          >
            <option value="">Seçiniz</option>
            {fields.map((field) => (
              <option key={field._id} value={field._id}>
                {field.cropName} ({field.area} {field.areaUnit})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="activityType">Aktivite Tipi *</label>
          <select
            id="activityType"
            name="activityType"
            value={formData.activityType}
            onChange={handleChange}
            required
          >
            <option value="">Seçiniz</option>
            {activityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Tarih *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Süre (Saat)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            step="0.5"
            min="0"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Miktar</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            step="0.1"
            min="0"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit">Birim</label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weatherCondition">Hava Koşulu</label>
          <select
            id="weatherCondition"
            name="weatherCondition"
            value={formData.weatherCondition}
            onChange={handleChange}
          >
            {weatherOptions.map((weather) => (
              <option key={weather} value={weather}>
                {weather}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="temperature">Sıcaklık (°C)</label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            step="0.1"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="humidity">Nemlilik (%)</label>
          <input
            type="number"
            id="humidity"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cost">Maliyet (₺)</label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notlar</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Aktivite hakkında ek bilgiler..."
        ></textarea>
      </div>

      <div className="flex gap-md" style={{ justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={onCancel}
          disabled={loading}
        >
          İptal
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-small"
          disabled={loading}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;
