import './DropdownMenu.css';

const DropdownMenu = ({ title, items }) => {
  return (
    <div className="dropdown">
      <button className="dropbtn">{title}</button>
      <div className="dropdown-content">
        {items.map((item, index) => (
          <a key={index} href={item.href}>{item.label}</a>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;