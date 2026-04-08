import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const EmployeeDetails = () => {
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await api.get(`/crew/${id}`);
                setEmployee(res.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) return <p>Searching the galley...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
    if (!employee) return <p>Employee not found! Check Chum Bucket.</p>;

    return (
        <div className="details-container">
            <Link to="/crew" className="btn-back">← Back to Registry</Link>

            <div className="details-card">
                <div className="details-header">
                    <div>
                        <img
                            src={employee.image}
                            alt={employee.name}
                            className="id-photo"
                        />
                        <p className="id-photo-label">Employee Photo</p>
                    </div>

                    <div className="details-info">
                        <h1>{employee.name}</h1>
                        <h3>{employee.role}</h3>
                        <p>Birthday: {new Date(employee.birth_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                        <hr />
                        <p>{employee.bio}</p>
                        <span className="status-badge">Active Employee</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetails;
