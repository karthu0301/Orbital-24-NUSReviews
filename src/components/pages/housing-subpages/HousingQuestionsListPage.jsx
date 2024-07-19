import QuestionList from "../../QuestionList";

const HousingQuestionsListPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row'}}>
      <QuestionList subCategoryProp={'housingQuestions'}/>
    </div>
  )
};

export default HousingQuestionsListPage;
