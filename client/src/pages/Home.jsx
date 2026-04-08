import { Link } from 'react-router-dom';

const Home = () => {
    const isAuthenticated = !!sessionStorage.getItem('token');

    return (
        <main className="container">
            <img
                src="/logo.webp"
                alt="Krusty Krab Logo"
                className="home-logo"
            />

            <h1>Welcome to the Krusty Krab HQ</h1>
            <hr />

            <section className="cta-section">
                <Link to="/crew" className="btn-primary">
                    View Krusty Krew
                </Link>

                {!isAuthenticated && (
                    <Link to="/apply" className="btn-primary">
                        Join the Krew
                    </Link>
                )}

                <Link to="/menu" className="btn-primary">
                    Galley Grub Menu
                </Link>
            </section>
        </main>
    );
};

export default Home;
