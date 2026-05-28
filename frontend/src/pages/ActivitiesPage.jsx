import React, { useState, useEffect } from 'react';
import { activityAPI, fieldAPI } from '../utils/api';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const ActivitiesPage = () => {
  const [activities, setActivities] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [activitiesRes, fieldsRes] = await Promise.all([
        activityAPI.getAll({}),
        fieldAPI.getAll()
      ]);

      setActivities(activitiesRes.data.activities || []);
      setFields(fieldsRes.data.fields || []);
      setError(null);
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = () => {
    if (fields.length === 0) {
      setError('Aktivite eklemek için önce en az bir tarla eklemeniz gerekir');
      return;
    }
    setEditingActivity(null);
    setShowForm(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Bu aktiviteyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await activityAPI.delete(activityId);
      setActivities(activities.filter((a) => a._id !== activityId));
      setError(null);
    } catch (err) {
      setError('Aktivite silinirken hata oluştu');
      console.error(err);
    }
  };

  const handleSubmitForm = async (formData) => {
    try {
      setSubmitting(true);

      if (editingActivity) {
        await activityAPI.update(editingActivity._id, formData);
        // Güncellenmiş aktiviteyi al ve listede güncelle
        const response = await activityAPI.getById(editingActivity._id);
        setActivities(
          activities.map((a) =>
            a._id === editingActivity._id ? response.data.activity : a
          )
        );
      } else {
        const response = await activityAPI.create(formData);
        setActivities([response.data.activity, ...activities]);
      }

      setShowForm(false);
      setEditingActivity(null);
      setError(null);
    } catch (err) {
      setError('Aktivite kaydedilirken hata oluştu');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const filteredActivities = filterType
    ? activities.filter((a) => a.activityType === filterType)
    : activities;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <div className="flex-between">
          <div>
            <h1>Aktiviteler</h1>
            <p className="text-muted">Toplam {activities.length} aktivite</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddActivity}
            style={{ padding: '0.75rem 1.5rem' }}
            disabled={fields.length === 0}
          >
            + Yeni Aktivite Ekle
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} />}

      {showForm && (
        <ActivityForm
          activity={editingActivity}
          fields={fields}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          loading={submitting}
        />
      )}

      {activities.length > 0 && (
        <div className="card mb-lg">
          <label htmlFor="filterType">Aktivite Filtreleme</label>
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">Tümü</option>
            <option value="Ekim">Ekim</option>
            <option value="Sulama">Sulama</option>
            <option value="GübreLeme">Gübre Leme</option>
            <option value="İlaçlama">İlaçlama</option>
            <option value="Çapalama">Çapalama</option>
            <option value="Hasat">Hasat</option>
            <option value="Depolama">Depolama</option>
          </select>
        </div>
      )}

      {filteredActivities.length > 0 ? (
        <div className="grid grid-2">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center">
          <p className="text-muted mb-md">
            {filterType ? 'Bu türde aktivite bulunamadı' : 'Henüz aktivite eklenmemiş'}
          </p>
          {activities.length === 0 && (
            <button className="btn btn-primary" onClick={handleAddActivity} disabled={fields.length === 0}>
              İlk Aktiviteyi Ekle
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
