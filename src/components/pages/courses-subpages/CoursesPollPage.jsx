import PollForm from "../../PollForm";
import PollList from "../../PollList";

const CoursesPollPage = () => {
  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PollForm fixedCategory="courses" />
      </div>
      <PollList filterCategory="courses" />
    </div>
  );
};

export default CoursesPollPage;
