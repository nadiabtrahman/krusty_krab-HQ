import { useState, useEffect } from 'react';
import api from '../api/axios';

const MyAttendance = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/attendance/my')
            .then(res => { setRecords(Array.isArray(res.data) ? res.data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading attendance...</p>;
    if (records.length === 0) return <p>No attendance records yet.</p>;

    return (
        <div className="attendance-table-wrap">
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Clock-In Time</th>
                        <th>Clock-Out Time</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(rec => (
                        <tr key={rec.id}>
                            <td>{new Date(rec.clock_in_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                            <td>{new Date(rec.clock_in_time).toLocaleTimeString()}</td>
                            <td>{rec.clock_out_time ? new Date(rec.clock_out_time).toLocaleTimeString() : '--:--'}</td>
                            <td>
                                <span className={rec.status === 'active' ? 'status-clocked-in' : 'status-not-working'}>
                                    {rec.status === 'active' ? 'IN' : 'OUT'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyAttendance;
