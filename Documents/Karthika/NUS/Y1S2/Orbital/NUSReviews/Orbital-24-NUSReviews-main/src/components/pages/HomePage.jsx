import DropdownMenu from '../DropdownMenu';
import HomeContent from '../HomeContent';

const HomePage = () => {
  const courseItems = [
    { href: "#course1", label: "Information" },
    { href: "#course2", label: "NUSMods" },
    { href: "#course3", label: "Question Threads" },
    { href: "#course4", label: "Files" }
  ];

  const housingItems = [
    { href: "#housing1", label: "NUS System" },
    { href: "#housing2", label: "Information" },
    { href: "#housing3", label: "Question Threads" },
    { href: "#housing4", label: "Files" }
  ];

  const foodItems = [
    { href: "#food1", label: "Question Threads" },
    { href: "#food2", label: "Files" }
  ];

  return (
    <div>
      <div className="sub-menus">
        <DropdownMenu title="Courses" items={courseItems} />
        <DropdownMenu title="Housing" items={housingItems} />
        <DropdownMenu title="Food" items={foodItems} />
      </div>
      <HomeContent />
    </div>
  )
}

export default HomePage;

