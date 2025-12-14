import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './App';

const SweetList = () => {
  const [sweets, setSweets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useContext(AuthContext);

  const fetchSweets = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/sweets`;
      const params = new URLSearchParams();

      if (searchQuery) params.append('name', searchQuery);
      if (categoryFilter) params.append('category', categoryFilter);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      if (params.toString()) {
        url = `${process.env.REACT_APP_API_URL}/api/sweets/search?${params.toString()}`;
      }

      const response = await fetch(url, {
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
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery, categoryFilter, minPrice, maxPrice]);

  useEffect(() => {
    if (token) {
      fetchSweets();
    }
  }, [token, fetchSweets]);

  const handlePurchase = async (sweetId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sweets/${sweetId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ quantity: 1 }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessageType('success');
        setMessage(`✅ Purchased ${data.name}!`);
        fetchSweets();
        
        // Auto-hide message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessageType('error');
        setMessage(data.msg || 'Failed to purchase sweet');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Network error');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Chocolate': '#8B4513',
      'Cake': '#FF69B4',
      'Cookie': '#FFD700',
      'Traditional': '#FF8C00',
      'Premium': '#9370DB'
    };
    return colors[category] || '#667eea';
  };

  const renderStars = (rating) => {
    return (
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  return (
    <div className="sweet-list-container">
     
      <div className="hero-section">
        <h1 className="hero-title">"Mithai & Mousse - A Sweet Symphony"</h1>
        <p className="hero-subtitle">Indian Sweets with Modern Treats</p>
      </div>

      
      <div className="filters-card">
        <div className="filters-grid">
          <input
            type="text"
            className="filter-input"
            placeholder=" Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type="text"
            className="filter-input"
            placeholder=" Filter by category..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
          <input
            type="number"
            className="filter-input"
            placeholder=" Low Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="filter-input"
            placeholder="High Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <button className="apply-filters-btn" onClick={fetchSweets}>
           Apply Filters
        </button>
      </div>

      
      {message && (
        <div className={`toast-message ${messageType}`}>
          {message}
        </div>
      )}

     
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading delicious sweets...</p>
        </div>
      ) : (
        <>
          
          <div className="sweets-count">
            <h2> Available Sweets ({sweets.length})</h2>
          </div>

         
          <div className="sweets-grid">
            {sweets.length > 0 ? (
              sweets.map((sweet) => (
                <div key={sweet._id} className="sweet-card-modern">
                 
                  <div className="sweet-image-container">
                    <img 
                      src={sweet.imageUrl} 
                      alt={sweet.name}
                      className="sweet-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400/667eea/ffffff?text=Sweet';
                      }}
                    />
                    {sweet.quantity < 10 && sweet.quantity > 0 && (
                      <div className="low-stock-badge">Only {sweet.quantity} left!</div>
                    )}
                    {sweet.quantity === 0 && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                  </div>

                  
                  <div className="sweet-card-content">
                    <h3 className="sweet-name">{sweet.name}</h3>
                    
                    
                    <span 
                      className="category-badge" 
                      style={{ backgroundColor: getCategoryColor(sweet.category) }}
                    >
                      {sweet.category}
                    </span>

                    
                    {sweet.rating && renderStars(sweet.rating)}

                   
                    <p className="sweet-description">{sweet.description}</p>

                  
                    <div className="sweet-info">
                      <div className="price-tag">
                        <span className="currency">₹</span>
                        <span className="amount">{sweet.price}</span>
                      </div>
                      <div className="stock-info">
                        <span className="stock-icon">📦</span>
                        <span>{sweet.quantity} in stock</span>
                      </div>
                    </div>

                    
                    <button
                      className={`purchase-btn ${sweet.quantity === 0 ? 'disabled' : ''}`}
                      onClick={() => handlePurchase(sweet._id)}
                      disabled={sweet.quantity === 0}
                    >
                      {sweet.quantity === 0 ? ' Out of Stock' : ' Add to Cart'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-sweets">
                <div className="no-sweets-icon"></div>
                <h3>No sweets found</h3>
                <p>Try adjusting your filters</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SweetList;