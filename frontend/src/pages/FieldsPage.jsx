import React, { useState, useEffect } from 'react';
import { fieldAPI } from '../utils/api';
import FieldCard from '../components/FieldCard';
import FieldForm from '../components/FieldForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const FieldsPage = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await fieldAPI.getAll();
      setFields(response.data.fields || []);
      setError(null);
    } catch (err) {
      setError('Tarlalar yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    setEditingField(null);
    setShowForm(true);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setShowForm(true);
  };

  const handleDeleteField = async (fieldId) => {
    if (!window.confirm('Bu tarlayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await fieldAPI.delete(fieldId);
      setFields(fields.filter((f) => f._id !== fieldId));
      setError(null);
    } catch (err) {
      setError('Tarla silinirken hata oluştu');
      console.error(err);
    }
  };

  const handleSubmitForm = async (formData) => {
    try {
      setSubmitting(true);

      if (editingField) {
        await fieldAPI.update(editingField._id, formData);
        setFields(
          fields.map((f) =>
            f._id === editingField._id ? { ...f, ...formData } : f
          )
        );
      } else {
        const response = await fieldAPI.create(formData);
        setFields([...fields, response.data.field]);
      }

      setShowForm(false);
      setEditingField(null);
      setError(null);
    } catch (err) {
      setError('Form kaydedilirken hata oluştu');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingField(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="flex-between">
          <div>
            <h1>Tarlalarım</h1>
            <p className="text-muted">Toplam {fields.length} tarla</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddField}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            + Yeni Tarla Ekle
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {showForm && (
        <FieldForm
          field={editingField}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          loading={submitting}
        />
      )}

      {fields.length > 0 ? (
        <div className="grid grid-2">
          {fields.map((field) => (
            <FieldCard
              key={field._id}
              field={field}
              onEdit={handleEditField}
              onDelete={handleDeleteField}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-muted mb-md">Henüz tarla eklenmemiş</p>
          <button className="btn btn-primary" onClick={handleAddField}>
            İlk Tarlayı Ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default FieldsPage;
