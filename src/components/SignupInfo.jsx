import { Link } from 'react-router-dom';
import './SignupInfo.css';

const SignUpInfo = () => {
  return (
    <div className="signup-main-content">
      <div className="signup-container">
        <header>Create an account</header>
        <p>Enter your NUS email to sign up</p>
        <input type="email" placeholder="email@u.nus.edu" />
        <input type="password" placeholder="enter password" />
        <input type="password" placeholder="re-enter password" />
        <Link to="/login/signup/verify" className="verify-button">Verify Email</Link>
        <p className="terms">
          By clicking continue, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default SignUpInfo;