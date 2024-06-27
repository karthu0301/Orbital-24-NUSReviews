import FoodQuestionsThread from '../../food/FoodQuestionsThread';

const FoodQuestionsThreadPage = () => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
    }}>
      <FoodQuestionsThread />
    </div>
  )
};

export default FoodQuestionsThreadPage;