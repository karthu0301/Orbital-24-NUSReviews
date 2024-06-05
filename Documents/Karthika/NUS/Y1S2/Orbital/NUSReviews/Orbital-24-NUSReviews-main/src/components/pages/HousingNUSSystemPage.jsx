import HousingNUSSystem from "../HousingNUSSystem"
import Sidebar from "../Sidebar"

const HousingNUSSystemPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HousingNUSSystem />
      <Sidebar />
    </div>
  )
}

export default HousingNUSSystemPage