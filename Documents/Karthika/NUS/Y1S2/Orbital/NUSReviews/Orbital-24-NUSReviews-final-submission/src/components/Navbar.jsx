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
                // sign in
                setUser(user);
            } else {
                // sign out
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.data().hasUnreadNotifications) {
              // show
              setShowNotificationDot(true);
            } else {
              // hide
              setShowNotificationDot(false);
            }
          });
      
          return () => unsubscribe(); 
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
                        <div style={{ display: 'flex', justifyContent: 'center',  flexDirection: 'column' }}>
                        <button className="more-button" onClick={toggleDropdown}>More</button>
                            <div className="dropdown">
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
                        </div>
                    ) 
                    : <button onClick={handleLoginClick} className="login-button">Login</button>
                }
            </div>
        </nav>
    );
};

export default Navbar;
