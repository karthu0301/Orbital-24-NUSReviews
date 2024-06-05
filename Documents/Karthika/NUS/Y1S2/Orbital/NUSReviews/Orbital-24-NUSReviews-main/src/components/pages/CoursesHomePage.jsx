import CoursesHome from "../CoursesHome"
import Sidebar from "../Sidebar"

const CoursesHomePage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <CoursesHome />
      <Sidebar />
      </div>
    )
  }
  
  export default CoursesHomePage