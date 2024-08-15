import './HomeContent.css';
import pic from '../../assets/images/UT.jpg';

const HomeContent = () => {
  return (
    <div className="home-main-content">
    <img src={pic} alt="NUS" className="background-image" />
      <div className="home-container">
        <header>Your Campus Life, Decoded!</header>
        <p>Struggling to navigate NUS life with information scattered and hard to find?</p>
        <p>Welcome to the one-stop shop for all the answers you need!</p>
      </div>
    </div>
  );
};

export default HomeContent;
