import '../QuestionsList.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { db, storage } from '../../firebase-config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CoursesQuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterAnswered, setFilterAnswered] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      let q = collection(db, "coursesQuestions");

      if (filterCategory) {
        q = query(q, where("category", "==", filterCategory));
      }

      if (filterAnswered) {
        const isAnswered = filterAnswered === "answered";
        q = query(q, where("answered", "==", isAnswered));
      }

      const querySnapshot = await getDocs(q);
      let fetchedQuestions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (searchQuery) {
        fetchedQuestions = fetchedQuestions.filter(q => q.text && q.text.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      if (filterDate === 'latest') {
        fetchedQuestions.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      } else if (filterDate === 'oldest') {
        fetchedQuestions.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds);
      }

      setQuestions(fetchedQuestions);
    };

    fetchQuestions();
  }, [searchQuery, filterDate, filterAnswered, filterCategory]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!category) newErrors.category = 'Category is required!';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const auth = getAuth(); // Get the auth instance
    const user = auth.currentUser; // Get the current user
    let asker = 'Anonymous'; // Default to 'Anonymous'

    if (user && !isAnonymous) {
      console.log("User Info:", user);
      asker = user.displayName || user.email || 'Registered User'; // Use displayName, email, or a fallback
    }

    let fileUrl = null;
    if (newQuestion.trim() !== '') {
      if (attachedFile) {
        const fileRef = ref(storage, `coursesReplies/${attachedFile.name}`); // Corrected reference creation
        const uploadTaskSnapshot = await uploadBytes(fileRef, attachedFile); // Corrected upload syntax
        fileUrl = await getDownloadURL(uploadTaskSnapshot.ref); // Corrected URL retrieval
      }

      try {
        const docRef = await addDoc(collection(db, "coursesQuestions"), {
          text: newQuestion,
          category: category,
          anonymous: isAnonymous,
          timestamp: serverTimestamp(),
          fileUrl: fileUrl,
          answered: false,
          askedBy: asker  
        });
        const newQuestionObj = {
          id: docRef.id,
          text: newQuestion,
          category: category,
          timestamp: new Date(),
          answered: false,
          askedBy: asker,
          fileUrl: fileUrl
        };
        setQuestions(prevQuestions => [newQuestionObj, ...prevQuestions]);
        setNewQuestion('');
        setCategory('');
        setAttachedFile(null);
        setIsAnonymous(false);
      } catch (error) {
        console.error("Error adding question: ", error);
      }
    }
  };

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  const categories = [
    { id: 'designandengineering', name: 'Design & Engineering' },
    { id: 'computing', name: 'Computing' },
    { id: 'humanitiesandsciences', name: 'Humanities & Sciences' },
    { id: 'medicine', name: 'Medicine' },
    { id: 'dentistry', name: 'Dentistry' },
    { id: 'law', name: "Law" },
    { id: 'music', name: 'Music' },
    { id: 'nursing', name: 'Nursing' },
    { id: 'pharmacy', name: 'Pharmacy'},
    { id: 'nuscollege', name: 'NUS College' },
    { id: 'application', name: 'Application Matters' },
    { id: 'others', name: 'Others' }
  ];

  const categoryMap = {
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
    application: 'Application Matters',
    others: 'Others'
  };

  return (
    <div className="subpage-questions-list">
      <h2>Courses Question threads</h2>
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange} 
          value={searchQuery}
        />
        <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="filter-select">
          <option value="">Order by Date</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
        <select value={filterAnswered} onChange={e => setFilterAnswered(e.target.value)} className="filter-select">
          <option value="">Filter by Answered</option>
          <option value="answered">Yes</option>
          <option value="unanswered">No</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="filter-select">
          <option value="">Filter by Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="form-container">
        <form onSubmit={handleQuestionSubmit} className="form">
          <input
            id="newQuestion"
            name="newQuestion"
            type="text"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="Ask a new question..."
            className="text-input"
          />
          <button type="submit">Create new thread</button>
          <input type="file" onChange={handleFileChange} />
          <div className="category-select">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <div className="error">{errors.category}</div>}
          </div>
          <div className="anonymous-checkbox">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous">Anonymous Question?</label>
          </div>    
        </form>
      </div>
      <div className="questions-list">
        <table>
          <thead>
            <tr>
              <th>Thread Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Answered</th>
              <th>Asked By</th>
              <th>Attached File</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.id}>
                <td>
                <Link to={`/courses/questions/${question.id}`}>
                    {question.text.length > 100 ? `${question.text.slice(0, 100)}...` : question.text}
                </Link>
                </td>
                <td>{categoryMap[question.category]}</td>
                <td>{new Date(question.timestamp?.seconds * 1000).toLocaleDateString()}</td>
                <td>{question.answered ? 'Yes' : 'No'}</td>
                <td>{question.askedBy}</td>
                <td>{question.fileUrl && <a href={question.fileUrl} target="_blank" rel="noopener noreferrer">View Attachment</a>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesQuestionsList;