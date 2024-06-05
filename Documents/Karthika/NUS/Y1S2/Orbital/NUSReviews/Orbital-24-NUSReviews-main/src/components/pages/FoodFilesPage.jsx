import FoodFiles from "../FoodFiles"
import Sidebar from "../Sidebar"

const FoodFilesPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <FoodFiles />
      <Sidebar />
      </div>
    )
  }
  
  export default FoodFilesPage