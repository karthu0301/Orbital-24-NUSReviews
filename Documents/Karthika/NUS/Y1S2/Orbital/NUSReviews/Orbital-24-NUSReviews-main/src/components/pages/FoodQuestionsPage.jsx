import FoodQuestions from "../FoodQuestions"
import Sidebar from "../Sidebar"

const FoodQuestionsPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <FoodQuestions />
      <Sidebar />
      </div>
    )
  }
  
  export default FoodQuestionsPage