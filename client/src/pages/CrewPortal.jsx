import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import MyAttendance from '../components/MyAttendance';
import MyTodos from '../components/MyTodos';
import '../assets/CrewPortal.css';
import EditProfile from '../components/EditProfile';

const CrewPortal = () => {
    const token = sessionStorage.getItem('token');
    const [profile, setProfile] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [clockMsg, setClockMsg] = useState({ text: '', isError: false });

    useEffect(() => {
        api.get('/crew/me')
            .then(res => setProfile(res.data))
            .catch(() => {});
    }, []);

    const showClockMsg = (text, isError = false) => {
        setClockMsg({ text, isError });
        setTimeout(() => setClockMsg({ text: '', isError: false }), 3000);
    };

    const handleClockIn = async () => {
        try {
            await api.post('/attendance/clock-in');
            showClockMsg("Clocked in! Time is money!");
            setRefreshKey(k => k + 1);
        } catch (err) {
            showClockMsg(err.response?.data?.message || "Error clocking in", true);
        }
    };

    const handleClockOut = async () => {
        try {
            await api.post('/attendance/clock-out');
            showClockMsg("Clocked out successfully!");
            setRefreshKey(k => k + 1);
        } catch (err) {
            showClockMsg(err.response?.data?.message || "Error clocking out", true);
        }
    };

    if (!token) return <Navigate to="/login" />;

    return (
        <div className="crew-portal">
            <header className="crew-portal-header">
                {profile?.image && (
                    <img src={profile.image} alt={profile.name} className="portal-avatar" />
                )}
                <h1>Krew Portal</h1>
                <p>Welcome back, {profile ? profile.name : '...'}!</p>
                <div className="portal-clock-btns">
                    <button className="clock-btn" onClick={handleClockIn}>Clock In</button>
                    <button className="clock-btn" onClick={handleClockOut}>Clock Out</button>
                </div>
                {clockMsg.text && (
                    <p className={clockMsg.isError ? 'inline-error' : 'inline-success'} style={{ marginTop: '10px' }}>
                        {clockMsg.text}
                    </p>
                )}
            </header>

            <div className="crew-portal-grid">
                <section className="crew-section">
                    <h2>My Attendance</h2>
                    <MyAttendance key={refreshKey} />
                </section>

                <section className="crew-section">
                    <h2>My Tasks</h2>
                    <MyTodos />
                </section>

                <section className="crew-section">
                    <h2>Edit My Details</h2>
                    <EditProfile onSave={(updated) => setProfile(prev => ({ ...prev, ...updated }))} />
                </section>
            </div>
        </div>
    );
};

export default CrewPortal;
