import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CrewRegistry from './pages/CrewRegistry';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import CrewPortal from './pages/CrewPortal';
import EmployeeDetails from './pages/EmployeeDetails';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Apply from './pages/Apply';
import Menu from './pages/Menu';
import './App.css';

function App() {
    return (
        <Router>
            <div className='app-container'>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/crew" element={<CrewRegistry />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/crew-portal" element={<CrewPortal />} />
                        <Route path="/crew/:id" element={<EmployeeDetails />} />
                        <Route path="/apply" element={<Apply />} />
                        <Route path="/menu" element={<Menu />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
