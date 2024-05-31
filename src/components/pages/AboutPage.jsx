import AboutContent from "../AboutContent"
import Sidebar from "../Sidebar"

const AboutPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Sidebar />
      <AboutContent />
    </div>
  )
}

export default AboutPage