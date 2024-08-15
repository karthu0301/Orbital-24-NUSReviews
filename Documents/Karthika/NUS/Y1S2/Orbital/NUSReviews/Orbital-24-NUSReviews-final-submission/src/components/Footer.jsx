import './Footer.css';
import stampLogo from '../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link to='/contact-us'>Feedback? Contact us.</Link>
        <img src={stampLogo} alt="NUSReviews" className='stamp-logo' />
      </div>
    </footer>
  );
};

export default Footer;
