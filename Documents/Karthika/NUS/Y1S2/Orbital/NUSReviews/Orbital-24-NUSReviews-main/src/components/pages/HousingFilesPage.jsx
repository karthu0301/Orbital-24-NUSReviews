import HousingFiles from "../HousingFiles"
import Sidebar from "../Sidebar"

const HousingFIlesPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HousingFiles />
      <Sidebar />
      </div>
    )
  }
  
  export default HousingFilesPage