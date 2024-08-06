import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import BidModal from './bidModal';
import Loader from './Loader';
import '../assets/css/dashboard.css';

export const Dashboard = ({ token }) => {
  const [auctionItems, setAuctionItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loadingBid, setLoadingBid] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/auction-items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (isMounted) {
          setAuctionItems(response.data);
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
      setLoadingBid(true);
      fetchData().finally(() => {
        setLoadingBid(false);
      });
    });

    socket.on('itemUpdated', (updatedItem) => {
      setAuctionItems((prevItems) =>
        prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    });

    socket.on('itemAdded', (newItem) => {
      if (isMounted) {
        setAuctionItems((prevItems) => [newItem, ...prevItems]);
      }
    });

    socket.on('itemDeleted', ({ id }) => {
      setAuctionItems((prevItems) => prevItems.filter((item) => item.id !== id));
    });

    return () => {
      isMounted = false;
      socket.disconnect();
    };
  }, [token]);

  if (loading || loadingBid) {
    return <Loader />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handlePlaceBid = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="dashBoardContainer">
      <h1>Dashboard</h1>
      <div className="cardContainer">
        {auctionItems.length === 0 ? (
          <div>No Items Available</div>
        ) : (
          auctionItems.map((item) => (
            <div key={item.id} className="card">
              <div className="card-img" style={{ backgroundImage: `url(${item.image_url})` }}></div>
              <div className="card-info">
                <p className="text-title">{item.title}</p>
                <p className="text-body">{item.description}</p>
                <p className="text-date">
                  Ends On: <span className="text-sub">{new Date(item.end_date).toLocaleDateString()}</span>
                </p>
              </div>
              <div className="card-footer">
                <p className="text-date">
                  Current Bid: <span className="text-sub">${item.starting_bid}</span>
                </p>
                <button className="card-button" onClick={() => handlePlaceBid(item)}>
                  Place Bid
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedItem && <BidModal item={selectedItem} onClose={handleCloseModal} token={token} />}
    </div>
  );
};

export default Dashboard;
