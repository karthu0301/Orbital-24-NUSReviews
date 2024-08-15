import './HousingInfo.css'
import pic from '../../assets/images/housing-bk.jpeg';
import sr1 from '../../assets/images/pgpr.png';
import sr2 from '../../assets/images/utr.png';
import { Link } from 'react-router-dom';

const items = [
  {
    icon: sr1,
    title: "Prince George's Park Residence",
    link: 'https://nus.edu.sg/osa/pgpr/home'
  },
  {
    icon: sr2,
    title: 'UTown Residence',
    link: 'https://nus.edu.sg/osa/utr/home'
  },
];

const Item = ({ icon, title, description, link }) => (
  <div className="homeinfo-item">
    <Link to={link} className='homeinfo-item-link'>
    <img src={icon} alt={title} className="item-image" />
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
