import './FoodQuestionsList.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { db, storage } from '../../firebase-config';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FoodQuestionsList = () => {
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
      let q = collection(db, "foodQuestions");

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
      asker = user.displayName || user.email || 'Registered User'; // Use displayName, email, or a fallback
    }

    let fileUrl = null;
    if (newQuestion.trim() !== '') {
      if (attachedFile) {
        const fileRef = ref(storage, `foodReplies/${attachedFile.name}`); // Corrected reference creation
        const uploadTaskSnapshot = await uploadBytes(fileRef, attachedFile); // Corrected upload syntax
        fileUrl = await getDownloadURL(uploadTaskSnapshot.ref); // Corrected URL retrieval
      }

      try {
        const docRef = await addDoc(collection(db, "foodQuestions"), {
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
    { id: 'general', name: 'General' },
    { id: 'recommendation', name: 'Recommendations' },
    { id: 'canteen', name: 'Canteen' },
    { id: 'cuisine', name: 'Cuisine' },
    { id: 'warning', name: 'Cautionary Tales'}
  ];

  const categoryMap = {
    general: 'General', 
    recommendation: 'Recommendations',
    canteen: 'Canteen',
    cuisine: 'Cuisine',
    warning: 'Cautionary Tales'
  };

  return (
    <div className="subpage-questions-list">
      <h2>Food Question threads</h2>
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange} 
          value={searchQuery}
        />
        <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="filter-select">
          <option value="">Filter by Date</option>
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
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.id}>
                <td>
                <Link to={`/food/questions/${question.id}`}>
                    {question.text.length > 100 ? `${question.text.slice(0, 100)}...` : question.text}
                </Link>
                </td>
                <td>{categoryMap[question.category]}</td>
                <td>{new Date(question.timestamp.seconds * 1000).toLocaleDateString()}</td>
                <td>{question.answered ? 'Yes' : 'No'}</td>
                <td>{question.askedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodQuestionsList;



// import './FoodQuestionsList.css';
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch } from '@fortawesome/free-solid-svg-icons';
// import { db, storage } from '../../firebase-config';
// import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// const FoodQuestionsList = () => {
//   const [questions, setQuestions] = useState([]);
//   const [newQuestion, setNewQuestion] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterDate, setFilterDate] = useState('');
//   const [filterAnswered, setFilterAnswered] = useState('');
//   const [filterCategory, setFilterCategory] = useState('');
//   const [attachedFile, setAttachedFile] = useState(null);
//   const [isAnonymous, setIsAnonymous] = useState(false);
//   const [category, setCategory] = useState('');
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       let q = collection(db, "foodQuestions");

//       if (filterCategory) {
//         q = query(q, where("category", "==", filterCategory));
//       }

//       if (filterAnswered) {
//         const isAnswered = filterAnswered === "answered";
//         q = query(q, where("answered", "==", isAnswered));
//       }

//       const querySnapshot = await getDocs(q);
//       let fetchedQuestions = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       if (searchQuery) {
//         fetchedQuestions = fetchedQuestions.filter(q => q.text.toLowerCase().includes(searchQuery.toLowerCase()));
//       }

//       if (filterDate === 'latest') {
//         fetchedQuestions.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
//       } else if (filterDate === 'oldest') {
//         fetchedQuestions.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
//       }

//       setQuestions(fetchedQuestions);
//     };

//     fetchQuestions();
//   }, [searchQuery, filterDate, filterAnswered, filterCategory]);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!category) newErrors.category = 'Category is required!';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleQuestionSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     if (newQuestion.trim() !== '') {
//       let fileUrl = null;
//       if (attachedFile) {
//         const fileRef = storage.ref(`replies/${attachedFile.name}`);
//         const uploadTaskSnapshot = await fileRef.put(attachedFile);
//         fileUrl = await uploadTaskSnapshot.ref.getDownloadURL();
//       }

//       try {
//         const docRef = await addDoc(collection(db, "foodQuestions"), {
//           text: newQuestion,
//           category: category,
//           anonymous: isAnonymous,
//           timestamp: serverTimestamp(),
//           fileUrl: fileUrl,
//           answered: false,
//           askedBy: "username or userID"  
//         });
//         const newQuestionObj = {
//           id: docRef.id,
//           text: newQuestion,
//           category: category,
//           timestamp: new Date(),
//           answered: false,
//           askedBy: "username or userID",
//           fileUrl: fileUrl
//         };
//         setQuestions(prevQuestions => [newQuestionObj, ...prevQuestions]);
//         setNewQuestion('');
//         setCategory('');
//         setAttachedFile(null);
//         setIsAnonymous(false);
//       } catch (error) {
//         console.error("Error adding question: ", error);
//       }
//     }
//   };

//   const handleFileChange = (e) => {
//     setAttachedFile(e.target.files[0]);
//   };

//   const categories = [
//     { id: 'general', name: 'General' },
//     { id: 'recommendation', name: 'Recommendations' },
//     { id: 'canteen', name: 'Canteen' },
//     { id: 'cuisine', name: 'Cuisine' },
//     { id: 'warning', name: 'Cautionary Tales'}
//   ];

//   const categoryMap = {
//     general: 'General', 
//     recommendation: 'Recommendations',
//     canteen: 'Canteen',
//     cuisine: 'Cuisine',
//     warning: 'Cautionary Tales'
//   };

//   return (
//     <div className="subpage-questions-list">
//       <h2>Food Question threads</h2>
//       <div className="search-container">
//         <FontAwesomeIcon icon={faSearch} />
//         <input
//           type="text"
//           placeholder="Search..."
//           onChange={handleSearchChange} 
//           value={searchQuery}
//         />
//         <select value={filterDate} onChange={e => setFilterDate(e.target.value)} className="filter-select">
//           <option value="">Filter by Date</option>
//           <option value="latest">Latest</option>
//           <option value="oldest">Oldest</option>
//         </select>
//         <select value={filterAnswered} onChange={e => setFilterAnswered(e.target.value)} className="filter-select">
//           <option value="">Filter by Answered</option>
//           <option value="answered">Yes</option>
//           <option value="unanswered">No</option>
//         </select>
//         <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="filter-select">
//           <option value="">Filter by Category</option>
//           {categories.map(cat => (
//             <option key={cat.id} value={cat.id}>{cat.name}</option>
//           ))}
//         </select>
//       </div>
//       <div className="form-container">
//         <form onSubmit={handleQuestionSubmit} className="form">
//           <input
//             id="newQuestion"
//             name="newQuestion"
//             type="text"
//             value={newQuestion}
//             onChange={e => setNewQuestion(e.target.value)}
//             placeholder="Ask a new question..."
//             className="text-input"
//           />
//           <button type="submit">Create new thread</button>
//           <input type="file" onChange={handleFileChange} />
//           <div className="category-select">
//             <select
//               value={category}
//               onChange={e => setCategory(e.target.value)}
//             >
//               <option value="">Select a category</option>
//               {categories.map(cat => (
//                 <option key={cat.id} value={cat.id}>{cat.name}</option>
//               ))}
//             </select>
//             {errors.category && <div className="error">{errors.category}</div>}
//           </div>
//           <div className="anonymous-checkbox">
//             <input
//               type="checkbox"
//               id="anonymous"
//               checked={isAnonymous}
//               onChange={e => setIsAnonymous(e.target.checked)}
//             />
//             <label htmlFor="anonymous">Anonymous Question?</label>
//           </div>
//         </form>
//       </div>
//       <div className="questions-list">
//         <table>
//           <thead>
//             <tr>
//               <th>Thread Title</th>
//               <th>Category</th>
//               <th>Date</th>
//               <th>Answered</th>
//               <th>Asked By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {questions.map(question => (
//               <tr key={question.id}>
//                 <td>
//                 <Link to={`/food/questions/${question.id}`}>
//                     {question.text.length > 100 ? `${question.text.slice(0, 100)}...` : question.text}
//                 </Link>
//                 </td>
//                 <td>{categoryMap[question.category]}</td>
//                 <td>{new Date(question.timestamp.seconds * 1000).toLocaleDateString()}</td>
//                 <td>{question.answered ? 'Yes' : 'No'}</td>
//                 <td>{question.askedBy}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FoodQuestionsList;