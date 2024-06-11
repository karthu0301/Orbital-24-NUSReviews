import { Link } from 'react-router-dom'
import './VerificationInfo.css'

const VerificationInfo = () => {
  return (
    <div>
      <div className="verify-main-content">
      <div className="verify-container">
        <header>Verify your account</header>
        <p>Enter the code that was sent to your email for verification</p>
        <input type="text" placeholder="enter verification code" />
        <Link to="/" className="continue-button">Continue</Link>
      </div>
    </div>
    </div>
  )
}

export default VerificationInfo