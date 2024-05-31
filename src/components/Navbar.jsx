import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">NUSReviews</div>
            <div className="navbar-links">
                <Link to="/" className="nav-item">Home</Link>
                <Link to="/about" className="nav-item">About</Link>
                <Link to="/login" className="login-button">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;