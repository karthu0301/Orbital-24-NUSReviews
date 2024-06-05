import { 
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'

import './firebase-config';
import MainLayout from './layouts/MainLayout';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import VerificationPage from './components/pages/VerificationPage';
import ProfilePage from './components/pages/ProfilePage';
import HousingHomePage from './components/pages/HousingHomePage'
import HousingNUSSystemPage from './components/pages/HousingNUSSystemPage'
import HousingInfoPage from './components/pages/HousingInfoPage'
// import HousingQuestionsPage from './components/pages/HousingQuestionsPage'
// import HousingFilesPage from './components/pages/HousingFilesPage'
// import CoursesHomePage from './components/pages/CoursesHomePage'
// import CoursesInfoPage from './components/pages/CoursesInfoPage'
// import CoursesNUSModsPage from './components/pages/CoursesNUSModsPage'
// import CoursesQuestionsPage from './components/pages/CoursesQuestionsPage'
// import CoursesFilesPage from './components/pages/CoursesFilesPage'
// import FoodHomePage from './components/pages/FoodHomePage'
// import FoodQuestionsPage from './components/pages/FoodQuestionsPage'
// import FoodFilesPage from './components/pages/FoodFilesPage'


const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path='/' element={<MainLayout />}>
   <Route index element={<HomePage />} />
   <Route path='/about' element={<AboutPage />} />
   <Route path='/login' element={<LoginPage />} />
   <Route path='/login/signup' element={<SignupPage />} />
   <Route path='/login/signup/verify' element={<VerificationPage />} />
   <Route path= '/profile' element={<ProfilePage />} />
   <Route path= '/housing' element={<HousingHomePage />} />
   <Route path= '/housing/NUSSystem' element={<HousingNUSSystemPage />} />
   <Route path= '/housing/info' element={<HousingInfoPage />} />
   {/* <Route path= '/housing/questions' element={<HousingQuestionsPage />} />
   <Route path= '/housing/files' element={<HousingFilesPage />} />
   <Route path= '/courses' element={<CoursesHomePage />} />
   <Route path= '/courses/info' element={<CoursesInfoPage />} />
   <Route path= '/courses/NUSMods' element={<CoursesNUSModsPage />} />
   <Route path= '/courses/questions' element={<CoursesQuestionsPage />} />
   <Route path= '/courses/files' element={<CoursesFilesPage />} />
   <Route path= '/food' element={<FoodHomePage />} />
   <Route path= '/food/questions' element={<FoodQuestionsPage />} />
   <Route path= '/food/files' element={<FoodFilesPage />} /> */}
     </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;