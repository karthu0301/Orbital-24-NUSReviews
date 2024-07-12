import HousingQuestionsThread from "../../housing/HousingQuestionsThread";

const HousingQuestionsThreadPage = () => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
    }}>
      <HousingQuestionsThread />
    </div>
  );
};

export default HousingQuestionsThreadPage;