import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './App';
import SweetForm from './SweetForm';
import Modal from './Modal';

const AdminSweets = () => {
  const [sweets, setSweets] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const { token } = useContext(AuthContext);

  const fetchSweets = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sweets`, {
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSweets(data);
      } else {
        setMessageType('error');
        setMessage(data.msg || 'Failed to fetch sweets');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchSweets();
    }
  }, [token, fetchSweets]);

  const handleDelete = async (sweetId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sweets/${sweetId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessageType('success');
        setMessage(data.msg);
        fetchSweets();
      } else {
        setMessageType('error');
        setMessage(data.msg || 'Failed to delete sweet');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error');
    }
    setIsModalOpen(false);
  };

  const handleRestock = async (sweetId, quantity) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sweets/${sweetId}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessageType('success');
        setMessage(`Restocked ${data.name} by ${quantity}`);
        fetchSweets();
      } else {
        setMessageType('error');
        setMessage(data.msg || 'Failed to restock sweet');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error');
    }
    setIsModalOpen(false);
  };

  const openDeleteModal = (sweet) => {
    setModalContent(
      <>
        <div className="modal-header">
          <h2>Confirm Delete</h2>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="confirmation-icon">⚠️</div>
          <p>Are you sure you want to delete <strong>{sweet.name}</strong>?</p>
          <p style={{ color: '#718096', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            This action cannot be undone.
          </p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn-confirm" onClick={() => handleDelete(sweet._id)}>
            Delete
          </button>
        </div>
      </>
    );
    setIsModalOpen(true);
  };

  const openRestockModal = (sweet) => {
   
    const RestockForm = () => {
      const [quantity, setQuantity] = useState(10);
      
      const handleSubmit = (e) => {
        e.preventDefault();
        handleRestock(sweet._id, quantity);
      };

      return (
        <>
          <div className="modal-header">
            <h2>Restock Sweet</h2>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <p style={{ marginBottom: '1.5rem', color: '#4a5568' }}>
              Enter quantity to restock for <strong>{sweet.name}</strong>
            </p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Quantity to Add:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                  min="1"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">
                  Restock
                </button>
              </div>
            </form>
          </div>
        </>
      );
    };

    setModalContent(<RestockForm />);
    setIsModalOpen(true);
  };

  const openFormModal = (sweet = null) => {
    setModalContent(
      <>
        <div className="modal-header">
          <h2>{sweet ? 'Edit Sweet' : 'Add New Sweet'}</h2>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <SweetForm 
            sweetToEdit={sweet} 
            onSweetSaved={() => { 
              fetchSweets(); 
              setIsModalOpen(false); 
            }} 
          />
        </div>
      </>
    );
    setIsModalOpen(true);
  };

  return (
    <div className="admin-sweets-container">
      <div className="admin-header">
        <h2>Manage Sweets</h2>
        <button onClick={() => openFormModal()} className="btn-primary add-sweet-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add New Sweet
        </button>
      </div>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
          <button onClick={() => setMessage('')} className="close-message">&times;</button>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet) => (
              <tr key={sweet._id}>
                <td>{sweet.name}</td>
                <td>{sweet.category}</td>
                <td>₹{sweet.price}</td>
                <td>{sweet.quantity}</td>
                <td className="action-buttons">
                  <button onClick={() => openFormModal(sweet)} className="btn-edit">Edit</button>
                  <button onClick={() => openDeleteModal(sweet)} className="btn-danger">Delete</button>
                  <button onClick={() => openRestockModal(sweet)} className="btn-restock">Restock</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default AdminSweets;