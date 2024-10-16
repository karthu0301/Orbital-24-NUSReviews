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

const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path='/' element={<MainLayout />}>
   <Route index element={<HomePage />} />
   <Route path='/about' element={<AboutPage />} />
   <Route path='/login' element={<LoginPage />} />
   <Route path='/login/signup' element={<SignupPage />} />
   <Route path='/login/signup/verify' element={<VerificationPage />} />
  </Route>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;