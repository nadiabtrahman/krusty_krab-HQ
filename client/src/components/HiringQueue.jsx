import { useEffect, useState } from "react";
import api from "../api/axios";

const HiringQueue = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleHire = async (app) => {
        const confirmHire = window.confirm(`Hire ${app.name} as a new staff member?`)
        if(!confirmHire) return;

        try {
            await api.post('/admin/hire', {
                name: app.name,
                email: app.email,
                role: 'crew',
                birthday: app.birth_date,
                application_id: app.id
            });
            alert(`${app.name} is now a member of Krusty Krab!`);
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
                                    <button className="btn-hire" onClick={() => handleHire(app)} style={{ visibility: app.status === 'pending' ? 'visible' : 'hidden' }}>Hire</button>
                                    <button className="btn-reject" onClick={() => handleReject(app)} style={{ visibility: app.status === 'pending' ? 'visible' : 'hidden' }}>Reject</button>
                                </div>
                            </td>
                       </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HiringQueue;