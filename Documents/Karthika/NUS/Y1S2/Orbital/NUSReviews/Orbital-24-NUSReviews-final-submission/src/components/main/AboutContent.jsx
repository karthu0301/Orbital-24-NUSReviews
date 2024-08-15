import './AboutContent.css';
import stampImage from '../../assets/images/logo.png';

const AboutContent = () => {
  return (
    <div className="about-main-content">
      <div className="about-image">
        <img src={stampImage} alt="NUSReviews Stamp" />
      </div>
      <div className="about-text-content">
        <section>
          <header>Aim</header>
          <p>"NUSReviews" aims to centralise and simplify access to data on housing, dining, and academic opportunities, "NUSReviews" facilitates a more informed, connected, and enriching university experience.</p>
        </section>
        <section>
          <header>Motivation</header>
          <p>Our goal is to eliminate the guesswork and fractured information trails by providing a one-stop solution that empowers students to make informed decisions with confidence and ease.</p>
        </section>
        <p className="about-summary">Make informed decisions! Get personalised help! Enhance your university life!</p>
      </div>
    </div>
  );
};

export default AboutContent;
