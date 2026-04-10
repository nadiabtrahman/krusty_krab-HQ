import { useState, useEffect } from 'react';
import api from '../api/axios';
import '../assets/Menu.css';

const CATEGORIES = ['Meal', 'Main', 'Side', 'Drink', 'Special'];

const Menu = () => {
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('Meal');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editError, setEditError] = useState('');

    const role = sessionStorage.getItem('role');
    const isManager = role === 'Manager';

    useEffect(() => {
        api.get('/menu')
            .then(res => { setItems(Array.isArray(res.data) ? res.data : []); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    const handleEditClick = (item) => {
        setEditingId(item.id);
        setEditForm({ name: item.name, price: item.price, description: item.description, category: item.category });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleEditSave = async (id) => {
        try {
            const res = await api.put(`/menu/${id}`, editForm);
            setItems(items.map(item => item.id === id ? res.data.item : item));
            setEditingId(null);
            setEditError('');
        } catch (err) {
            setEditError(err.response?.data?.message || "Error updating item");
        }
    };

    if (loading) return <p className='loading-message'>Loading the menu...🍔</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    const filtered = items.filter(item => item.category === activeTab);

    return (
        <div className="container">
            <img className="menu-pic" src="/galley_grub.webp" alt="galley grub" />
            <p>The Galley Grub is the menu of the Krusty Krab.</p>

            <div className="menu-tabs">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`menu-tab ${activeTab === cat ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="menu-grid">
                {filtered.map(item => (
                    <div key={item.id} className="menu-card">
                        {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="menu-item-img" />
                        )}

                        {editingId === item.id ? (
                            <div className="menu-edit-form">
                                <input name="name" value={editForm.name} onChange={handleEditChange} placeholder="Name" />
                                <input name="price" value={editForm.price} onChange={handleEditChange} placeholder="Price" type="number" step="0.01" />
                                <input name="description" value={editForm.description} onChange={handleEditChange} placeholder="Description" />
                                <select name="category" value={editForm.category} onChange={handleEditChange}>
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                {editError && <p className="inline-error">{editError}</p>}
                                <div className="menu-edit-actions">
                                    <button className="btn-hire" onClick={() => handleEditSave(item.id)}>Save</button>
                                    <button className="btn-reject" onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <span className="price">${item.price}</span>
                                {isManager && (
                                    <button className="btn-menu-edit" onClick={() => handleEditClick(item)}>Edit</button>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
