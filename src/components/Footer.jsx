import './Footer.css';
import stampLogo from '../assets/images/logo.png'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Made By: NUS Students</p>
        <img src={stampLogo} alt="NUSReviews" className='stamp-logo' />
      </div>
    </footer>
  );
};

export default Footer;