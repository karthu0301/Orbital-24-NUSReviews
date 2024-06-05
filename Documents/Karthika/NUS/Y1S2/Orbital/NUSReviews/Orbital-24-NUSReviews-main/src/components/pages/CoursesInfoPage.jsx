import CoursesInfo from "../CoursesInfo"
import Sidebar from "../Sidebar"

const CoursesInfoPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <CoursesInfo />
      <Sidebar />
      </div>
    )
  }
  
  export default CoursesInfoPage