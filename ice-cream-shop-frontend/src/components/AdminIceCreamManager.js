import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/UserDashboard1.css'; 

const AdminIceCreamManager = () => {
    const [iceCreams, setIceCreams] = useState([]);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Fetch ice creams
    const fetchIceCreams = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/ice-creams');
            setIceCreams(response.data);
        } catch (error) {
            console.error('Error fetching ice creams:', error);
        }
    };

    useEffect(() => {
        fetchIceCreams();
    }, []);

    // Add new ice cream
    const handleAdd = async () => {
        if (!newName || !newPrice) return;
        try {
            await axios.post('http://localhost:5000/api/ice-creams', { name: newName, price: parseFloat(newPrice) });
            setNewName('');
            setNewPrice('');
            fetchIceCreams();
        } catch (error) {
            console.error('Error adding ice cream:', error);
        }
    };

    // Delete ice cream
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/ice-creams/${id}`);
            fetchIceCreams();
        } catch (error) {
            console.error('Error deleting ice cream:', error);
        }
    };

    // Start editing an ice cream
    const startEditing = (id, name, price) => {
        setEditingId(id);
        setNewName(name);
        setNewPrice(price);
    };

    // Update ice cream
    const handleUpdate = async () => {
        if (!newName || !newPrice) return;
        try {
            await axios.put(`http://localhost:5000/api/ice-creams/${editingId}`, { name: newName, price: parseFloat(newPrice) });
            setEditingId(null);
            setNewName('');
            setNewPrice('');
            fetchIceCreams();
        } catch (error) {
            console.error('Error updating ice cream:', error);
        }
    };

    return (
        <div className="admin-container1">
            <h3>Manage Ice Creams</h3>
            <div className="input-container1">
                <input
                    type="text"
                    placeholder="Ice Cream Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input-field"
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="input-field"
                />
                {editingId ? (
                    <button onClick={handleUpdate} className="action-button update-button">Update Ice Cream</button>
                ) : (
                    <button onClick={handleAdd} className="action-button add-button">Add Ice Cream</button>
                )}
            </div>

            <ul className="ice-cream-list1">
                {iceCreams.map(([id, name, price]) => (
                    <li key={id} className="ice-cream-item">
                        <span>{name} - RS:{price.toFixed(2)}</span>
                        <button onClick={() => startEditing(id, name, price)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(id)} className="delete-button">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminIceCreamManager;
