import AboutContent from "../main/AboutContent";
import Sidebar from "../Sidebar";

const AboutPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <AboutContent />
      <Sidebar />
    </div>
  )
}

export default AboutPage;
