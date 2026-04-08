import { useState } from 'react';
import ApplyForm from "../components/ApplyForm";
import { Link } from "react-router-dom";

const Apply = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSuccess = () => {
        setIsSubmitted(true);
    };

    return (
        <div className="apply-container">
            {isSubmitted ? (
                <div className="apply-card success-view">
                    <h1>Application Submitted!</h1>
                    <p>Order up! Mr. Krabs has received your data.</p>
                    <div className="success-icon">⚓</div>
                    <Link to="/" className="btn-primary">Return to Main Menu</Link>
                </div>
            ) : (
                <>
                    <Link to="/crew" className="btn-back">← Back to Registry</Link>
                    <div className="apply-card">
                        <h1>Krusty Krab Employment Application</h1>
                        <p>Please provide your name, birth date and contact details!</p>
                        <hr />
                        <ApplyForm onEmployeeAdded={handleSuccess} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Apply;
