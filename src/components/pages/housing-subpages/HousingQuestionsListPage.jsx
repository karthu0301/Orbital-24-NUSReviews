import QuestionsList from "../../QuestionsList";

const HousingQuestionsListPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row'}}>
      <QuestionsList subCategoryProp={'housingQuestions'}/>
    </div>
  )
};

export default HousingQuestionsListPage;