import { Link } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
    const [user, setUser] = useState(null);
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

    return (
        <nav className="navbar">
            <div className="logo">NUSReviews</div>
            <div className="navbar-links">
                <Link to="/" className="nav-item">Home</Link>
                <Link to="/about" className="nav-item">About</Link>
                {
                    user 
                    ? <Link to="/" className="login-button" onClick={() => auth.signOut()}>Log Out</Link>
                    : <Link to="/login" className="login-button">Login</Link>
                }
            </div>
        </nav>
    );
};

export default Navbar;