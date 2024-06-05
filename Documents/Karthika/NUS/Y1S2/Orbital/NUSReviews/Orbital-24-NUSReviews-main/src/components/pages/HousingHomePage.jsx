import HousingHome from "../HousingHome"
import Sidebar from "../Sidebar"

const HousingHomePage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HousingHome />
      <Sidebar />
      </div>
    )
  }
  
  export default HousingHomePage