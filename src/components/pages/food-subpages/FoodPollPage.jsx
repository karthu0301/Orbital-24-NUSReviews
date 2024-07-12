import PollForm from "../../PollForm";
import PollList from "../../PollList";

const FoodPollPage = () => {
  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PollForm fixedCategory="food" />
      </div>
      <PollList filterCategory="food" />
    </div>
  );
};

export default FoodPollPage;