import './Sidebar.css';

const Sidebar = () => {
  const sidebarSubpages = [
    { name: 'Courses', icon: 'https://via.placeholder.com/24x24' },
    { name: 'Housing', icon: 'https://via.placeholder.com/24x24' },
    { name: 'Food', icon: 'https://via.placeholder.com/24x24' },
  ];

  const sidebarLibrary = [
    { name: 'All Files', icon: 'https://via.placeholder.com/24x24' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">Subpages</div>
      {sidebarSubpages.map((item, index) => (
        <div key={index} className="sidebar-item">
          <img src={item.icon} alt={item.name} />
          <span>{item.name}</span>
        </div>
      ))}
      <div className="sidebar-header">Library</div>
      {sidebarLibrary.map((item, index) => (
        <div key={index} className="sidebar-item">
          <img src={item.icon} alt={item.name} />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;