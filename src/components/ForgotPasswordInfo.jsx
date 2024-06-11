import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import './ForgotPasswordInfo.css'

const ForgotPasswordInfo = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error) {
      console.error("Error sending password reset email:", error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="forgot-password-main-content">
      <div className="forgot-password-container">
        <header>Reset Your Password</header>
        <form onSubmit={handleResetPassword}>
          <p>Enter your email address to receive a password reset link</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="reset-button">Send Reset Link</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordInfo;