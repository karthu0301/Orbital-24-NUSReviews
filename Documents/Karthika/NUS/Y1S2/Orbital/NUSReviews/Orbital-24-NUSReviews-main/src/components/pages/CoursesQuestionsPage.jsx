import CoursesQuestions from "../CoursesQuestions"
import Sidebar from "../Sidebar"

const CoursesQuestionsPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <CoursesQuestions />
      <Sidebar />
      </div>
    )
  }
  
  export default CoursesQuestionsPage