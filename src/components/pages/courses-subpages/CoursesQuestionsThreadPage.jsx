import QuestionsThread from "../../QuestionsThread";

const CoursesQuestionsThreadPage = () => {
  return (
    <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
        <QuestionsThread subCategoryPropQ={'coursesQuestions'} subCategoryPropR={'coursesReplies'} subtopic={'courses'}/>
    </div>
  )
}
  
export default CoursesQuestionsThreadPage;
