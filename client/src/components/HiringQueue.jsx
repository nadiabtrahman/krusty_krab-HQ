import { useEffect, useState } from "react";
import api from "../api/axios";

const HiringQueue = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hiringApp, setHiringApp] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    const handleReject = async (app) => {
        const confirmReject = window.confirm(`Reject ${app.name}'s application?`);
        if (!confirmReject) return;

        try {
            await api.patch(`/admin/applications/${app.id}/status`);
            fetchApps();
        } catch (err) {
            alert("Error rejecting application.");
        }
    };

    const handleHireClick = (app) => {
        setHiringApp(app);
        setUsername(app.name.toLowerCase().replace(/\s/g, ''));
        setPassword('KrabbyPatty123');
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
            alert(`${hiringApp.name} is now a member of Krusty Krab!`);
            setHiringApp(null);
            fetchApps();
        } catch (err) {
            alert("Error hiring applicant.");
        }
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
                                    <button className="btn-reject" onClick={() => handleReject(app)} style={{ visibility: app.status === 'pending' ? 'visible' : 'hidden' }}>Reject</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {hiringApp && (
                <div className="modal-overlay">
                    <div className="modal">
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
                            <div className="modal-actions">
                                <button className="btn-hire" type="submit">Confirm Hire</button>
                                <button className="btn-reject" type="button" onClick={() => setHiringApp(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HiringQueue;
