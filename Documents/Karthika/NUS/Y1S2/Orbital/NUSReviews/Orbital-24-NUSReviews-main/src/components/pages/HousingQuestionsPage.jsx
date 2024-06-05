import HousingQuestions from "../HousingQuestions"
import Sidebar from "../Sidebar"

const HousingQuestionsPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <HousingQuestions />
      <Sidebar />
      </div>
    )
  }
  
  export default HousingQuestionsPage