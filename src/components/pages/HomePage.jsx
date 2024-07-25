import DropdownMenu from '../DropdownMenu';
import HomeContent from '../HomeContent';

const HomePage = () => {
  const courseItems = [
    { href: "/courses/guide", label: "Guide" },
    { href: 'https://nusmods.com', label: "NUSMods" },
    { href: "/courses/questions", label: "Question Threads" },
    { href: "/courses/polls", label: "Polls" },
  ];

  const housingItems = [
    { href: "/housing/information", label: "Information" },
    { href: "/housing/questions", label: "Question Threads" },
    { href: "/housing/polls", label: "Polls" },
  ];

  const foodItems = [
    { href: "/food/map", label: "Map" },
    { href: "/food/questions", label: "Question Threads" },
    { href: "/food/polls", label: "Polls" }, 
  ];

  return (
    <div>
      <div className="sub-menus">
        <DropdownMenu title="Courses" items={courseItems} navigateTo={'/courses'} />
        <DropdownMenu title="Housing" items={housingItems} navigateTo={'/housing'} />
        <DropdownMenu title="Food" items={foodItems} navigateTo={'/food'} />
      </div>
      <HomeContent />
    </div>
  )
}

export default HomePage;
