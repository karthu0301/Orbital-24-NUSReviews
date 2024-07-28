import Filter from 'bad-words';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faTrash, faFlag } from '@fortawesome/free-solid-svg-icons';
import './QuestionsThread.css';
import { doc, getDoc, addDoc, deleteDoc, collection, getDocs, updateDoc, serverTimestamp, query, orderBy, where, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const QuestionsThread = ({ subCategoryPropQ, subCategoryPropR, subtopic }) => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState('');
  const [questionData, setQuestionData] = useState({ text: '', flagged: false });
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [questionFileUrl, setQuestionFileUrl] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggingReplyId, setFlaggingReplyId] = useState(null);
  const [flagModalPosition, setFlagModalPosition] = useState({ top: 0, left: 0 });
  const [showFlagSuccess, setShowFlagSuccess] = useState(false);
  const [isFlaggingQuestion, setIsFlaggingQuestion] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profilePopupData, setProfilePopupData] = useState(null);
  const [profilePopupPosition, setProfilePopupPosition] = useState({ top: 0, left: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [replyToDeleteId, setReplyToDeleteId] = useState(null);

  const filter = new Filter();

  useEffect(() => {
    const fetchQuestionAndReplies = async () => {
      try {
        const questionRef = doc(db, subCategoryPropQ, questionId);
        const questionDoc = await getDoc(questionRef);
            
        if (questionDoc.exists()) {
          const data = questionDoc.data(); // Properly defining data
          const flagged = data.flagged || filter.isProfane(data.text);  // Check for profanity

          setQuestionData({
            text: data.text,
            fileUrl: data.fileUrl,
            flagged: flagged
          });

          // Automatically update flag status in Firestore if necessary
          if (!data.flagged && flagged) {
            await updateDoc(questionRef, { flagged: true });
          }
        } else {
          console.log("No such document!");
        }

        const repliesRef = collection(db, subCategoryPropQ, questionId, subCategoryPropR);
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
  }, [questionId, subCategoryPropQ, subCategoryPropR, filter]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user && questionId) {
      const userRef = doc(db, 'users', user.uid);
      const lastViewedKey = `lastViewedThreads.${questionId}`;
  
      const updateLastViewed = () => {
        updateDoc(userRef, {
          [lastViewedKey]: serverTimestamp()
        }).then(() => {
          console.log('Last viewed timestamp updated successfully.');
        }).catch(error => {
          console.error('Failed to update last viewed timestamp:', error);
          // Optionally retry the update or inform the user
          alert('Failed to update your activity, please try again!');
        });
      };
  
      updateLastViewed();
    }
  }, [questionId]);  // Ensure this effect is correctly dependent on questionId and user's state if needed

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth(); 
    const user = auth.currentUser; 
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
        const fileRef = ref(storage, `${subCategoryPropR}/${attachedFile.name}`);
        await uploadBytes(fileRef, attachedFile);
        fileUrl = await getDownloadURL(fileRef);
      }

      try {
        const repliesRef = collection(db, subCategoryPropQ, questionId, subCategoryPropR);
        const repliesSnapshot = await getDocs(repliesRef);

        const newReplyData = {
          text: newReply,
          fileUrl,
          anonymous: isAnonymous,
          timestamp: serverTimestamp(),
          answeredBy: answerer,
          answeredByUid: answerUid
        };

        if (filter.isProfane(newReply)) {
          newReplyData.flagged = true;
          const flagDocRef = await addDoc(collection(db, 'flags'), {
            responseId: '', 
            reason: 'Auto-flagged for offensive content',
            timestamp: serverTimestamp(),
            subtopic: subtopic, 
            questionId: questionId
          });

          newReplyData.flagId = flagDocRef.id;
        }

        const docRef = await addDoc(repliesRef, newReplyData);

        if (newReplyData.flagged) {
          await updateDoc(doc(db, 'flags', newReplyData.flagId), {
            responseId: docRef.id
          });
        }

        const newReplyObj = {
          id: docRef.id,
          text: newReply,
          timestamp: new Date(),
          answeredBy: answerer,
          answeredByUid: answerUid,
          fileUrl: fileUrl,
          flagged: newReplyData.flagged
        }

        setReplies(prevReplies => [...prevReplies, newReplyObj]);
        setNewReply('');
        setAttachedFile(null);
        setIsAnonymous(false);

        if (repliesSnapshot.empty) {
          const questionRef = doc(db, subCategoryPropQ, questionId);
          await updateDoc(questionRef, { answered: true });
        }

        await updateDoc(doc(db, subCategoryPropQ, questionId), {
          lastReplyTimestamp: serverTimestamp()
        });

      } catch (error) {
        console.error("Failed to submit reply:", error);
      }
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe; 
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

  const handleRemindMeClick = async () => {
    if (!user) {
      alert("Please log in to save threads and get reminders!");
      return;
    }

    try {
      if (reminderId) {
        await removeReminder(reminderId);
        setReminderId(null);
      } else {
        const remindersRef = collection(db, "users", user.uid, "reminders");
        const docRef = await addDoc(remindersRef, {
          questionCollection: subCategoryPropQ,
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

  const handleDeleteReplyInitiate = async (replyId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to delete replies.");
      return;
    }

    const replyRef = doc(db, subCategoryPropQ, questionId, subCategoryPropR, replyId);
    try {
      const replyDoc = await getDoc(replyRef); // Ensure you await the getDoc call

      if (replyDoc.exists()) {
        const replyData = replyDoc.data();
        if (replyData.answeredByUid !== user.uid) {
          alert("You do not have permission to delete this reply.");
          return;
        }
        setReplyToDeleteId(replyId);
        setShowDeleteConfirm(true);
      } else {
        alert("Reply does not exist.");
      }
    } catch (error) {
      console.error("Error fetching reply data:", error);
    }
  };

  const handleDeleteReply = async () => {
    try {
      const replyRef = doc(db, subCategoryPropQ, questionId, subCategoryPropR, replyToDeleteId);
      const replyDoc = await getDoc(replyRef);

      if (!replyDoc.exists()) {
        alert("Reply does not exist.");
        return;
      }

      await deleteDoc(replyRef);
      setShowDeleteConfirm(false);
      setReplies(replies.filter(reply => reply.id !== replyToDeleteId));

      const updatedRepliesSnapshot = await getDocs(query(collection(db, subCategoryPropQ, questionId, subCategoryPropR), orderBy('timestamp')));
      setReplies(updatedRepliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Failed to delete reply:", error);
      alert("Failed to delete reply. Please try again.");
    }
  };

  const handleFlagQuestionClick = (event) => {
    console.log("Flag button clicked for the question");
    const rect = event.target.getBoundingClientRect();
    setIsFlaggingQuestion(true);
    setShowFlagModal(true);
    setFlagModalPosition({ top: rect.top, left: rect.left });
  };

  const handleFlagReply = (replyId, event) => {
    console.log("Flag button clicked for reply ID:", replyId);
    const rect = event.target.getBoundingClientRect();
    const parentRect = event.target.closest('.reply').getBoundingClientRect();
    setFlaggingReplyId(replyId);
    setShowFlagModal(true);
    setFlagModalPosition({ top: rect.top - parentRect.top, left: rect.left - parentRect.left });
  };

  const incrementFlaggedContributions = async (userId) => {
    if (!userId) {
      console.error("User ID is undefined, cannot increment flagged contributions.");
      return;
    }
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        flaggedContributions: increment(1)
      });
    } catch (error) {
      console.error("Failed to increment flagged contributions:", error);
    }
  };

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    if (flagReason.trim() !== '') {
      try {
        if (isFlaggingQuestion) {
          const questionRef = doc(db, subCategoryPropQ, questionId);
          const questionDoc = await getDoc(questionRef);
          const askedByUid = questionDoc.data().askedByUid;

          const flagDocRef = await addDoc(collection(db, 'flags'), {
            questionId: questionId,
            reason: flagReason,
            timestamp: serverTimestamp(),
            subtopic: subtopic
          });

          // Update the question to mark it as flagged
          await updateDoc(questionRef, {
            flagged: true
          });

          incrementFlaggedContributions(askedByUid);

          setQuestionData(prev => ({ ...prev, flagged: true }));
        } else {
          const replyRef = doc(db, subCategoryPropQ, questionId, subCategoryPropR, flaggingReplyId);
          const replyDoc = await getDoc(replyRef);
          const repliedByUid = replyDoc.data().answeredByUid;

          const flagsRef = collection(db, 'flags');
          const flagDocRef = await addDoc(flagsRef, {
            responseId: flaggingReplyId,
            reason: flagReason,
            timestamp: serverTimestamp(),
            subtopic: subtopic,
            questionId: questionId
          });

          // Update the reply to mark it as flagged
          await updateDoc(replyRef, {
            flagged: true
          });

          incrementFlaggedContributions(repliedByUid);
        }

        // Assuming you fetch and set replies somewhere else after this update, otherwise, you need to update local state here
        console.log("Flagged successfully.");
        setFlagReason('');
        setShowFlagModal(false);
        setShowFlagSuccess(true);

        setTimeout(() => {
          setShowFlagSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("Failed to flag:", error);
      }
    }
  };

  const handleProfileClick = async (answerUid, event) => {
    if (answerUid) {
      try {
        const userDoc = await getDoc(doc(db, 'users', answerUid));
        if (userDoc.exists()) {
          const profileInfo = userDoc.data();
          setProfilePopupData(profileInfo);
          const rect = event.target.getBoundingClientRect();
          setProfilePopupPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX + rect.width
          });
          setShowProfilePopup(true);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    }
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
    setProfilePopupData(null);
  };

  const handleCloseAllModals = () => {
    setShowFlagModal(false);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="question-thread-page">
      <div className="question-section">
        <h2>Question</h2>
        {questionData.flagged ? (
          <p>This question has been flagged for inappropriate content.</p>
        ) : (
          <p>{questionData.text}</p>
        )}
        {!questionData.flagged &&
          <button onClick={handleFlagQuestionClick} className="flag-button">
            <FontAwesomeIcon icon={faFlag} />
          </button>
        }
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
        {replies.map(reply => (
          <div key={reply.id} className={`reply ${reply.flagged ? 'flagged' : ''}`}>
            {!reply.flagged && (
              <>
                <button onClick={() => handleDeleteReplyInitiate(reply.id)} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button onClick={(event) => handleFlagReply(reply.id, event)} className="flag-button">
                  <FontAwesomeIcon icon={faFlag} />
                </button>
              </>
            )}
            <p className='text'>
              {reply.flagged ? "This response has been flagged for inappropriate content." : reply.text}
            </p>
            {!reply.flagged && reply.fileUrl && (
              <a href={reply.fileUrl} target="_blank" rel="noopener noreferrer" className='attach-text'>View Attachment</a>
            )}
            {!reply.flagged && (
              <>
                <p>{new Date(reply.timestamp.seconds * 1000).toLocaleString()}</p>
                <p onClick={(event) => handleProfileClick(reply.answeredByUid, event)} className="user-name-link">
                  {reply.answeredBy || 'Registered User'}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
      {showProfilePopup && profilePopupData && (
        <div className="popup" style={{ top: profilePopupPosition.top, left: profilePopupPosition.left }}>
          <img className='popup-profile-image' src={profilePopupData.profileImage || "https://via.placeholder.com/64x64"} alt="Profile" />
          <p>Name: {profilePopupData.name || "Unknown"}</p>
          <p>Role: {profilePopupData.role || "Unknown"}</p>
          {profilePopupData.role === "Student" && (
            <>
              <p>Course: {profilePopupData.courseOfStudy || "Unknown"}</p>
              <p>Year: {profilePopupData.yearOfStudy || "Unknown"}</p>
            </>
          )}
          <p>Additional: {profilePopupData.additionalInfo || "Unknown"}</p>
          <button className='popup-close-button' onClick={handleClosePopup}>Close</button>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="delete-confirmation-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this reply?</p>
            <div className="modal-buttons">
              <button className='delete-confirm-button' onClick={handleDeleteReply}>Confirm</button>
              <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {(showFlagModal || showDeleteConfirm) && (
        <div className="backdrop" onClick={handleCloseAllModals}></div>
      )}
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
      {showFlagModal && (
        <>
          <div className="backdrop" onClick={() => setShowFlagModal(false)}></div>
          <div className="modal">
            <h3>Flag {isFlaggingQuestion ? 'Question' : 'Reply'}</h3>
            <form onSubmit={handleFlagSubmit}>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder={`Reason for flagging this ${isFlaggingQuestion ? 'question' : 'reply'}...`}
                className="flag-textarea"
              />
              <div className="flag-buttons">
                <button type="submit" className="flag-submit-button">Submit Flag</button>
                <button type="button" className="flag-cancel-button" onClick={() => setShowFlagModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
      {showFlagSuccess && (
        <div className="flag-success-popup">
          The response has been flagged and will be manually reviewed!
        </div>
      )}
    </div>
  );
};

export default QuestionsThread;



// import Filter from 'bad-words';
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFileAlt, faTrash, faFlag } from '@fortawesome/free-solid-svg-icons';
// import './QuestionsThread.css';
// import { doc, getDoc, addDoc, deleteDoc, collection, getDocs, updateDoc, serverTimestamp, query, orderBy, where, increment } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { db, storage } from '../firebase-config';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

// const QuestionsThread = ({ subCategoryPropQ, subCategoryPropR, subtopic }) => {
//   const { questionId } = useParams();
//   const [question, setQuestion] = useState('');
//   const [questionData, setQuestionData] = useState({ text: '', flagged: false });
//   const [replies, setReplies] = useState([]);
//   const [newReply, setNewReply] = useState('');
//   const [attachedFile, setAttachedFile] = useState(null);
//   const [questionFileUrl, setQuestionFileUrl] = useState(null);
//   const [isAnonymous, setIsAnonymous] = useState(false);
//   const [flagReason, setFlagReason] = useState('');
//   const [showFlagModal, setShowFlagModal] = useState(false);
//   const [flaggingReplyId, setFlaggingReplyId] = useState(null);
//   const [flagModalPosition, setFlagModalPosition] = useState({ top: 0, left: 0 });
//   const [showFlagSuccess, setShowFlagSuccess] = useState(false);
//   const [isFlaggingQuestion, setIsFlaggingQuestion] = useState(false);
//   const [showProfilePopup, setShowProfilePopup] = useState(false);
//   const [profilePopupData, setProfilePopupData] = useState(null);
//   const [profilePopupPosition, setProfilePopupPosition] = useState({ top: 0, left: 0 });


//   const filter = new Filter();

//   useEffect(() => {
//     const fetchQuestionAndReplies = async () => {
//       try {
//         const questionRef = doc(db, subCategoryPropQ, questionId);
//         const questionDoc = await getDoc(questionRef);
//         if (questionDoc.exists()) {
//           setQuestionData({
//             text: questionDoc.data().text,
//             fileUrl: questionDoc.data().fileUrl,
//             flagged: questionDoc.data().flagged || false
//           });
//         } else {
//           console.log("No such document!");
//         }

//         const repliesRef = collection(db, subCategoryPropQ, questionId, subCategoryPropR);
//         const repliesQuery = query(repliesRef, orderBy('timestamp'));
//         const repliesSnapshot = await getDocs(repliesQuery);
//         setReplies(repliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };

//     if (questionId) {
//       fetchQuestionAndReplies();
//     } else {
//       console.log("ID is undefined.");
//     }
//   }, [questionId]);

//   useEffect(() => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user && questionId) {
//       const userRef = doc(db, 'users', user.uid);
//       const lastViewedKey = `lastViewedThreads.${questionId}`;

//       updateDoc(userRef, {
//         [lastViewedKey]: serverTimestamp()
//       }).then(() => {
//         console.log('Last viewed timestamp updated successfully.');
//       }).catch(error => {
//         console.error('Failed to update last viewed timestamp:', error);
//       });
//     }
//   }, [questionId]);

//   const handleReplyChange = (e) => {
//     setNewReply(e.target.value);
//   };

//   const handleFileChange = (e) => {
//     setAttachedFile(e.target.files[0]);
//   };

//   const handleReplySubmit = async (e) => {
//     e.preventDefault();

//     const auth = getAuth(); 
//     const user = auth.currentUser; 
//     let answerer = null;
//     let answerUid = null;

//     if (user) {
//       answerer = user.displayName || user.name || 'Registered User';
//       answerUid = user.uid;
//     } else {
//       alert('Please Log in to proceed.');
//       return;
//     }

//     if (isAnonymous) {
//       answerer = 'Anonymous';
//     }

//     if (newReply.trim() !== '') {
//       let fileUrl = null;
//       if (attachedFile) {
//         const fileRef = ref(storage, `${subCategoryPropR}/${attachedFile.name}`);
//         await uploadBytes(fileRef, attachedFile);
//         fileUrl = await getDownloadURL(fileRef);
//       }

//       try {
//         const repliesRef = collection(db, subCategoryPropQ, questionId, subCategoryPropR);
//         const repliesSnapshot = await getDocs(repliesRef);

//         const newReplyData = {
//           text: newReply,
//           fileUrl,
//           anonymous: isAnonymous,
//           timestamp: serverTimestamp(),
//           answeredBy: answerer,
//           answeredByUid: answerUid
//         };

//         if (filter.isProfane(newReply)) {
//           newReplyData.flagged = true;
//           const flagDocRef = await addDoc(collection(db, 'flags'), {
//             responseId: '', 
//             reason: 'Auto-flagged for offensive content',
//             timestamp: serverTimestamp(),
//             subtopic: subtopic, 
//             questionId: questionId
//           });

//           newReplyData.flagId = flagDocRef.id;
//         }

//         const docRef = await addDoc(repliesRef, newReplyData);

//         if (newReplyData.flagged) {
//           await updateDoc(doc(db, 'flags', newReplyData.flagId), {
//             responseId: docRef.id
//           });
//         }

//         const newReplyObj = {
//           id: docRef.id,
//           text: newReply,
//           timestamp: new Date(),
//           answeredBy: answerer,
//           answeredByUid: answerUid,
//           fileUrl: fileUrl,
//           flagged: newReplyData.flagged
//         }

//         setReplies(prevReplies => [...prevReplies, newReplyObj]);
//         setNewReply('');
//         setAttachedFile(null);
//         setIsAnonymous(false);

//         if (repliesSnapshot.empty) {
//           const questionRef = doc(db, subCategoryPropQ, questionId);
//           await updateDoc(questionRef, { answered: true });
//         }

//         await updateDoc(doc(db, subCategoryPropQ, questionId), {
//           lastReplyTimestamp: serverTimestamp()
//         });

//       } catch (error) {
//         console.error("Failed to submit reply:", error);
//       }
//     }
//   };

//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return unsubscribe; 
//   }, []);

//   const [reminderId, setReminderId] = useState(null);

//   useEffect(() => {
//     const fetchReminderState = async () => {
//       if (user) {
//         const remindersRef = collection(db, "users", user.uid, "reminders");
//         const querySnapshot = await getDocs(query(remindersRef, where("questionId", "==", questionId)));
//         const reminders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         const reminder = reminders.find(r => r.questionId === questionId);
//         setReminderId(reminder ? reminder.id : null);
//       }
//     };

//     fetchReminderState();
//   }, [user, questionId]);

//   const handleRemindMeClick = async () => {
//     if (!user) {
//       alert("Please log in to save threads and get reminders!");
//       return;
//     }

//     try {
//       if (reminderId) {
//         await removeReminder(reminderId);
//         setReminderId(null);
//       } else {
//         const remindersRef = collection(db, "users", user.uid, "reminders");
//         const docRef = await addDoc(remindersRef, {
//           questionCollection: subCategoryPropQ,
//           questionId: questionId,
//           timestamp: serverTimestamp()
//         });
//         setReminderId(docRef.id);
//         alert("Thread saved! You will be notified when new replies are added.");
//       }
//     } catch (error) {
//       console.error("Error handling reminder:", error);
//       alert("Failed to handle reminder.");
//     }
//   };

//   const removeReminder = async (reminderId) => {
//     try {
//       const reminderRef = doc(db, "users", user.uid, "reminders", reminderId);
//       await deleteDoc(reminderRef);
//       alert("Thread unsaved! You will no longer be notified when replies are added");

//     } catch (error) {
//       console.error("Error removing reminder:", error);
//       alert("Failed to remove reminder.");
//     }
//   };

//   const handleDeleteReply = async (replyId) => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       alert("Please log in to delete replies.");
//       return;
//     }

//     try {
//       const replyRef = doc(db, subCategoryPropQ, questionId, subCategoryPropR, replyId);
//       const replyDoc = await getDoc(replyRef);

//       if (!replyDoc.exists()) {
//         alert("Reply does not exist.");
//         return;
//       }

//       const replyData = replyDoc.data();

//       if (replyData.answeredByUid !== user.uid) {
//         alert("You do not have permission to delete this reply.");
//         return;
//       }

//       await deleteDoc(replyRef);

//       const updatedRepliesSnapshot = await getDocs(query(collection(db, subCategoryPropQ, questionId, subCategoryPropR), orderBy('timestamp')));
//       setReplies(updatedRepliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     } catch (error) {
//       console.error("Failed to delete reply:", error);
//       alert("Failed to delete reply. Please try again.");
//     }
//   };

//   const handleFlagQuestionClick = (event) => {
//     console.log("Flag button clicked for the question");
//     const rect = event.target.getBoundingClientRect();
//     setIsFlaggingQuestion(true);
//     setShowFlagModal(true);
//     setFlagModalPosition({ top: rect.top, left: rect.left });
//   };

//   const handleFlagReply = (replyId, event) => {
//     console.log("Flag button clicked for reply ID:", replyId);
//     const rect = event.target.getBoundingClientRect();
//     const parentRect = event.target.closest('.reply').getBoundingClientRect();
//     setFlaggingReplyId(replyId);
//     setShowFlagModal(true);
//     setFlagModalPosition({ top: rect.top - parentRect.top, left: rect.left - parentRect.left });
//   };

//   const incrementFlaggedContributions = async (userId) => {
//     if (!userId) {
//       console.error("User ID is undefined, cannot increment flagged contributions.");
//       return;
//     }
//     try {
//       const userRef = doc(db, 'users', userId);
//       await updateDoc(userRef, {
//         flaggedContributions: increment(1)
//       });
//     } catch (error) {
//       console.error("Failed to increment flagged contributions:", error);
//     }
//   };

//   const handleFlagSubmit = async (e) => {
//     e.preventDefault();
//     if (flagReason.trim() !== '') {
//       try {
//         if (isFlaggingQuestion) {
//           const questionRef = doc(db, subCategoryPropQ, questionId);
//           const questionDoc = await getDoc(questionRef);
//           const askedByUid = questionDoc.data().askedByUid;

//           const flagDocRef = await addDoc(collection(db, 'flags'), {
//             questionId: questionId,
//             reason: flagReason,
//             timestamp: serverTimestamp(),
//             subtopic: subtopic
//           });

//           // Update the question to mark it as flagged
//           await updateDoc(questionRef, {
//             flagged: true
//           });

//           incrementFlaggedContributions(askedByUid);

//           setQuestionData(prev => ({ ...prev, flagged: true }));
//         } else {
//           const replyRef = doc(db, subCategoryPropQ, questionId, subCategoryPropR, flaggingReplyId);
//           const replyDoc = await getDoc(replyRef);
//           const repliedByUid = replyDoc.data().answeredByUid;

//           const flagsRef = collection(db, 'flags');
//           const flagDocRef = await addDoc(flagsRef, {
//             responseId: flaggingReplyId,
//             reason: flagReason,
//             timestamp: serverTimestamp(),
//             subtopic: subtopic,
//             questionId: questionId
//           });

//           // Update the reply to mark it as flagged
//           await updateDoc(replyRef, {
//             flagged: true
//           });

//           incrementFlaggedContributions(repliedByUid);
//         }

//         // Assuming you fetch and set replies somewhere else after this update, otherwise, you need to update local state here
//         console.log("Flagged successfully.");
//         setFlagReason('');
//         setShowFlagModal(false);
//         setShowFlagSuccess(true);

//         setTimeout(() => {
//           setShowFlagSuccess(false);
//         }, 3000);
//       } catch (error) {
//         console.error("Failed to flag:", error);
//       }
//     }
//   };

//   const handleProfileClick = async (answerUid, event) => {
//     if (answerUid) {
//       try {
//         const userDoc = await getDoc(doc(db, 'users', answerUid));
//         if (userDoc.exists()) {
//           const profileInfo = userDoc.data();
//           setProfilePopupData(profileInfo);
//           const rect = event.target.getBoundingClientRect();
//           setProfilePopupPosition({
//             top: rect.top + window.scrollY,
//             left: rect.left + window.scrollX + rect.width
//           });
//           setShowProfilePopup(true);
//         } else {
//           console.log("No such document!");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile: ", error);
//       }
//     }
//   };

//   const handleClosePopup = () => {
//     setShowProfilePopup(false);
//     setProfilePopupData(null);
//   };

//   return (
//     <div className="question-thread-page">
//       <div className="question-section">
//         <h2>Question</h2>
//         {questionData.flagged ? (
//           <p>This question has been flagged for inappropriate content.</p>
//         ) : (
//           <p>{questionData.text}</p>
//         )}
//         {!questionData.flagged &&
//           <button onClick={handleFlagQuestionClick} className="flag-button">
//             <FontAwesomeIcon icon={faFlag} />
//           </button>
//         }
//       </div>
//       <div className="question-files-section">
//         {questionFileUrl && (
//           <a href={questionFileUrl} target="_blank" rel="noopener noreferrer">
//             <FontAwesomeIcon icon={faFileAlt} /> View Attached File
//           </a>
//         )}
//       </div>
//       <button onClick={handleRemindMeClick} className='reminder-button'>
//         {reminderId ? "Remove Reminder" : "Remind Me!"}
//       </button>
//       <div className="replies-section-h">Replies</div>
//       <div className="reply-container">
//         {replies.map(reply => (
//           <div key={reply.id} className={`reply ${reply.flagged ? 'flagged' : ''}`}>
//             {!reply.flagged && (
//               <>
//                 <button onClick={() => handleDeleteReply(reply.id)} className="delete-button">
//                   <FontAwesomeIcon icon={faTrash} />
//                 </button>
//                 <button onClick={(event) => handleFlagReply(reply.id, event)} className="flag-button">
//                   <FontAwesomeIcon icon={faFlag} />
//                 </button>
//               </>
//             )}
//             <p className='text'>
//               {reply.flagged ? "This response has been flagged for inappropriate content." : reply.text}
//             </p>
//             {!reply.flagged && reply.fileUrl && (
//               <a href={reply.fileUrl} target="_blank" rel="noopener noreferrer" className='attach-text'>View Attachment</a>
//             )}
//             {!reply.flagged && (
//               <>
//                 <p>{new Date(reply.timestamp.seconds * 1000).toLocaleString()}</p>
//                 <p onClick={(event) => handleProfileClick(reply.answeredByUid, event)} className="user-name-link">
//                   {reply.answeredBy || 'Registered User'}
//                 </p>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//       {showProfilePopup && profilePopupData && (
//         <div className="popup" style={{ top: profilePopupPosition.top, left: profilePopupPosition.left }}>
//           <img className='popup-profile-image' src={profilePopupData.profileImage || "https://via.placeholder.com/64x64"} alt="Profile" />
//           <p>Name: {profilePopupData.name || "Unknown"}</p>
//           <p>Role: {profilePopupData.role || "Unknown"}</p>
//           {profilePopupData.role === "Student" && (
//             <>
//               <p>Course: {profilePopupData.courseOfStudy || "Unknown"}</p>
//               <p>Year: {profilePopupData.yearOfStudy || "Unknown"}</p>
//             </>
//           )}
//           <p>Additional: {profilePopupData.additionalInfo || "Unknown"}</p>
//           <button className='popup-close-button' onClick={handleClosePopup}>Close</button>
//         </div>
//       )}
//       <div className="reply-form">
//         <h3>Your Answer</h3>
//         <form onSubmit={handleReplySubmit}>
//           <textarea
//             value={newReply}
//             onChange={handleReplyChange}
//             placeholder="Write your answer here..."
//           />
//           <div className="anonymous-checkbox">
//             <input
//               type="checkbox"
//               id="anonymous"
//               checked={isAnonymous}
//               onChange={(e) => setIsAnonymous(e.target.checked)}
//             />
//             <label htmlFor="anonymous">Answer anonymously</label>
//           </div>
//           <input type="file" onChange={handleFileChange} />
//           <button type="submit">Submit Answer</button>
//         </form>
//       </div>
//       {showFlagModal && (
//         <>
//           <div className="backdrop" onClick={() => setShowFlagModal(false)}></div>
//           <div className="modal">
//             <h3>Flag {isFlaggingQuestion ? 'Question' : 'Reply'}</h3>
//             <form onSubmit={handleFlagSubmit}>
//               <textarea
//                 value={flagReason}
//                 onChange={(e) => setFlagReason(e.target.value)}
//                 placeholder={`Reason for flagging this ${isFlaggingQuestion ? 'question' : 'reply'}...`}
//                 className="flag-textarea"
//               />
//               <div className="flag-buttons">
//                 <button type="submit" className="flag-submit-button">Submit Flag</button>
//                 <button type="button" className="flag-cancel-button" onClick={() => setShowFlagModal(false)}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </>
//       )}
//       {showFlagSuccess && (
//         <div className="flag-success-popup">
//           The response has been flagged and will be manually reviewed!
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestionsThread;
