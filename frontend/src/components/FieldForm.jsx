import React, { useState, useEffect } from 'react';

const FieldForm = ({ field, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    cropName: '',
    area: '',
    areaUnit: 'dönüm',
    plantingDate: '',
    expectedHarvestDate: '',
    soilType: 'Tınlı',
    waterRequirement: 'Normal',
    description: ''
  });

  useEffect(() => {
    if (field) {
      setFormData({
        cropName: field.cropName || '',
        area: field.area || '',
        areaUnit: field.areaUnit || 'dönüm',
        plantingDate: field.plantingDate?.split('T')[0] || '',
        expectedHarvestDate: field.expectedHarvestDate?.split('T')[0] || '',
        soilType: field.soilType || 'Tınlı',
        waterRequirement: field.waterRequirement || 'Normal',
        description: field.description || ''
      });
    }
  }, [field]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const cropOptions = ['Buğday', 'Arpa', 'Mısır', 'Pamuk', 'Domates', 'Biber', 'Patlıcan', 'Soğan', 'Patates', 'Diğer'];
  const soilOptions = ['Killi', 'Kumlu', 'Tınlı', 'Organik'];
  const waterOptions = ['Az', 'Normal', 'Çok'];

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="mb-md">{field ? '✏️ Tarla Bilgisini Güncelle' : '🌾 Yeni Tarla Ekle'}</h3>

      <div className="grid grid-2 gap-md">
        <div className="form-group">
          <label htmlFor="cropName">Ürün Adı *</label>
          <select
            id="cropName"
            name="cropName"
            value={formData.cropName}
            onChange={handleChange}
            required
          >
            <option value="">Seçiniz</option>
            {cropOptions.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="area">Tarla Alanı *</label>
          <input
            type="number"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
            step="0.1"
            min="0.1"
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="areaUnit">Alan Birimi</label>
          <select
            id="areaUnit"
            name="areaUnit"
            value={formData.areaUnit}
            onChange={handleChange}
          >
            <option value="dönüm">Dönüm</option>
            <option value="hektar">Hektar</option>
            <option value="m²">m²</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="soilType">Toprak Tipi</label>
          <select
            id="soilType"
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
          >
            {soilOptions.map((soil) => (
              <option key={soil} value={soil}>
                {soil}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="plantingDate">Ekim Tarihi *</label>
          <input
            type="date"
            id="plantingDate"
            name="plantingDate"
            value={formData.plantingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expectedHarvestDate">Beklenen Hasat Tarihi *</label>
          <input
            type="date"
            id="expectedHarvestDate"
            name="expectedHarvestDate"
            value={formData.expectedHarvestDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="waterRequirement">Su İhtiyacı</label>
          <select
            id="waterRequirement"
            name="waterRequirement"
            value={formData.waterRequirement}
            onChange={handleChange}
          >
            {waterOptions.map((water) => (
              <option key={water} value={water}>
                {water}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Açıklama</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tarla hakkında ek bilgiler..."
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

export default FieldForm;
