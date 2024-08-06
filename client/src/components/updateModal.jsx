import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/updateModal.css';
import Loader from './Loader';

const UpdateModal = ({ item, onClose, token, onUpdate }) => {
    const [updatedItem, setUpdatedItem] = useState(item);
    const [loading, setLoading] = useState(false);

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:8000/api/auction-items/${item.id}`, updatedItem, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            onUpdate(updatedItem);
            onClose();
        } catch (err) {
            console.error('Error updating item:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-modal">
            <div className="update-modal-content">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <h2>Update Item</h2>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>
                                Title:
                                <input type="text" name="title" value={updatedItem.title} onChange={handleUpdateChange} />
                            </label>
                            <label>
                                Description:
                                <textarea name="description" value={updatedItem.description} onChange={handleUpdateChange} />
                            </label>
                            <label>
                                Starting Bid:
                                <input type="number" name="starting_bid" value={updatedItem.starting_bid} onChange={handleUpdateChange} />
                            </label>
                            <label>
                                End Date:
                                <input type="date" name="end_date" value={new Date(updatedItem.end_date).toISOString().split('T')[0]} onChange={handleUpdateChange} />
                            </label>
                            <label>
                                Image URL:
                                <input type="text" name="image_url" value={updatedItem.image_url} onChange={handleUpdateChange} />
                            </label>
                            <div className="button-group">
                                <button className="card-button" type="submit">Update</button>
                                <button className="card-button" type="button" onClick={onClose}>Cancel</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpdateModal;
