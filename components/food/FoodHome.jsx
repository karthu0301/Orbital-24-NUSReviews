import '../SubpagesHome.css';
import pic from '../../assets/images/UT.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faPersonCircleQuestion, faPoll, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const items = [
  {
    icon: faMap,
    title: 'Map',
    description: 'Looking for food near you? You have come to the right place.',
    link: '/food/map'
  },
  {
    icon: faPersonCircleQuestion,
    title: 'Question Threads',
    description: 'Still have questions? Ask and answer questions related to courses.',
    link: '/food/questions'
  },
  {
    icon: faPoll,
    title: 'Polls',
    description: 'Create and vote on anonymous polls to share and gauge opinions on various topics.',
    link: '/food/polls'
  },
  {
    icon: faFileAlt,
    title: 'Files',
    description: 'Find any files shared in course-related question threads.',
    link: '/food/files'
  },
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

const FoodHome = () => (
  <div className="subpage-home-container">
    <img src={pic} alt="NUS" className="background-image" />
    {items.map((item) => (
      <Item key={item.title} icon={item.icon} title={item.title} description={item.description} link={item.link} />
    ))}
  </div>
);

export default FoodHome;