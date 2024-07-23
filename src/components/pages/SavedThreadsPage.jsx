import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase-config';
import { collection, getDoc, doc as firestoreDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import '../SavedThreads.css'

const SavedThreadsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userLastViewed, setUserLastViewed] = useState({});

  useEffect(() => {
      if (user) {
          const userRef = firestoreDoc(db, "users", user.uid);
          getDoc(userRef).then(docSnapshot => {
              if (docSnapshot.exists()) {
                  const userData = docSnapshot.data();
                  setUserLastViewed(userData.lastViewedThreads || {});
              }
          });
      }
  }, [user]);

  const categoryMap = {
    housingQuestions: 'Housing',
    coursesQuestions: 'Courses',
    foodQuestions: 'Food'
  };

  const categoryMapRoute = {
    housingQuestions: 'housing',
    coursesQuestions: 'courses',
    foodQuestions: 'food'
  };

  const subcategoryMap = {
    houses: 'Houses',
    halls: 'Halls',
    studentresidences: 'Student Residences',
    residentialcolleges: 'Residential Colleges',
    pricing: 'Pricing',
    designandengineering: 'Design & Engineering',
    computing: 'Computing',
    humanitiesandsciences: 'Humanities & Sciences',
    medicine: 'Medicine',
    dentistry: 'Dentistry',
    law: 'Law',
    music: 'Music',
    nursing: 'Nursing',
    pharmacy: 'Pharmacy',
    nuscollege: 'NUS College', 
    others: 'Others',
    application: 'Application Matters',
    general: 'General', 
    recommendation: 'Recommendations',
    canteen: 'Canteen',
    cuisine: 'Cuisine',
    warning: 'Cautionary Tales'
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);  // Set this true once we know the auth state
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user) return;

      let hasUnread = false; // Initialize the flag for each fetch cycle
      console.log("Started fetching questions...");

      const remindersRef = collection(db, "users", user.uid, "reminders");
      const reminderDocs = await getDocs(remindersRef);

      const questionsPromises = reminderDocs.docs.map(async (reminderDoc) => {
        const reminderData = reminderDoc.data();
        const questionRef = firestoreDoc(db, reminderData.questionCollection, reminderData.questionId);
        const questionDoc = await getDoc(questionRef);
      
        if (questionDoc.exists()) {
          const questionData = questionDoc.data();
          const questionId = questionDoc.id;
          const lastViewedTimestamp = userLastViewed[questionId] ? userLastViewed[questionId].seconds : 0;
          const lastReplyTimestamp = questionData.lastReplyTimestamp ? questionData.lastReplyTimestamp.seconds : 0;
      
          if (lastReplyTimestamp > lastViewedTimestamp) {
            hasUnread = true;
          }
      
          return {
            ...questionData,
            id: questionId,
            collection: reminderData.questionCollection,
            topic: categoryMap[reminderData.questionCollection],
            pageRoute: categoryMapRoute[reminderData.questionCollection],
            reminderId: reminderDoc.id,
            reminderTimestamp: reminderData.timestamp.seconds
          };
        }
        return null;
      });    

      const fetchedQuestions = await Promise.all(questionsPromises);
      setQuestions(fetchedQuestions.filter(q => q !== null));

      console.log("hasUnread final value:", hasUnread);

      // Ensure all promises complete before updating the user document
      const userRef = firestoreDoc(db, "users", user.uid);
      await updateDoc(userRef, {
        hasUnreadNotifications: hasUnread
      });
    };

    if (isAuthReady && user) {
        fetchQuestions();
    }
  }, [isAuthReady, user, userLastViewed]); // Make sure to correctly list all dependencies


  const checkForNewReplies = (question, lastViewed) => {
    return question.lastReplyTimestamp > lastViewed;
  };

  const getLastReplyTimestamp = (question) => question.lastReplyTimestamp ? question.lastReplyTimestamp.seconds || question.lastReplyTimestamp : 0;

  const sortedQuestions = questions.sort((a, b) => {
    if (sortOrder === ""){
      return getLastReplyTimestamp(b) - getLastReplyTimestamp(a);
    } else if (sortOrder === 'latest') {
      return b.reminderTimestamp - a.reminderTimestamp;
    } else {
      return a.reminderTimestamp - b.reminderTimestamp;
    }
  });

  const filteredQuestions = sortedQuestions.filter(question =>
    filterTopic ? question.collection.includes(filterTopic) : true
  );

  const removeReminder = async (reminderId) => { 
    try {
      const reminderRef = firestoreDoc(db, "users", user.uid, "reminders", reminderId);
      await deleteDoc(reminderRef);
      alert("Thread unsaved! You will no longer be notified when replies are added");

    } catch (error) {
      console.error("Error removing reminder:", error);
      alert("Failed to remove reminder.");
    }
  };

  return (
    <div className="saved-page">
      <h1>Saved Threads</h1>
      <div>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Date Reminder Set</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
          <option value="">Filter by Topic</option>
          <option value="housingQuestions">Housing</option>
          <option value="coursesQuestions">Courses</option>
          <option value="foodQuestions">Food</option>
        </select>
      </div>
      <div className='question-cards-container'>
        {filteredQuestions.map(question => (
          <div key={question.id} className="question-card">
            <Link to={`/${question.pageRoute}/questions/${question.id}`}>
              {question.text.length > 100 ? `${question.text.slice(0, 100)}...` : question.text}
            </Link>
            {checkForNewReplies(question, userLastViewed[question.id]) && <FontAwesomeIcon icon={faExclamationCircle} className='notification-dot'/>}
            <p>Subpage: {question.topic || 'unknown'}</p>
            <p>Category: {subcategoryMap[question.category] || 'unknown'}</p>
            <p>Asked By: {question.askedBy || 'unkown'}</p>
            <button onClick={() => removeReminder(question.reminderId)} className='remove-reminder'>Remove from saved</button>
          </div>
        ))}  
      </div>
      
    </div>
  );
};

export default SavedThreadsPage;
