import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../assets/css/dashboard.css';

export const MyBids = ({ token }) => {
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/bids', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setMyBids(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    const socket = io('http://localhost:8000', {
      query: { token },
    });

    socket.on('updateAuctionItems', () => {
      fetchData();
    });

    socket.on('itemUpdated', (updatedItem) => {
      setMyBids((prevBids) =>
        prevBids.map((bid) =>
          bid.item_id === updatedItem.id ? { ...bid, ...updatedItem } : bid
        )
      );
    });

    socket.on('itemDeleted', ({ id }) => {
      setMyBids((prevBids) => prevBids.filter((bid) => bid.item_id !== id));
    });

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashBoardContainer">
      <h1>My Bids</h1>
      <div className="cardContainer">
        {myBids.length === 0 ? (
          <div>No Items Currently Bid On</div>
        ) : (
          myBids.map((bid) => (
            <div key={bid.bid_id} className="card">
              <div className="card-img" style={{ backgroundImage: `url(${bid.image_url})` }}></div>
              <div className="card-info">
                <p className="text-title">{bid.title}</p>
                <p className="text-body">{bid.description}</p>
                <p className="text-date">
                  Ends On: <span className="text-sub">{new Date(bid.end_date).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="card-footer">
                <p className="text-date">
                  Current Bid: <span className="text-sub">${bid.bid_amount}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBids;
