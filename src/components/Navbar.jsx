import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from '@firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '../firebase-config';

const Navbar = ({}) => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const auth = getAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [ShowNotificationDot, setShowNotificationDot] = useState(false);

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

    useEffect(() => {
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.data().hasUnreadNotifications) {
              // Show notification dot
              setShowNotificationDot(true);
            } else {
              // Hide notification dot
              setShowNotificationDot(false);
            }
          });
      
          return () => unsubscribe(); // Cleanup subscription on component unmount
        }
    }, [user]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSignOut = () => {
        auth.signOut();
        setDropdownOpen(false);
    };

    const handleLoginClick = () => {
        navigate('/login', { state: { from: location } });
    };

    return (
        <nav className="navbar">
            <Link to='/' className="logo">NUSReviews</Link>
            <div className="navbar-links">
                <Link to="/about" className="nav-item">About</Link>
                <Link to="/all-files" className="nav-item">Files</Link>
                <Link to="/polls" className="nav-item">Polls</Link>
                {
                    user 
                    ? (
                        <div className="dropdown">
                            <button className="nav-item" onClick={toggleDropdown}>More</button>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                                    {ShowNotificationDot && <span className='notification-dot-in'></span>}
                                    <Link to="/saved-threads" className="dropdown-item" onClick={() => setDropdownOpen(false)}>Saved Threads</Link>
                                    <button className="dropdown-item" onClick={handleSignOut}>Log Out</button>
                                </div>
                            )}
                            {ShowNotificationDot && <span className='notification-dot-more'></span>}
                        </div>
                    ) 
                    : <button onClick={handleLoginClick} className="login-button">Login</button>
                }
            </div>
        </nav>
    );
};

export default Navbar;
