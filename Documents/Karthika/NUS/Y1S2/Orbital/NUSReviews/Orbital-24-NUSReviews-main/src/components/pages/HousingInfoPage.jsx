import HousingInfo from "../HousingInfo"
import Sidebar from "../Sidebar"

const HousingInfoPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HousingInfo />
      <Sidebar />
      </div>
    )
  }
  
  export default HousingInfoPage