import QuestionsThread from '../../QuestionsThread';

const FoodQuestionsThreadPage = () => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
    }}>
      <QuestionsThread subCategoryPropQ={'foodQuestions'} subCategoryPropR={'foodReplies'}/>
    </div>
  )
};

export default FoodQuestionsThreadPage;
