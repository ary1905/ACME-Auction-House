import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/bidModal.css';
import Loader from './Loader';

const BidModal = ({ item, onClose, token }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceBid = async () => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:8000/api/bids',
        {
          auction_item_id: item.id,
          bid_amount: bidAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      onClose();
    } catch (error) {
      console.error('Error placing bid:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bid-modal">
      <div className="bid-modal-content">
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2>Place Bid for {item.title}</h2>
            <p>Current Highest Bid: ${item.starting_bid}</p>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid"
            />
            <button onClick={handlePlaceBid}>Place Bid</button>
            <button onClick={onClose}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BidModal;
