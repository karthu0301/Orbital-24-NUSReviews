import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import './LoginInfo.css';

const LoginInfo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully:", userCredential.user);
      navigate('/'); // Navigate to dashboard or home page
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert(error.message); // Show error message to the user
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
          <div className="divider">
            <hr />
            <p>No existing account?</p>
            <hr />
          </div>
          <Link to="/login/signup" className="login-button">Create new account</Link>
          <p className="terms">
            By clicking continue, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginInfo;