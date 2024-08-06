import React, { useState } from 'react';
import axios from 'axios';
import Loader from './Loader';
import '../assets/css/addItem.css';

export const AddItem = ({ token }) => {
  const [item, setItem] = useState({
    title: '',
    description: '',
    starting_bid: '',
    end_date: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:8000/api/auction-items', item, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
      setItem({
        title: '',
        description: '',
        starting_bid: '',
        end_date: '',
        image_url: ''
      });
    } catch (err) {
      setError('Error adding item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-item-container">
      <h2>Add New Auction Item</h2>
      {loading && <Loader />}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Item added successfully!</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={item.title} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={item.description} onChange={handleChange} required />
        </label>
        <label>
          Starting Bid:
          <input type="number" name="starting_bid" value={item.starting_bid} onChange={handleChange} required />
        </label>
        <label>
          End Date:
          <input type="date" name="end_date" value={item.end_date} onChange={handleChange} required />
        </label>
        <label>
          Image URL:
          <input type="text" name="image_url" value={item.image_url} onChange={handleChange} required />
        </label>
        <button type="submit" className="add-item-button">Add Item</button>
      </form>
    </div>
  );
};
