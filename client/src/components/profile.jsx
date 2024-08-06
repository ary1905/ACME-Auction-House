import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import UpdateModal from './updateModal';
import Loader from './Loader';
import '../assets/css/dashboard.css';

export const Profile = ({ token }) => {
    const [auctionItems, setAuctionItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false); // New state for deletion loading
    const [error, setError] = useState(null);
    const [userDetails, setUserDetails] = useState({ first_name: '', last_name: '' });
    const [selectedItem, setSelectedItem] = useState(null);

    const socket = useMemo(() => io('http://localhost:8000'), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/my-auction-items', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAuctionItems(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8000/user-details', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserDetails(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchDetails();

        socket.on('itemUpdated', (updatedItem) => {
            setAuctionItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        });

        socket.on('itemDeleted', ({ id }) => {
            fetchData();
        });

        return () => {
            socket.disconnect();
        };
    }, [token, socket]);

    const handleDelete = async (itemId) => {
        setDeleting(true);
        try {
            await axios.delete(`http://localhost:8000/api/auction-items/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleUpdateClick = (item) => {
        setSelectedItem(item);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    const handleUpdate = (updatedItem) => {
        setAuctionItems(auctionItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    };

    if (loading) {
        return <Loader />;
    }

    if (deleting) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dashBoardContainer">
            <h1>Good Day, Mr. {userDetails.first_name} {userDetails.last_name}</h1>
            <h2>Your Auctioned Items</h2>
            <div className="cardContainer">
                {auctionItems.map(item => (
                    <div key={item.id} className="card">
                        <div className="card-img" style={{ backgroundImage: `url(${item.image_url})` }}></div>
                        <div className="card-info">
                            <p className="text-title">{item.title}</p>
                            <p className="text-body">{item.description}</p>
                            <p className="text-date">Ends On: <span className="text-sub">{new Date(item.end_date).toLocaleDateString()} </span></p>
                        </div>
                        <div className="card-footer">
                            <p className="text-date">Current Bid: <span className="text-sub">${item.starting_bid}</span></p>
                            <button className='card-button' onClick={() => handleUpdateClick(item)}>Update</button>
                            <button className='card-button' onClick={() => handleDelete(item.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            {selectedItem && <UpdateModal item={selectedItem} onClose={handleCloseModal} token={token} onUpdate={handleUpdate} />}
        </div>
    );
};

export default Profile;
