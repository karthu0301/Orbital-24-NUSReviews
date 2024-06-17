import './HousingInfo.css'
import pic from '../../assets/images/housing-bk.jpeg';
import rc1 from '../../assets/images/capt.png';
import rc2 from '../../assets/images/rc4.png';
import rc3 from '../../assets/images/rvrc.png';
import rc4 from '../../assets/images/tembusu.png'
import { Link } from 'react-router-dom';

const items = [
  {
    icon: rc1,
    title: 'College of Alice & Peter Tan',
    link: 'https://capt.nus.edu.sg/'
  },
  {
    icon: rc2,
    title: 'Residential College 4',
    link: 'https://rc4.nus.edu.sg/'
  },
  {
    icon: rc3,
    title: 'Ridge View Residential College',
    link: 'https://rvrc.nus.edu.sg/'
  },
  {
    icon: rc4,
    title: 'Tembusu College',
    link: 'https://tembusu.nus.edu.sg/'
  },
];

const Item = ({ icon, title, description, link }) => (
  <div className="homeinfo-item">
    <Link to={link} className='homeinfo-item-link'>
    <img src={icon} alt={title} className="item-image" />
    </Link>
  </div>
);

const RCInfo = () => (
  <div className="homeinfo-container">
    {items.map((item) => (
      <Item key={item.title} icon={item.icon} title={item.title} description={item.description} link={item.link}/>
    ))}
  </div>
);

export default RCInfo;