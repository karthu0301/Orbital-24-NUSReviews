import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, getDocs, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import '../QuestionsThread.css';

const CoursesQuestionsThread = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState('');
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [questionFileUrl, setQuestionFileUrl] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const fetchQuestionAndReplies = async () => {
      try {
        const questionRef = doc(db, 'coursesQuestions', questionId);
        const questionDoc = await getDoc(questionRef);
        if (questionDoc.exists()) {
          setQuestion(questionDoc.data().text);
          setQuestionFileUrl(questionDoc.data().fileUrl);
        } else {
          console.log("No such document!");
        }

        const repliesRef = collection(db, 'coursesQuestions', questionId, 'coursesReplies');
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
        const fileRef = ref(storage, `coursesReplies/${attachedFile.name}`);
        await uploadBytes(fileRef, attachedFile);
        fileUrl = await getDownloadURL(fileRef);
      }

      try {
        // Check if there are existing replies
        const repliesRef = collection(db, 'coursesQuestions', questionId, 'coursesReplies');
        const repliesSnapshot = await getDocs(repliesRef);

        // Add the new reply
        const docRef = await addDoc(repliesRef, {
          text: newReply,
          fileUrl,
          anonymous: isAnonymous,
          timestamp: serverTimestamp()
        });

        setNewReply('');
        setAttachedFile(null);
        setIsAnonymous(false);

        // If there were no existing replies, update the question to mark it as answered
        if (repliesSnapshot.empty) {
          const questionRef = doc(db, 'coursesQuestions', questionId);
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

export default CoursesQuestionsThread;