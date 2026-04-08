import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import HiringQueue from '../components/HiringQueue';
import StaffStatus from '../components/StaffStatus';
import api from '../api/axios';

const AdminDashboard = () => {
    const role = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');
    const [profile, setProfile] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        api.get('/crew/me').then(res => setProfile(res.data)).catch(() => {});
    }, []);

    const handleClockIn = async () => {
        try {
            await api.post('/attendance/clock-in');
            alert("Clocked in! Time is money!");
            setRefreshKey(k => k + 1);
        } catch (err) {
            alert(err.response?.data?.message || "Error clocking in");
        }
    };

    const handleClockOut = async () => {
        try {
            await api.post('/attendance/clock-out');
            alert("Clocked out successfully!");
            setRefreshKey(k => k + 1);
        } catch (err) {
            alert(err.response?.data?.message || "Error clocking out");
        }
    };

    if (!token || role !== 'Manager') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="admin-dashboard">
            <header>
                {profile?.image && (
                    <img src={profile.image} alt={profile.name} className="portal-avatar" />
                )}
                <h1>Manager Control Center</h1>
                <p>Welcome back, Mr. Krabs!</p>
                <div className="portal-clock-btns">
                    <button className="clock-btn" onClick={handleClockIn}>Clock In</button>
                    <button className="clock-btn" onClick={handleClockOut}>Clock Out</button>
                </div>
            </header>

            <section>
                <h2>Krusty Krab Crew</h2>
                <StaffStatus key={refreshKey} />
            </section><br /><br />

            <section>
                <h2>Hiring Queue (Pending Applications)</h2>
                <HiringQueue />
            </section>
        </div>
    );
};

export default AdminDashboard;