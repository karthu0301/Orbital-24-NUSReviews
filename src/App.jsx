import { 
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'

import './firebase-config';
import MainLayout from './layouts/MainLayout';
import AltLayout from './layouts/AltLayout';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ProfilePage from './components/pages/ProfilePage';
import AllPollsPage from './components/pages/AllPollsPage';
import CoursesHomePage from './components/pages/courses-subpages/CoursesHomePage';
import CoursesGuidePage from './components/pages/courses-subpages/CoursesGuidePage';
import HousingHomePage from './components/pages/housing-subpages/HousingHomePage';
import HousingInformationPage from './components/pages/housing-subpages/HousingInformationPage';
import FoodHomePage from './components/pages/food-subpages/FoodHomePage';
import FoodMapPage from './components/pages/food-subpages/FoodMapPage';

const router = createBrowserRouter(
  createRoutesFromElements(
  <>  
    <Route path='/' element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/login/signup' element={<SignupPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Route>
    <Route path='/courses' element={<AltLayout />}>
      <Route index element={<CoursesHomePage />} />
      <Route path='/courses/guide' element={<CoursesGuidePage />} />
    </Route>
    <Route path='/housing' element={<AltLayout />}>
      <Route index element={<HousingHomePage />} />
      <Route path='/housing/information' element={<HousingInformationPage />} />
    </Route>
    <Route path='/food' element={<AltLayout />}>
      <Route index element={<FoodHomePage />} />
      <Route path='/food/map' element={<FoodMapPage />} />
    </Route>
    <Route path='/polls' element={<AltLayout />}>
      <Route index element={<AllPollsPage />} />
    </Route>
  </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;