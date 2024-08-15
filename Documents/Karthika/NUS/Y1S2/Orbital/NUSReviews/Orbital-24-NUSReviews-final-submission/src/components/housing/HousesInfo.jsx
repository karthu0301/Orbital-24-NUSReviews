import './HousingInfo.css'
import pic from '../../assets/images/housing-bk.jpeg';
import house1 from '../../assets/images/helix.png';
import house2 from '../../assets/images/light.png';
import house3 from '../../assets/images/pioneer.png';
import { Link } from 'react-router-dom';

const items = [
  {
    icon: house1,
    title: 'Helix',
    link: 'https://nus.edu.sg/osa/helixhouse'
  },
  {
    icon: house2,
    title: 'Lighthouse',
    link: 'https://nus.edu.sg/osa/lighthouse/home'
  },
  {
    icon: house3,
    title: 'Pioneer',
    link: 'https://nus.edu.sg/osa/pioneerhouse/home'
  },
];

const Item = ({ icon, title, description, link }) => (
  <div className="homeinfo-item">
    <Link to={link} className='homeinfo-item-link'>
    <img src={icon} alt={title} className="item-image" />
    </Link>
  </div>
);

const HousesInfo = () => (
  <div className="homeinfo-container">
    {items.map((item) => (
      <Item key={item.title} icon={item.icon} title={item.title} link={item.link}/>
    ))}
  </div>
);

export default HousesInfo;
