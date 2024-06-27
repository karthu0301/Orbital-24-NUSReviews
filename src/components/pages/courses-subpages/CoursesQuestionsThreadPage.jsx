import CoursesQuestionsThread from "../../courses/CoursesQuestionsThread"

const CoursesQuestionsThreadPage = () => {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      <CoursesQuestionsThread />
      </div>
    )
  }
  
  export default CoursesQuestionsThreadPage;