import { Link } from 'react-router-dom';
import './LoginInfo.css'; // Ensure your CSS file is imported

const LoginInfo = () => {
  return (
    <div className="login-main-content">
      <div className="login-container">
        <header>Sign In</header>
        <p>Enter your NUS email and password</p>
        <input type="email" placeholder="email@u.nus.edu" />
        <input type="password" placeholder="password" />
        <Link to="/" className="continue-button">Continue</Link>
        <div className="divider">
          <hr />
          <p>No existing account?</p>
          <hr />
        </div>
        <Link to="/login/signup" className="create-account-button">Create new account</Link>
        <p className="terms">
          By clicking continue, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default LoginInfo;