import { useState } from 'react';
import './CollapsibleSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faHome, faUtensils, faPoll, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const CollapsibleSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

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
        { name: 'Files', link: '/courses/files' }
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
        { name: 'Files', link: '/housing/files' }
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
        { name: 'Files', link: '/food/files' }
      ]
    }
  ];

  const sidebarLibrary = [
    { name: 'Polls', icon: faPoll, link: '/polls' },
    { name: 'All Files', icon: faFolderOpen, link: '/all-files' }
  ];

  return (
    <>
      <div className={`dim-overlay ${isExpanded ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <div className={`collapsible-sidebar ${isExpanded ? 'expanded' : ''}`}>
        <div className="collapsible-sidebar-content">
          <div className="collapsible-sidebar-header">Subpages</div>
          {sidebarSubpages.map((item, index) => (
            <div
              key={index}
              className="collapsible-sidebar-item-container"
              onMouseEnter={() => document.getElementById(`submenu-${item.name}`).style.display = 'flex'}
              onMouseLeave={() => document.getElementById(`submenu-${item.name}`).style.display = 'none'}
            >
              <div className="collapsible-sidebar-item" onClick={() => navigate(item.link)}>
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.name}</span>
              </div>
              <div className="collapsible-sidebar-submenu" id={`submenu-${item.name}`}>
                {item.subItems.map((subItem, subIndex) => (
                  <Link key={subIndex} to={subItem.link} className="collapsible-sidebar-subitem">
                    {subItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="collapsible-sidebar-header">Library</div>
          {sidebarLibrary.map((item, index) => (
            <Link key={index} to={item.link} className="collapsible-sidebar-item collapsible-sidebar-item-link">
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="sidebar-toggle-button" onClick={toggleSidebar}>
        {isExpanded ? '<' : '>'}
      </div>
    </>
  );
};

export default CollapsibleSidebar;