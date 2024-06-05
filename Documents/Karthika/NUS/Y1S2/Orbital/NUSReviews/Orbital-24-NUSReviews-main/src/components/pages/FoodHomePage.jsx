import FoodHome from "../FoodHome"
import Sidebar from "../Sidebar"

const FoodHomePage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <FoodHome />
      <Sidebar />
      </div>
    )
  }
  
  export default FoodHomePage