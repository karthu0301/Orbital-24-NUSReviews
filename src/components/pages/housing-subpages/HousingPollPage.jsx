import PollForm from "../../PollForm";
import PollList from "../../PollList";

const HousingPollPage = () => {
  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PollForm fixedCategory="housing" />
      </div>
      <PollList filterCategory="housing" />
    </div>
  );
};

export default HousingPollPage;
