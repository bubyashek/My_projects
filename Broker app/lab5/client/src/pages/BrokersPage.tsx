import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBrokers, createBroker, updateBroker, deleteBroker } from '../store/slices/brokersSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from '../components/ConfirmModal';

export default function BrokersPage() {
  const dispatch = useAppDispatch();
  const { brokers, loading } = useAppSelector((state) => state.brokers);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [brokerToDelete, setBrokerToDelete] = useState<string | null>(null);
  const [editingBroker, setEditingBroker] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', initialFunds: 100000 });

  useEffect(() => {
    dispatch(fetchBrokers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBroker) {
      await dispatch(updateBroker({ id: editingBroker.id, updates: formData }));
    } else {
      await dispatch(createBroker(formData));
    }
    setShowModal(false);
    setEditingBroker(null);
    setFormData({ name: '', initialFunds: 100000 });
  };

  const handleEdit = (broker: any) => {
    setEditingBroker(broker);
    setFormData({ name: broker.name, initialFunds: broker.initialFunds });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    setBrokerToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (brokerToDelete) {
      await dispatch(deleteBroker(brokerToDelete));
      setBrokerToDelete(null);
    }
  };

  const openCreateModal = () => {
    setEditingBroker(null);
    setFormData({ name: '', initialFunds: 100000 });
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Загрузка брокеров...</div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h1>Управление Брокерами</h1>
          <button className="button button-primary" onClick={openCreateModal}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
            Добавить Брокера
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Начальные Средства</th>
                <th>Текущие Средства</th>
                <th>Портфель</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {brokers.map((broker) => (
                <tr key={broker.id}>
                  <td data-label="Имя">
                    <strong style={{ color: '#5a67d8' }}>{broker.name}</strong>
                  </td>
                  <td data-label="Начальные Средства">${broker.initialFunds.toLocaleString()}</td>
                  <td data-label="Текущие Средства">${broker.currentFunds.toLocaleString()}</td>
                  <td data-label="Портфель">
                    {Object.keys(broker.portfolio).length > 0 
                      ? Object.entries(broker.portfolio).map(([symbol, qty]) => `${symbol}: ${qty}`).join(', ')
                      : <span style={{ color: '#6c757d' }}>Пусто</span>}
                  </td>
                  <td data-label="Действия">
                    <button 
                      className="button button-primary" 
                      onClick={() => handleEdit(broker)}
                      style={{ marginRight: '8px', marginBottom: '8px' }}
                    >
                      <FontAwesomeIcon icon={faEdit} style={{ marginRight: '6px' }} />
                      Изменить
                    </button>
                    <button 
                      className="button button-danger" 
                      onClick={() => handleDelete(broker.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} style={{ marginRight: '6px' }} />
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingBroker ? 'Редактировать Брокера' : 'Добавить Брокера'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Имя</label>
                <input
                  className="input"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Введите имя брокера"
                />
              </div>
              <div className="form-group">
                <label>Начальные Средства ($)</label>
                <input
                  className="input"
                  type="number"
                  value={formData.initialFunds}
                  onChange={(e) => setFormData({ ...formData, initialFunds: Number(e.target.value) })}
                  required
                  min="0"
                  placeholder="100000"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="button button-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Отмена
                </button>
                <button type="submit" className="button button-primary">
                  {editingBroker ? 'Обновить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmDelete}
        title="Удаление брокера"
        message="Вы уверены, что хотите удалить этого брокера? Это действие нельзя отменить."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
        confirmText="Удалить"
        cancelText="Отмена"
        type="danger"
      />
    </div>
  );
}
