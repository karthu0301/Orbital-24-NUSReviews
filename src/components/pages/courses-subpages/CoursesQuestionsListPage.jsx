import QuestionList from "../../QuestionList";

const CoursesQuestionsListPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <QuestionList subCategoryProp={'coursesQuestions'}/>
    </div>
  )
};
  
export default CoursesQuestionsListPage;
