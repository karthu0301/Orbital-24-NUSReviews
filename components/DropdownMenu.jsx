import { Link, useNavigate } from 'react-router-dom';
import './DropdownMenu.css';

const DropdownMenu = ({ title, items, navigateTo }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(navigateTo);
  };

  return (
    <div className="dropdown" onMouseEnter={() => document.getElementById(`dropdown-content-${title}`).style.display = 'block'} onMouseLeave={() => document.getElementById(`dropdown-content-${title}`).style.display = 'none'}>
      <button className="dropbtn" onClick={handleButtonClick}>{title}</button>
      <div className="dropdown-content" id={`dropdown-content-${title}`}>
        {items.map((item, index) => (
          <Link key={index} to={item.href}>{item.label}</Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;