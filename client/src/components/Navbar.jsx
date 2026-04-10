import { Link, useLocation } from 'react-router-dom';
import '../assets/Navbar.css';

const Navbar = () => {
    const { pathname } = useLocation();
    const isAuthenticated = !!sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <Link to="/"><img src="/logo.webp" alt="Home" className="nav-logo" /></Link>

            <div className="nav-links">
                {pathname !== '/' && (
                    <>
                        {!isAuthenticated}
                        <Link to="/menu">Menu</Link>
                        <Link to="/crew">Krusty Krew</Link>
                    </>
                )}

                {!isAuthenticated ? (
                    <Link to="/login" className='login-link'>Krew Login</Link>
                ):(
                    <div className='auth-group'>
                        {role === 'Manager' ? (
                            <Link to="/admin-dashboard">Dashboard</Link>
                        ) : (
                            <Link to="/crew-portal">Krew Portal</Link>
                        )}

                        <span>({role})</span>
                        <button onClick={handleLogout} className='logout-btn'>Logout</button>

                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
