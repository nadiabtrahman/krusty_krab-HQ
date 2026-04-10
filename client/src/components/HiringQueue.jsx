import { useEffect, useState } from "react";
import api from "../api/axios";

const HiringQueue = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hiringApp, setHiringApp] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hireSuccess, setHireSuccess] = useState('');
    const [hireError, setHireError] = useState('');
    const [rejectingApp, setRejectingApp] = useState(null);
    const [rejectError, setRejectError] = useState('');

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const res = await api.get('/admin/applications')
            setApps(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error: ", err);
            setLoading(false);
        }
    };

    const handleRejectConfirm = async () => {
        try {
            await api.patch(`/admin/applications/${rejectingApp.id}/status`);
            setRejectingApp(null);
            setRejectError('');
            fetchApps();
        } catch (err) {
            setRejectError("Error rejecting application.");
        }
    };

    const handleHireClick = (app) => {
        setHiringApp(app);
        setHireSuccess('');
        setHireError('');
        setUsername(app.name.toLowerCase().replace(/\s/g, ''));
        setPassword(import.meta.env.VITE_CREW_INITIAL_PW);
    };

    const handleHireSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/hire', {
                name: hiringApp.name,
                email: hiringApp.email,
                role: 'crew',
                birthday: hiringApp.birth_date,
                application_id: hiringApp.id,
                username,
                password,
            });
            setHireSuccess(`${hiringApp.name} is now a member of the Krusty Krab!`);
            fetchApps();
        } catch (err) {
            setHireError("Error hiring applicant.");
        }
    };

    const handleCloseModal = () => {
        setHiringApp(null);
        setHireSuccess('');
        setHireError('');
    };

    if (loading) return <p>Loading applications...</p>

    return (
        <div className="hiring-queue">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Birthday</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {apps.map((app) => (
                        <tr key={app.id}>
                            <td>{app.name}</td>
                            <td>{app.email}</td>
                            <td>{new Date(app.birth_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</td>
                            <td>
                                <span className={`status-${app.status}`}>{app.status}</span>
                            </td>
                            <td>
                                <div className="action-btns">
                                    <button className="btn-hire" onClick={() => handleHireClick(app)} style={{ visibility: app.status === 'pending' ? 'visible' : 'hidden' }}>Hire</button>
                                    <button className="btn-reject" onClick={() => { setRejectingApp(app); setRejectError(''); }} style={{ visibility: app.status === 'pending' ? 'visible' : 'hidden' }}>Reject</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {rejectingApp && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Reject Application</h2>
                        <hr />
                        <h3>{rejectingApp.name}</h3>
                        <p>Are you sure you want to reject this application?</p>
                        {rejectError && <p className="inline-error">{rejectError}</p>}
                        <div className="modal-actions">
                            <button className="btn-reject" onClick={handleRejectConfirm}>Yes, Reject</button>
                            <button className="btn-hire" onClick={() => setRejectingApp(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {hiringApp && (
                <div className="modal-overlay">
                    <div className="modal">
                        {hireSuccess ? (
                            <>
                                <h2>Employment Confirmed!</h2>
                                <hr />
                                <p className="inline-success" style={{ margin: '1rem 0' }}>{hireSuccess}</p>
                                <div className="modal-actions">
                                    <button className="btn-hire" onClick={handleCloseModal}>Done</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>Hiring Confirmation</h2>
                                <hr />
                                <h3>Applicant: {hiringApp.name}</h3>
                                <p>Please set their login credentials:</p>
                                <form onSubmit={handleHireSubmit}>
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                    />
                                    <label>Initial Password</label>
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                    {hireError && <p className="inline-error">{hireError}</p>}
                                    <div className="modal-actions">
                                        <button className="btn-hire" type="submit">Confirm Hire</button>
                                        <button className="btn-reject" type="button" onClick={handleCloseModal}>Cancel</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HiringQueue;
