import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
import './PollList.css';

const PollList = () => {
    const [polls, setPolls] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchPolls = async () => {
            const querySnapshot = await getDocs(collection(db, "polls"));
            const pollsData = querySnapshot.docs.map(doc => {
                const options = doc.data().options;
                const totalVotes = options.reduce((total, option) => total + option.votes, 0);
                return {
                    id: doc.id,
                    ...doc.data(),
                    options,
                    totalVotes
                };
            });

            setPolls(pollsData);
        };

        fetchPolls();
    }, []);

    const handleVote = async (pollId, optionIndex) => {
        const poll = polls.find(poll => poll.id === pollId);
        const optionToUpdate = poll.options[optionIndex];
        optionToUpdate.votes += 1;
    
        const pollRef = doc(db, "polls", pollId);
        try {
            await updateDoc(pollRef, {
                options: poll.options
            });
            setPolls(currentPolls => currentPolls.map(p => p.id === pollId ? { ...p, options: poll.options.map((opt, idx) => idx === optionIndex ? { ...opt, votes: opt.votes } : opt) } : p));
            alert('Vote recorded!');
        } catch (error) {
            console.error('Error updating document:', error);
            alert('Failed to record vote');
        }
    };
    

    return (
        <div className="polls-container">
            <div className="category-buttons">
                {['all', 'course', 'housing', 'food', 'others'].map(category => (
                    <button key={category} onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? "selected" : ""}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>
            <div className="polls-grid">
                {polls.filter(poll => selectedCategory === 'all' || poll.category === selectedCategory).map(poll => (
                    <div key={poll.id} className="poll-container">
                        <h3>{poll.title} - {poll.category ? poll.category.charAt(0).toUpperCase() + poll.category.slice(1) : 'Unknown'}</h3>
                        <ul>
                            {poll.options.map((option, index) => (
                                <li key={index}>
                                    <div>{option.option}: {option.votes} votes</div>
                                    <div className="vote-bar" style={{ width: `${poll.totalVotes ? (option.votes / poll.totalVotes * 100) : 0}%`, backgroundColor: 'lightgreen', height: '20px', marginBottom: '10px' }}></div>
                                    <button className='vote-button'onClick={() => handleVote(poll.id, index)}>Vote</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollList;