import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../QuestionsThread.css';
import { doc, getDoc, addDoc, deleteDoc, collection, getDocs, updateDoc, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const HousingQuestionsThread = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState('');
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [questionFileUrl, setQuestionFileUrl] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => { 
    const fetchQuestionAndReplies = async () => {
      try {
        const questionRef = doc(db, 'housingQuestions', questionId);
        const questionDoc = await getDoc(questionRef);
        if (questionDoc.exists()) {
          setQuestion(questionDoc.data().text);
          setQuestionFileUrl(questionDoc.data().fileUrl);
        } else {
          console.log("No such document!");
        }
    
        const repliesRef = collection(db, 'housingQuestions', questionId, 'housingReplies');
        const repliesQuery = query(repliesRef, orderBy('timestamp'));
        const repliesSnapshot = await getDocs(repliesQuery);
        setReplies(repliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    if (questionId) {
      fetchQuestionAndReplies();
    } else {
      console.log("ID is undefined.");
    }
  }, [questionId]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && questionId) {
      const userRef = doc(db, 'users', user.uid);
      const lastViewedKey = `lastViewedThreads.${questionId}`;

      // Update the last viewed timestamp for this thread
      updateDoc(userRef, {
        [lastViewedKey]: serverTimestamp()
      }).then(() => {
        console.log('Last viewed timestamp updated successfully.');
      }).catch(error => {
        console.error('Failed to update last viewed timestamp:', error);
      });
    }
  }, [questionId]);

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth(); // Get the auth instance
    const user = auth.currentUser; // Get the current user
    let answerer = null;
    let answerUid = null;

    if (user) {
      answerer = user.displayName || user.name || 'Registered User';
      answerUid = user.uid;
    } else {
      alert('Please Log in to proceed.');
      return;
    }

    if (isAnonymous) {
      answerer = 'Anonymous';
    }

    if (newReply.trim() !== '') {
      let fileUrl = null;
      if (attachedFile) {
        const fileRef = ref(storage, `housingReplies/${attachedFile.name}`);
        await uploadBytes(fileRef, attachedFile);
        fileUrl = await getDownloadURL(fileRef);
      }
  
      try {
        // Check if there are existing replies
        const repliesRef = collection(db, 'housingQuestions', questionId, 'housingReplies');
        const repliesSnapshot = await getDocs(repliesRef);
  
        // Add the new reply
        const docRef = await addDoc(repliesRef, {
          text: newReply,
          fileUrl,
          anonymous: isAnonymous,
          timestamp: serverTimestamp(),
          answeredBy: answerer,
          answeredByUid: answerUid
        });

        const newReplyObj = {
          id: docRef.id, 
          text: newReply,
          timestamp: new Date(),
          answeredBy: answerer,
          answeredByUid: answerUid,
          fileUrl: fileUrl
        }
  
        setReplies(prevReplies => [...prevReplies, newReplyObj]);
        setNewReply('');
        setAttachedFile(null);
        setIsAnonymous(false);
  
        // If there were no existing replies, update the question to mark it as answered
        if (repliesSnapshot.empty) {
          const questionRef = doc(db, 'housingQuestions', questionId);
          await updateDoc(questionRef, { answered: true });
        }

        // Update last reply timestamp
        await updateDoc(doc(db, "housingQuestions", questionId), {
          lastReplyTimestamp: serverTimestamp()
        });

      } catch (error) {
        console.error("Failed to submit reply:", error);
      }
    }
  };

  const handleMouseEnter = async (answeredBy, answeredByUid, event) => {
    if (answeredBy !== 'Anonymous' && answeredByUid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', answeredByUid));
        if (userDoc.exists()) {
          const profileInfo = userDoc.data();
          setPopupData(profileInfo);
          const rect = event.target.getBoundingClientRect();
          setPopupPosition({ top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width });
          setShowPopup(true);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
    setPopupData(null);  // Clear the popup data when mouse leaves
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;  // This will unsubscribe when the component unmounts
  }, []);  

  const [reminderId, setReminderId] = useState(null);

  useEffect(() => {
      const fetchReminderState = async () => {
          if (user) {
              const remindersRef = collection(db, "users", user.uid, "reminders");
              const querySnapshot = await getDocs(query(remindersRef, where("questionId", "==", questionId)));
              const reminders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              const reminder = reminders.find(r => r.questionId === questionId);
              setReminderId(reminder ? reminder.id : null);
          }
      };

      fetchReminderState();
  }, [user, questionId]);

  // const handleRemindMeClick = async () => {
  //   if (!user) {
  //     alert("Please log in to save polls and get reminders!");
  //     return;
  //   }
  
  //   try {
  //     const remindersRef = collection(db, "users", user.uid, "reminders");
  //     await addDoc(remindersRef, {
  //       questionCollection: 'housingQuestions',
  //       questionId: questionId,
  //       timestamp: serverTimestamp()
  //     });
  //     alert("Thread saved! You will be notified when new replies are added.");

  //     const questionRef = doc(db, 'housingQuestions', questionId);
  //     await updateDoc(questionRef, { reminderSet: true });
  //   } catch (error) {
  //     console.error("Error saving thread:", error);
  //   }
  // };

  const handleRemindMeClick = async () => {
    if (!user) {
      alert("Please log in to save threads and get reminders!");
      return;
    }

    try {
      if (reminderId) {
        // If there's already a reminder set, remove it
        await removeReminder(reminderId);
        setReminderId(null);  // Reset the reminder state
      } else {
        // No reminder set, so add one
        const remindersRef = collection(db, "users", user.uid, "reminders");
        const docRef = await addDoc(remindersRef, {
          questionCollection: 'housingQuestions',
          questionId: questionId,
          timestamp: serverTimestamp()
        });
        setReminderId(docRef.id);
        alert("Thread saved! You will be notified when new replies are added.");
      }
    } catch (error) {
      console.error("Error handling reminder:", error);
      alert("Failed to handle reminder.");
    }
  };

  const removeReminder = async (reminderId) => { 
    try {
      const reminderRef = doc(db, "users", user.uid, "reminders", reminderId);
      await deleteDoc(reminderRef);
      alert("Thread unsaved! You will no longer be notified when replies are added");

    } catch (error) {
      console.error("Error removing reminder:", error);
      alert("Failed to remove reminder.");
    }
  };
  
  return (
    <div className="question-thread-page">
      <div className="question-section">
        <h2>Question</h2>
        <p>{question}</p>
      </div>
      <div className="question-files-section">
        {questionFileUrl && (
          <a href={questionFileUrl} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFileAlt} /> View Attached File
          </a>
        )}
      </div>
      <button onClick={handleRemindMeClick} className='reminder-button'>
        {reminderId ? "Remove Reminder" : "Remind Me!"}
      </button>
      <div className="replies-section-h">Replies</div>
      <div className="reply-container">
        {replies.map( reply => (
          <div key={reply.id} className="reply">
            <p className='text'>{reply.text}</p>
            {reply.fileUrl && <a href={reply.fileUrl} target="_blank" rel="noopener noreferrer" className='attach-text'>View Attachment</a>}
            <p>{new Date(reply.timestamp.seconds * 1000).toLocaleString()}</p>
            <p
              onMouseEnter={(event) => handleMouseEnter(reply.answeredBy, reply.answeredByUid, event)}
              onMouseLeave={handleMouseLeave}
            >
              {reply.answeredBy || 'Registered User'}
            </p>
            {showPopup && popupData && (
              <div className="popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
                <img src={popupData.profileImage || "https://via.placeholder.com/64x64"} alt="Profile" className="popup-profile-image" />
                <p>Name: {popupData.name || "Unknown"}</p>
                <p>Role: {popupData.role || "Unknown"}</p>
                {popupData.role === "Student" && (
                  <>
                    <p>Course: {popupData.courseOfStudy || "Unknown"}</p>
                    <p>Year: {popupData.yearOfStudy || "Unknown"}</p>
                  </>
                )}
                <p>Additional: {popupData.additionalInfo || "Unknown"}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="reply-form">
        <h3>Your Answer</h3>
        <form onSubmit={handleReplySubmit}>
          <textarea
            value={newReply}
            onChange={handleReplyChange}
            placeholder="Write your answer here..."
          />
          <div className="anonymous-checkbox">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous">Answer anonymously</label>
          </div>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Submit Answer</button>
        </form>
      </div>
    </div>
  );
};

export default HousingQuestionsThread;
