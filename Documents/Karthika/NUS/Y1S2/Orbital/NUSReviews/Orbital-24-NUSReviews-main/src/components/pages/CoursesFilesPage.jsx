import CoursesFiles from "../CoursesFiles"
import Sidebar from "../Sidebar"

const CoursesFilesPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <CoursesFiles />
      <Sidebar />
      </div>
    )
  }
  
  export default CoursesFilesPage