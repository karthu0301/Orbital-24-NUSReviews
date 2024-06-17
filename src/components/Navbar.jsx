import { Link } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in.
                setUser(user);
            } else {
                // User is signed out.
                setUser(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [auth]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSignOut = () => {
        auth.signOut();
        setDropdownOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="logo">NUSReviews</div>
            <div className="navbar-links">
                <Link to="/" className="nav-item">Home</Link>
                <Link to="/about" className="nav-item">About</Link>
                {
                    user 
                    ? (
                        <div className="dropdown">
                            <button className="nav-item" onClick={toggleDropdown}>More</button>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                                    <Link to="/all-files" className="dropdown-item" onClick={() =>setDropdownOpen(false)}>All Files</Link>
                                    <Link to="/polls" className="dropdown-item" onClick={() =>setDropdownOpen(false)}>Polls</Link>
                                    <button className="dropdown-item" onClick={handleSignOut}>Log Out</button>
                                </div>
                            )}
                        </div>
                    ) 
                    : <Link to="/login" className="login-button">Login</Link>
                }
            </div>
        </nav>
    );
};

export default Navbar;