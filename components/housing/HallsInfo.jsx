import './HousingInfo.css'
import pic from '../../assets/images/housing-bk.jpeg';
import hall1 from '../../assets/images/eusoff.png';
import hall2 from '../../assets/images/kent-ridge.png';
import hall3 from '../../assets/images/ke7.png';
import hall4 from '../../assets/images/raffles.png';
import hall5 from '../../assets/images/sheares.png';
import hall6 from '../../assets/images/temasek.png';
import { Link } from 'react-router-dom';

const items = [
  {
    icon: hall1,
    title: 'Eusoff',
    link: 'https://nus.edu.sg/osa/eusoffhall'
  },
  {
    icon: hall2,
    title: 'Kent Ridge',
    link: 'https://nus.edu.sg/osa/kentridgehall/home'
  },
  {
    icon: hall3,
    title: 'King Edwards VII',
    link: 'https://nus.edu.sg/osa/keviihall/keviihall'
  },
  {
    icon: hall4,
    title: 'Raffles',
    link: 'https://nus.edu.sg/osa/raffleshall/home'
  },
  {
    icon: hall5,
    title: 'Sheares',
    link: 'https://nus.edu.sg/osa/sheareshall/home'
  }, 
  {
    icon: hall6,
    title: 'Temasek',
    link: 'https://nus.edu.sg/osa/temasekhall/home'
  }
];

const Item = ({ icon, title, description, link }) => (
  <div className="homeinfo-item">
    <Link to={link} className='homeinfo-item-link'>
    <img src={icon} alt={title} className="item-image" />
    </Link>
  </div>
);

const HallsInfo = () => (
  <div className="homeinfo-container">
    <img src={pic} alt="NUS" className="background-image" />
    {items.map((item) => (
      <Item key={item.title} icon={item.icon} title={item.title} link={item.link}/>
    ))}
  </div>
);

export default HallsInfo;