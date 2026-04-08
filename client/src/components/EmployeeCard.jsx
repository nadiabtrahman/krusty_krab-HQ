import { Link } from 'react-router-dom';

const EmployeeCard = ({ staff }) => {
    return (
        <div className="employee-card">
            <div className="card-photo-section">
                <img
                    src={staff.image}
                    alt={staff.name}
                    className="crew-thumb"
                />
                <span className="card-brand">Krusty Krab</span>
            </div>

            <div className="card-info-section">
                <div className="card-krusty-header">Official Staff ID</div>
                <h3>{staff.name}</h3>
                <p className="card-role">{staff.role}</p>
                <Link to={`/crew/${staff.id}`} className="btn-primary">
                    View Deets
                </Link>
            </div>
        </div>
    );
};

export default EmployeeCard;
