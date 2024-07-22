import QuestionsList from "../../QuestionsList";

const CoursesQuestionsListPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <QuestionsList subCategoryProp={'coursesQuestions'}/>
    </div>
  )
};
  
export default CoursesQuestionsListPage;