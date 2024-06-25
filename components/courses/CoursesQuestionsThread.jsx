import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CoursesQuestionsThread.css';
import { doc, getDoc, addDoc, collection, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, storage } from '../../firebase-config';

const CoursesQuestionsThread = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState('');
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);


  useEffect(() => { 
    const fetchQuestionAndReplies = async () => {
      const questionRef = doc(db, 'coursesQuestions', questionId);
      const questionDoc = await getDoc(questionRef);
      if (questionDoc.exists()) {
        setQuestion(questionDoc.data().text);
      } else {
        console.log("No such document!");
      }
  
      const repliesRef = collection(db, 'coursesQuestions', questionId, 'coursesReplies');
      const repliesQuery = query(repliesRef, orderBy('timestamp'));
      const repliesSnapshot = await getDocs(repliesQuery);
      setReplies(repliesSnapshot.docs.map(doc => ({ questionId: doc.id, ...doc.data() })));
    };
  
    console.log("ID from params:", questionId); // Check what you get here
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
        const fileRef = storage.ref(`coursesReplies/${attachedFile.name}`);
        await fileRef.put(attachedFile);
        fileUrl = await fileRef.getDownloadURL();
      }

      await db.collection('coursesQuestions').doc(questionId).collection('coursesReplies').add({
        text: newReply,
        fileUrl,
        anonymous: isAnonymous,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      setNewReply('');
      setAttachedFile(null);
      setIsAnonymous(false);

      const repliesSnapshot = await db.collection('coursesQuestions').doc(questionId).collection('coursesReplies').orderBy('timestamp').get();
      setReplies(repliesSnapshot.docs.map(doc => ({ questionId: doc.id, ...doc.data() })));
    }
  };

  return (
    <div className="question-thread-page">
      <div className="question-section">
        <h2>Question</h2>
        <p>{question}</p>
      </div>
      <div className="replies-section">
        <h3>Replies</h3>
        {replies.map((reply, index) => (
          <div key={index} className="reply">
            <p>{reply.text}</p>
            {reply.fileUrl && <a href={reply.fileUrl} target="_blank" rel="noopener noreferrer">View Attachment</a>}
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
