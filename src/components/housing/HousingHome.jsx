import '../SubpagesHome.css';
import pic from '../../assets/images/UT.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPersonCircleQuestion, faPoll } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const items = [
  {
    icon: faInfoCircle,
    title: 'Information',
    description: 'Some helpful offical resources.',
    link: '/housing/information'
  },
  {
    icon: faPersonCircleQuestion,
    title: 'Question Threads',
    description: 'Still have questions? Ask and answer questions related to courses.',
    link: '/housing/questions'
  },
  {
    icon: faPoll,
    title: 'Polls',
    description: 'Create and vote on anonymous polls to share and gauge opinions on various topics.',
    link: '/housing/polls'
  }
];

const Item = ({ icon, title, description, link }) => (
  <div className="subpage-home-item">
    <Link to={link} className='subpage-home-item-link'>
      <FontAwesomeIcon icon={icon} className="item-icon" />
      <div className="item-content">
        <h3 className="item-title">{title}</h3>
        <p className="item-description">{description}</p>
      </div>
    </Link>
  </div>
);

const HousingHome = () => (
  <div className="subpage-home-container">
    <img src={pic} alt="NUS" className="background-image" />
    <div className="subpage-home-item">
      <div className="item-content">
        <h3 className="item-title">Housing</h3>
        <p className="item-description">Lost in the endless housing options?</p>
        <p className="item-description">Unsure what to look for when choosing?</p>
        <p className="item-description">Don't know where to find answers?</p>
        <p className="item-description">Here’s where you can start!</p>
      </div>
    </div>
    {items.map((item) => (
      <Item key={item.title} icon={item.icon} title={item.title} description={item.description} link={item.link}/>
    ))}
  </div>
);

export default HousingHome;