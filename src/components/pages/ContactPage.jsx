import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { getAuth } from '@firebase/auth';
import './ContactAdmins.css';


const ContactPage = () => {
  const [feedback, setFeedback] = useState('');
  const auth = getAuth();

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    const info = user ? user.uid : 'anonymous';

    try {
      await addDoc(collection(db, 'adminFeedback'), {
        feedback,
        userId: info,
        timestamp: serverTimestamp()
      });

      alert('Feedback submitted!');
      setFeedback('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="contact-admins-page" style={{ display: 'flex', justifyContent: 'center',  flexDirection: 'column' }}>
      <div className="content">
        <h1>Contact Admins</h1>
        <h2>Have any feedback or want to get in touch?</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
          <textarea
            value={feedback}
            onChange={handleFeedbackChange}
            placeholder="Enter your feedback here..."
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <p>Note that if you are not logged in submissions will be treated as anonymous feedback.</p>
    </div>
  );
};

export default ContactPage;
