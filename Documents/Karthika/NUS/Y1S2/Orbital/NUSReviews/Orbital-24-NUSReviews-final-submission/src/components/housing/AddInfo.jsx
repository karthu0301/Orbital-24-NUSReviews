import './HousingInfo.css'
import pic from '../../assets/images/housing-bk.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const items = [
  {
    icon: faRoute,
    title: "Application Guide",
    link: 'https://nus.edu.sg/osa/student-services/hostel-admission/undergraduate'
  },
  {
    icon: faDollarSign,
    title: 'Pricing',
    link: 'https://nus.edu.sg/osa/student-services/hostel-admission/undergraduate/hostel-meal-plan-rates'
  },
];

const Item = ({ icon, title, description, link }) => (
  <div className="homeinfo-other-item">
    <Link to={link} className='homeinfo-item-link'>
    <FontAwesomeIcon icon={icon} className="item-icon" />
      <div className="item-content">
        <h3 className="item-title">{title}</h3>
      </div>
    </Link>
  </div>
);

const SRInfo = () => (
  <div className="homeinfo-container">
    {items.map((item) => (
      <Item key={item.title} icon={item.icon} title={item.title} link={item.link}/>
    ))}
  </div>
);

export default SRInfo;
