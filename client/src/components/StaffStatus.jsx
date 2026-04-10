import { useEffect, useState, Fragment } from 'react';
import api from '../api/axios';

const EMPTY_FORM = { name: '', role: '', hourly_rate: '', image: '', bio: '', birth_date: '', email: '' };

const StaffStatus = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_FORM);
    const [deletingMember, setDeletingMember] = useState(null);

    const fetchStatus = async () => {
        try {
            const res = await api.get('/admin/staff-status');
            setStaff(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching staff status");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 15000);
        return () => clearInterval(interval);
    }, []);

    const handleEditClick = (member) => {
        setEditingId(member.id);
        setEditForm({
            name: member.name || '',
            role: member.role || '',
            hourly_rate: member.hourly_rate || '',
            image: member.image || '',
            bio: member.bio || '',
            birth_date: member.birth_date ? member.birth_date.split('T')[0] : '',
            email: member.email || ''
        });
    };

    const handleChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async (id) => {
        try {
            const res = await api.put(`/admin/staff/${id}`, editForm);
            setStaff(staff.map(m => m.id === id ? { ...m, ...res.data.data } : m));
            setEditingId(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error updating staff');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const res = await api.delete(`/admin/staff/${deletingMember.id}`);
            alert(res.data.message);
            setStaff(staff.filter(m => m.id !== deletingMember.id));
            setDeletingMember(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting staff');
        }
    };

    if (loading) return <p>Loading crew status...🦀</p>;

    return (
        <div className="staff-monitor">
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Clock-In Time</th>
                        <th>Clock-Out Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map(member => (
                        <Fragment key={member.id}>
                            <tr>
                                <td>{member.name}</td>
                                <td>{member.role}</td>
                                <td>
                                    <span className={member.current_status === 'Clocked In' ? 'status-clocked-in' : 'status-not-working'}>
                                        {member.current_status}
                                    </span>
                                </td>
                                <td>
                                    {member.clock_in_time
                                        ? new Date(member.clock_in_time).toLocaleTimeString()
                                        : '--:--'}
                                </td>
                                <td>
                                    {member.attendance_status === 'active' || !member.clock_out_time ? '--:--'
                                        : new Date(member.clock_out_time).toLocaleTimeString()}
                                </td>
                                <td>
                                    {editingId === member.id ? (
                                        <button className="btn-reject" onClick={() => setEditingId(null)}>Cancel</button>
                                    ) : (
                                        <div className="action-btns">
                                            <button className="btn-menu-edit" onClick={() => handleEditClick(member)}>Edit</button>
                                            <button className="btn-reject" onClick={() => setDeletingMember(member)}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>

                            {editingId === member.id && (
                                <tr key={`edit-${member.id}`} className="staff-edit-row">
                                    <td colSpan={5}>
                                        <div className="staff-edit-form">
                                            <div className="staff-edit-grid">
                                                <div className="staff-edit-field">
                                                    <label>Name</label>
                                                    <input name="name" value={editForm.name} onChange={handleChange} />
                                                </div>
                                                <div className="staff-edit-field">
                                                    <label>Role</label>
                                                    <input name="role" value={editForm.role} onChange={handleChange} />
                                                </div>
                                                <div className="staff-edit-field">
                                                    <label>Hourly Rate ($)</label>
                                                    <input name="hourly_rate" type="number" step="0.01" value={editForm.hourly_rate} onChange={handleChange} />
                                                </div>
                                                <div className="staff-edit-field">
                                                    <label>Birthday</label>
                                                    <input name="birth_date" type="date" value={editForm.birth_date} onChange={handleChange} />
                                                </div>
                                                <div className="staff-edit-field">
                                                    <label>Email</label>
                                                    <input name="email" type="email" value={editForm.email} onChange={handleChange} />
                                                </div>
                                                <div className="staff-edit-field full-width">
                                                    <label>Bio</label>
                                                    <textarea name="bio" value={editForm.bio} onChange={handleChange} rows={3} />
                                                </div>
                                            </div>
                                            <div className="staff-edit-actions">
                                                <button className="btn-hire" onClick={() => handleSave(member.id)}>Save</button>
                                                <button className="btn-reject" onClick={() => setEditingId(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </Fragment>
                    ))}
                </tbody>
            </table>

            {deletingMember && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Delete Confirmation</h2>
                        <hr />
                        <h3>Employee Name: {deletingMember.name}</h3>
                        <p>This will permanently remove them and all their records.</p>
                        <div className="modal-actions">
                            <button className="btn-reject" onClick={handleDeleteConfirm}>Yes, Remove Them</button>
                            <button className="btn-hire" onClick={() => setDeletingMember(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffStatus;
