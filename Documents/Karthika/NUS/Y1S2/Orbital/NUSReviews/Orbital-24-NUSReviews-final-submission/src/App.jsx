import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
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
import AllFilesPage from './components/pages/AllFilesPage';
import SavedThreadsPage from './components/pages/SavedThreadsPage';
import CoursesHomePage from './components/pages/courses-subpages/CoursesHomePage';
import CoursesGuidePage from './components/pages/courses-subpages/CoursesGuidePage';
import CoursesPollPage from './components/pages/courses-subpages/CoursesPollPage';
import CoursesQuestionsListPage from './components/pages/courses-subpages/CoursesQuestionsListPage';
import CoursesQuestionsThreadPage from './components/pages/courses-subpages/CoursesQuestionsThreadPage';
import HousingHomePage from './components/pages/housing-subpages/HousingHomePage';
import HousingInformationPage from './components/pages/housing-subpages/HousingInformationPage';
import HousingPollPage from './components/pages/housing-subpages/HousingPollPage';
import HousingQuestionsListPage from './components/pages/housing-subpages/HousingQuestionsListPage';
import HousingQuestionsThreadPage from './components/pages/housing-subpages/HousingQuestionsThreadPage';
import FoodHomePage from './components/pages/food-subpages/FoodHomePage';
import FoodMapPage from './components/pages/food-subpages/FoodMapPage';
import FoodPollPage from './components/pages/food-subpages/FoodPollPage';
import FoodQuestionsListPage from './components/pages/food-subpages/FoodQuestionsListPage';
import FoodQuestionsThreadPage from './components/pages/food-subpages/FoodQuestionsThreadPage';
import ContactAdminsPage from './components/pages/ContactAdminsPage';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { useEffect, useState } from 'react';
import { getDoc, doc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase-config';

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
      <Route path='/courses/polls' element={<CoursesPollPage />} />
      <Route path='/courses/questions' element={<CoursesQuestionsListPage />} />
      <Route path='/courses/questions/:questionId' element={<CoursesQuestionsThreadPage />} />
    </Route>
    <Route path='/housing' element={<AltLayout />}>
      <Route index element={<HousingHomePage />} />
      <Route path='/housing/information' element={<HousingInformationPage />} />
      <Route path='/housing/polls' element={<HousingPollPage />} />
      <Route path='/housing/questions' element={<HousingQuestionsListPage />} />
      <Route path='/housing/questions/:questionId' element={<HousingQuestionsThreadPage />} />
    </Route>
    <Route path='/food' element={<AltLayout />}>
      <Route index element={<FoodHomePage />} />
      <Route path='/food/map' element={<FoodMapPage />} />
      <Route path='/food/polls' element={<FoodPollPage />} />
      <Route path='/food/questions' element={<FoodQuestionsListPage />} />
      <Route path='/food/questions/:questionId' element={<FoodQuestionsThreadPage />} />
    </Route>
    <Route path='/polls' element={<AltLayout />}>
      <Route index element={<AllPollsPage />} />
    </Route>
    <Route path='/all-files' element={<AltLayout />}>
      <Route index element={<AllFilesPage />} />
    </Route>
    <Route path='/saved-threads' element={<AltLayout />}>
      <Route index element={<SavedThreadsPage />} />
    </Route>
    <Route path='/contactadmins' element={<AltLayout />}>
      <Route index element={<ContactAdminsPage />} />
    </Route>
  </>
  )
);

const App = () => {
  const [user, setUser] = useState(null);
  const [userLastViewed, setUserLastViewed] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        getDoc(userRef).then(docSnapshot => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUserLastViewed(userData.lastViewedThreads || {});
          }
        }).catch(error => console.error("Failed to fetch user data:", error));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const refreshReminders = async () => {
      if (!user) return;

      let hasUnread = false;
      const remindersRef = collection(db, "users", user.uid, "reminders");
      const reminderDocs = await getDocs(remindersRef);
      await Promise.all(reminderDocs.docs.map(async (reminderDoc) => {
        const reminderData = reminderDoc.data();
        const questionRef = doc(db, reminderData.questionCollection, reminderData.questionId);
        const questionDoc = await getDoc(questionRef);
        if (questionDoc.exists()) {
          const questionData = questionDoc.data();
          const questionId = questionDoc.id;
          const lastViewedTimestamp = userLastViewed[questionId]?.seconds || 0;
          const lastReplyTimestamp = questionData.lastReplyTimestamp?.seconds || 0;
          if (lastReplyTimestamp > lastViewedTimestamp) {
            hasUnread = true;
          }
        }
      }));
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        hasUnreadNotifications: hasUnread
      });
    };

    if (user) {
      refreshReminders().catch(error => console.error("Failed to refresh reminders:", error));
    }

    
  }, [user, userLastViewed]);

  return <RouterProvider router={router} />
   
};

export default App;
