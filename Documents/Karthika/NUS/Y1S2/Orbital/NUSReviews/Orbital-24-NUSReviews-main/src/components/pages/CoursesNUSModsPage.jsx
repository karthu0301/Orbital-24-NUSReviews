import CoursesNUSMods from "../CoursesNUSMods"
import Sidebar from "../Sidebar"

const CoursesNUSModsPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <CoursesNUSMods />
      <Sidebar />
      </div>
    )
  }
  
  export default CoursesNUSModsPage