import ProfileContent from "../ProfileContent";
import Sidebar from "../Sidebar";

const ProfilePage = () => {
  return (
    <div className="profile-hold">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <ProfileContent />
        <Sidebar />
      </div>
    </div>
  );
};

export default ProfilePage;