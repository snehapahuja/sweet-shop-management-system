import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './App';

const SweetForm = ({ sweetToEdit, onSweetSaved }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (sweetToEdit) {
      setName(sweetToEdit.name);
      setCategory(sweetToEdit.category);
      setPrice(sweetToEdit.price);
      setQuantity(sweetToEdit.quantity);
      setDescription(sweetToEdit.description || '');
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setQuantity('');
      setDescription('');
    }
  }, [sweetToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const method = sweetToEdit ? 'PUT' : 'POST';
    const url = sweetToEdit
      ? `${process.env.REACT_APP_API_URL}/api/sweets/${sweetToEdit._id}`
      : `${process.env.REACT_APP_API_URL}/api/sweets`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ name, category, price, quantity, description }),
      });

      const data = await response.json();

      if (response.ok) {
        onSweetSaved();
      } else {
        setMessage(data.msg || 'An error occurred');
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="message error">{message}</div>}
      
      <div>
        <label>Name: <span className="required">*</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter sweet name"
          required
        />
      </div>

      <div>
        <label>Category: <span className="required">*</span></label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          <option value="Traditional">Traditional</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Cake">Cake</option>
          <option value="Cookie">Cookie</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      <div>
        <label>Price (₹): <span className="required">*</span></label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          min="1"
          required
        />
      </div>

      <div>
        <label>Quantity: <span className="required">*</span></label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          min="0"
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter sweet description (optional)"
          rows="3"
        />
        <span className="help-text">Add a brief description of the sweet</span>
      </div>

      <div className="modal-footer">
        <button type="submit">
          {sweetToEdit ? '✓ Update Sweet' : '+ Add Sweet'}
        </button>
      </div>
    </form>
  );
};

export default SweetForm;