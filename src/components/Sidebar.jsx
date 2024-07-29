import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHome, faUtensils, faPoll, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const sidebarSubpages = [
    {
      name: 'Courses',
      icon: faBook,
      link: '/courses',
      subItems: [
        { name: 'Guide', link: '/courses/guide' },
        { name: 'NUSMods', link: 'https://nusmods.com' },
        { name: 'Question Threads', link: '/courses/questions' },
        { name: 'Polls', link: '/courses/polls' },
      ]
    },
    {
      name: 'Housing',
      icon: faHome,
      link: '/housing',
      subItems: [
        { name: 'Information', link: '/housing/information' },
        { name: 'Question Threads', link: '/housing/questions' },
        { name: 'Polls', link: '/housing/polls' },
      ]
    },
    {
      name: 'Food',
      icon: faUtensils,
      link: '/food',
      subItems: [
        { name: 'Map', link: '/food/map' },
        { name: 'Question Threads', link: '/food/questions' },
        { name: 'Polls', link: '/food/polls' },
      ]
    }
  ];

  const sidebarLibrary = [
    { name: 'Polls', icon: faPoll, link: '/polls' },
    { name: 'All Files', icon: faFolderOpen, link: '/all-files' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">Subpages</div>
      {sidebarSubpages.map((item, index) => (
        <div
          key={index}
          className="sidebar-item-container"
          onMouseEnter={() => document.getElementById(`submenu-${item.name}`).style.display = 'flex'}
          onMouseLeave={() => document.getElementById(`submenu-${item.name}`).style.display = 'none'}
        >
          <div className="sidebar-item" onClick={() => navigate(item.link)}>
            <FontAwesomeIcon icon={item.icon} />
            <span>{item.name}</span>
          </div>
          <div className="sidebar-submenu" id={`submenu-${item.name}`}>
            {item.subItems.map((subItem, subIndex) => (
              <Link key={subIndex} to={subItem.link} className="sidebar-subitem">
                {subItem.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <div className="sidebar-header">Library</div>
      {sidebarLibrary.map((item, index) => (
        <Link key={index} to={item.link} className="sidebar-item sidebar-item-link">
          <FontAwesomeIcon icon={item.icon} />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
