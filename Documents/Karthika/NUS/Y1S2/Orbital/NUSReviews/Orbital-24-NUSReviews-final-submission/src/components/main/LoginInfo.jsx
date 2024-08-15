import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, OAuthProvider } from "firebase/auth";
import './LoginInfo.css';
import microsoftSignIn from '../../assets/images/microsoft-signin.svg';
import API_URL from '../../apiConfig';

const LoginInfo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const provider = new OAuthProvider('microsoft.com');

  const { from } = location.state || { from: { pathname: '/' } }; // Default to home if no previous location is found

  const isNusEmail = (email) => {
    return email.endsWith('@u.nus.edu');
  };

  const checkUserExists = async (email) => {
    const response = await fetch(`${API_URL}/check-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    return result.exists;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Reset error message

    if (!isNusEmail(email)) {
      setErrorMessage('Only valid NUS emails are allowed.');
      return;
    }

    const userExists = await checkUserExists(email);
    if (!userExists) {
      setErrorMessage('No account found with this email.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        console.log("Logged in successfully:", userCredential.user);
        navigate(from.pathname);
      } else {
        await auth.signOut();
        setErrorMessage("Please verify your email address before logging in.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.code === 'auth/invalid-credential') {
        setErrorMessage('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-disabled') {
        setErrorMessage('This account has been disabled. Contact Administrators to reinstate.');
      } else {
        setErrorMessage(error.message); // Use the original Firebase error message
      }
    }
  };

  const handleMicrosoftLogin = async () => {
    setErrorMessage(''); // Reset error message
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Ensure email domain is u.nus.edu
      if (isNusEmail(email)) {
        console.log("Logged in with Microsoft Successfully:", result.user);
        navigate(from.pathname);
      } else {
        setErrorMessage('Only valid NUS emails are allowed.');
        await auth.signOut();
      }
    } catch (error) {
      console.error('Error logging in with Microsoft:', error);
      setErrorMessage('Login failed with Microsoft. Please try again.');
    }
  };

  return (
    <div className="login-main-content">
      <div className="login-container">
        <header>Sign In to Contribute</header>
        <form onSubmit={handleLogin}>
          <p>Enter your NUS email and password</p>
          <input
            type="email"
            placeholder="email@u.nus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Continue</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="divider">
            <hr />
            <p>No existing account?</p>
            <hr />
          </div>
          <Link to="/login/signup" className="login-button">Create new account</Link>
        </form>
        <div className="divider">
          <hr />
          <p>or</p>
          <hr />
        </div>
        <div className="microsoft-button" onClick={handleMicrosoftLogin}>
          <img src={microsoftSignIn} alt="Sign in with Microsoft" />
        </div>
        <note>Note: You can freely explore the website without logging in. An account is only required to answer question threads or vote on polls.</note>
      </div>
    </div>
  );
};

export default LoginInfo;
