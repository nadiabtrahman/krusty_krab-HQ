import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

const EditProfile = ({ onSave }) => {
    const [form, setForm] = useState({ email: '', birth_date: '', image: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        api.get('/crew/me')
            .then(res => {
                const { email, birth_date, image } = res.data;
                setForm({
                    email: email || '',
                    birth_date: birth_date ? birth_date.split('T')[0] : '',
                    image: image || ''
                });
                setPhotoPreview(image || '');
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            let imageUrl = form.image;
            if (photoFile) {
                const formData = new FormData();
                formData.append('photo', photoFile);
                const uploadRes = await api.post('/upload/staff-photo', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.url;
            }
            await api.patch('/crew/me', { ...form, image: imageUrl });
            setForm(prev => ({ ...prev, image: imageUrl }));
            setPhotoPreview(imageUrl);
            setPhotoFile(null);
            setMessage('Profile updated!');
            onSave?.({ email: form.email, birth_date: form.birth_date, image: imageUrl });
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

            <div className="edit-profile-photo">
                {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="photo-preview" />
                ) : (
                    <div className="photo-placeholder">No Photo</div>
                )}
                <button type="button" className="btn-back" onClick={() => fileInputRef.current.click()}>
                    Change Photo
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                />
            </div>

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
