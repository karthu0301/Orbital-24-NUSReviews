import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import './SignupInfo.css';

const SignUpInfo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignUp = async (event) => {
    event.preventDefault();
    // Check if the email ends with "@u.nus.edu"
    if (!email.endsWith("@u.nus.edu")) {
      alert("Please use a valid NUS email address.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up successfully:", userCredential.user);
      navigate('/login/signup/verify'); // Navigate to verify route or other route you want
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message); // Show error message to the user
    }
  };

  return (
    <div className="signup-main-content">
      <div className="signup-container">
        <header>Create an account</header>
        <form onSubmit={handleSignUp}>
          <p>Enter your NUS email to sign up</p>
          <input
            type="email"
            placeholder="email@u.nus.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="verify-button">Verify Email</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpInfo;