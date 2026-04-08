import { useState } from 'react';

const ApplyForm = ({ onEmployeeAdded }) => {
    const [name, setName] = useState('');
    const [birth_date, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch("http://localhost:5000/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, birth_date, email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit application.');
            }

            const result = await response.json();
            onEmployeeAdded(result.data);
            setName('');
            setBirthDate('');
            setEmail('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="apply-form">
            {error && <p className="login-error">{error}</p>}
            <input
                type="text"
                placeholder="Enter Your Name..."
                required
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <input
                type="date"
                required
                value={birth_date}
                onChange={e => setBirthDate(e.target.value)}
            />

            <input
                type="email"
                placeholder="Enter Your Email..."
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
            </button>
        </form>
    );
};

export default ApplyForm;
