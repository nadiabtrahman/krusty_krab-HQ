import { useState, useEffect } from 'react';
import EmployeeCard from '../components/EmployeeCard';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const CrewRegistry = () => {
    const isAuthenticated = !!sessionStorage.getItem('token');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCrew = async () => {
            try {
                const res = await api.get('/crew');
                setEmployees(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCrew();
    }, []);

    if (loading) return <p>Loading the Krew...🍔</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div className="crew-registry-container">
            <div className="registry-header">
                <h1>Krusty Krab Registry</h1>
                {!isAuthenticated && <Link to="/apply" className="btn-apply">Join the Crew</Link>}
            </div>

            <div className="employee-list">
                {employees.map((staff) => (
                    <EmployeeCard key={staff.id} staff={staff} />
                ))}
            </div>
        </div>
    );
};

export default CrewRegistry;
