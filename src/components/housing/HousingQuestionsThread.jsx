import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../QuestionsThread.css';
import { doc, getDoc, addDoc, collection, getDocs, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase-config';

const HousingQuestionsThread = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState('');
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [questionFileUrl, setQuestionFileUrl] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flaggingReplyId, setFlaggingReplyId] = useState(null);


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

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
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
          userId: user.uid,
          timestamp: serverTimestamp()
        });
  
        setNewReply('');
        setAttachedFile(null);
        setIsAnonymous(false);
  
        // If there were no existing replies, update the question to mark it as answered
        if (repliesSnapshot.empty) {
          const questionRef = doc(db, 'housingQuestions', questionId);
          await updateDoc(questionRef, { answered: true });
        }
  
        // Fetch the updated list of replies
        const updatedRepliesSnapshot = await getDocs(query(repliesRef, orderBy('timestamp')));
        setReplies(updatedRepliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Failed to submit reply:", error);
      }
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const replyRef = doc(db, 'housingQuestions', questionId, 'housingReplies', replyId);
      await deleteDoc(replyRef);

      const updatedRepliesSnapshot = await getDocs(query(collection(db, 'housingQuestions', questionId, 'housingReplies'), orderBy('timestamp')));
      setReplies(updatedRepliesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Failed to delete reply:", error);
    }
  };

  const handleFlagReply = (replyId) => {
    setFlaggingReplyId(replyId);
    setShowFlagModal(true);
  };

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    if (flagReason.trim() !== '') {
      try {
        const flagsRef = collection(db, 'flags');
        await addDoc(flagsRef, {
          responseId: flaggingReplyId,
          reason: flagReason,
          timestamp: serverTimestamp()
        });
  
        // Fetch the user ID of the flagged response
        const replyRef = doc(db, 'housingQuestions', questionId, 'housingReplies', flaggingReplyId);
        const replyDoc = await getDoc(replyRef);
        const userId = replyDoc.data().userId;
  
        const incrementFlaggedContributions = async (userId) => {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            flaggedContributions: increment(1)
          });
        };
        
        // Increment the flagged contributions count
        await incrementFlaggedContributions(userId);
  
        setFlagReason('');
        setShowFlagModal(false);
      } catch (error) {
        console.error("Failed to flag reply:", error);
      }
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
      <div className="replies-section-h">Replies</div>
      <div className="reply-container">
        {replies.map((reply, index) => (
          <div key={index} className="reply">
            <p>{reply.text}</p>
            {reply.fileUrl && <a href={reply.fileUrl} target="_blank" rel="noopener noreferrer" className='attach-text'>View Attachment</a>}
            {reply.userId === user?.uid && (
              <button onClick={() => handleDeleteReply(reply.id)}>Delete</button>
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
      {showFlagModal && (
        <div className="modal">
          <h3>Flag Reply</h3>
          <form onSubmit={handleFlagSubmit}>
            <textarea
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Reason for flagging this reply..."
            />
            <button type="submit">Submit Flag</button>
            <button type="button" onClick={() => setShowFlagModal(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HousingQuestionsThread;