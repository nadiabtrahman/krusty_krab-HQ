import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api/axios";
import '../assets/Login.css';

const Login = () => {
    const [formData, setFormData]  = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', {
                username,
                password
            });

            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('role', res.data.role);

            if (res.data.role === 'Manager') {
                navigate('/admin-dashboard');
            } else {
                navigate('/crew-portal')
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Server Error";
            setError(errorMessage);
            console.error("Login Error: ", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <h1>Krusty Krab Staff Login</h1>

            {error && <p className="login-error">{error}</p>}

            <form onSubmit={handleLogin} className="login-form">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                    placeholder="Enter username..."
                />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    placeholder="Enter password..."
                />

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    );
};

export default Login;