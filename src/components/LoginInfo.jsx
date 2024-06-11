import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, OAuthProvider } from "firebase/auth";
import './LoginInfo.css';
import microsoftSignIn from '../assets/images/microsoft-signin.svg'

const LoginInfo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new OAuthProvider('microsoft.com');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user.emailVerified) {
        console.log("Logged in successfully:", userCredential.user);
        navigate('/'); // Navigate to dashboard or home page
      } else {
        auth.signOut();
        alert("Please verify your email address before logging in.")
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      if (!email.endsWith('@u.nus.edu')){
        alert('Only valid NUS emails are allowed.');
      } else {
        alert(error.message); // Show error message to the user
      }
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Ensure email domain is u.nus.edu
      if (email.endsWith('@u.nus.edu')) {
        console.log("Logged in with Microsoft Successfully:", result.user);
        navigate('/');
      } else {
        alert('Only valid NUS emails are allowed.');
        auth.signOut;
      }
    } catch (error) {
      console.error('Error logging in with Microsoft:', error.message);
      alert(error.message);
    }
  }

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
      </div>
    </div>
  );
};

export default LoginInfo;