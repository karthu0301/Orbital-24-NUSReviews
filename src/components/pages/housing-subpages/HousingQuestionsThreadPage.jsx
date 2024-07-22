import QuestionsThread from "../../QuestionsThread";

const HousingQuestionsThreadPage = () => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
    }}>
      <QuestionsThread subCategoryPropQ={'housingQuestions'} subCategoryPropR={'housingReplies'} subtopic={'housing'}/>
    </div>
  );
};

export default HousingQuestionsThreadPage;