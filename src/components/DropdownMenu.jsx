import './DropdownMenu.css'

const DropdownMenu = ({ title }) => {
  return (
    <div className="dropdown">
      <button className="dropbtn">{title}</button>
      {/* Dropdown Content Placeholder */}
      <div className="dropdown-content">
        <a href="#">Link 1</a>
        <a href="#">Link 2</a>
        <a href="#">Link 3</a>
      </div>
    </div>
  );
};

export default DropdownMenu;