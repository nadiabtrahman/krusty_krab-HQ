import { useState, useEffect } from 'react';
import api from '../api/axios';

const EditProfile = () => {
    const [form, setForm] = useState({ email: '', birth_date: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/crew/me')
            .then(res => {
                const { email, birth_date } = res.data;
                setForm({
                    email: email || '',
                    birth_date: birth_date ? birth_date.split('T')[0] : ''
                });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await api.patch('/crew/me', form);
            setMessage('Profile updated!');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error saving profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading profile...</p>;

    return (
        <form className="edit-profile-form" onSubmit={handleSubmit}>
            {message && <p className={message === 'Profile updated!' ? 'profile-success' : 'login-error'}>{message}</p>}

            <label>Email</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email..."
                required
            />

            <label>Birthday</label>
            <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                required
            />

            <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </form>
    );
};

export default EditProfile;
