import PollForm from "../PollForm";
import PollList from "../PollList";

const AllPollsPage = () => {
  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PollForm />
      </div>
      <PollList />
    </div>
  );
};

export default AllPollsPage;
