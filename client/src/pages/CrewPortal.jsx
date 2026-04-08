import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import MyAttendance from '../components/MyAttendance';
import MyTodos from '../components/MyTodos';
import EditProfile from '../components/EditProfile';

const CrewPortal = () => {
    const token = sessionStorage.getItem('token');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        api.get('/crew/me')
            .then(res => setProfile(res.data))
            .catch(() => {});
    }, []);

    const handleClockIn = async () => {
        try {
            await api.post('/attendance/clock-in');
            alert("Clocked in! Time is money!");
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Error clocking in");
        }
    };

    const handleClockOut = async () => {
        try {
            await api.post('/attendance/clock-out');
            alert("Clocked out successfully!");
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Error clocking out");
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
            </header>

            <div className="crew-portal-grid">
                <section className="crew-section">
                    <h2>My Attendance</h2>
                    <MyAttendance />
                </section>

                <section className="crew-section">
                    <h2>My Tasks</h2>
                    <MyTodos />
                </section>

                <section className="crew-section">
                    <h2>Edit My Details</h2>
                    <EditProfile />
                </section>
            </div>
        </div>
    );
};

export default CrewPortal;
