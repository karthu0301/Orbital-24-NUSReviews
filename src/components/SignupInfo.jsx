import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from "firebase/auth";
import './SignupInfo.css';

const SignUpInfo = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
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
    if (!displayName.trim()) {
      alert("Display Name is required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signed up successfully:", userCredential.user);

      // Update the display name in Firebase Auth
      await updateProfile(userCredential.user, { displayName: displayName });
      console.log('Display name updated:', displayName);

      // Send verification email
      await sendEmailVerification(userCredential.user);
      console.log('Verification email sent to:', email);

      // Sign out the user
      await signOut(auth);
      console.log('User signed out after registration');

      alert("A verification email has been sent to your email address. Please verify your email to proceed.")
      navigate('/login');
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
            type="text"
            placeholder="enter display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
