import ProfileContent from "../ProfileContent"
import Sidebar from "../Sidebar"

const ProfilePage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <ProfileContent />
      <Sidebar />
      </div>
    )
  }
  
  export default ProfilePage