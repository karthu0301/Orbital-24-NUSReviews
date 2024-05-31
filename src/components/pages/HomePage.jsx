import DropdownMenu from '../DropdownMenu';
import HomeContent from '../HomeContent';


const HomePage = () => {
  return (
    <div>
      <div className="sub-menus">
        <DropdownMenu title="Courses" />
        <DropdownMenu title="Housing" />
        <DropdownMenu title="Food" />
      </div>
      <HomeContent />
    </div>
  )
}

export default HomePage
