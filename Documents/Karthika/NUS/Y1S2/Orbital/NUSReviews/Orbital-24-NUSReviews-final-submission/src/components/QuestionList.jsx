import './QuestionList.css';
import { useState, useEffect, useRef } from 'react';
import Filter from 'bad-words';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { db, storage } from '../firebase-config';
import { collection, query, where, getDoc, doc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const QuestionList = ({ subCategoryProp }) => {
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
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const filter = new Filter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      let q = collection(db, subCategoryProp);

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
        fetchedQuestions = fetchedQuestions.filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      if (filterDate === 'latest') {
        fetchedQuestions.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      } else if (filterDate === 'oldest') {
        fetchedQuestions.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
      }

      setQuestions(fetchedQuestions);
    };

    fetchQuestions();
  }, [searchQuery, filterDate, filterAnswered, filterCategory]);

  const handleMouseEnter = async (askerUid, event) => {
    if (askerUid !== null) {
      try {
        const userDoc = await getDoc(doc(db, 'users', askerUid));
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
    setPopupData(null);  
  };

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
    let askerUid = null;

    if (user && !isAnonymous) {
      asker = user.displayName || user.name || 'Registered User'; // Use displayName, name or a fallback
      askerUid = user.uid;
    }


    let fileUrl = null;
    if (newQuestion.trim() !== '') {
      if (attachedFile) {
        const fileRef = ref(storage, `replies/${attachedFile.name}`);
        const uploadTaskSnapshot = await uploadBytes(fileRef, attachedFile);
        fileUrl = await getDownloadURL(uploadTaskSnapshot.ref);
      }

      const isProfane = filter.isProfane(newQuestion); // Check for profanity

      try {
        const docRef = await addDoc(collection(db, subCategoryProp), {
          text: newQuestion,
          category: category,
          anonymous: isAnonymous,
          timestamp: serverTimestamp(),
          fileUrl: fileUrl,
          answered: false,
          askedBy: asker,
          askedByUid: askerUid,
          reminderSet: false,
          lastReplyTimestamp: serverTimestamp(),
          flagged: isProfane
        });

        if (isProfane) {
          alert("Your question contains inappropriate content and has been flagged for review.");
        }

        const newQuestionObj = {
          id: docRef.id,
          text: newQuestion,
          category: category,
          timestamp: new Date(),
          answered: false,
          askedBy: asker,
          askedByUid: askerUid,
          fileUrl: fileUrl,
          reminderSet: false,
          lastReplyTimestamp: serverTimestamp(),
          flagged: isProfane
        };

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        setQuestions(prevQuestions => [newQuestionObj, ...prevQuestions]);
        setNewQuestion('');
        setCategory('');
        setAttachedFile(null);
        setIsAnonymous(false);
        setErrorMessage('');
      } catch (error) {
        console.error("Error adding question: ", error);
      }
    }
  };

  const handleTextChange = (e) => {
    const input = e.target.value;
    setNewQuestion(input);

    const isProfane = filter.isProfane(input);
    if (isProfane) {
        setErrorMessage("Your input contains inappropriate content.");
    } else {
        setErrorMessage("");
    }
  };

  const handleFileChange = (e) => {
    setAttachedFile(e.target.files[0]);
  };

  let categories = [];
  if (subCategoryProp === 'housingQuestions') {
    categories = [
        { id: 'houses', name: 'Houses' },
        { id: 'halls', name: 'Halls' },
        { id: 'studentresidences', name: 'Student Residences' },
        { id: 'residentialcolleges', name: 'Residential Colleges' },
        { id: 'application', name: 'Application Matters' },
        { id: 'pricing', name: 'Pricing' },
        { id: 'others', name: 'Others' }
    ];
  } else if (subCategoryProp === 'coursesQuestions') {
    categories = [
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
  }


  let categoryMap = {};
  if (subCategoryProp === 'housingQuestions') {
    categoryMap = {
        houses: 'Houses',
        halls: 'Halls',
        studentresidences: 'Student Residences',
        residentialcolleges: 'Residential Colleges',
        application: 'Application Matters',
        pricing: 'Pricing',
        others: 'Others'
    };
  } else if (subCategoryProp === 'coursesQuestions') {
    categoryMap = {
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
  }

  return (
    <div className="subpage-questions-list">
      <h2>{subCategoryProp === 'housingQuestions' ? 'Housing' : 'Courses' } Question threads</h2>
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
          <div className="input-container">
            <input
              id="newQuestion"
              name="newQuestion"
              type="text"
              value={newQuestion}
              onChange={handleTextChange}
              placeholder="Ask a new question..."
              className="text-input"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
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
          </div>
          <div className="button-container">
            <button type="submit">Create new thread</button>
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
              <th>Replies</th>
              <th>Asked By</th>
              <th>Attached File</th>
              { getAuth().currentUser &&
                <th>Reminder</th>

              }
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.id}>
                <td>
                  <Link to={`/${subCategoryProp === 'housingQuestions' ? 'housing' : 'courses'}/questions/${question.id}`}>
                    {question.flagged ? <span className="flagged-question">Flagged!</span> : (question.text.length > 100 ? `${question.text.slice(0, 100)}...` : question.text)}
                  </Link>
                </td>
                <td>{categoryMap[question.category]}</td>
                <td>{new Date(question.timestamp.seconds * 1000).toLocaleDateString()}</td>
                <td>{question.answered ? 'Yes' : 'None'}</td>
                <td
                  onMouseEnter={(event) => handleMouseEnter(question.askedByUid, event)}

                  onMouseLeave={handleMouseLeave}
                >
                  {question.askedBy}
                </td>
                <td>{question.fileUrl ? <a href={question.fileUrl} target="_blank" rel="noopener noreferrer">View Attachment</a> : "No File"}</td>
                {getAuth().currentUser && 
                  <td>{question.reminderSet? 'On' : 'Off'}</td>
                }
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default QuestionList;
