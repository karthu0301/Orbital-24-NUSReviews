import { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, query, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Files.css';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterFileType, setFilterFileType] = useState('');
  const [filterDateOrder, setFilterDateOrder] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const questionCollections = [
        { name: 'housingQuestions', replyCollection: 'housingReplies' },
        { name: 'coursesQuestions', replyCollection: 'coursesReplies' },
        { name: 'foodQuestions', replyCollection: 'foodReplies' }
      ];

      let filesList = [];

      for (let questionType of questionCollections) {
        const questionsQuery = query(collection(db, questionType.name));
        const questionSnapshots = await getDocs(questionsQuery);

        questionSnapshots.forEach(doc => {
          if (doc.data().fileUrl) {
            const fileUrl = doc.data().fileUrl.split('?')[0];
            const fileType = fileUrl.substring(fileUrl.lastIndexOf('.') + 1).toLowerCase();
            filesList.push({
              url: doc.data().fileUrl,
              type: 'Question Thread',
              relatedId: doc.id,
              category: questionType.name,
              timestamp: doc.data().timestamp,
              fileType: fileType
            });
          }
        });

        for (let doc of questionSnapshots.docs) {
          const repliesQuery = query(collection(db, questionType.name, doc.id, questionType.replyCollection));
          const replySnapshots = await getDocs(repliesQuery);
          replySnapshots.forEach(replyDoc => {
            if (replyDoc.data().fileUrl) {
              const fileUrl = replyDoc.data().fileUrl.split('?')[0];
              const fileType = fileUrl.substring(fileUrl.lastIndexOf('.') + 1).toLowerCase();
              filesList.push({
                url: replyDoc.data().fileUrl,
                type: 'Reply',
                relatedId: replyDoc.id,
                category: questionType.replyCollection,
                timestamp: replyDoc.data().timestamp,
                fileType: fileType
              });
            }
          });
        }
      }

      console.log('Fetched Files:', filesList); // Log fetched files
      setFiles(filesList);
    };

    fetchFiles();
  }, []);

  const filteredFiles = files.filter(file => {
    const matchesSearch = searchQuery === '' || file.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === '' || 
                            (filterCategory === 'housing' && (file.category === 'housingQuestions' || file.category === 'housingReplies')) ||
                            (filterCategory === 'courses' && (file.category === 'coursesQuestions' || file.category === 'coursesReplies')) ||
                            (filterCategory === 'food' && (file.category === 'foodQuestions' || file.category === 'foodReplies'));
    const matchesFileType = filterFileType === '' || file.fileType === filterFileType.toLowerCase();
    return matchesSearch && matchesCategory && matchesFileType;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (filterDateOrder === 'latest') {
      return b.timestamp.seconds - a.timestamp.seconds;
    } else if (filterDateOrder === 'oldest') {
      return a.timestamp.seconds - b.timestamp.seconds;
    }
    return 0;
  });

  const categoryMap = {
    housingQuestions: 'Housing',
    housingReplies: 'Housing',
    coursesQuestions: 'Courses',
    coursesReplies: 'Courses',
    foodQuestions: 'Food',
    foodReplies: 'Food'
  };

  return (
    <div className='files-main-section'>
      <h1>Uploaded Files</h1>
      <div className='file-search-filter-section'>
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          placeholder="Search files..."
          className="file-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="file-filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Filter by Category</option>
          <option value="housing">Housing</option>
          <option value="courses">Courses</option>
          <option value="food">Food</option>
        </select>
        <select className="file-filter-select" value={filterFileType} onChange={(e) => setFilterFileType(e.target.value.toLowerCase())}>
          <option value="">Filter by File Type</option>
          <option value="pdf">PDF</option>
          <option value="jpg">JPEG</option>
          <option value="png">PNG</option>
        </select>
        <select className="file-filter-select" value={filterDateOrder} onChange={(e) => setFilterDateOrder(e.target.value)}>
          <option value="">Sort by Date</option>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className='files-container' style={{ display: 'flex', justifyContent: 'center' }}>
        {sortedFiles.length > 0 ? sortedFiles.map((file, index) => (
          <div className='file-card' key={index}>
            <FontAwesomeIcon icon={faFileAlt} className="file-icon" />
            <div className='file-info'>
              <p><strong>Category:</strong> {categoryMap[file.category]}</p>
              <p><strong>Type:</strong> {file.type}</p>
              <p><strong>File Type:</strong> {file.fileType}</p>
              <p><strong>Title:</strong> {decodeURIComponent(file.url.split('/').pop().split('?')[0].split('%2F').pop())}</p>
              <a href={file.url} target="_blank" rel="noopener noreferrer">View File</a>
            </div>
          </div>
        )) : <p>No files found.</p>}
      </div>
    </div>
  );
};

export default Files;